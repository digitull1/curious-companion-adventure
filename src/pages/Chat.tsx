
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import StatsBar from "@/components/StatsBar";
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
  const [ageRange, setAgeRange] = useState(localStorage.getItem("wonderwhiz_age_range") || "8-10");
  const [avatar, setAvatar] = useState(localStorage.getItem("wonderwhiz_avatar") || "explorer");
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi there! I'm your WonderWhiz assistant, created by leading IB educationalists and Cambridge University child psychologists. I'm here to help you learn fascinating topics in depth. What would you like to explore today?",
      isUser: false,
      blocks: ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"],
      showBlocks: true,
      isIntroduction: true
    }
  ]);
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
  const { isLoading, generateResponse, generateImage, generateQuiz } = useOpenAI();
  const [streakCount, setStreakCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [learningProgress, setLearningProgress] = useState(0);
  const [showSuggestedPrompts, setShowSuggestedPrompts] = useState(false);

  const suggestedPrompts = [
    "Tell me about dinosaurs",
    "How do planets form?",
    "What are robots?",
    "Why is the sky blue?",
    "How do animals communicate?"
  ];
  
  useEffect(() => {
    // If user hasn't completed onboarding, redirect them
    if (!ageRange || !avatar) {
      navigate("/");
    }
    
    // Simulate loading saved data from localStorage
    const savedStreak = Math.floor(Math.random() * 5) + 1; // Random 1-5 for demo
    const savedPoints = Math.floor(Math.random() * 500); // Random points for demo
    setStreakCount(savedStreak);
    setPoints(savedPoints);
  }, [ageRange, avatar, navigate]);

  // Check if all sections are completed
  useEffect(() => {
    if (topicSectionsGenerated && messages.some(m => m.tableOfContents)) {
      const sections = messages.find(m => m.tableOfContents)?.tableOfContents || [];
      if (sections.length > 0 && completedSections.length === sections.length) {
        setLearningComplete(true);
      }
    }
  }, [completedSections, topicSectionsGenerated, messages]);
  
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
      const response = await generateResponse(prompt, ageRange);
      
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

    // Reset topic sections if starting a new conversation
    if (topicSectionsGenerated && !selectedTopic) {
      setTopicSectionsGenerated(false);
      setCompletedSections([]);
      setCurrentSection(null);
      setLearningComplete(false);
    }

    // Check if this is a new topic request (not a follow-up on sections)
    const isNewTopicRequest = !selectedTopic && !topicSectionsGenerated;
    
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
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowTypingIndicator(false);
        
        // Generate table of contents for encyclopedia-style approach
        const tocResponse = await generateResponse(`Generate a concise table of contents with 4-5 sections for learning about: ${inputValue}. Format as a numbered list.`, ageRange);
        
        // Parse the TOC into sections
        const sections = tocResponse
          .split(/\d+\./)
          .map(s => s.trim())
          .filter(s => s.length > 0);
        
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
        
        // Suggest related topics based on the main topic
        const relatedTopicsResponse = await generateResponse(`Generate 5 related topics to ${inputValue} that might interest a learner. Format as a short comma-separated list.`, ageRange);
        setRelatedTopics(relatedTopicsResponse.split(",").map(topic => topic.trim()));
        
        // Add points for starting a new learning journey
        setPoints(prev => prev + 25);
        setLearningProgress(10);

        // Auto-select the first section after a short delay
        setTimeout(() => {
          if (sections.length > 0) {
            handleTocSectionClick(sections[0]);
          }
        }, 1000);
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
          blockResponse = await generateResponse(`Give me an interesting fact related to: ${messageText} that would amaze a ${ageRange} year old. Be fun and educational.`, ageRange);
          break;
        case "mind-blowing":
          blockResponse = await generateResponse(`Tell me something mind-blowing about the science related to: ${messageText} that would fascinate a ${ageRange} year old. Use an enthusiastic tone.`, ageRange);
          break;
        case "amazing-stories":
          blockResponse = await generateResponse(`Share an amazing story or legend related to: ${messageText} appropriate for a ${ageRange} year old. Keep it engaging and educational.`, ageRange);
          break;
        case "see-it":
          blockResponse = "Here's a visual representation I created for you:";
          imagePrompt = `${messageText} in a style that appeals to ${ageRange} year old children, educational, detailed, colorful, Pixar style illustration`;
          break;
        case "quiz":
          blockResponse = "Let's test your knowledge with a quick quiz! Get all answers right to earn bonus points! 🎯";
          quiz = await generateQuiz(messageText);
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

      setMessages(prev => [...prev, blockMessage]);
    } catch (error) {
      console.error("Error processing learning block:", error);
      setShowTypingIndicator(false);
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
    toast.success("Chat cleared! Ready for a new adventure!");
  };

  const handleTocSectionClick = (section: string) => {
    // If clicking on the same section that's already current, don't do anything
    if (section === currentSection) return;
    
    // Set the current section immediately for a more responsive feel
    setCurrentSection(section);
    
    // Process the section request directly, skipping the user message display
    processMessage(`Tell me about "${section}" in detail`, false, true);
  };

  const handleRelatedTopicClick = (topic: string) => {
    clearChat();
    // Auto-send the related topic
    setTimeout(() => {
      processMessage(`Tell me about ${topic}`, true);
    }, 100);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-wonder-background to-white overflow-hidden">
      {/* Header */}
      <Header avatar={avatar} />
      
      {/* Stats Bar */}
      <StatsBar 
        streakCount={streakCount}
        points={points}
        learningProgress={learningProgress}
        topicSectionsGenerated={topicSectionsGenerated}
      />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden bg-gradient-to-b from-wonder-background/50 to-white/30 backdrop-blur-sm">
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
          />
          
          {/* Chat Input */}
          <ChatInput 
            inputValue={inputValue}
            isProcessing={isProcessing}
            selectedTopic={selectedTopic}
            suggestedPrompts={suggestedPrompts}
            isListening={isListening}
            showSuggestedPrompts={showSuggestedPrompts}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onSendMessage={handleSendMessage}
            onVoiceInput={handleVoiceInput}
            toggleListening={toggleListening}
            onSuggestedPromptClick={handleSuggestedPromptClick}
            setShowSuggestedPrompts={setShowSuggestedPrompts}
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
      
      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-wonder-purple/10 py-2 px-4 text-center text-xs text-muted-foreground">
        <span className="bg-gradient-to-r from-wonder-purple to-wonder-purple-light bg-clip-text text-transparent font-medium font-bubbly">WonderWhiz</span> by leading IB educationalists & Cambridge University child psychologists
      </div>
      
      {/* Toast */}
      <Toaster position="top-right" />
    </div>
  );
};

export default Chat;
