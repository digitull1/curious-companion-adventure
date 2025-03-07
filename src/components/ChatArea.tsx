import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { ChevronRight, ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage from "@/components/ChatMessage";
import LearningBlock, { BlockType } from "@/components/LearningBlock";
import TypingIndicator from "@/components/TypingIndicator";
import TableOfContents from "@/components/TableOfContents";
import ContentBox from "@/components/ContentBox";
import { animate } from "@motionone/dom";
import { toast } from "@/components/ui/use-toast";

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
  blockType?: BlockType;
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
  console.log(`[ChatArea] Processing related topics:`, topics);
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

// Default blocks to use if none are provided
const DEFAULT_BLOCKS: BlockType[] = ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"];

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
  const [renderId, setRenderId] = useState(0); // Add a render ID to help with memoization
  const [contentBoxBlocks, setContentBoxBlocks] = useState<BlockType[]>(DEFAULT_BLOCKS); // Track blocks for ContentBox

  // Store previous section to detect changes
  const prevSectionRef = useRef<string | null>(null);
  
  // Use useMemo to prevent unnecessary recalculations
  const processedRelatedTopics = useMemo(() => {
    console.log(`[ChatArea] Processing related topics:`, relatedTopics);
    if (!relatedTopics || relatedTopics.length === 0) return [];
    
    // If it's a single string containing multiple topics
    if (relatedTopics.length === 1 && typeof relatedTopics[0] === 'string') {
      const topicStr = relatedTopics[0];
      
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
    return relatedTopics.filter(t => t && typeof t === 'string' && t.trim().length > 0);
  }, [relatedTopics]);

  // Stable reference to scrollToBottom
  const scrollToBottom = useCallback(() => {
    console.log(`[ChatArea] Scrolling to bottom of chat`);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Scroll to bottom when messages or typing indicator changes
  useEffect(() => {
    console.log(`[ChatArea][render:${renderId}] Messages updated, scrolling to bottom`);
    scrollToBottom();
  }, [messages, showTypingIndicator, scrollToBottom, renderId]);

  // Find block message (with image or quiz) in a stable way to prevent unnecessary re-renders
  useEffect(() => {
    console.log(`[ChatArea][render:${renderId}] Checking for block messages (image or quiz)`);
    
    // Look for messages with the specific blockType, focusing on most recent ones first
    const blockTypeMessage = [...messages]
      .reverse()
      .find(m => m.blockType && !m.isUser);
    
    if (blockTypeMessage) {
      console.log(`[ChatArea] Found block type message with id: ${blockTypeMessage.id}, type: ${blockTypeMessage.blockType}`);
      
      // Only update if the message is different to avoid unnecessary re-renders
      if (!currentBlockMessage || currentBlockMessage.id !== blockTypeMessage.id) {
        console.log(`[ChatArea] Updating block message - previous: ${currentBlockMessage?.id}, new: ${blockTypeMessage.id}`);
        setCurrentBlockMessage(blockTypeMessage);
        setActiveBlock(blockTypeMessage.blockType || null);
      }
    }
  }, [messages, renderId]);

  // Track section changes without triggering re-renders
  useEffect(() => {
    if (currentSection !== prevSectionRef.current) {
      console.log(`[ChatArea] Section changing from "${prevSectionRef.current}" to "${currentSection}"`);
      prevSectionRef.current = currentSection;
      setProcessedCurrentSection(currentSection);
      
      // Reset block-related state when changing sections
      setActiveBlock(null);
      // Increment render ID to help with memoization
      setRenderId(prev => prev + 1);
    }
  }, [currentSection]);

  // Find the appropriate content message for the current section and extract blocks
  useEffect(() => {
    // Find the most recent non-user message about the current section that isn't a block-related message
    if (currentSection) {
      console.log(`[ChatArea][render:${renderId}] Finding content for section: "${currentSection}"`);
      
      const sectionMessage = [...messages]
        .reverse()
        .find(m => !m.isUser && 
               !m.tableOfContents && 
               !m.blockType && // Skip block-specific messages
               !m.imagePrompt && 
               !m.quiz);
      
      if (sectionMessage) {
        console.log(`[ChatArea] Found content message for section: ${sectionMessage.id}, text: ${sectionMessage.text.substring(0, 50)}...`);
        console.log(`[ChatArea] Section message blocks:`, sectionMessage.blocks || "none");
        
        // Only update if different to avoid unnecessary re-renders
        if (!currentSectionMessage || currentSectionMessage.id !== sectionMessage.id) {
          setCurrentSectionMessage(sectionMessage);
          
          // Extract blocks from this message or use defaults
          if (sectionMessage.blocks && sectionMessage.blocks.length > 0) {
            console.log(`[ChatArea] Using blocks from section message:`, sectionMessage.blocks);
            setContentBoxBlocks(sectionMessage.blocks);
          } else {
            console.log(`[ChatArea] No blocks found in message, using defaults:`, DEFAULT_BLOCKS);
            setContentBoxBlocks(DEFAULT_BLOCKS);
          }
        }
      } else {
        // If we can't find a section message, set default blocks
        console.log(`[ChatArea] No section message found, using default blocks:`, DEFAULT_BLOCKS);
        setContentBoxBlocks(DEFAULT_BLOCKS);
      }
    } else {
      console.log(`[ChatArea][render:${renderId}] No current section selected, clearing section message`);
      if (currentSectionMessage !== null) {
        setCurrentSectionMessage(null);
      }
      // Reset to default blocks when no section is selected
      setContentBoxBlocks(DEFAULT_BLOCKS);
    }
  }, [processedCurrentSection, messages, renderId, currentSection]);

  // Apply animations to related topics when they appear
  useEffect(() => {
    if (relatedTopicsRef.current && learningComplete && processedRelatedTopics.length > 0) {
      console.log(`[ChatArea][render:${renderId}] Animating related topics:`, processedRelatedTopics);
      const topics = relatedTopicsRef.current.querySelectorAll('.related-topic');
      topics.forEach((topic, index) => {
        animate(
          topic,
          { opacity: [0, 1], scale: [0.9, 1], y: [10, 0] },
          { duration: 0.4, delay: 0.15 * index, easing: "ease-out" }
        );
      });
    }
  }, [learningComplete, processedRelatedTopics, renderId]);

  // Toggle message expansion
  const toggleMessageExpansion = useCallback((messageId: string) => {
    console.log(`[ChatArea] Toggling expansion for message: ${messageId}`);
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  }, []);

  // Function to get previous and next section based on current section
  const getAdjacentSections = useCallback(() => {
    if (!currentSection) return { prev: null, next: null };
    
    const toc = messages.find(m => m.tableOfContents)?.tableOfContents || [];
    if (toc.length === 0) return { prev: null, next: null };
    
    const currentIndex = toc.findIndex(section => section === currentSection);
    if (currentIndex === -1) return { prev: null, next: null };
    
    const prev = currentIndex > 0 ? toc[currentIndex - 1] : null;
    const next = currentIndex < toc.length - 1 ? toc[currentIndex + 1] : null;
    
    return { prev, next };
  }, [currentSection, messages]);

  // Topic pill with enhanced visual design
  const renderTopicPill = useCallback(() => {
    if (!currentSection) return null;
    
    // Remove asterisks from current section
    const cleanedSection = currentSection.replace(/\*\*/g, "");
    
    return (
      <motion.div 
        className="mx-auto max-w-3xl px-4 my-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between bg-gradient-to-r from-wonder-purple/10 to-wonder-purple/5 backdrop-blur-md p-2 px-4 rounded-full border border-wonder-purple/10 shadow-sm">
          <div className="flex items-center gap-1.5 ml-1">
            <div className="w-6 h-6 flex-shrink-0 rounded-full bg-wonder-purple/20 flex items-center justify-center">
              <BookOpen className="h-3 w-3 text-wonder-purple" />
            </div>
            <span className="text-xs text-wonder-purple/70">Learning about:</span>
            <span className="text-sm font-medium text-wonder-purple truncate max-w-[150px] sm:max-w-[300px]">
              {cleanedSection}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-white/70 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-wonder-purple/50 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${learningProgress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              ></motion.div>
            </div>
            <span className="text-xs text-wonder-purple/70">{Math.round(learningProgress)}%</span>
          </div>
        </div>
      </motion.div>
    );
  }, [currentSection, learningProgress]);

  // Handle specific block click within ContentBox
  const handleContentBoxBlockClick = useCallback((block: BlockType) => {
    console.log(`[ChatArea] Content box block clicked: ${block}`);
    
    if (currentSectionMessage) {
      console.log(`[ChatArea] Using current section message: ${currentSectionMessage.id}`);
      console.log(`[ChatArea] Current section message text: ${currentSectionMessage.text.substring(0, 50)}...`);
      
      setActiveBlock(block);
      onBlockClick(block, currentSectionMessage.id, currentSectionMessage.text);
    } else {
      console.warn("[ChatArea] Block clicked but no current section message found!");
    }
  }, [currentSectionMessage, onBlockClick]);

  // Find the welcome message
  const welcomeMessage = useMemo(() => 
    messages.find(m => !m.isUser && m.isIntroduction && !m.tableOfContents), 
    [messages]
  );
  
  // Find the introduction message that contains the table of contents
  const introMessage = useMemo(() => 
    messages.find(m => m.isIntroduction && m.tableOfContents), 
    [messages]
  );
  
  const shouldShowRelatedTopics = useMemo(() => 
    processedRelatedTopics.length > 0 && learningComplete,
    [processedRelatedTopics, learningComplete]
  );

  // Get adjacent sections for navigation
  const { prev, next } = useMemo(() => getAdjacentSections(), [currentSection, messages]);
  
  // Memoize filtered messages to prevent unnecessary re-renders
  const userMessages = useMemo(() => messages.filter(m => m.isUser), [messages]);
  
  const aiMessages = useMemo(() => {
    return messages.filter(m => {
      const isRegularAIMessage = !m.isUser && 
                              !m.isIntroduction && 
                              !m.tableOfContents && 
                              !m.blockType && 
                              !m.imagePrompt && 
                              !m.quiz;
      
      const isInContentBox = currentSectionMessage && 
                          m.id === currentSectionMessage.id;
      
      return isRegularAIMessage && !isInContentBox;
    });
  }, [messages, currentSectionMessage]);
  
  // Check if a message should be truncated
  const shouldTruncate = useCallback((text: string) => text.length > 300, []);
  
  // Truncate message text
  const truncateText = useCallback((text: string) => {
    if (text.length <= 300) return text;
    return text.substring(0, 300) + "...";
  }, []);

  console.log(`[ChatArea][RENDER:${renderId}] Current block message ID: ${currentBlockMessage?.id}, active block: ${activeBlock}`);
  
  return (
    <div 
      className="flex-1 overflow-y-auto py-6 scrollbar-thin relative" 
      ref={chatHistoryRef}
    >
      {currentSection && renderTopicPill()}
      
      {/* Main chat content */}
      <div className="relative">
        <div className="space-y-6">
          {/* Display welcome message first */}
          <AnimatePresence>
            {welcomeMessage && (
              <motion.div 
                className="fade-scale-in mb-6 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ChatMessage message={welcomeMessage.text} isUser={welcomeMessage.isUser} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Display the intro message with Table of Contents */}
          <AnimatePresence>
            {introMessage && (
              <motion.div 
                className="fade-scale-in mb-6 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ChatMessage message={introMessage.text} isUser={introMessage.isUser}>
                  <TableOfContents 
                    sections={introMessage.tableOfContents || []} 
                    completedSections={completedSections}
                    currentSection={currentSection}
                    onSectionClick={onTocSectionClick}
                  />
                </ChatMessage>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Place typing indicator within the message flow, right after the last message */}
          <AnimatePresence>
            {showTypingIndicator && (
              <motion.div 
                className="px-4 mb-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Display user and AI message pairs in sequence */}
          {userMessages.map((message, index) => (
            <React.Fragment key={message.id}>
              <motion.div 
                className="fade-scale-in px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <ChatMessage message={message.text} isUser={true} />
              </motion.div>
              {aiMessages[index] && (
                <motion.div 
                  className="fade-scale-in px-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <div className="relative">
                    <ChatMessage 
                      message={expandedMessages.has(aiMessages[index].id) ? 
                        aiMessages[index].text : 
                        shouldTruncate(aiMessages[index].text) ? 
                          truncateText(aiMessages[index].text) : 
                          aiMessages[index].text
                      } 
                      isUser={false} 
                    />
                    
                    {/* Show expand/collapse button for long messages */}
                    {shouldTruncate(aiMessages[index].text) && (
                      <motion.button 
                        onClick={() => toggleMessageExpansion(aiMessages[index].id)}
                        className="mt-2 flex items-center text-xs text-wonder-purple/70 hover:text-wonder-purple transition-colors group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {expandedMessages.has(aiMessages[index].id) ? (
                          <>Show less <ChevronDown className="h-3 w-3 ml-1 transform rotate-180 group-hover:translate-y-0.5 transition-transform" /></>
                        ) : (
                          <>Read more <ChevronDown className="h-3 w-3 ml-1 group-hover:translate-y-0.5 transition-transform" /></>
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </React.Fragment>
          ))}
          
          {/* Display content box for current section if selected */}
          <AnimatePresence>
            {currentSection && currentSectionMessage && (
              <motion.div 
                className="px-4 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                key={`content-box-${currentSection}`}
              >
                <ContentBox
                  key={`content-${currentSection}-${currentBlockMessage?.id || 'none'}-${activeBlock || 'none'}-${renderId}`}
                  title={currentSection}
                  content={currentSectionMessage.text}
                  prevSection={prev}
                  nextSection={next}
                  blocks={contentBoxBlocks}
                  onBlockClick={handleContentBoxBlockClick}
                  onNavigate={onTocSectionClick}
                  activeBlock={activeBlock}
                  imagePrompt={currentBlockMessage?.imagePrompt}
                  quiz={currentBlockMessage?.quiz}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Show related topics at the bottom if learning is complete */}
          <AnimatePresence>
            {shouldShowRelatedTopics && (
              <motion.div 
                className="mx-auto max-w-3xl px-4 mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                ref={relatedTopicsRef}
              >
                <div className="p-4 bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-sm rounded-xl border border-wonder-purple/20 shadow-magical">
                  <h3 className="text-sm font-medium mb-3 text-wonder-purple flex items-center">
                    <span className="text-lg mr-2">🎉</span> Continue your learning journey with:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {processedRelatedTopics.map((topic, index) => (
                      <motion.div 
                        key={`related-topic-${index}`}
                        onClick={() => onRelatedTopicClick(topic)}
                        className="related-topic p-3 bg-white/90 backdrop-blur-sm rounded-xl border border-wonder-purple/10 
                                  hover:border-wonder-purple/30 shadow-sm hover:shadow-magical cursor-pointer transition-all duration-300
                                  hover:-translate-y-1 transform touch-manipulation"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-wonder-yellow/20 to-wonder-yellow flex items-center justify-center text-wonder-yellow-dark">
                            <ChevronRight className="h-3.5 w-3.5" />
                          </div>
                          <h3 className="font-medium text-sm text-foreground font-rounded leading-tight">{topic}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground font-rounded">Tap to explore this fascinating topic</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Show a message if all sections are completed but no related topics are displayed */}
          <AnimatePresence>
            {learningComplete && !shouldShowRelatedTopics && (
              <motion.div 
                className="px-4 mt-8 mb-6 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="p-4 bg-white/90 rounded-xl border border-wonder-purple/10 shadow-sm">
                  <div className="text-center">
                    <motion.h3 
                      className="text-wonder-purple font-medium mb-2"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      🎉 Congratulations!
                    </motion.h3>
                    <p className="text-muted-foreground text-sm">You've completed all sections of this topic.</p>
                    <motion.button 
                      className="mt-3 px-4 py-2 bg-wonder-purple/10 hover:bg-wonder-purple/20 text-wonder-purple rounded-full text-sm font-medium transition-colors"
                      onClick={() => {
                        onRelatedTopicClick("Give me a new interesting topic to learn about");
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Explore a new topic
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Fix the style tag by removing the jsx property */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default ChatArea;
