
import React from "react";
import { BookOpen, Rocket, History, Image, HelpCircle } from "lucide-react";

export type BlockType = "did-you-know" | "mind-blowing" | "amazing-stories" | "see-it" | "quiz";

interface LearningBlockProps {
  type: BlockType;
  onClick: () => void;
}

const LearningBlock: React.FC<LearningBlockProps> = ({ type, onClick }) => {
  const getBlockContent = () => {
    switch (type) {
      case "did-you-know":
        return {
          icon: <BookOpen className="h-5 w-5 mr-2" />,
          title: "Did You Know?",
          className: "learning-block-did-you-know"
        };
      case "mind-blowing":
        return {
          icon: <Rocket className="h-5 w-5 mr-2" />,
          title: "Mind-Blowing Science",
          className: "learning-block-mind-blowing"
        };
      case "amazing-stories":
        return {
          icon: <History className="h-5 w-5 mr-2" />,
          title: "Amazing Stories",
          className: "learning-block-amazing-stories"
        };
      case "see-it":
        return {
          icon: <Image className="h-5 w-5 mr-2" />,
          title: "See It in Action",
          className: "learning-block-see-it"
        };
      case "quiz":
        return {
          icon: <HelpCircle className="h-5 w-5 mr-2" />,
          title: "Test Your Knowledge",
          className: "learning-block-quiz"
        };
      default:
        return {
          icon: <BookOpen className="h-5 w-5 mr-2" />,
          title: "Did You Know?",
          className: "learning-block-did-you-know"
        };
    }
  };

  const { icon, title, className } = getBlockContent();

  return (
    <button
      onClick={onClick}
      className={`learning-block h-32 min-w-[220px] flex flex-col justify-between hover-scale ${className}`}
    >
      <div className="flex items-center">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="absolute bottom-2 right-2 opacity-25">
        <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse-soft"></div>
      </div>
    </button>
  );
};

export default LearningBlock;
