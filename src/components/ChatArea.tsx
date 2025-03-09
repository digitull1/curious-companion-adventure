import React, { useRef, useEffect, useState, useCallback } from "react";
import { ChevronRight, ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import { BlockType } from "@/components/LearningBlock";
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
  const [renderId, setRenderId] = useState(0); // Add a render ID to help with memoization
  const [contentBoxBlocks, setContentBoxBlocks] = useState<BlockType[]>([]); // Track blocks for ContentBox
  const [isNavigating, setIsNavigating] = useState(false);

  // Keep stable references to current state values
  const activeBlockRef = useRef<BlockType | null>(null);
  const currentSectionRef = useRef<string | null>(null);
  const currentSectionMessageRef = useRef<Message | null>(null);
  
  // Update refs when state changes
  useEffect(() => {
    activeBlockRef.current = activeBlock;
    currentSectionRef.current = currentSection;
    currentSectionMessageRef.current = currentSectionMessage;
  }, [activeBlock, currentSection, currentSectionMessage]);
  
  // Process related topics
  const processedRelatedTopics = processRelatedTopics(relatedTopics);
  console.log(`[ChatArea][render:${renderId}] Processed related topics:`, processedRelatedTopics);

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

  // Log all messages with their blocks for debugging
  useEffect(() => {
    console.log('[ChatArea] All messages with blocks:');
    messages.forEach(msg => {
      if (msg.blocks && msg.blocks.length > 0) {
        console.log(`- Message ${msg.id}: isIntroduction=${msg.isIntroduction}, showBlocks=${msg.showBlocks}, blocks=`, msg.blocks);
      }
    });
  }, [messages]);

  // Handle block click from ChatMessage
  const handleMessageBlockClick = useCallback((type: BlockType, messageId: string) => {
    console.log(`[ChatArea] Message block clicked: ${type} from message ${messageId}`);
    const message = messages.find(m => m.id === messageId);
    if (message) {
      onBlockClick(type, messageId, message.text);
    }
  }, [messages, onBlockClick]);

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
  }, [messages, renderId, currentBlockMessage]);

  // Track section changes without triggering re-renders
  useEffect(() => {
    currentSectionRef.current = currentSection;
    
    // Only trigger content loading if not already the current section
    if (currentSection !== processedCurrentSection) {
      console.log(`[ChatArea] Section changing from "${processedCurrentSection}" to "${currentSection}"`);
      setProcessedCurrentSection(currentSection);
      
      // Don't reset block-related state when changing sections anymore
      // This prevents ContentBox from remounting and losing its state
      
      // Increment render ID to help with memoization
      setRenderId(prev => prev + 1);
    }
  }, [currentSection, processedCurrentSection]);

  // Find the appropriate content message for the current section and extract blocks
  useEffect(() => {
    if (!isNavigating && currentSection) {
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
        
        // Only update if different to avoid unnecessary re-renders
        if (!currentSectionMessage || currentSectionMessage.id !== sectionMessage.id) {
          console.log(`[ChatArea] Updating section message from ${currentSectionMessage?.id} to ${sectionMessage.id}`);
          currentSectionMessageRef.current = sectionMessage;
          setCurrentSectionMessage(sectionMessage);
          
          // Extract blocks from this message or use defaults
          const messageBlocks = sectionMessage.blocks || ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"];
          console.log(`[ChatArea] Extracted blocks for ContentBox:`, messageBlocks);
          setContentBoxBlocks(messageBlocks);
        }
      } else {
        // If we can't find a section message, set default blocks
        const defaultBlocks: BlockType[] = ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"];
        console.log(`[ChatArea] No section message found, using default blocks:`, defaultBlocks);
        setContentBoxBlocks(defaultBlocks);
      }
    }
  }, [currentSection, messages, renderId, currentSectionMessage, isNavigating]);

  // Apply animations to related topics when they appear
  // ... keep existing code (related topics animations)

  // Toggle message expansion
  // ... keep existing code (toggle message expansion)

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

  // Topic pill instead of a sticky header
  // ... keep existing code (topic pill)

  // Handle specific block click within ContentBox
  const handleContentBoxBlockClick = useCallback((block: BlockType) => {
    console.log(`[ChatArea] Content box block clicked: ${block}`);
    
    // Set the active block first, so ContentBox updates immediately
    setActiveBlock(block);
    
    if (currentSectionMessage) {
      console.log(`[ChatArea] Using current section message: ${currentSectionMessage.id}`);
      console.log(`[ChatArea] Current section message text: ${currentSectionMessage.text.substring(0, 50)}...`);
      
      // Use a small timeout to allow the UI to update before making the request
      setTimeout(() => {
        onBlockClick(block, currentSectionMessage.id, currentSectionMessage.text);
      }, 10);
    } else {
      console.warn("[ChatArea] Block clicked but no current section message found!");
    }
  }, [currentSectionMessage, onBlockClick]);

  // Wrap onTocSectionClick to prevent refreshes
  const handleTocSectionClick = useCallback((section: string) => {
    console.log(`[ChatArea] Section clicked: ${section}`);
    setIsNavigating(true);
    
    // Use timeout to prevent race conditions
    setTimeout(() => {
      onTocSectionClick(section);
      setIsNavigating(false);
    }, 50);
  }, [onTocSectionClick]);

  // Generate a stable key for ContentBox to prevent remounting
  const getContentBoxKey = useCallback(() => {
    // Use the current section as the base of the key
    const baseKey = `content-${currentSection || 'none'}`;
    
    // Add the active block to the key ONLY if it exists
    // This prevents key from changing when a block is clicked
    const blockPart = activeBlockRef.current ? `-${activeBlockRef.current}` : '';
    
    // Include block message ID only if we have one
    const blockMsgPart = currentBlockMessage?.id ? `-${currentBlockMessage.id}` : '';
    
    // Final key - stable while blocks are active
    return `${baseKey}${blockPart}${blockMsgPart}`;
  }, [currentSection, currentBlockMessage?.id]);

  // Find the welcome message and intro message
  const welcomeMessage = messages.find(m => !m.isUser && m.isIntroduction && !m.tableOfContents);
  
  // Find the introduction message that contains the table of contents
  const introMessage = messages.find(m => m.isIntroduction && m.tableOfContents);
  
  // Check if we have related topics to display and if learning is complete
  const shouldShowRelatedTopics = processedRelatedTopics.length > 0 && learningComplete;
  
  // Get adjacent sections for navigation
  const { prev, next } = getAdjacentSections();
  
  // Filter messages for display
  const userMessages = messages.filter(m => m.isUser);
  console.log(`[ChatArea][render:${renderId}] Filtered user messages: ${userMessages.length}`);
  
  // Filter AI messages that are not special (TOC, welcome, etc.)
  const aiMessages = messages.filter(m => {
    const isRegularAIMessage = !m.isUser && 
                              !m.isIntroduction && 
                              !m.tableOfContents && 
                              !m.blockType && // Exclude block-specific messages
                              !m.imagePrompt && 
                              !m.quiz;
    
    // Exclude messages that are currently displayed in the content box
    const isInContentBox = currentSectionMessage && 
                          m.id === currentSectionMessage.id;
    
    return isRegularAIMessage && !isInContentBox;
  });
  
  console.log(`[ChatArea][render:${renderId}] Filtered AI messages: ${aiMessages.length}`);
  
  // Always update ContentBox blocks when messages change
  useEffect(() => {
    // Find all blocks from all messages to ensure we have a complete set
    const allBlocks = messages
      .filter(m => m.blocks && m.blocks.length > 0)
      .flatMap(m => m.blocks || []);
    
    // Deduplicate blocks
    const uniqueBlocks = [...new Set(allBlocks)];
    
    if (uniqueBlocks.length > 0) {
      console.log(`[ChatArea] Found ${uniqueBlocks.length} unique blocks across all messages:`, uniqueBlocks);
      setContentBoxBlocks(uniqueBlocks as BlockType[]);
    } else {
      // Default blocks if none found
      const defaultBlocks: BlockType[] = ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"];
      console.log(`[ChatArea] No blocks found in messages, using default blocks:`, defaultBlocks);
      setContentBoxBlocks(defaultBlocks);
    }
  }, [messages]);

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
        <div className="space-y-6 w-full">
          {/* Display welcome message first */}
          {welcomeMessage && (
            <div className="fade-scale-in mb-6 w-full">
              <ChatMessage 
                message={welcomeMessage.text} 
                isUser={welcomeMessage.isUser} 
                blocks={welcomeMessage.blocks || ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"]}
                showBlocks={welcomeMessage.showBlocks !== false} // Default to true if not specified
                onBlockClick={(type) => handleMessageBlockClick(type, welcomeMessage.id)}
              />
            </div>
          )}
          
          {/* Display the intro message with Table of Contents */}
          {introMessage && (
            <div className="fade-scale-in mb-6 w-full">
              <ChatMessage message={introMessage.text} isUser={introMessage.isUser}>
                <TableOfContents 
                  sections={introMessage.tableOfContents || []} 
                  completedSections={completedSections}
                  currentSection={currentSection}
                  onSectionClick={handleTocSectionClick}
                />
              </ChatMessage>
            </div>
          )}
          
          {/* Place typing indicator within the message flow, right after the last message */}
          {showTypingIndicator && (
            <div className="w-full mb-2">
              <TypingIndicator />
            </div>
          )}
          
          {/* Display user and AI message pairs in sequence */}
          {userMessages.map((message, index) => (
            <React.Fragment key={message.id}>
              <div className="fade-scale-in w-full">
                <ChatMessage message={message.text} isUser={true} />
              </div>
              {aiMessages[index] && (
                <div className="fade-scale-in w-full">
                  <ChatMessage 
                    message={aiMessages[index].text} 
                    isUser={false} 
                    blocks={aiMessages[index].blocks}
                    showBlocks={false} // Don't show blocks in regular messages
                    onBlockClick={(type) => handleMessageBlockClick(type, aiMessages[index].id)}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
          
          {/* Display content box for current section if selected */}
          {currentSection && currentSectionMessage && (
            <div className="px-4 max-w-4xl mx-auto">
              <ContentBox
                key={getContentBoxKey()}
                title={currentSection}
                content={currentSectionMessage.text}
                prevSection={prev}
                nextSection={next}
                blocks={contentBoxBlocks.length > 0 ? contentBoxBlocks : ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"]}
                onBlockClick={handleContentBoxBlockClick}
                onNavigate={handleTocSectionClick}
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
                      key={`related-topic-${index}`}
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
