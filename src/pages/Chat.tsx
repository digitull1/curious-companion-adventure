import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { HelpCircle, X } from "lucide-react";
import Header from "@/components/Header";
import ChatArea from "@/components/ChatArea";
import ChatInput from "@/components/ChatInput";
import AgeRangeSelector from "@/components/AgeRangeSelector";
import { useOpenAI } from "@/hooks/useOpenAI";
import { BlockType } from "@/components/LearningBlock";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  blocks?: BlockType[];
  showBlocks?: boolean;
  imagePrompt?: string;
  imageSource?: string; // For uploaded homework images
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
  code?: {
    snippet: string;
    language: string;
  };
  tableOfContents?: string[];
  isIntroduction?: boolean;
}

const Chat = () => {
  const navigate = useNavigate();
  const [ageRange, setAgeRange] = useState(() => localStorage.getItem("wonderwhiz_age_range") || "8-10");
  const [avatar, setAvatar] = useState(() => localStorage.getItem("wonderwhiz_avatar") || "explorer");
  const [userName, setUserName] = useState(() => localStorage.getItem("wonderwhiz_username") || "Explorer");
  const [language, setLanguage] = useState(() => localStorage.getItem("wonderwhiz_language") || "en");
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [showAgeSelector, setShowAgeSelector] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [topicSectionsGenerated, setTopicSectionsGenerated] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [relatedTopics, setRelatedTopics] = useState<string[]>([]);
  const [learningComplete, setLearningComplete] = useState(false);
  const { isLoading, generateResponse, generateImage, generateQuiz, analyzeImage, textToSpeech } = useOpenAI();
  const [streakCount, setStreakCount] = useState(() => parseInt(localStorage.getItem("wonderwhiz_streak") || "1", 10));
  const [points, setPoints] = useState(() => parseInt(localStorage.getItem("wonderwhiz_points") || "0", 10));
  const [learningProgress, setLearningProgress] = useState(0);
  const [showSuggestedPrompts, setShowSuggestedPrompts] = useState(false);
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [previousTopics, setPreviousTopics] = useState<string[]>([]);
  
  // Use refs to prevent infinite loops with state updates
  const initRef = useRef(false);
  const pointsRef = useRef(points);
  
  // Update refs when state changes
  useEffect(() => {
    pointsRef.current = points;
  }, [points]);
  
  // Save points to localStorage when they change, but throttle updates
  useEffect(() => {
    const savePoints = () => {
      localStorage.setItem("wonderwhiz_points", points.toString());
    };
    
    // Use a debounced save to avoid excessive localStorage writes
    const timeoutId = setTimeout(savePoints, 2000);
    return () => clearTimeout(timeoutId);
  }, [points]);
  
  // Process topics from a response string into an array
  const processTopicsFromResponse = useCallback((response: string): string[] => {
    console.log("Processing topics from response:", response);
    
    // Basic guard for empty responses
    if (!response || response.trim().length === 0) {
      console.log("Empty response, returning default topics");
      return ["Dinosaurs", "Space", "Animals", "Robots", "Ocean"];
    }
    
    // Check if already formatted as a list with numbers or bullets
    if (response.includes("\n")) {
      const lines = response.split("\n").map(line => 
        line.replace(/^\d+[\.\)]?\s*|\*\s*|•\s*|-\s*/, "").trim()
      ).filter(line => line.length > 0);
      
      console.log("Processed as numbered/bulleted list:", lines);
      return lines;
    }
    
    // Check if it's a comma-separated list
    if (response.includes(",")) {
      const topics = response.split(",").map(topic => 
        topic.replace(/^\d+[\.\)]?\s*/, "").trim()
      ).filter(topic => topic.length > 0);
      
      console.log("Processed as comma-separated list:", topics);
      return topics;
    }
    
    // Just return as a single item if no clear separator
    console.log("No clear separator, returning as single item");
    return [response.trim()];
  }, []);
  
  // Default suggested prompts as fallback
  const defaultSuggestedPrompts = [
    "Tell me about dinosaurs",
    "How do planets form?",
    "What are robots?",
    "Why is the sky blue?",
    "How do animals communicate?"
  ];
  
  // Fetch user data and generate welcome message with suggested topics - only once on mount
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    
    console.log("Chat component mounted, initializing...");
    console.log("User data:", { userName, ageRange, avatar, language });
    
    // If user hasn't completed onboarding, redirect them
    if (!ageRange || !avatar) {
      console.log("Incomplete user data, redirecting to onboarding");
      navigate("/");
      return;
    }
    
    // Set initial loading state
    setShowTypingIndicator(true);
    
    // Generate personalized topics based on age range
    const generatePersonalizedTopics = async () => {
      try {
        console.log("Generating personalized topics for age range:", ageRange);
        
        // Generate age-appropriate topics
        const topicsPrompt = `Generate 5 engaging, educational topics that would interest a ${ageRange} year old child. Format as a short comma-separated list. Topics should be interesting and appropriate for their age group.`;
        
        // Use a timeout to ensure we don't get stuck in loading state
        const timeoutPromise = new Promise<string>(resolve => {
          setTimeout(() => {
            resolve("Dinosaurs, Space Exploration, Animal Habitats, How Machines Work, Weather and Climate");
          }, 3000);
        });
        
        // Race between the actual API call and the timeout
        const topicsResponse = await Promise.race([
          generateResponse(topicsPrompt, ageRange, language),
          timeoutPromise
        ]);
        
        console.log("Generated topics response:", topicsResponse);
        
        // Process topics from the response string
        const topics = processTopicsFromResponse(topicsResponse);
        console.log("Processed topics:", topics);
        
        // Make sure we have exactly 5 topics
        const finalTopics = topics.length >= 5 ? topics.slice(0, 5) : [...topics, ...defaultSuggestedPrompts.slice(0, 5 - topics.length)];
        console.log("Final topics list:", finalTopics);
        
        setSuggestedTopics(finalTopics);
        
        // Create personalized welcome message with name
        let welcomeText = "";
        
        if (language === "en") {
          welcomeText = `Hi ${userName}! I'm your WonderWhiz assistant, created by leading IB educationalists and Cambridge University child psychologists. I'm here to help you learn fascinating topics in depth. What would you like to explore today?`;
        } else {
          // Simplified language-specific welcome for non-English
          welcomeText = `Hi ${userName}! I'm your WonderWhiz assistant. I'm here to help you learn fascinating topics in depth. What would you like to explore today?`;
        }
        
        const welcomeMessage: Message = {
          id: "welcome",
          text: welcomeText,
          isUser: false,
          blocks: ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"],
          showBlocks: true,
          isIntroduction: true
        };
        
        console.log("Setting welcome message:", welcomeMessage);
        setMessages([welcomeMessage]);
        setShowTypingIndicator(false);
        
        // Auto-show suggested prompts after welcome
        setTimeout(() => {
          setShowSuggestedPrompts(true);
        }, 1000);
        
      } catch (error) {
        console.error("Error generating personalized topics:", error);
        setSuggestedTopics(defaultSuggestedPrompts);
        
        // Fallback welcome message
        const welcomeMessage: Message = {
          id: "welcome",
          text: `Hi ${userName}! I'm your WonderWhiz assistant. I'm here to help you learn fascinating topics in depth. What would you like to explore today?`,
          isUser: false,
          blocks: ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"],
          showBlocks: true,
          isIntroduction: true
        };
        
        console.log("Setting fallback welcome message");
        setMessages([welcomeMessage]);
        setShowTypingIndicator(false);
        
        // Auto-show suggested prompts after welcome
        setTimeout(() => {
          setShowSuggestedPrompts(true);
        }, 1000);
      }
    };
    
    generatePersonalizedTopics();
  }, [ageRange, avatar, language, userName, generateResponse, navigate, processTopicsFromResponse]);

  // Check if all sections are completed - with safeguards to prevent infinite loops
  useEffect(() => {
    if (topicSectionsGenerated && messages.some(m => m.tableOfContents)) {
      const sections = messages.find(m => m.tableOfContents)?.tableOfContents || [];
      if (sections.length > 0 && completedSections.length === sections.length) {
        console.log("All sections completed, setting learningComplete to true");
        setLearningComplete(true);
        
        // Generate related topics if not already generated
        if (relatedTopics.length === 0 && selectedTopic) {
          generateRelatedTopics(selectedTopic);
        }
      }
    }
  }, [completedSections, topicSectionsGenerated, messages, selectedTopic, relatedTopics.length]);
  
  const generateRelatedTopics = useCallback(async (topic: string) => {
    try {
      console.log("Generating related topics for:", topic);
      
      // Define default related topics based on the main topic to avoid API calls
      let defaultRelated: string[] = ["Space exploration", "Astronomy facts", "Planets and moons", "Solar system formation", "Black holes"];
      
      if (topic.toLowerCase().includes("dinosaur")) {
        defaultRelated = ["Prehistoric animals", "Fossils", "Extinction events", "Paleontology", "Ancient reptiles"];
      } else if (topic.toLowerCase().includes("animal")) {
        defaultRelated = ["Wildlife habitats", "Ocean creatures", "Animal adaptations", "Endangered species", "Pet care"];
      } else if (topic.toLowerCase().includes("robot")) {
        defaultRelated = ["Artificial intelligence", "Coding for kids", "How machines work", "Future technology", "Famous robots"];
      }
      
      // If we're already related topics, just set them without an API call
      setRelatedTopics(defaultRelated);
      
    } catch (error) {
      console.error("Error generating related topics:", error);
      // Fallback related topics
      setRelatedTopics([
        "Space exploration", 
        "Astronomy facts", 
        "Planets and moons", 
        "Solar system formation", 
        "Black holes"
      ]);
    }
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() && !isProcessing) {
      handleSendMessage();
    }
  };

  const handleAgeRangeChange = (newRange: string) => {
    setAgeRange(newRange);
    localStorage.setItem("wonderwhiz_age_range", newRange);
    setShowAgeSelector(false);
    toast.success(`Learning content will now be tailored for age ${newRange}!`);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem("wonderwhiz_language", newLanguage);
    toast.success(`Language changed to ${newLanguage}!`);
    
    // Clear chat and generate new welcome message in selected language
    clearChat();
  };

  const handleImageCapture = async (base64Image: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setShowTypingIndicator(true);
    
    // Create a message for the uploaded image
    const userImageMessage: Message = {
      id: Date.now().toString(),
      text: "I've uploaded a homework problem for help.",
      isUser: true,
      imageSource: base64Image
    };
    
    setMessages(prev => [...prev, userImageMessage]);
    
    try {
      console.log("Analyzing uploaded image...");
      const analysis = await analyzeImage(base64Image, ageRange, language);
      
      // Simulate a delay for typing effect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowTypingIndicator(false);
      
      // Create AI response message
      const aiResponseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: analysis,
        isUser: false,
        blocks: ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"],
        showBlocks: true
      };
      
      setMessages(prev => [...prev, aiResponseMessage]);
      
      // Add points for analyzing homework - using the pointsRef to avoid state closure issues
      setPoints(prev => prev + 20);
      
    } catch (error) {
      console.error("Error analyzing image:", error);
      setShowTypingIndicator(false);
      toast.error("Sorry, I couldn't analyze that image. Please try again with a clearer picture.");
      
      // Create a fallback message
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I couldn't analyze that image clearly. Could you try again with a clearer picture? Make sure the homework problem is well-lit and centered in the image.",
        isUser: false
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      
    } finally {
      setIsProcessing(false);
    }
  };

  const processMessage = async (prompt: string, isUserMessage: boolean = true, skipUserMessage: boolean = false) => {
    if (isProcessing) return;

    setIsProcessing(true);
    setShowTypingIndicator(true);

    // If it's a user message and we're not skipping user message display
    if (isUserMessage && !skipUserMessage) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: prompt,
        isUser: true
      };
      setMessages(prev => [...prev, userMessage]);
    }

    try {
      // Is this a request to explore a specific TOC section?
      const matchedSection = selectedTopic && messages.find(m => m.tableOfContents)?.tableOfContents?.find(
        section => prompt.toLowerCase().includes(section.toLowerCase())
      );

      // Generate response based on the prompt
      const response = await generateResponse(prompt, ageRange, language);
      console.log("Generated response:", response);
      
      // Simulate a delay for typing effect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowTypingIndicator(false);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        blocks: ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"],
        showBlocks: true
      };
      
      if (matchedSection) {
        // Set as current section
        setCurrentSection(matchedSection);
        
        // If not already completed, mark as completed
        if (!completedSections.includes(matchedSection)) {
          // Mark this section as completed
          setCompletedSections(prev => [...prev, matchedSection]);
          
          // Add more points for completing a section
          setPoints(prev => prev + 15);
          
          // Update learning progress
          const totalSections = messages.find(m => m.tableOfContents)?.tableOfContents?.length || 5;
          const newProgress = Math.min(100, 10 + (completedSections.length + 1) * (90 / totalSections));
          setLearningProgress(newProgress);
        }

        // Add a "next section" suggestion after the current message
        const sectionsAvailable = messages.find(m => m.tableOfContents)?.tableOfContents || [];
        const currentSectionIndex = sectionsAvailable.indexOf(matchedSection);
        if (currentSectionIndex >= 0 && currentSectionIndex < sectionsAvailable.length - 1) {
          const nextSection = sectionsAvailable[currentSectionIndex + 1];
          // The message includes a suggestion for the next section
          aiMessage.text += `\n\nWould you like to continue learning about "${nextSection}" next?`;
        } else if (currentSectionIndex === sectionsAvailable.length - 1) {
          // This is the last section
          aiMessage.text += "\n\nCongratulations! You've completed all sections of this topic. Check out related topics below!";
        }
      }
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Increment points for each interaction
      setPoints(prev => prev + 10);
    } catch (error) {
      console.error("Error processing message:", error);
      setShowTypingIndicator(false);
      toast.error("Sorry, there was an error processing your request. Please try again.");
    } finally {
      setIsProcessing(false);
      setInputValue("");
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    // If starting a new topic after completing previous one
    if (learningComplete && topicSectionsGenerated) {
      // Save the previous topic before resetting
      if (selectedTopic) {
        setPreviousTopics(prev => [...prev, selectedTopic]);
      }
      
      // Reset topic-related states
      setTopicSectionsGenerated(false);
      setCompletedSections([]);
      setCurrentSection(null);
      setLearningComplete(false);
      setRelatedTopics([]);
    }

    // Check if this is a new topic request (not a follow-up on sections)
    const isNewTopicRequest = !selectedTopic || !topicSectionsGenerated || 
                              (inputValue.toLowerCase().indexOf("tell me about") === 0) ||
                              (inputValue.toLowerCase().indexOf("what is") === 0) ||
                              (inputValue.toLowerCase().indexOf("how does") === 0);
    
    console.log("Handle send message - isNewTopicRequest:", isNewTopicRequest);
    
    // If it's a new topic, generate table of contents
    if (isNewTopicRequest) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputValue,
        isUser: true
      };
      setMessages(prev => [...prev, userMessage]);
      setInputValue("");
      setIsProcessing(true);
      setShowTypingIndicator(true);

      try {
        console.log("Generating TOC for new topic:", inputValue);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowTypingIndicator(false);
        
        // Generate table of contents for encyclopedia-style approach
        const tocPrompt = `Generate a concise table of contents with 4-5 sections for learning about: ${inputValue}. Format as a numbered list.`;
        const tocResponse = await generateResponse(tocPrompt, ageRange, language);
        console.log("Generated TOC response:", tocResponse);
        
        // Parse the TOC into sections
        const sections = processTopicsFromResponse(tocResponse);
        console.log("Parsed TOC sections:", sections);
        
        // Create introduction message with TOC
        const tocMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `I'd love to teach you about ${inputValue}! Here's what we'll explore:`,
          isUser: false,
          tableOfContents: sections,
          isIntroduction: true
        };
        
        setMessages(prev => [...prev, tocMessage]);
        setSelectedTopic(inputValue);
        setTopicSectionsGenerated(true);
        
        // Generate related topics based on the main topic
        generateRelatedTopics(inputValue);
        
        // Add points for starting a new learning journey
        setPoints(prev => prev + 25);
        setLearningProgress(10);
      } catch (error) {
        console.error("Error generating TOC:", error);
        toast.error("Sorry, there was an error processing your request. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Handle regular messages
      await processMessage(inputValue);
    }
  };

  const handleBlockClick = async (type: BlockType, messageId: string, messageText: string) => {
    try {
      setIsProcessing(true);
      setShowTypingIndicator(true);
      let blockResponse = "";
      let imagePrompt = "";
      let quiz = undefined;
      
      // Award points for exploring content
      setPoints(prev => prev + 15);
      
      switch (type) {
        case "did-you-know":
          blockResponse = await generateResponse(`Give me an interesting fact related to: ${messageText} that would amaze a ${ageRange} year old. Be fun and educational.`, ageRange, language);
          break;
        case "mind-blowing":
          blockResponse = await generateResponse(`Tell me something mind-blowing about the science related to: ${messageText} that would fascinate a ${ageRange} year old. Use an enthusiastic tone.`, ageRange, language);
          break;
        case "amazing-stories":
          blockResponse = await generateResponse(`Share an amazing story or legend related to: ${messageText} appropriate for a ${ageRange} year old. Keep it engaging and educational.`, ageRange, language);
          break;
        case "see-it":
          try {
            blockResponse = "Here's a visual representation I created for you:";
            imagePrompt = `${messageText} in a style that appeals to ${ageRange} year old children, educational, detailed, colorful, Pixar style illustration`;
            console.log("Generating image with prompt:", imagePrompt);
          } catch (error) {
            console.error("Error generating image:", error);
            blockResponse = "I'm sorry, I couldn't create an image right now. Let me tell you about it instead!";
            const fallbackResponse = await generateResponse(`Describe ${messageText} visually for a ${ageRange} year old in vivid, colorful terms.`, ageRange, language);
            blockResponse += "\n\n" + fallbackResponse;
          }
          break;
        case "quiz":
          blockResponse = "Let's test your knowledge with a quick quiz! Get all answers right to earn bonus points! 🎯";
          try {
            console.log("Generating quiz for topic:", messageText, "in", language, "language");
            quiz = await generateQuiz(messageText, language);
            console.log("Quiz generated successfully:", quiz);
          } catch (error) {
            console.error("Error generating quiz:", error);
            quiz = {
              question: "Which of these is a fact about this topic?",
              options: ["Option 1", "Option 2", "Option 3", "Option 4"],
              correctAnswer: 0
            };
          }
          break;
      }

      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setShowTypingIndicator(false);

      const blockMessage: Message = {
        id: Date.now().toString(),
        text: blockResponse,
        isUser: false,
        imagePrompt: imagePrompt || undefined,
        quiz: quiz || undefined
      };

      console.log("Adding block message:", blockMessage);
      setMessages(prev => [...prev, blockMessage]);
    } catch (error) {
      console.error("Error processing learning block:", error);
      setShowTypingIndicator(false);
      toast.error("Sorry, I couldn't process that right now. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestedPromptClick = (prompt: string) => {
    setInputValue(prompt);
    // Auto-send the suggestion
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleVoiceInput = (transcript: string) => {
    setInputValue(transcript);
  };
  
  const toggleListening = () => {
    setIsListening(prev => !prev);
  };
  
  const clearChat = () => {
    setMessages([
      {
        id: "welcome-new",
        text: "Chat cleared! What would you like to explore now?",
        isUser: false,
        blocks: ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"],
        showBlocks: true,
        isIntroduction: true
      }
    ]);
    setSelectedTopic(null);
    setTopicSectionsGenerated(false);
    setCompletedSections([]);
    setCurrentSection(null);
    setLearningProgress(0);
    setLearningComplete(false);
    setRelatedTopics([]);
    setPreviousTopics([]);
    toast.success("Chat cleared! Ready for a new adventure!");
  };

  const handleTocSectionClick = (section: string) => {
    // If clicking on the same section that's already current, don't do anything
    if (section === currentSection) return;
    
    console.log("Clicked TOC section:", section);
    
    // Set the current section immediately for a more responsive feel
    setCurrentSection(section);
    
    // Process the section request directly, skipping the user message display
    processMessage(`Tell me about "${section}" in detail`, false, true);
  };

  const handleRelatedTopicClick = (topic: string) => {
    console.log("Clicked related topic:", topic);
    
    // Save the previous topic before clearing
    if (selectedTopic) {
      setPreviousTopics(prev => [...prev, selectedTopic]);
    }
    
    // Reset states for the new topic
    setSelectedTopic(null);
    setTopicSectionsGenerated(false);
    setCompletedSections([]);
    setCurrentSection(null);
    setLearningProgress(0);
    setLearningComplete(false);
    setRelatedTopics([]);
    
    // Process the related topic as a new user message
    processMessage(`Tell me about ${topic}`, true);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-wonder-background to-white overflow-hidden relative">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5 z-0">
        <img 
          src="/lovable-uploads/22fa1957-ce26-4f1a-ae37-bf442630d36d.png" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Header with Stats integrated */}
      <Header 
        avatar={avatar} 
        streakCount={streakCount}
        points={points}
        learningProgress={learningProgress}
        topicSectionsGenerated={topicSectionsGenerated}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden backdrop-blur-sm relative z-10">
        <div className="w-full h-full mx-auto flex flex-col">
          {/* Chat Messages */}
          <ChatArea 
            messages={messages}
            showTypingIndicator={showTypingIndicator}
            completedSections={completedSections}
            currentSection={currentSection}
            relatedTopics={relatedTopics}
            learningComplete={learningComplete}
            onBlockClick={handleBlockClick}
            onTocSectionClick={handleTocSectionClick}
            onRelatedTopicClick={handleRelatedTopicClick}
            learningProgress={learningProgress}
          />
          
          {/* Chat Input */}
          <ChatInput 
            inputValue={inputValue}
            isProcessing={isProcessing}
            selectedTopic={selectedTopic}
            suggestedPrompts={suggestedTopics.length > 0 ? suggestedTopics : defaultSuggestedPrompts}
            isListening={isListening}
            showSuggestedPrompts={showSuggestedPrompts}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onSendMessage={handleSendMessage}
            onVoiceInput={handleVoiceInput}
            toggleListening={toggleListening}
            onSuggestedPromptClick={handleSuggestedPromptClick}
            setShowSuggestedPrompts={setShowSuggestedPrompts}
            onImageCapture={handleImageCapture}
          />
        </div>
      </main>
      
      {/* Age Selector Modal */}
      {showAgeSelector && (
        <AgeRangeSelector 
          currentRange={ageRange} 
          onSelect={handleAgeRangeChange}
          onClose={() => setShowAgeSelector(false)}
        />
      )}
      
      {/* Footer - Now with a link for suggested prompts */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-wonder-purple/10 py-2 px-4 flex justify-between items-center z-10">
        <span className="text-xs text-muted-foreground">
          <span className="bg-gradient-to-r from-wonder-purple to-wonder-purple-light bg-clip-text text-transparent font-medium font-bubbly">WonderWhiz</span> by leading IB educationalists & Cambridge University child psychologists
        </span>
        <button 
          onClick={() => setShowSuggestedPrompts(true)}
          className="text-xs text-wonder-purple hover:text-wonder-purple-dark transition-colors"
        >
          Need ideas?
        </button>
      </div>
      
      {/* Toast */}
      <Toaster position="top-right" />
    </div>
  );
};

export default Chat;
