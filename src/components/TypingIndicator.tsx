
import React from "react";
import { motion } from "framer-motion";
import "./TypingIndicator.css";

const TypingIndicator: React.FC = () => {
  // Bubble variants for animation
  const bubbleVariants = {
    initial: {
      scale: 0,
      opacity: 0
    },
    animate: (i: number) => ({
      scale: [0.7, 1, 0.7],
      opacity: [0.5, 1, 0.5],
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "easeInOut"
      }
    })
  };

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
        </div>
        <motion.div 
          className="typing-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          thinking...
        </motion.div>
      </div>
    </div>
  );
};

export default TypingIndicator;
