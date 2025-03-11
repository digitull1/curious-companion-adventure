import React, { useRef, useEffect, useState } from "react";
import { ChevronRight, ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import LearningBlock, { BlockType } from "@/components/LearningBlock";
import TypingIndicator from "@/components/TypingIndicator";
import TableOfContents from "@/components/TableOfContents";
import ContentBox from "@/components/ContentBox";
import { animate } from "@motionone/dom";
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
    funFact?: string;
  };
  code?: {
    snippet: string;
    language: string;
  };
  tableOfContents?: string[];
  isIntroduction?: boolean;
}

interface ChatAreaProps {
  messages: Message[];
  showTypingIndicator: boolean;
  completedSections: string[];
  currentSection: string | null;
  relatedTopics: string[];
  learningComplete: boolean;
  onBlockClick: (type: BlockType, messageId: string, messageText: string) => void;
  onTocSectionClick: (section: string) => void;
  onRelatedTopicClick: (topic: string) => void;
  learningProgress: number;
  isInitialView?: boolean;
  onStartLearning?: () => void;
}

const processRelatedTopics = (topics: string[]): string[] => {
  console.log("Processing related topics:", topics);
  if (!topics || topics.length === 0) return [];
  
  if (topics.length === 1 && typeof topics[0] === 'string') {
    const topicStr = topics[0];
    
    if (topicStr.includes('\n')) {
      return topicStr.split('\n')
        .map(line => line.replace(/^\d+[\.\)]?\s*/, '').trim())
        .filter(line => line.length > 0);
    }
    
    if (topicStr.includes(',')) {
      return topicStr.split(',').map(t => t.trim()).filter(t => t.length > 0);
    }
    
    if (topicStr.includes(';')) {
      return topicStr.split(';').map(t => t.trim()).filter(t => t.length > 0);
    }
  }
  
  return topics.filter(t => t && typeof t === 'string' && t.trim().length > 0);
};

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  showTypingIndicator,
  completedSections,
  currentSection,
  relatedTopics,
  learningComplete,
  onBlockClick,
  onTocSectionClick,
  onRelatedTopicClick,
  learningProgress,
  isInitialView = false,
  onStartLearning
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const relatedTopicsRef = useRef<HTMLDivElement>(null);
  const [currentSectionMessage, setCurrentSectionMessage] = useState<Message | null>(null);
  const [currentBlockMessage, setCurrentBlockMessage] = useState<Message | null>(null);
  const [activeBlock, setActiveBlock] = useState<BlockType | null>(null);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [processedCurrentSection, setProcessedCurrentSection] = useState<string | null>(null);
  
  const processedRelatedTopics = processRelatedTopics(relatedTopics);
  console.log("Processed related topics:", processedRelatedTopics);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTypingIndicator]);

  useEffect(() => {
    console.log("[ChatArea][Debug] Current messages count:", messages.length);
    const tocMessages = messages.filter(m => m.tableOfContents);
    console.log("[ChatArea][Debug] TOC messages:", tocMessages.map(m => ({
      id: m.id,
      text: m.text.substring(0, 50) + "...",
      hasTOC: !!m.tableOfContents,
      sections: m.tableOfContents
    })));
  }, [messages]);

  useEffect(() => {
    const lastMessages = messages.slice(-5);
    const blockMessage = lastMessages.find(m => (m.imagePrompt || m.quiz) && !m.isUser);
    
    if (blockMessage) {
      console.log(`[ChatArea] Found block message with id: ${blockMessage.id}`);
      if (blockMessage.imagePrompt) {
        console.log(`[ChatArea] Image prompt found: ${blockMessage.imagePrompt.substring(0, 50)}...`);
      }
      if (blockMessage.quiz) {
        console.log(`[ChatArea] Quiz found: ${JSON.stringify({
          question: blockMessage.quiz.question.substring(0, 30) + "...",
          options: blockMessage.quiz.options.length
        })}`);
      }
      setCurrentBlockMessage(blockMessage);
    }
  }, [messages]);

  useEffect(() => {
    if (currentSection !== processedCurrentSection) {
      console.log(`Section changing from "${processedCurrentSection}" to "${currentSection}"`);
      setProcessedCurrentSection(currentSection);
    }
  }, [currentSection, processedCurrentSection]);

  useEffect(() => {
    if (currentSection) {
      const sectionMessage = [...messages]
        .reverse()
        .find(m => !m.isUser && !m.tableOfContents && !m.imagePrompt && !m.quiz);
      
      if (sectionMessage) {
        console.log("Setting current section message:", sectionMessage.id, sectionMessage.text.substring(0, 50) + "...");
        setCurrentSectionMessage(sectionMessage);
      }
    } else {
      console.log("No current section selected, clearing section message and block message");
      setCurrentSectionMessage(null);
      setCurrentBlockMessage(null);
      setActiveBlock(null);
    }
  }, [processedCurrentSection, messages]);

  useEffect(() => {
    if (relatedTopicsRef.current && learningComplete) {
      console.log("Animating related topics:", processedRelatedTopics);
      const topics = relatedTopicsRef.current.querySelectorAll('.related-topic');
      topics.forEach((topic, index) => {
        animate(
          topic,
          { opacity: [0, 1], scale: [0.9, 1], y: [10, 0] },
          { duration: 0.4, delay: 0.15 * index, easing: "ease-out" }
        );
      });
    }
  }, [learningComplete, processedRelatedTopics]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleMessageExpansion = (messageId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const getAdjacentSections = () => {
    if (!currentSection) return { prev: null, next: null };
    
    const toc = messages.find(m => m.tableOfContents)?.tableOfContents || [];
    if (toc.length === 0) return { prev: null, next: null };
    
    const currentIndex = toc.findIndex(section => section === currentSection);
    if (currentIndex === -1) return { prev: null, next: null };
    
    const prev = currentIndex > 0 ? toc[currentIndex - 1] : null;
    const next = currentIndex < toc.length - 1 ? toc[currentIndex + 1] : null;
    
    return { prev, next };
  };

  const renderTopicPill = () => {
    if (!currentSection) return null;
    
    const cleanedSection = currentSection.replace(/\*\*/g, "");
    
    return (
      <div className="mx-auto max-w-3xl px-4 my-3">
        <div className="flex items-center justify-between bg-gradient-to-r from-wonder-purple/10 to-wonder-purple/5 backdrop-blur-md p-2 px-4 rounded-full border border-wonder-purple/10 shadow-sm">
          <div className="flex items-center gap-1.5 ml-1">
            <div className="w-6 h-6 flex-shrink-0 rounded-full bg-wonder-purple/20 flex items-center justify-center">
              <BookOpen className="h-3 w-3 text-wonder-purple" />
            </div>
            <span className="text-xs text-wonder-purple/70">Learning:</span>
            <span className="text-sm font-medium text-wonder-purple truncate max-w-[150px] sm:max-w-[300px]">
              {cleanedSection}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-white/70 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pixar-blue to-pixar-sky rounded-full"
                style={{ width: `${learningProgress}%` }}
              ></div>
            </div>
            <span className="text-xs text-wonder-purple/70">{Math.round(learningProgress)}%</span>
          </div>
        </div>
      </div>
    );
  };

  const handleContentBoxBlockClick = (block: BlockType) => {
    if (currentSectionMessage) {
      console.log(`[ChatArea] Content box block clicked: ${block} for message: ${currentSectionMessage.id}`);
      console.log(`[ChatArea] Current section message text: ${currentSectionMessage.text.substring(0, 50)}...`);
      setActiveBlock(block);
      onBlockClick(block, currentSectionMessage.id, currentSectionMessage.text);
    } else {
      console.warn("[ChatArea] Block clicked but no current section message found!");
    }
  };

  const welcomeMessage = messages.find(m => !m.isUser && m.isIntroduction && !m.tableOfContents);
  
  const introMessage = messages.find(m => m.tableOfContents);
  
  console.log("[ChatArea][Debug] Welcome message:", welcomeMessage ? `ID: ${welcomeMessage.id}` : "None");
  console.log("[ChatArea][Debug] Intro message with TOC:", introMessage ? 
    `ID: ${introMessage.id}, TOC sections: ${introMessage.tableOfContents?.length || 0}` : 
    "None");
  
  const shouldShowRelatedTopics = processedRelatedTopics.length > 0 && learningComplete;
  
  const { prev, next } = getAdjacentSections();
  
  const userMessages = messages.filter(m => m.isUser);
  console.log("Filtered user messages:", userMessages.length);
  
  const aiMessages = messages.filter(m => {
    const isRegularAIMessage = !m.isUser && 
                              !m.isIntroduction && 
                              !m.tableOfContents && 
                              !m.imagePrompt && 
                              !m.quiz;
    
    const isInContentBox = currentSectionMessage && 
                          m.id === currentSectionMessage.id;
    
    if (isRegularAIMessage && currentSectionMessage && m.id === currentSectionMessage.id) {
      console.log("Excluding message from chat flow - will be shown in content box:", m.id);
    }
    
    return isRegularAIMessage && !isInContentBox;
  });
  
  console.log("Filtered AI messages:", aiMessages.length);

  const shouldTruncate = (text: string) => text.length > 300;
  
  const truncateText = (text: string) => {
    if (text.length <= 300) return text;
    return text.substring(0, 300) + "...";
  };

  return (
    <div 
      className="flex-1 overflow-y-auto py-6 scrollbar-thin relative" 
      ref={chatHistoryRef}
    >
      <div className="sticky top-0 z-10 mb-4 bg-gradient-to-b from-wonder-background via-wonder-background to-transparent pb-2">
        {currentSection && renderTopicPill()}
      </div>
      
      <div className="relative">
        <div className="space-y-6">
          {welcomeMessage && (
            <div className="fade-scale-in mb-6 px-4">
              <ChatMessage message={welcomeMessage.text} isUser={welcomeMessage.isUser} />
            </div>
          )}
          
          {introMessage && (
            <div className="fade-scale-in mb-6 px-4">
              <ChatMessage message={introMessage.text} isUser={introMessage.isUser}>
                <TableOfContents 
                  sections={introMessage.tableOfContents || []} 
                  completedSections={completedSections}
                  currentSection={currentSection}
                  onSectionClick={onTocSectionClick}
                />
              </ChatMessage>
            </div>
          )}
          
          {showTypingIndicator && (
            <div className="px-4 mb-2">
              <TypingIndicator />
            </div>
          )}
          
          {userMessages.map((message, index) => {
            const aiMessage = aiMessages[index];
            
            return (
              <div key={message.id} className="mb-6">
                <div className="fade-scale-in px-4">
                  <ChatMessage message={message.text} isUser={true} />
                </div>
                
                {aiMessage && (
                  <div className="fade-scale-in px-4 mt-3">
                    <div className="relative">
                      <ChatMessage 
                        message={expandedMessages.has(aiMessage.id) ? 
                          aiMessage.text : 
                          shouldTruncate(aiMessage.text) ? 
                            truncateText(aiMessage.text) : 
                            aiMessage.text
                        } 
                        isUser={false} 
                      />
                      
                      {shouldTruncate(aiMessage.text) && (
                        <button 
                          onClick={() => toggleMessageExpansion(aiMessage.id)}
                          className="mt-2 flex items-center text-xs text-wonder-purple/70 hover:text-wonder-purple transition-colors"
                        >
                          {expandedMessages.has(aiMessage.id) ? (
                            <>Show less <ChevronDown className="h-3 w-3 ml-1 transform rotate-180" /></>
                          ) : (
                            <>Read more <ChevronDown className="h-3 w-3 ml-1" /></>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {currentSection && currentSectionMessage && (
            <div className="px-4 max-w-4xl mx-auto">
              <ContentBox
                title={currentSection}
                content={currentSectionMessage.text}
                prevSection={prev}
                nextSection={next}
                blocks={currentSectionMessage.blocks || ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"]}
                onBlockClick={handleContentBoxBlockClick}
                onNavigate={onTocSectionClick}
                activeBlock={activeBlock}
                imagePrompt={currentBlockMessage?.imagePrompt}
                quiz={currentBlockMessage?.quiz}
              />
            </div>
          )}
          
          {shouldShowRelatedTopics && (
            <div className="mx-auto max-w-3xl px-4 mb-6" ref={relatedTopicsRef}>
              <div className="p-4 bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-sm rounded-xl border border-wonder-purple/20 shadow-magical">
                <h3 className="text-sm font-medium mb-3 text-wonder-purple flex items-center">
                  <span className="text-lg mr-2">🎉</span> Continue your learning journey with:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {processedRelatedTopics.map((topic, index) => (
                    <div 
                      key={index}
                      onClick={() => onRelatedTopicClick(topic)}
                      className="related-topic p-3 bg-white/90 backdrop-blur-sm rounded-xl border border-wonder-purple/10 
                                hover:border-wonder-purple/30 shadow-sm hover:shadow-magical cursor-pointer transition-all duration-300
                                hover:-translate-y-1 transform touch-manipulation opacity-100"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-wonder-yellow/20 to-wonder-yellow flex items-center justify-center text-wonder-yellow-dark">
                          <ChevronRight className="h-3.5 w-3.5" />
                        </div>
                        <h3 className="font-medium text-sm text-foreground font-rounded leading-tight">{topic}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground font-rounded">Tap to explore this fascinating topic</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {learningComplete && !shouldShowRelatedTopics && (
            <div className="px-4 mt-8 mb-6 max-w-3xl mx-auto">
              <div className="p-4 bg-white/90 rounded-xl border border-wonder-purple/10 shadow-sm">
                <div className="text-center">
                  <h3 className="text-wonder-purple font-medium mb-2">🎉 Congratulations!</h3>
                  <p className="text-muted-foreground text-sm">You've completed all sections of this topic.</p>
                  <button 
                    className="mt-3 px-4 py-2 bg-wonder-purple/10 hover:bg-wonder-purple/20 text-wonder-purple rounded-full text-sm font-medium transition-colors"
                    onClick={() => {
                      onRelatedTopicClick("Give me a new interesting topic to learn about");
                    }}
                  >
                    Explore a new topic
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
