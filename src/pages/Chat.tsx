
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
  const [relatedTopics, setRelatedTopics] = useState<string[]>([]);
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

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    // Reset topic sections if starting a new conversation
    if (topicSectionsGenerated && !selectedTopic) {
      setTopicSectionsGenerated(false);
      setCompletedSections([]);
    }

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
      // Check if this is a new topic request (not a follow-up on sections)
      const isNewTopicRequest = !selectedTopic && !topicSectionsGenerated;
      
      // If it's a new topic, generate table of contents
      if (isNewTopicRequest) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowTypingIndicator(false);

        // Ask about age range customization if not recently shown
        if (!showAgeSelector) {
          setShowAgeSelector(true);
        }
        
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
        
        // Animate confetti effect for starting a new topic
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '9999';
        document.body.appendChild(confettiContainer);

        // Remove confetti after animation
        setTimeout(() => {
          confettiContainer.remove();
        }, 5000);
        
      } else {
        // Handle follow-up messages or section explorations
        const response = await generateResponse(inputValue, ageRange);
        
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
        
        // Check if this is a request to explore a specific TOC section
        const matchedSection = selectedTopic && messages.find(m => m.tableOfContents)?.tableOfContents?.find(
          section => inputValue.toLowerCase().includes(section.toLowerCase())
        );
        
        if (matchedSection && !completedSections.includes(matchedSection)) {
          // Mark this section as completed
          setCompletedSections(prev => [...prev, matchedSection]);
          
          // Add more points for completing a section
          setPoints(prev => prev + 15);
          
          // Update learning progress
          const totalSections = messages.find(m => m.tableOfContents)?.tableOfContents?.length || 5;
          const newProgress = Math.min(100, 10 + (completedSections.length + 1) * (90 / totalSections));
          setLearningProgress(newProgress);
        }
        
        setMessages(prev => [...prev, aiMessage]);
      }
      
      // Increment points for each interaction
      setPoints(prev => prev + 10);
    } catch (error) {
      console.error("Error sending message:", error);
      setShowTypingIndicator(false);
    } finally {
      setIsProcessing(false);
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
    setLearningProgress(0);
    toast.success("Chat cleared! Ready for a new adventure!");
  };

  const handleTocSectionClick = (section: string) => {
    setInputValue(`Tell me about "${section}" in detail`);
  };

  const handleRelatedTopicClick = (topic: string) => {
    clearChat();
    setInputValue(`Tell me about ${topic}`);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-wonder-background to-white">
      {/* Header */}
      <Header 
        points={points}
        ageRange={ageRange}
        avatar={avatar}
        onAgeRangeChange={() => setShowAgeSelector(true)}
      />
      
      {/* Stats Bar */}
      <StatsBar 
        streakCount={streakCount}
        points={points}
        learningProgress={learningProgress}
        topicSectionsGenerated={topicSectionsGenerated}
        ageRange={ageRange}
        onAgeRangeChange={() => setShowAgeSelector(true)}
      />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden bg-gradient-to-b from-wonder-background/50 to-white/30 backdrop-blur-sm">
        <div className="w-full h-full mx-auto flex flex-col px-4 md:px-8">
          {/* Chat Messages */}
          <ChatArea 
            messages={messages}
            showTypingIndicator={showTypingIndicator}
            completedSections={completedSections}
            relatedTopics={relatedTopics}
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
        <span className="bg-gradient-to-r from-wonder-purple to-wonder-purple-light bg-clip-text text-transparent font-medium font-rounded">WonderWhiz</span> by leading IB educationalists & Cambridge University child psychologists
      </div>
      
      {/* Toast */}
      <Toaster position="top-right" />
    </div>
  );
};

export default Chat;
