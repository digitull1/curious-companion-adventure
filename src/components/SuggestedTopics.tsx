
import React from "react";
import { Sparkles, X } from "lucide-react";
import { getTopicEmoji } from "@/utils/topicUtils";
import { motion } from "framer-motion";

interface SuggestedTopicsProps {
  topics: string[];
  onTopicClick: (topic: string) => void;
  onClose: () => void;
}

const SuggestedTopics: React.FC<SuggestedTopicsProps> = ({
  topics,
  onTopicClick,
  onClose
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      y: 10,
      transition: { duration: 0.3 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      scale: 1.05,
      y: -5,
      boxShadow: "0 10px 25px rgba(124, 58, 237, 0.2)"
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="mb-4 bg-gradient-to-br from-white/95 to-white/90 rounded-xl p-5 shadow-magical border border-wonder-purple/20 relative backdrop-blur-md"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-xl pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-wonder-yellow/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-wonder-purple/10 rounded-full blur-xl"></div>
      </div>
      
      <motion.button 
        onClick={onClose}
        className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 transition-colors z-10 shadow-sm"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Close suggestions"
      >
        <X className="h-4 w-4 text-gray-500" />
      </motion.button>
      
      <div className="relative z-10">
        <h3 className="text-base font-medium text-wonder-purple mb-4 flex items-center">
          <div className="p-1.5 rounded-full bg-wonder-yellow/20 mr-2">
            <Sparkles className="h-4 w-4 text-wonder-yellow" />
          </div>
          What would you like to explore?
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {topics.map((topic, index) => {
            const emoji = getTopicEmoji(topic);
            
            return (
              <motion.button
                key={index}
                className="flex flex-col items-center justify-center text-center bg-white hover:bg-wonder-purple/5 text-wonder-purple p-3 rounded-xl transition-all border border-wonder-purple/10 overflow-hidden group"
                onClick={() => {
                  onTopicClick(topic);
                  onClose();
                }}
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <motion.span 
                  className="text-2xl mb-2 transform transition-transform"
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  {emoji}
                </motion.span>
                <span className="text-sm font-medium line-clamp-2 px-1">{topic}</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-wonder-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default SuggestedTopics;
