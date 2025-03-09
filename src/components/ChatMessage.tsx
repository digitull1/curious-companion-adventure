
import React, { useState, useRef, useEffect } from "react";
import { Bot, User, Copy, CheckCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import LearningBlock, { BlockType } from "@/components/LearningBlock";
import CodeBlock from "@/components/CodeBlock";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  children?: React.ReactNode;
  blocks?: BlockType[];
  showBlocks?: boolean;
  code?: {
    snippet: string;
    language: string;
  };
  onBlockClick?: (type: BlockType) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isUser,
  children,
  blocks = [],
  showBlocks = false,
  code,
  onBlockClick
}) => {
  const [copied, setCopied] = useState(false);
  const blockContainerRef = useRef<HTMLDivElement>(null);
  const [isProcessingClick, setIsProcessingClick] = useState(false);
  
  console.log("[ChatMessage] Rendering with props:", { 
    isUser, 
    messagePreview: message?.substring(0, 30),
    hasBlocks: blocks && blocks.length > 0,
    showBlocks,
    blocksData: blocks
  });

  useEffect(() => {
    // Debug log for blocks visibility
    if (blocks && blocks.length > 0) {
      console.log(`[ChatMessage] Message has ${blocks.length} blocks:`, blocks);
      console.log(`[ChatMessage] showBlocks flag is: ${showBlocks}`);
    }
    
    // Add horizontal scroll behavior
    if (blockContainerRef.current) {
      const container = blockContainerRef.current;
      
      const handleWheel = (e: WheelEvent) => {
        if (container.contains(e.target as Node)) {
          e.preventDefault();
          container.scrollLeft += e.deltaY;
        }
      };
      
      container.addEventListener('wheel', handleWheel, { passive: false });
      
      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [blocks, showBlocks]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    toast.success("Message copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBlockClicked = (type: BlockType) => {
    console.log(`[ChatMessage] Block clicked: ${type}`);
    
    // Prevent multiple clicks with debounce
    if (isProcessingClick || !onBlockClick) return;
    
    setIsProcessingClick(true);
    
    // Call the handler with debounce protection
    onBlockClick(type);
    
    // Reset after a short delay to prevent rapid clicking
    setTimeout(() => {
      setIsProcessingClick(false);
    }, 1000);
  };

  // Create a stable array of block types if blocks is empty
  const safeBlocks: BlockType[] = blocks && blocks.length > 0 
    ? blocks 
    : ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"];

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-6 w-full px-4`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-wonder-purple to-wonder-purple-dark flex items-center justify-center flex-shrink-0 shadow-magical">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      
      <div className={`relative px-4 py-3 rounded-xl flex-1 max-w-[95%] sm:max-w-[90%] shadow-sm
        ${isUser 
          ? 'bg-gradient-to-br from-wonder-purple to-wonder-purple-dark text-white rounded-tr-none ml-8' 
          : 'bg-white border border-wonder-purple/10 rounded-tl-none'}`}>
        
        {/* Copy button (only for AI messages) */}
        {!isUser && (
          <button 
            onClick={copyToClipboard} 
            className="absolute top-2 right-2 p-1 text-wonder-purple/60 hover:text-wonder-purple transition-colors"
            aria-label="Copy message"
          >
            {copied ? <CheckCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        )}
        
        {/* Message content */}
        <div className="prose prose-sm max-w-none">
          <p className={`whitespace-pre-line ${isUser ? 'text-white' : 'text-foreground'}`}>{message}</p>
          
          {/* Code block if provided */}
          {code && <CodeBlock code={code.snippet} language={code.language} />}
          
          {/* Additional content (e.g., table of contents) */}
          {children}
        </div>
        
        {/* Learning blocks - Only show in special circumstances, not in regular chat messages */}
        {!isUser && showBlocks && (
          <div className="mt-4">
            <h3 className="text-xs font-medium mb-3 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-wonder-yellow" />
              <span className="text-wonder-purple">Explore More</span>
            </h3>
            
            <div 
              ref={blockContainerRef}
              className="flex gap-3 overflow-x-auto pb-2 snap-x scrollbar-thin scrollbar-thumb-wonder-purple/20 scrollbar-track-transparent"
              data-testid="learning-blocks-container"
            >
              {safeBlocks.map((blockType) => (
                <LearningBlock 
                  key={blockType} 
                  type={blockType} 
                  onClick={() => handleBlockClicked(blockType)} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-wonder-yellow to-wonder-orange flex items-center justify-center flex-shrink-0 shadow-magical">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
