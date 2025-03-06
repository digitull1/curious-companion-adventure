
import React, { useRef } from "react";
import { MessageCircle, Send, X, Sparkles } from "lucide-react";
import VoiceInput from "@/components/VoiceInput";
import ImageUpload from "@/components/ImageUpload";

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
  onImageCapture: (base64Image: string) => void;
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
  setShowSuggestedPrompts,
  onImageCapture
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 via-white/90 to-white/70 backdrop-blur-lg pt-6 pb-4 px-4 md:px-8 z-20">
      {/* Suggested prompts overlay */}
      {showSuggestedPrompts && (
        <div className="mb-3 bg-gradient-to-br from-white/95 to-white/90 rounded-xl p-4 shadow-magical border border-wonder-purple/20 relative backdrop-blur-md">
          <button 
            onClick={() => setShowSuggestedPrompts(false)}
            className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
          
          <h3 className="text-sm font-medium text-wonder-purple mb-3 flex items-center">
            <Sparkles className="h-3 w-3 mr-1.5 text-wonder-yellow" />
            Try asking about...
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                className="text-xs bg-gradient-to-r from-wonder-purple/10 to-wonder-purple/15 hover:from-wonder-purple/15 hover:to-wonder-purple/20 text-wonder-purple px-4 py-2 rounded-full transition-colors shadow-sm hover:shadow-md"
                onClick={() => {
                  onSuggestedPromptClick(prompt);
                  setShowSuggestedPrompts(false);
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
      
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
            className="w-full pl-12 pr-24 py-4 rounded-full border border-wonder-purple/20 focus:outline-none focus:ring-2 focus:ring-wonder-purple/30 shadow-magical bg-white/90 backdrop-blur-sm placeholder:text-slate-400 text-foreground font-comic text-base"
          />
          
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <MessageCircle className="h-5 w-5 text-wonder-purple" />
          </div>
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <ImageUpload
              onImageCapture={onImageCapture}
              isProcessing={isProcessing}
            />
            
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
