
import React from "react";
import { motion } from "framer-motion";
import "./TypingIndicator.css";

const TypingIndicator: React.FC = () => {
  // Simplified bubble variants for animation with only two keyframes (supported by framer-motion)
  const bubbleVariants = {
    initial: {
      scale: 0.7,
      opacity: 0.6
    },
    animate: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.7,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      }
    })
  };

  // Character animation variants (simplified)
  const characterVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.5 + (i * 0.08),
        duration: 0.3
      }
    })
  };

  // Simplified mascot animation with only two keyframes
  const mascotVariants = {
    initial: { y: 0, rotate: 0 },
    animate: {
      y: -4,
      rotate: 5,
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  // Text for "thinking..." animation
  const thinkingText = "thinking...";

  return (
    <div className="chat-bubble-ai mb-6 mr-auto max-w-[85%] flex items-center">
      <div className="typing-indicator">
        <div className="typing-indicator-content">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              custom={i}
              variants={bubbleVariants}
              initial="initial"
              animate="animate"
              className="typing-dot"
            />
          ))}
          
          {/* Add a simplified bouncing mascot with only two keyframe states */}
          <motion.div 
            className="typing-mascot"
            variants={mascotVariants}
            initial="initial"
            animate="animate"
          >
            🧠
          </motion.div>
        </div>
        
        <div className="typing-label">
          {thinkingText.split('').map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={characterVariants}
              initial="hidden"
              animate="visible"
              className="typing-char"
            >
              {char}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
