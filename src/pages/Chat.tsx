
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WonderWhizLogo from "@/components/WonderWhizLogo";
import { BookOpen, Crown, LogOut, Settings, Star, UserRound } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import LearningBlock, { BlockType } from "@/components/LearningBlock";
import ImageBlock from "@/components/ImageBlock";
import QuizBlock from "@/components/QuizBlock";
import VoiceInput from "@/components/VoiceInput";
import TypingIndicator from "@/components/TypingIndicator";
import TableOfContents from "@/components/TableOfContents";
import AgeRangeSelector from "@/components/AgeRangeSelector";
import RelatedTopicsCard from "@/components/RelatedTopicsCard";
import { useOpenAI } from "@/hooks/useOpenAI";
import { Eraser, Image, Lightbulb, Search, Send, Sparkles, CheckCircle, ListTodo } from "lucide-react";
import { toast } from "sonner";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ageRange = localStorage.getItem("wonderwhiz_age_range") || "8-10";
  const avatar = localStorage.getItem("wonderwhiz_avatar") || "explorer";
  
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
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const chatHistoryRef = React.useRef<HTMLDivElement>(null);
  const [streakCount, setStreakCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [learningProgress, setLearningProgress] = useState(0);

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
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, showTypingIndicator]);
  
  const getAvatarEmoji = () => {
    switch (avatar) {
      case "explorer": return "🧭";
      case "scientist": return "🔬";
      case "storyteller": return "📚";
      default: return "🧭";
    }
  };
  
  const getAvatarColor = () => {
    switch (avatar) {
      case "explorer": return "bg-gradient-yellow";
      case "scientist": return "bg-gradient-teal";
      case "storyteller": return "bg-gradient-coral";
      default: return "bg-gradient-yellow";
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("wonderwhiz_age_range");
    localStorage.removeItem("wonderwhiz_avatar");
    navigate("/");
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      
      inputRef.current?.focus();
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
          imagePrompt = `${messageText} in a style that appeals to ${ageRange} year old children, educational, detailed, colorful`;
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
    inputRef.current?.focus();
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
  };

  const handleTocSectionClick = (section: string) => {
    setInputValue(`Tell me about "${section}" in detail`);
    inputRef.current?.focus();
  };

  const handleRelatedTopicClick = (topic: string) => {
    clearChat();
    setInputValue(`Tell me about ${topic}`);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <WonderWhizLogo size="md" />
            
            <div className="hidden md:flex ml-8 gap-6">
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>Topics</span>
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>Rewards</span>
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <Crown className="h-4 w-4" />
                <span>Progress</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            <div 
              className={`h-10 w-10 rounded-full ${getAvatarColor()} text-white flex items-center justify-center mr-3 shadow-sm cursor-pointer`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {getAvatarEmoji()}
            </div>
            
            <div className="relative">
              <div 
                className="flex items-center gap-2 py-1 px-3 rounded-full bg-purple-100 hover:bg-purple-200 cursor-pointer transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="text-sm text-purple-700 font-medium">{ageRange} years</span>
                <UserRound className="h-4 w-4 text-purple-700" />
              </div>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg py-3 z-50 border border-gray-100">
                  <div className="px-4 py-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-full ${getAvatarColor()} text-white flex items-center justify-center shadow-sm text-xl`}>
                        {getAvatarEmoji()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{avatar}</p>
                        <p className="text-sm text-muted-foreground">{ageRange} years</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <button 
                      className="w-full text-left px-4 py-2 text-sm hover:bg-muted/50 flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-3 text-muted-foreground" />
                      Settings
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Stats Bar */}
      <div className="bg-white border-b px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white shadow-sm">
                <Crown className="h-4 w-4" />
              </div>
              <div className="ml-2">
                <div className="text-xs text-muted-foreground">Learning Streak</div>
                <div className="font-bold text-sm flex items-center">
                  {streakCount} days 
                  <Sparkles className="h-3 w-3 ml-1 text-amber-400" />
                </div>
              </div>
            </div>
            
            <div className="h-8 border-l border-muted mx-2"></div>
            
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-violet-400 to-purple-500 flex items-center justify-center text-white shadow-sm">
                <Star className="h-4 w-4" />
              </div>
              <div className="ml-2">
                <div className="text-xs text-muted-foreground">Points</div>
                <div className="font-bold text-sm">{points}</div>
              </div>
            </div>
            
            {topicSectionsGenerated && (
              <>
                <div className="h-8 border-l border-muted mx-2"></div>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-white shadow-sm">
                    <ListTodo className="h-4 w-4" />
                  </div>
                  <div className="ml-2">
                    <div className="text-xs text-muted-foreground">Progress</div>
                    <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                      <div 
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full" 
                        style={{ width: `${learningProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button 
              className="flex items-center gap-1 bg-purple-100 hover:bg-purple-200 px-3 py-1 rounded-full text-purple-700 text-sm font-medium transition-colors"
              onClick={() => setShowAgeSelector(true)}
            >
              Age: {ageRange}
              <CheckCircle className="h-3 w-3 ml-1" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden bg-gray-50">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4" ref={chatHistoryRef}>
            {messages.map((message) => (
              <div key={message.id}>
                <ChatMessage message={message.text} isUser={message.isUser}>
                  {message.tableOfContents && (
                    <TableOfContents 
                      sections={message.tableOfContents} 
                      completedSections={completedSections}
                      onSectionClick={handleTocSectionClick}
                    />
                  )}
                  {message.imagePrompt && (
                    <ImageBlock prompt={message.imagePrompt} />
                  )}
                  {message.quiz && (
                    <QuizBlock 
                      question={message.quiz.question} 
                      options={message.quiz.options}
                      correctAnswer={message.quiz.correctAnswer}
                    />
                  )}
                </ChatMessage>
                
                {message.showBlocks && message.blocks && (
                  <div className="mb-8 overflow-x-auto pb-4 flex gap-3 snap-x snap-mandatory">
                    {message.blocks.map((block) => (
                      <LearningBlock
                        key={block}
                        type={block}
                        onClick={() => handleBlockClick(block, message.id, message.text)}
                      />
                    ))}
                  </div>
                )}
                
                {message.isIntroduction && relatedTopics.length > 0 && (
                  <div className="mb-8">
                    <RelatedTopicsCard 
                      topics={relatedTopics} 
                      onTopicClick={handleRelatedTopicClick}
                    />
                  </div>
                )}
              </div>
            ))}
            
            {showTypingIndicator && <TypingIndicator />}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Suggested Prompts */}
          {suggestedPrompts.length > 0 && messages.length < 3 && (
            <div className="px-4 mb-4">
              <div className="flex items-center mb-2 text-sm text-muted-foreground">
                <Lightbulb className="h-4 w-4 mr-2" />
                <span>Try asking about:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSuggestedPromptClick(prompt)}
                    className="bg-white border border-purple-200 text-purple-700 rounded-full px-3 py-1 text-sm hover:bg-purple-50 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Chat Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={clearChat}
                className="flex items-center text-sm text-muted-foreground hover:text-purple-700 transition-colors"
              >
                <Eraser className="h-3.5 w-3.5 mr-1" />
                Clear chat
              </button>
              <button
                className="flex items-center text-sm text-muted-foreground hover:text-purple-700 transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5 mr-1" />
                Learning resources
              </button>
            </div>
            
            <div className="relative flex">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={selectedTopic ? `Ask me about ${selectedTopic} or explore a section...` : "Ask me anything..."}
                disabled={isProcessing}
                className="w-full pl-12 pr-16 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-sm"
              />
              
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="h-5 w-5 text-purple-400" />
              </div>
              
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <VoiceInput 
                  onTranscript={handleVoiceInput}
                  isListening={isListening}
                  toggleListening={toggleListening}
                />
                
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isProcessing}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                    inputValue.trim() && !isProcessing
                      ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-md hover:shadow-lg"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isProcessing ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Quick Access */}
            <div className="flex justify-center mt-3 space-x-2">
              <button className="p-1 text-purple-600 hover:text-purple-800 transition-colors">
                <Image className="h-5 w-5" />
              </button>
              <button className="p-1 text-teal-600 hover:text-teal-800 transition-colors">
                <Star className="h-5 w-5" />
              </button>
              <button className="p-1 text-rose-500 hover:text-rose-700 transition-colors">
                <Sparkles className="h-5 w-5" />
              </button>
            </div>
          </div>
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
      <div className="bg-white border-t py-1.5 px-4 text-center text-xs text-muted-foreground">
        WonderWhiz by leading IB educationalists & Cambridge University child psychologists
      </div>
    </div>
  );
};

export default Chat;
