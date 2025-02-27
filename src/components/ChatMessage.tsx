
import React from "react";
import { Motion, Presence } from "@motionone/dom";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  children?: React.ReactNode;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, children }) => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className={`mb-4 ${isUser ? 'ml-auto max-w-[85%]' : 'mr-auto max-w-[85%]'}`}
    >
      <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}>
        <p className="whitespace-pre-line leading-relaxed">{message}</p>
        {children}
      </div>
    </Motion.div>
  );
};

export default ChatMessage;
