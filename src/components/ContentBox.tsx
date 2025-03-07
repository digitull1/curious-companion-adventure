
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CornerRightDown, BookOpen } from "lucide-react";
import LearningBlock, { BlockType } from "./LearningBlock";
import ImageBlock from "./ImageBlock";
import QuizBlock from "./QuizBlock";

interface ContentBoxProps {
  title: string;
  content: string;
  prevSection?: string | null;
  nextSection?: string | null;
  blocks?: BlockType[];
  onBlockClick: (block: BlockType) => void;
  onNavigate: (section: string) => void;
  activeBlock?: BlockType | null;
  imagePrompt?: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    funFact?: string;
  };
}

// Default blocks to use when none are provided
const DEFAULT_BLOCKS: BlockType[] = ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"];

const ContentBox: React.FC<ContentBoxProps> = ({ 
  title, 
  content, 
  prevSection,
  nextSection,
  blocks = [],
  onBlockClick, 
  onNavigate,
  activeBlock,
  imagePrompt,
  quiz
}) => {
  const [safeBlocks, setSafeBlocks] = useState<BlockType[]>(DEFAULT_BLOCKS);
  const [isExploreVisible, setIsExploreVisible] = useState(true);
  const uniqueId = Date.now(); // Used for logging purposes
  
  // Ensure we always have valid blocks to display
  useEffect(() => {
    console.log(`[ContentBox][${uniqueId}] Mounted/Updated with title: "${title.substring(0, 30)}..."`);
    console.log(`[ContentBox][${uniqueId}] activeBlock: ${activeBlock || 'null'}, imagePrompt: ${imagePrompt ? 'present' : 'none'}, quiz: ${quiz ? 'present' : 'none'}`);
    
    console.log(`[ContentBox][${uniqueId}] blocks provided:`, blocks);
    setIsExploreVisible(true); // Always show explore section
    
    // Use provided blocks if available, otherwise use defaults
    if (blocks && blocks.length > 0) {
      console.log(`[ContentBox][${uniqueId}] Using provided blocks:`, blocks);
      setSafeBlocks(blocks);
    } else {
      console.log(`[ContentBox][${uniqueId}] Using safe blocks:`, DEFAULT_BLOCKS);
      setSafeBlocks(DEFAULT_BLOCKS);
    }
    
    console.log(`[ContentBox][${uniqueId}] isExploreVisible:`, isExploreVisible);
    
    return () => {
      console.log(`[ContentBox][${uniqueId}] Unmounting component`);
    };
  }, [blocks, title, activeBlock, imagePrompt, quiz, uniqueId]);

  // Clean title by removing markdown formatting
  const cleanTitle = title.replace(/\*\*/g, '');
  
  // Handle navigation to previous/next section
  const handleNavigate = (section: string | null) => {
    if (!section) return;
    onNavigate(section);
  };

  // Handle block click with a more explicit implementation
  const handleBlockClick = (blockType: BlockType) => {
    console.log(`[ContentBox] Block clicked: ${blockType}`);
    onBlockClick(blockType);
  };

  return (
    <div className="flex flex-col bg-white/90 backdrop-blur-sm rounded-xl border border-wonder-purple/20 shadow-magical overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-wonder-purple/10 to-white p-4 flex items-center justify-between border-b border-wonder-purple/10">
        <h2 className="font-medium text-lg text-wonder-purple">{cleanTitle}</h2>
        
        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          {prevSection && (
            <button 
              onClick={() => handleNavigate(prevSection)}
              className="p-1.5 text-wonder-purple/70 hover:text-wonder-purple hover:bg-wonder-purple/10 rounded-full transition-colors"
              aria-label="Previous section"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          
          {nextSection && (
            <button 
              onClick={() => handleNavigate(nextSection)}
              className="p-1.5 text-wonder-purple/70 hover:text-wonder-purple hover:bg-wonder-purple/10 rounded-full transition-colors"
              aria-label="Next section"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="p-4 overflow-auto max-h-[400px]">
        {/* Show main content text */}
        {!activeBlock && (
          <div className="prose max-w-none text-gray-700">
            {content}
          </div>
        )}
        
        {/* Show image if active block is "see-it" and we have an image prompt */}
        {activeBlock === "see-it" && imagePrompt && (
          <ImageBlock prompt={imagePrompt} />
        )}
        
        {/* Show quiz if active block is "quiz" and we have quiz data */}
        {activeBlock === "quiz" && quiz && (
          <QuizBlock 
            question={quiz.question} 
            options={quiz.options} 
            correctAnswer={quiz.correctAnswer}
            funFact={quiz.funFact}
          />
        )}
        
        {/* Show text for other blocks */}
        {activeBlock && 
         activeBlock !== "see-it" && 
         activeBlock !== "quiz" && (
          <div className="prose max-w-none text-gray-700">
            {content}
          </div>
        )}
      </div>
      
      {/* Always show Explore More section */}
      <div className="p-4 pt-0 border-t border-wonder-purple/10 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-wonder-purple/10 flex items-center justify-center">
            <CornerRightDown className="h-3 w-3 text-wonder-purple" />
          </div>
          <h3 className="text-sm font-medium text-wonder-purple">Explore More</h3>
        </div>
        
        {/* Always render blocks */}
        <div className="flex gap-3 overflow-x-auto snap-x pb-2 scrollbar-thin scrollbar-thumb-wonder-purple/20">
          {safeBlocks.map((block) => (
            <LearningBlock
              key={block} 
              type={block}
              onClick={() => handleBlockClick(block)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentBox;
