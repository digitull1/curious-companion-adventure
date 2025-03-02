
import React, { useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import LearningBlock, { BlockType } from "@/components/LearningBlock";
import TypingIndicator from "@/components/TypingIndicator";
import TableOfContents from "@/components/TableOfContents";
import ImageBlock from "@/components/ImageBlock";
import QuizBlock from "@/components/QuizBlock";
import { animate } from "@motionone/dom";

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
  tableOfContents?: string[];
  isIntroduction?: boolean;
}

interface ChatAreaProps {
  messages: Message[];
  showTypingIndicator: boolean;
  completedSections: string[];
  relatedTopics: string[];
  onBlockClick: (type: BlockType, messageId: string, messageText: string) => void;
  onTocSectionClick: (section: string) => void;
  onRelatedTopicClick: (topic: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  showTypingIndicator,
  completedSections,
  relatedTopics,
  onBlockClick,
  onTocSectionClick,
  onRelatedTopicClick
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const learningBlocksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTypingIndicator]);

  useEffect(() => {
    // Apply animations to learning blocks on first load
    if (learningBlocksRef.current) {
      const blocks = learningBlocksRef.current.querySelectorAll('.learning-block');
      blocks.forEach((block, index) => {
        animate(
          block,
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.4, delay: 0.1 * index, easing: "ease-out" }
        );
      });
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollLearningBlocks = (direction: 'left' | 'right') => {
    if (learningBlocksRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      learningBlocksRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="flex-1 overflow-y-auto py-6 scrollbar-thin" 
      ref={chatHistoryRef}
    >
      {messages.map((message) => (
        <div key={message.id} className="fade-scale-in">
          <ChatMessage message={message.text} isUser={message.isUser}>
            {message.tableOfContents && (
              <TableOfContents 
                sections={message.tableOfContents} 
                completedSections={completedSections}
                onSectionClick={onTocSectionClick}
              />
            )}
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
            <div className="relative mb-8 learning-blocks-wrapper">
              <button 
                className="scroll-button scroll-button-left" 
                onClick={() => scrollLearningBlocks('left')}
                aria-label="Scroll left"
              >
                <ChevronRight className="h-5 w-5 rotate-180" />
              </button>
              
              <div 
                ref={learningBlocksRef}
                className="learning-blocks-container"
              >
                {message.blocks.map((block) => (
                  <LearningBlock
                    key={block}
                    type={block}
                    onClick={() => onBlockClick(block, message.id, message.text)}
                  />
                ))}
              </div>
              
              <button 
                className="scroll-button scroll-button-right" 
                onClick={() => scrollLearningBlocks('right')}
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
          
          {message.isIntroduction && relatedTopics.length > 0 && (
            <div className="mb-8 overflow-x-auto hide-scrollbar">
              <div className="flex gap-3 pb-2">
                {relatedTopics.map((topic, index) => (
                  <div 
                    key={index}
                    onClick={() => onRelatedTopicClick(topic)}
                    className="flex-shrink-0 min-w-[180px] max-w-[220px] p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-wonder-purple/10 
                              hover:border-wonder-purple/30 shadow-sm hover:shadow-magical cursor-pointer transition-all duration-300
                              hover:-translate-y-1 transform"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-wonder-yellow/20 to-wonder-yellow flex items-center justify-center text-wonder-yellow-dark">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                      <ChevronRight className="h-4 w-4 text-wonder-purple/60" />
                    </div>
                    <h3 className="font-medium text-sm text-foreground font-rounded leading-tight">{topic}</h3>
                    <p className="text-xs text-muted-foreground mt-1 font-rounded">Click to explore</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      
      {showTypingIndicator && <TypingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatArea;
