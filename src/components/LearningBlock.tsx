
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
          icon: <BookOpen className="h-5 w-5" />,
          title: "Did You Know?",
          description: "Discover fascinating facts",
          className: "learning-block-did-you-know"
        };
      case "mind-blowing":
        return {
          icon: <Rocket className="h-5 w-5" />,
          title: "Mind-Blowing Science",
          description: "Explore amazing scientific concepts",
          className: "learning-block-mind-blowing"
        };
      case "amazing-stories":
        return {
          icon: <History className="h-5 w-5" />,
          title: "Amazing Stories",
          description: "Hear incredible tales and legends",
          className: "learning-block-amazing-stories"
        };
      case "see-it":
        return {
          icon: <Image className="h-5 w-5" />,
          title: "See It in Action",
          description: "Visual learning resources",
          className: "learning-block-see-it"
        };
      case "quiz":
        return {
          icon: <HelpCircle className="h-5 w-5" />,
          title: "Test Your Knowledge",
          description: "Fun quizzes to reinforce learning",
          className: "learning-block-quiz"
        };
      default:
        return {
          icon: <BookOpen className="h-5 w-5" />,
          title: "Did You Know?",
          description: "Discover fascinating facts",
          className: "learning-block-did-you-know"
        };
    }
  };

  const { icon, title, description, className } = getBlockContent();

  return (
    <button
      onClick={onClick}
      className={`learning-block flex flex-col items-start gap-2 transition-all duration-300 hover:scale-102 active:scale-98 ${className}`}
      aria-label={title}
    >
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2 rounded-full bg-white/40 backdrop-blur-sm">
          {icon}
        </div>
        <h3 className="font-medium text-base">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground opacity-80">{description}</p>
      <div className="absolute bottom-2 right-2 opacity-25">
        <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse-soft"></div>
      </div>
    </button>
  );
};

export default LearningBlock;
