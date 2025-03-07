
import React, { useRef, useState, useEffect } from "react";
import { MessageCircle, Send, Sparkles, Lightbulb, Search, X, MicrophoneIcon, ThumbsUp } from "lucide-react";
import VoiceInput from "@/components/VoiceInput";
import SuggestedTopics from "@/components/SuggestedTopics";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [sendButtonHover, setSendButtonHover] = useState(false);
  
  const placeholders = [
    "Ask me anything...",
    "What are you curious about today?",
    "Let's learn something cool!",
    "What would you like to explore?",
    "I'm here to help you discover!",
    "Ask me about animals, space, or science!",
    "Wonder about something? Ask me!",
    "What's on your mind today?",
  ];
  
  // Rotate placeholders every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFocused && !inputValue) {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isFocused, inputValue, placeholders.length]);

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const getPlaceholder = () => {
    if (selectedTopic) {
      return `Ask me about ${selectedTopic} or explore a section...`;
    }
    return placeholders[placeholderIndex];
  };
  
  const handleClearInput = () => {
    setIsFocused(true);
    if (inputRef.current) {
      inputRef.current.value = "";
      onInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
      inputRef.current.focus();
    }
  };

  const handleSend = () => {
    if (inputValue.trim() && !isProcessing) {
      onSendMessage();
      // Haptic feedback for mobile devices
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } else if (!inputValue.trim()) {
      inputRef.current?.focus();
      toast.info("Please type a question first", {
        duration: 2000,
        position: "bottom-center"
      });
    }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 via-white/90 to-white/70 backdrop-blur-lg pt-6 pb-4 px-4 md:px-8 z-20">
      {/* Suggested topics overlay with improved animation */}
      <AnimatePresence>
        {showSuggestedPrompts && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <SuggestedTopics
              topics={suggestedPrompts}
              onTopicClick={onSuggestedPromptClick}
              onClose={() => setShowSuggestedPrompts(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chat Input with enhanced visual feedback */}
      <div className="relative max-w-3xl mx-auto">
        <motion.div 
          className="relative flex"
          animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={getPlaceholder()}
            disabled={isProcessing}
            aria-label="Chat input"
            className={`w-full pl-12 pr-16 py-4 rounded-full border focus:outline-none focus:ring-2 shadow-magical bg-white/90 backdrop-blur-sm placeholder:text-slate-400 text-foreground font-comic text-base transition-all duration-300 ${
              isFocused 
                ? 'border-wonder-purple/50 focus:ring-wonder-purple/30 shadow-magical-hover' 
                : 'border-wonder-purple/20 focus:ring-wonder-purple/30 shadow-wonder'
            }`}
          />
          
          {/* Animated icon */}
          <motion.div 
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${isFocused ? 'text-wonder-purple' : 'text-wonder-purple/70'}`}
            animate={isFocused ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {inputValue ? (
              <Search className="h-5 w-5" />
            ) : (
              <MessageCircle className="h-5 w-5" />
            )}
          </motion.div>
          
          {/* Clear input button */}
          {inputValue && !isProcessing && (
            <button
              onClick={handleClearInput}
              className="absolute right-[4.5rem] top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear input"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <VoiceInput 
              onTranscript={onVoiceInput}
              isListening={isListening}
              toggleListening={toggleListening}
            />
            
            <motion.button
              onClick={handleSend}
              disabled={!inputValue.trim() || isProcessing}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                inputValue.trim() && !isProcessing
                  ? "bg-gradient-to-br from-wonder-purple to-wonder-purple-dark text-white shadow-magical hover:shadow-magical-hover"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              animate={sendButtonHover && inputValue.trim() && !isProcessing ? 
                { scale: 1.05, y: -2 } : 
                { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onHoverStart={() => setSendButtonHover(true)}
              onHoverEnd={() => setSendButtonHover(false)}
              aria-label="Send message"
              whileTap={{ scale: 0.95 }}
            >
              {isProcessing ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </motion.button>
          </div>
        </motion.div>
        
        {/* Ideas button with enhanced design */}
        <motion.button
          onClick={() => setShowSuggestedPrompts(true)}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-wonder-purple/10 text-wonder-purple hover:bg-wonder-purple/20 transition-colors shadow-sm hover:shadow-magical"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <Lightbulb className="h-3 w-3" />
          <span>Need ideas?</span>
        </motion.button>
      </div>
    </div>
  );
};

export default ChatInput;
