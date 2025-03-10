
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
}

// Helper function to process related topics from a single string
const processRelatedTopics = (topics: string[]): string[] => {
  console.log("Processing related topics:", topics);
  if (!topics || topics.length === 0) return [];
  
  // If it's a single string containing multiple topics
  if (topics.length === 1 && typeof topics[0] === 'string') {
    const topicStr = topics[0];
    
    // Check for numbered list format (e.g., "1. Topic\n2. Topic")
    if (topicStr.includes('\n')) {
      return topicStr.split('\n')
        .map(line => line.replace(/^\d+[\.\)]?\s*/, '').trim())
        .filter(line => line.length > 0);
    }
    
    // Check for comma-separated list
    if (topicStr.includes(',')) {
      return topicStr.split(',').map(t => t.trim()).filter(t => t.length > 0);
    }
    
    // Check for semicolon-separated list
    if (topicStr.includes(';')) {
      return topicStr.split(';').map(t => t.trim()).filter(t => t.length > 0);
    }
  }
  
  // Already an array of topics
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
  learningProgress
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const relatedTopicsRef = useRef<HTMLDivElement>(null);
  const [currentSectionMessage, setCurrentSectionMessage] = useState<Message | null>(null);
  const [currentBlockMessage, setCurrentBlockMessage] = useState<Message | null>(null);
  const [activeBlock, setActiveBlock] = useState<BlockType | null>(null);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [processedCurrentSection, setProcessedCurrentSection] = useState<string | null>(null);
  
  // Process related topics
  const processedRelatedTopics = processRelatedTopics(relatedTopics);
  console.log("Processed related topics:", processedRelatedTopics);

  useEffect(() => {
    // Only scroll to bottom when the user sends a message, not for automatic section selection
    if (messages.length > 0 && messages[messages.length - 1].isUser) {
      scrollToBottom();
    }
  }, [messages]);

  // Debug log messages to track table of contents
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

  // When a new message with image or quiz is added, update the current block message
  useEffect(() => {
    const lastMessages = messages.slice(-5); // Look at the last 5 messages for efficiency
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
    // Find the most recent non-user message about the current section that isn't a block-related message
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
    // Apply animations to related topics when they appear
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

  // Toggle message expansion
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

  // Function to get previous and next section based on current section
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

  // Render topic pill (improved version that doesn't overlap)
  const renderTopicPill = () => {
    if (!currentSection) return null;
    
    // Remove asterisks from current section
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

  // Handle specific block click within ContentBox
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

  // Find the welcome message
  const welcomeMessage = messages.find(m => !m.isUser && m.isIntroduction && !m.tableOfContents);
  
  // Find the introduction message that contains the table of contents
  const introMessage = messages.find(m => m.tableOfContents);
  
  console.log("[ChatArea][Debug] Welcome message:", welcomeMessage ? `ID: ${welcomeMessage.id}` : "None");
  console.log("[ChatArea][Debug] Intro message with TOC:", introMessage ? 
    `ID: ${introMessage.id}, TOC sections: ${introMessage.tableOfContents?.length || 0}` : 
    "None");
  
  // Check if we have related topics to display and if learning is complete
  const shouldShowRelatedTopics = processedRelatedTopics.length > 0 && learningComplete;
  
  // Get adjacent sections for navigation
  const { prev, next } = getAdjacentSections();
  
  // Filter user messages to display in the chat flow
  const userMessages = messages.filter(m => m.isUser);
  console.log("Filtered user messages:", userMessages.length);
  
  // Filter AI messages that are not special (TOC, welcome, etc.)
  // FIXED: Properly exclude messages that are currently displayed in the content box
  const aiMessages = messages.filter(m => {
    const isRegularAIMessage = !m.isUser && 
                              !m.isIntroduction && 
                              !m.tableOfContents && 
                              !m.imagePrompt && 
                              !m.quiz;
    
    // Exclude messages that are currently displayed in the content box
    const isInContentBox = currentSectionMessage && 
                          m.id === currentSectionMessage.id;
    
    // Debug logging
    if (isRegularAIMessage && currentSectionMessage && m.id === currentSectionMessage.id) {
      console.log("Excluding message from chat flow - will be shown in content box:", m.id);
    }
    
    return isRegularAIMessage && !isInContentBox;
  });
  
  console.log("Filtered AI messages:", aiMessages.length);

  // Check if a message should be truncated
  const shouldTruncate = (text: string) => text.length > 300;
  
  // Truncate message text
  const truncateText = (text: string) => {
    if (text.length <= 300) return text;
    return text.substring(0, 300) + "...";
  };

  return (
    <div 
      className="flex-1 overflow-y-auto py-6 scrollbar-thin relative" 
      ref={chatHistoryRef}
    >
      {/* Topic pill - NOT sticky anymore */}
      <div className="mb-4 pb-2">
        {currentSection && renderTopicPill()}
      </div>
      
      {/* Main chat content */}
      <div className="relative">
        <div className="space-y-6">
          {/* Display welcome message first */}
          {welcomeMessage && (
            <div className="fade-scale-in mb-6 px-4">
              <ChatMessage message={welcomeMessage.text} isUser={welcomeMessage.isUser} />
            </div>
          )}
          
          {/* Display the intro message with Table of Contents */}
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
          
          {/* Place typing indicator within the message flow, right after the last message */}
          {showTypingIndicator && (
            <div className="px-4 mb-2">
              <TypingIndicator />
            </div>
          )}
          
          {/* Display user and AI message pairs in sequence */}
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
                      
                      {/* Show expand/collapse button for long messages */}
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
          
          {/* Display content box for current section if selected */}
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
          
          {/* Show related topics at the bottom if learning is complete */}
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
          
          {/* Show a message if all sections are completed but no related topics are displayed */}
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
