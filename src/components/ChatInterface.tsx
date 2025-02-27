
import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import LearningBlock, { BlockType } from "./LearningBlock";
import ImageBlock from "./ImageBlock";
import QuizBlock from "./QuizBlock";
import { useOpenAI } from "@/hooks/useOpenAI";
import { Send, Lightbulb } from "lucide-react";

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
  };
}

interface ChatInterfaceProps {
  ageRange: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ ageRange }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi there! I'm your WonderWhiz assistant. I'm here to help you learn about anything you're curious about. What would you like to explore today?",
      isUser: false,
      blocks: ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"],
      showBlocks: true
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { isLoading, generateResponse, generateImage, generateQuiz } = useOpenAI();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const suggestedPrompts = [
    "Tell me about dinosaurs",
    "How do planets form?",
    "What are robots?",
    "Why is the sky blue?",
    "How do animals communicate?"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() && !isProcessing) {
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);

    try {
      const response = await generateResponse(inputValue, ageRange);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        blocks: ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"],
        showBlocks: true
      };

      setMessages(prev => [...prev, aiMessage]);
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBlockClick = async (type: BlockType, messageId: string, messageText: string) => {
    try {
      setIsProcessing(true);
      let blockResponse = "";
      let imagePrompt = "";
      let quiz = undefined;
      
      switch (type) {
        case "did-you-know":
          blockResponse = await generateResponse(`Give me an interesting fact related to: ${messageText}`, ageRange);
          break;
        case "mind-blowing":
          blockResponse = await generateResponse(`Tell me something mind-blowing about the science related to: ${messageText}`, ageRange);
          break;
        case "amazing-stories":
          blockResponse = await generateResponse(`Share an amazing story or legend related to: ${messageText}`, ageRange);
          break;
        case "see-it":
          blockResponse = "Here's a visual representation I created for you:";
          imagePrompt = messageText;
          break;
        case "quiz":
          blockResponse = "Let's test your knowledge with a quick quiz!";
          quiz = await generateQuiz(messageText);
          break;
      }

      const blockMessage: Message = {
        id: Date.now().toString(),
        text: blockResponse,
        isUser: false,
        imagePrompt: imagePrompt || undefined,
        quiz: quiz || undefined
      };

      setMessages(prev => [...prev, blockMessage]);
    } catch (error) {
      console.error("Error processing learning block:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestedPromptClick = (prompt: string) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <React.Fragment key={message.id}>
              <ChatMessage message={message.text} isUser={message.isUser}>
                {message.imagePrompt && (
                  <ImageBlock prompt={message.imagePrompt} />
                )}
                {message.quiz && (
                  <QuizBlock 
                    question={message.quiz.question} 
                    options={message.quiz.options}
                    correctAnswer={message.quiz.correctAnswer}
                  />
                )}
              </ChatMessage>
              
              {message.showBlocks && message.blocks && (
                <div className="mb-8 overflow-x-auto pb-2 flex gap-3 scrollbar-thin">
                  {message.blocks.map((block) => (
                    <LearningBlock
                      key={block}
                      type={block}
                      onClick={() => handleBlockClick(block, message.id, message.text)}
                    />
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {suggestedPrompts.length > 0 && messages.length < 3 && (
        <div className="px-4 mb-4">
          <div className="flex items-center mb-2 text-sm text-muted-foreground">
            <Lightbulb className="h-4 w-4 mr-2" />
            <span>Try asking about:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSuggestedPromptClick(prompt)}
                className="bg-white border border-wonder-purple/20 text-wonder-purple rounded-full px-3 py-1 text-sm hover:bg-wonder-purple/10 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="border-t p-4 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            disabled={isProcessing}
            className="w-full pl-4 pr-10 py-3 rounded-full border border-wonder-purple/20 focus:outline-none focus:ring-2 focus:ring-wonder-purple/30 shadow-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
              inputValue.trim() && !isProcessing
                ? "bg-gradient-wonder text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isProcessing ? (
              <div className="h-4 w-4 border-2 border-wonder-purple border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
