
import React from "react";
import { Sparkles } from "lucide-react";
import { getTopicEmoji } from "@/utils/topicUtils";

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
  // Handler to prevent event bubbling
  const handleTopicClick = (topic: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTopicClick(topic);
    onClose();
  };

  return (
    <div className="mb-3 bg-gradient-to-br from-white/95 to-white/90 rounded-xl p-4 shadow-magical border border-wonder-purple/20 relative backdrop-blur-md z-10">
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="Close suggestions"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18"></path>
          <path d="M6 6L18 18"></path>
        </svg>
      </button>
      
      <h3 className="text-sm font-medium text-wonder-purple mb-3 flex items-center">
        <Sparkles className="h-3 w-3 mr-1.5 text-wonder-yellow" />
        Topics to explore
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
        {topics.map((topic, index) => (
          <button
            key={index}
            className="flex items-center text-left bg-gradient-to-r from-wonder-purple/10 to-wonder-purple/15 hover:from-wonder-purple/15 hover:to-wonder-purple/20 text-wonder-purple px-3 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 group overflow-hidden cursor-pointer"
            onClick={(e) => handleTopicClick(topic, e)}
          >
            <span className="text-xl mr-2 transform group-hover:scale-110 transition-transform">
              {getTopicEmoji(topic)}
            </span>
            <span className="text-xs font-medium line-clamp-2">{topic}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedTopics;
