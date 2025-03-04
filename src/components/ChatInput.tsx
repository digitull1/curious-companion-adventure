
import React, { useRef } from "react";
import { MessageCircle, Send } from "lucide-react";
import VoiceInput from "@/components/VoiceInput";

interface ChatInputProps {
  inputValue: string;
  isProcessing: boolean;
  selectedTopic: string | null;
  suggestedPrompts: string[];
  isListening: boolean;
  showSuggestedPrompts: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  onVoiceInput: (transcript: string) => void;
  toggleListening: () => void;
  onSuggestedPromptClick: (prompt: string) => void;
  setShowSuggestedPrompts: (show: boolean) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  isProcessing,
  selectedTopic,
  suggestedPrompts,
  isListening,
  showSuggestedPrompts,
  onInputChange,
  onKeyDown,
  onSendMessage,
  onVoiceInput,
  toggleListening,
  onSuggestedPromptClick,
  setShowSuggestedPrompts
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 via-white/90 to-white/70 backdrop-blur-md pt-6 pb-4 px-4 md:px-8 z-20">      
      {/* Chat Input */}
      <div className="relative">
        <div className="relative flex">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            placeholder={selectedTopic ? `Ask me about ${selectedTopic} or explore a section...` : "Ask me anything..."}
            disabled={isProcessing}
            className="w-full pl-12 pr-16 py-4 rounded-full border border-wonder-purple/20 focus:outline-none focus:ring-2 focus:ring-wonder-purple/30 shadow-magical bg-white/90 backdrop-blur-sm placeholder:text-slate-400 text-foreground font-comic text-base"
          />
          
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <MessageCircle className="h-5 w-5 text-wonder-purple" />
          </div>
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <VoiceInput 
              onTranscript={onVoiceInput}
              isListening={isListening}
              toggleListening={toggleListening}
            />
            
            <button
              onClick={onSendMessage}
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
    </div>
  );
};

export default ChatInput;
