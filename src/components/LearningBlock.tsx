
import React, { useRef, useEffect } from "react";
import { BookOpen, Rocket, History, Image, HelpCircle } from "lucide-react";
import { animate } from "@motionone/dom";

export type BlockType = "did-you-know" | "mind-blowing" | "amazing-stories" | "see-it" | "quiz";

interface LearningBlockProps {
  type: BlockType;
  onClick: () => void;
}

const LearningBlock: React.FC<LearningBlockProps> = ({ type, onClick }) => {
  const blockRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (blockRef.current) {
      // Add hover animation
      blockRef.current.addEventListener('mouseenter', () => {
        animate(
          blockRef.current!,
          { y: [-2, -8, -2], scale: [1, 1.02, 1] },
          { duration: 0.6, easing: "ease-in-out" }
        );
      });
    }
  }, []);
  
  const getBlockContent = () => {
    switch (type) {
      case "did-you-know":
        return {
          icon: <BookOpen className="h-5 w-5" />,
          title: "Did You Know?",
          description: "Discover fascinating facts",
          className: "learning-block-did-you-know",
          gradient: "from-wonder-blue/80 to-wonder-blue-light/40",
          shadowColor: "shadow-[0_8px_20px_-4px_rgba(14,165,233,0.3)]"
        };
      case "mind-blowing":
        return {
          icon: <Rocket className="h-5 w-5" />,
          title: "Mind-Blowing Science",
          description: "Explore amazing scientific concepts",
          className: "learning-block-mind-blowing",
          gradient: "from-wonder-purple/80 to-wonder-purple-light/40",
          shadowColor: "shadow-magical"
        };
      case "amazing-stories":
        return {
          icon: <History className="h-5 w-5" />,
          title: "Amazing Stories",
          description: "Hear incredible tales and legends",
          className: "learning-block-amazing-stories",
          gradient: "from-wonder-yellow/80 to-wonder-yellow-light/40",
          shadowColor: "shadow-[0_8px_20px_-4px_rgba(245,158,11,0.3)]"
        };
      case "see-it":
        return {
          icon: <Image className="h-5 w-5" />,
          title: "See It in Action",
          description: "Visual learning resources",
          className: "learning-block-see-it",
          gradient: "from-wonder-green/80 to-wonder-green-light/40",
          shadowColor: "shadow-[0_8px_20px_-4px_rgba(16,185,129,0.3)]"
        };
      case "quiz":
        return {
          icon: <HelpCircle className="h-5 w-5" />,
          title: "Test Your Knowledge",
          description: "Fun quizzes to reinforce learning",
          className: "learning-block-quiz",
          gradient: "from-wonder-coral/80 to-wonder-coral-light/40",
          shadowColor: "shadow-[0_8px_20px_-4px_rgba(244,63,94,0.3)]"
        };
      default:
        return {
          icon: <BookOpen className="h-5 w-5" />,
          title: "Did You Know?",
          description: "Discover fascinating facts",
          className: "learning-block-did-you-know",
          gradient: "from-wonder-blue/80 to-wonder-blue-light/40",
          shadowColor: "shadow-[0_8px_20px_-4px_rgba(14,165,233,0.3)]"
        };
    }
  };

  const { icon, title, description, className, gradient, shadowColor } = getBlockContent();

  return (
    <button
      ref={blockRef}
      onClick={onClick}
      className={`learning-block flex flex-col items-start gap-2 transition-all duration-300 hover:scale-102 active:scale-98 ${className} ${shadowColor}`}
      aria-label={title}
    >
      {/* Subtle background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 rounded-xl z-0`}></div>
      
      {/* Content */}
      <div className="flex items-center gap-3 mb-1 z-10">
        <div className={`p-2 rounded-full bg-white/70 backdrop-blur-sm ${shadowColor}`}>
          {icon}
        </div>
        <h3 className="font-medium text-base">{title}</h3>
      </div>
      
      <p className="text-sm text-muted-foreground opacity-80 z-10">{description}</p>
      
      {/* Decorative elements */}
      <div className="absolute bottom-2 right-2 opacity-25 z-0">
        <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse-soft"></div>
      </div>
      
      {/* Glowing accent */}
      <div className="absolute -bottom-1 -right-1 w-12 h-12 rounded-full blur-xl bg-white/10 animate-pulse-glow z-0"></div>
    </button>
  );
};

export default LearningBlock;
