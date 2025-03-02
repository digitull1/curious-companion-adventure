
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import WonderWhizLogo from "@/components/WonderWhizLogo";
import { 
  BookOpen, Crown, LogOut, Settings, Star, UserRound, 
  Eraser, MessageCircle, Send, Sparkles, 
  CheckCircle, ListTodo, Mic, ChevronRight, HelpCircle, Rocket, BookMarked, Brain
} from "lucide-react";
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
import { animate } from "@motionone/dom";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const learningBlocksRef = useRef<HTMLDivElement>(null);
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

    // Apply animations to learning blocks on first load
    if (learningBlocksRef.current) {
      const blocks = learningBlocksRef.current.querySelectorAll('.learning-block');
      blocks.forEach((block, index) => {
        animate(
          block,
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.4, delay: 0.1 * index, easing: "ease-out" }
        );
      });
    }
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
      case "explorer": return "bg-gradient-to-br from-wonder-yellow to-wonder-yellow-dark";
      case "scientist": return "bg-gradient-to-br from-wonder-teal to-wonder-teal-dark";
      case "storyteller": return "bg-gradient-to-br from-wonder-coral to-wonder-coral-dark";
      default: return "bg-gradient-to-br from-wonder-yellow to-wonder-yellow-dark";
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
    toast.success("Chat cleared! Ready for a new adventure!");
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

  const scrollLearningBlocks = (direction: 'left' | 'right') => {
    if (learningBlocksRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      learningBlocksRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-wonder-background to-white">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <WonderWhizLogo size="md" className="animate-float" />
            
            <div className="hidden md:flex ml-8 gap-6">
              <button className="text-sm font-medium text-muted-foreground hover:text-wonder-purple transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-wonder-purple/5">
                <BookOpen className="h-4 w-4" />
                <span>Topics</span>
              </button>
              <button className="text-sm font-medium text-muted-foreground hover:text-wonder-purple transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-wonder-purple/5">
                <Star className="h-4 w-4" />
                <span>Rewards</span>
              </button>
              <button className="text-sm font-medium text-muted-foreground hover:text-wonder-purple transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-wonder-purple/5">
                <Crown className="h-4 w-4" />
                <span>Progress</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-wonder-purple/10 text-wonder-purple rounded-full px-4 py-1 text-sm font-semibold flex items-center gap-2">
              <Star className="h-3.5 w-3.5" />
              <span>{points} points</span>
            </div>
            
            <div 
              className={`h-10 w-10 rounded-full ${getAvatarColor()} text-white flex items-center justify-center shadow-magical cursor-pointer transition-all duration-300 hover:shadow-magical-hover text-lg`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {getAvatarEmoji()}
            </div>
            
            <div className="relative">
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-pixar py-3 z-50 border border-wonder-purple/10 backdrop-blur-sm bg-white/95 animate-fade-in-up">
                  <div className="px-4 py-3 border-b border-wonder-purple/10">
                    <div className="flex items-center gap-3">
                      <div className={`h-14 w-14 rounded-full ${getAvatarColor()} text-white flex items-center justify-center shadow-magical text-2xl`}>
                        {getAvatarEmoji()}
                      </div>
                      <div>
                        <p className="font-bold text-foreground capitalize">{avatar}</p>
                        <p className="text-sm text-muted-foreground">{ageRange} years</p>
                        <div className="flex items-center mt-1 text-xs text-wonder-purple">
                          <Crown className="h-3 w-3 mr-1" />
                          <span>Level 3 Explorer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <button 
                      onClick={() => {
                        setShowAgeSelector(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-wonder-purple/5 flex items-center text-foreground"
                    >
                      <UserRound className="h-4 w-4 mr-3 text-wonder-purple" />
                      Change Age Range
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-wonder-purple/5 flex items-center text-foreground"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-3 text-wonder-purple" />
                      Settings
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2.5 text-sm text-wonder-coral hover:bg-wonder-coral/5 flex items-center"
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
      <div className="bg-white/60 backdrop-blur-sm border-b border-wonder-purple/10 px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-wonder-coral to-wonder-coral-dark flex items-center justify-center text-white shadow-magical">
                <Crown className="h-4 w-4" />
              </div>
              <div className="ml-2">
                <div className="text-xs text-muted-foreground">Learning Streak</div>
                <div className="font-bold text-sm flex items-center">
                  {streakCount} days 
                  <Sparkles className="h-3 w-3 ml-1 text-wonder-yellow animate-sparkle" />
                </div>
              </div>
            </div>
            
            <div className="h-8 border-l border-wonder-purple/10 mx-2"></div>
            
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-wonder-purple to-wonder-purple-dark flex items-center justify-center text-white shadow-magical">
                <Star className="h-4 w-4" />
              </div>
              <div className="ml-2">
                <div className="text-xs text-muted-foreground">Points</div>
                <div className="font-bold text-sm">{points}</div>
              </div>
            </div>
            
            {topicSectionsGenerated && (
              <>
                <div className="h-8 border-l border-wonder-purple/10 mx-2"></div>
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-wonder-blue to-wonder-blue-dark flex items-center justify-center text-white shadow-magical">
                    <ListTodo className="h-4 w-4" />
                  </div>
                  <div className="ml-2">
                    <div className="text-xs text-muted-foreground">Progress</div>
                    <div className="w-24 h-2.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-wonder-purple to-wonder-purple-light rounded-full transition-all duration-700 relative overflow-hidden"
                        style={{ width: `${learningProgress}%` }}
                      >
                        <div className="absolute inset-0 animate-shine"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button 
              className="flex items-center gap-1.5 bg-gradient-to-r from-wonder-purple/20 to-wonder-purple-light/20 hover:from-wonder-purple/30 hover:to-wonder-purple-light/30 px-3.5 py-1.5 rounded-full text-wonder-purple text-sm font-medium transition-all duration-300 border border-wonder-purple/20 shadow-sm"
              onClick={() => setShowAgeSelector(true)}
            >
              <UserRound className="h-3.5 w-3.5 mr-1" />
              Age: {ageRange}
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden bg-gradient-to-b from-wonder-background/50 to-white/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {/* Chat Messages */}
          <div 
            className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin" 
            ref={chatHistoryRef}
          >
            {messages.map((message) => (
              <div key={message.id} className="fade-scale-in">
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
                  <div className="relative mb-8 learning-blocks-wrapper">
                    <button 
                      className="scroll-button scroll-button-left" 
                      onClick={() => scrollLearningBlocks('left')}
                      aria-label="Scroll left"
                    >
                      <ChevronRight className="h-5 w-5 rotate-180" />
                    </button>
                    
                    <div 
                      ref={learningBlocksRef}
                      className="learning-blocks-container"
                    >
                      {message.blocks.map((block) => (
                        <LearningBlock
                          key={block}
                          type={block}
                          onClick={() => handleBlockClick(block, message.id, message.text)}
                        />
                      ))}
                    </div>
                    
                    <button 
                      className="scroll-button scroll-button-right" 
                      onClick={() => scrollLearningBlocks('right')}
                      aria-label="Scroll right"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
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
              <div className="flex items-center mb-2">
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-r from-wonder-yellow to-wonder-yellow-dark text-white mr-2 shadow-magical">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-wonder-purple">Try asking about:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSuggestedPromptClick(prompt)}
                    className="bg-white/80 backdrop-blur-sm border border-wonder-purple/30 text-wonder-purple-dark rounded-full px-3.5 py-1.5 text-sm hover:bg-wonder-purple/5 transition-all duration-300 shadow-sm hover:border-wonder-purple/50 hover:shadow-magical"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Chat Input */}
          <div className="p-4 border-t border-wonder-purple/10 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={clearChat}
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-wonder-purple transition-colors px-2 py-1 rounded-md hover:bg-wonder-purple/5"
              >
                <Eraser className="h-3.5 w-3.5 mr-1.5" />
                Clear chat
              </button>
              
              <div className="flex space-x-1">
                <button className="flex items-center text-sm font-medium text-wonder-teal hover:text-wonder-teal-dark transition-colors px-2 py-1 rounded-md hover:bg-wonder-teal/5">
                  <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
                  Help
                </button>
                <button className="flex items-center text-sm font-medium text-wonder-yellow hover:text-wonder-yellow-dark transition-colors px-2 py-1 rounded-md hover:bg-wonder-yellow/5">
                  <BookMarked className="h-3.5 w-3.5 mr-1.5" />
                  Resources
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative flex">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={selectedTopic ? `Ask me about ${selectedTopic} or explore a section...` : "Ask me anything..."}
                  disabled={isProcessing}
                  className="w-full pl-12 pr-16 py-4 rounded-full border border-wonder-purple/20 focus:outline-none focus:ring-2 focus:ring-wonder-purple/30 shadow-magical bg-white/90 backdrop-blur-sm placeholder:text-slate-400 text-foreground"
                />
                
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <MessageCircle className="h-5 w-5 text-wonder-purple" />
                </div>
                
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <VoiceInput 
                    onTranscript={handleVoiceInput}
                    isListening={isListening}
                    toggleListening={toggleListening}
                  />
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isProcessing}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                      inputValue.trim() && !isProcessing
                        ? "bg-gradient-to-br from-wonder-purple to-wonder-purple-dark text-white shadow-magical hover:shadow-magical-hover transform hover:-translate-y-0.5"
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
            </div>
            
            {/* Learning Tools Menu */}
            <div className="flex justify-center mt-3">
              <div className="bg-white/90 backdrop-blur-sm border border-wonder-purple/10 rounded-full px-2 py-1 shadow-sm">
                <div className="flex space-x-2">
                  <button className="p-1.5 text-wonder-purple/80 hover:text-wonder-purple transition-colors rounded-full hover:bg-wonder-purple/5 flex items-center justify-center">
                    <BookOpen className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 text-wonder-yellow/80 hover:text-wonder-yellow transition-colors rounded-full hover:bg-wonder-yellow/5 flex items-center justify-center">
                    <Rocket className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 text-wonder-teal/80 hover:text-wonder-teal transition-colors rounded-full hover:bg-wonder-teal/5 flex items-center justify-center">
                    <Brain className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 text-wonder-coral/80 hover:text-wonder-coral transition-colors rounded-full hover:bg-wonder-coral/5 flex items-center justify-center">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
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
      
      {/* Footer - Simplified */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-wonder-purple/10 py-2 px-4 text-center text-xs text-muted-foreground">
        <span className="bg-gradient-to-r from-wonder-purple to-wonder-purple-light bg-clip-text text-transparent font-medium">WonderWhiz</span> by leading IB educationalists & Cambridge University child psychologists
      </div>
      
      {/* Toast */}
      <Toaster position="top-right" />
    </div>
  );
};

export default Chat;
