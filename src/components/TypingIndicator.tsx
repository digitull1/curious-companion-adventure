
import React from "react";
import { motion } from "framer-motion";

const TypingIndicator: React.FC = () => {
  // Bubble variants for animation
  const bubbleVariants = {
    initial: {
      scale: 0,
      opacity: 0
    },
    animate: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.3,
        repeat: Infinity,
        repeatType: "reverse" as const,
        repeatDelay: 0.1
      }
    })
  };

  return (
    <div className="chat-bubble-ai mb-6 mr-auto max-w-[85%] flex items-center">
      <div className="typing-indicator">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            custom={i}
            variants={bubbleVariants}
            initial="initial"
            animate="animate"
          />
        ))}
      </div>
    </div>
  );
};

export default TypingIndicator;
