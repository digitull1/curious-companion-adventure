
import React, { ReactNode } from "react";
import CodeBlock from "./CodeBlock";
import LearningBlock from "./LearningBlock";
import { BlockType } from "@/types/chat";

export interface ChatMessageProps {
  message: any;
  isUser: boolean;
  children?: ReactNode;
  onBlockClick?: (type: BlockType) => void;
}

// Function to clean up message text for rendering
const cleanMessageText = (text: string): string => {
  if (!text || typeof text !== 'string') {
    console.error("[ChatMessage] Invalid text received:", text);
    return "Message text unavailable";
  }
  
  return text
    .replace(/```[a-z]*\n([\s\S]*?)```/g, '') // Remove code blocks
    .trim();
};

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isUser, 
  children, 
  onBlockClick 
}) => {
  console.log("[ChatMessage] Rendering message:", message);
  
  // Safety check for message
  if (!message) {
    console.error("[ChatMessage] No message provided");
    return null;
  }
  
  // Check message.text
  if (message.text !== undefined && message.text !== null) {
    console.log("[ChatMessage] Message text type:", typeof message.text);
  } else {
    console.error("[ChatMessage] Message is missing text property");
    message.text = "No message content available";
  }
  
  const messageText = typeof message.text === 'string' ? cleanMessageText(message.text) : "Message text unavailable";
  
  return (
    <div className={`w-full max-w-3xl rounded-lg p-4 ${isUser ? 'bg-indigo-100 text-indigo-900' : 'bg-white shadow-sm border border-gray-100'}`}>
      {/* Message content */}
      <div className="prose-sm">
        {messageText.split('\n').map((paragraph, idx) => (
          <p key={idx} className={`mb-2 ${idx === 0 ? 'font-medium' : ''}`}>
            {paragraph}
          </p>
        ))}
        
        {/* Code blocks */}
        {message.code && (
          <CodeBlock code={message.code} language={message.codeLanguage || 'javascript'} />
        )}
        
        {/* Additional UI elements for AI messages */}
        {!isUser && (
          <div className="mt-4">
            {/* Learning blocks if applicable */}
            {message.blocks && message.showBlocks && onBlockClick && (
              <div className="flex flex-wrap gap-2 mt-2">
                {message.blocks.map((block: BlockType) => (
                  <LearningBlock 
                    key={block} 
                    type={block} 
                    onClick={() => onBlockClick(block)} 
                  />
                ))}
              </div>
            )}
            
            {/* Render children (like TableOfContents) */}
            {children && <div className="mt-4">{children}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
