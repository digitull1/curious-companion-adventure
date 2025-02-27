
import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import LearningBlock, { BlockType } from "./LearningBlock";
import ImageBlock from "./ImageBlock";
import QuizBlock from "./QuizBlock";
import CodeBlock from "./CodeBlock";
import VoiceInput from "./VoiceInput";
import TypingIndicator from "./TypingIndicator";
import { useOpenAI } from "@/hooks/useOpenAI";
import { Send, Lightbulb, Eraser, BookOpen } from "lucide-react";

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
  code?: {
    snippet: string;
    language: string;
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
  const [isListening, setIsListening] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const { isLoading, generateResponse, generateImage, generateQuiz } = useOpenAI();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  
  const suggestedPrompts = [
    "Tell me about dinosaurs",
    "How do planets form?",
    "What are robots?",
    "Why is the sky blue?",
    "How do animals communicate?"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTypingIndicator]);

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
    setShowTypingIndicator(true);

    try {
      // Check for code snippet request
      const isCodeRequest = inputValue.toLowerCase().includes("code") && 
        (inputValue.toLowerCase().includes("example") || 
         inputValue.toLowerCase().includes("show me") || 
         inputValue.toLowerCase().includes("how to"));
      
      const response = await generateResponse(inputValue, ageRange);
      
      // Simulate a delay for typing effect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowTypingIndicator(false);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        blocks: ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"],
        showBlocks: true
      };
      
      // If it seems like a code request, add a code snippet
      if (isCodeRequest) {
        // Generate a simple code example based on topic
        let codeSnippet = "";
        let language = "javascript";
        
        if (inputValue.toLowerCase().includes("python")) {
          language = "python";
          codeSnippet = `# A simple Python example
def greet(name):
    """This function greets the person passed in as a parameter"""
    return f"Hello, {name}!"

# Call the function
print(greet("World"))  # Output: Hello, World!`;
        } else {
          codeSnippet = `// A simple JavaScript example
function greet(name) {
  // This function greets the person passed in as a parameter
  return \`Hello, \${name}!\`;
}

// Call the function
console.log(greet("World"));  // Output: Hello, World!`;
        }
        
        aiMessage.code = {
          snippet: codeSnippet,
          language: language
        };
      }

      setMessages(prev => [...prev, aiMessage]);
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error sending message:", error);
      setShowTypingIndicator(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBlockClick = async (type: BlockType, messageId: string, messageText: string) => {
    try {
      setIsProcessing(true);
      setShowTypingIndicator(true);
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

      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setShowTypingIndicator(false);

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
      setShowTypingIndicator(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestedPromptClick = (prompt: string) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  const handleVoiceInput = (transcript: string) => {
    setInputValue(transcript);
  };
  
  const toggleListening = () => {
    setIsListening(prev => !prev);
  };
  
  const clearChat = () => {
    setMessages([
      {
        id: "welcome-new",
        text: "Chat cleared! What would you like to explore now?",
        isUser: false,
        blocks: ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"],
        showBlocks: true
      }
    ]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4" ref={chatHistoryRef}>
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
                {message.code && (
                  <CodeBlock 
                    code={message.code.snippet} 
                    language={message.code.language} 
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
          
          {showTypingIndicator && <TypingIndicator />}
          
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={clearChat}
              className="flex items-center text-sm text-muted-foreground hover:text-wonder-purple transition-colors"
            >
              <Eraser className="h-3.5 w-3.5 mr-1" />
              Clear chat
            </button>
            <button
              className="flex items-center text-sm text-muted-foreground hover:text-wonder-purple transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5 mr-1" />
              Learning resources
            </button>
          </div>
          
          <div className="relative flex">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={isProcessing}
              className="w-full pl-4 pr-16 py-3 rounded-full border border-wonder-purple/20 focus:outline-none focus:ring-2 focus:ring-wonder-purple/30 shadow-sm"
            />
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <VoiceInput 
                onTranscript={handleVoiceInput}
                isListening={isListening}
                toggleListening={toggleListening}
              />
              
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isProcessing}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
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
      </div>
    </div>
  );
};

export default ChatInterface;
