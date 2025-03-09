
import React, { useState, useRef, useEffect } from "react";
import { Bot, User, Copy, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import LearningBlock, { BlockType } from "@/components/LearningBlock";
import CodeBlock from "@/components/CodeBlock";
import { Message } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
  onBlockClick?: (type: BlockType) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onBlockClick
}) => {
  const [copied, setCopied] = useState(false);
  const blockContainerRef = useRef<HTMLDivElement>(null);
  const [isProcessingClick, setIsProcessingClick] = useState(false);
  const messageId = useRef(`chatmsg-${Date.now()}`).current;
  
  const { 
    id, 
    text, 
    isUser, 
    blocks = [], 
    showBlocks = false,
    code
  } = message;
  
  console.log(`[ChatMessage][${messageId}] Rendering with props:`, { 
    isUser, 
    messagePreview: text?.substring(0, 30),
    hasBlocks: blocks && blocks.length > 0,
    showBlocks,
    blocksData: blocks
  });

  useEffect(() => {
    // Debug log for blocks visibility
    if (blocks && blocks.length > 0) {
      console.log(`[ChatMessage][${messageId}] Message has ${blocks.length} blocks:`, blocks);
      console.log(`[ChatMessage][${messageId}] showBlocks flag is: ${showBlocks}`);
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
  }, [blocks, showBlocks, messageId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Message copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBlockClicked = (type: BlockType) => {
    console.log(`[ChatMessage][${messageId}] Block clicked: ${type}`);
    
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
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-6 w-full px-1 md:px-2`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-wonder-purple to-wonder-purple-dark flex items-center justify-center flex-shrink-0 shadow-magical">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      
      <div className={`relative px-4 py-3 rounded-xl w-full max-w-[calc(100%-3rem)] shadow-sm
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
          <p className={`whitespace-pre-line ${isUser ? 'text-white' : 'text-foreground'}`}>{text}</p>
          
          {/* Code block if provided */}
          {code && <CodeBlock code={code.snippet} language={code.language} />}
          
          {/* Additional content (e.g., table of contents) */}
          {message.tableOfContents && (
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-2">Table of Contents</h4>
              <ul className="list-disc pl-5 space-y-1">
                {message.tableOfContents.map((section, idx) => (
                  <li key={idx} className="text-sm">{section}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Removed the "Explore More" section that was here */}
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
