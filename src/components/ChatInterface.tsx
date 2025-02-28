
import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import LearningBlock, { BlockType } from "./LearningBlock";
import ImageBlock from "./ImageBlock";
import QuizBlock from "./QuizBlock";
import CodeBlock from "./CodeBlock";
import VoiceInput from "./VoiceInput";
import TypingIndicator from "./TypingIndicator";
import TableOfContents from "./TableOfContents";
import AgeRangeSelector from "./AgeRangeSelector";
import RelatedTopicsCard from "./RelatedTopicsCard";
import { useOpenAI } from "@/hooks/useOpenAI";
import { BookOpen, Crown, Eraser, Image, Lightbulb, Search, Send, Sparkles, Star, CheckCircle, ListTodo } from "lucide-react";
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

interface ChatInterfaceProps {
  ageRange: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ ageRange: initialAgeRange }) => {
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
  const [ageRange, setAgeRange] = useState(initialAgeRange);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showAgeSelector, setShowAgeSelector] = useState(false);
  const [topicSectionsGenerated, setTopicSectionsGenerated] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [relatedTopics, setRelatedTopics] = useState<string[]>([]);
  const { isLoading, generateResponse, generateImage, generateQuiz } = useOpenAI();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
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
    scrollToBottom();
  }, [messages, showTypingIndicator]);

  useEffect(() => {
    // Simulate loading saved data from localStorage
    const savedStreak = Math.floor(Math.random() * 5) + 1; // Random 1-5 for demo
    const savedPoints = Math.floor(Math.random() * 500); // Random points for demo
    setStreakCount(savedStreak);
    setPoints(savedPoints);
  }, []);

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
    <div className="flex flex-col h-full">
      {/* Stats Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-rainbow flex items-center justify-center text-white shadow-sm">
              <Crown className="h-4 w-4" />
            </div>
            <div className="ml-2">
              <div className="text-xs text-muted-foreground">Learning Streak</div>
              <div className="font-bold text-sm flex items-center">
                {streakCount} days 
                <Sparkles className="h-3 w-3 ml-1 text-wonder-yellow" />
              </div>
            </div>
          </div>
          
          <div className="h-8 border-l border-muted mx-2"></div>
          
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-purple flex items-center justify-center text-white shadow-sm">
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
                <div className="h-8 w-8 rounded-full bg-gradient-teal flex items-center justify-center text-white shadow-sm">
                  <ListTodo className="h-4 w-4" />
                </div>
                <div className="ml-2">
                  <div className="text-xs text-muted-foreground">Progress</div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-gradient-wonder rounded-full" 
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
            className="point-counter flex items-center gap-1 bg-gradient-wonder/10 hover:bg-gradient-wonder/20 px-3 py-1 rounded-full text-wonder-purple text-sm font-medium transition-colors"
            onClick={() => setShowAgeSelector(true)}
          >
            Age: {ageRange}
            <CheckCircle className="h-3 w-3 ml-1" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4" ref={chatHistoryRef}>
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <React.Fragment key={message.id}>
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
                {message.code && (
                  <CodeBlock 
                    code={message.code.snippet} 
                    language={message.code.language} 
                  />
                )}
              </ChatMessage>
              
              {message.showBlocks && message.blocks && (
                <div className="mb-8 overflow-x-auto pb-4 flex gap-3 hide-scrollbar">
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
            </React.Fragment>
          ))}
          
          {showTypingIndicator && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {showAgeSelector && (
        <AgeRangeSelector 
          currentRange={ageRange} 
          onSelect={handleAgeRangeChange}
          onClose={() => setShowAgeSelector(false)}
        />
      )}
      
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
                className="bg-white border border-wonder-purple/20 text-wonder-purple rounded-full px-3 py-1 text-sm hover:bg-wonder-purple/10 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="p-4 bg-gradient-to-r from-white/95 to-wonder-background/95 backdrop-blur-md border-t">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={clearChat}
              className="flex items-center text-sm text-muted-foreground hover:text-wonder-purple transition-colors"
            >
              <Eraser className="h-3.5 w-3.5 mr-1" />
              Clear chat
            </button>
            <button
              className="flex items-center text-sm text-muted-foreground hover:text-wonder-purple transition-colors"
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
              className="w-full pl-12 pr-16 py-4 rounded-full border border-wonder-purple/20 focus:outline-none focus:ring-2 focus:ring-wonder-purple/30 shadow-wonder"
            />
            
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="h-5 w-5 text-wonder-purple/60" />
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
                    ? "bg-gradient-wonder text-white shadow-wonder hover:shadow-wonder-lg"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isProcessing ? (
                  <div className="h-4 w-4 border-2 border-wonder-purple border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          
          {/* Character Quick Access */}
          <div className="flex justify-center mt-3 space-x-2">
            <button className="p-1 text-wonder-purple hover:text-wonder-purple-dark transition-colors">
              <Image className="h-5 w-5" />
            </button>
            <button className="p-1 text-wonder-teal hover:text-wonder-teal-dark transition-colors">
              <Star className="h-5 w-5" />
            </button>
            <button className="p-1 text-wonder-coral hover:text-wonder-coral-dark transition-colors">
              <Sparkles className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
