
import React from "react";
import { ArrowRight } from "lucide-react";

interface RelatedTopicsCardProps {
  topics: string[];
  onTopicClick: (topic: string) => void;
}

const RelatedTopicsCard: React.FC<RelatedTopicsCardProps> = ({ topics, onTopicClick }) => {
  if (!topics.length) return null;
  
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 shadow-wonder border border-wonder-purple/10">
      <h3 className="font-medium text-wonder-purple mb-3">
        Related topics you might enjoy:
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {topics.map((topic, index) => (
          <button
            key={index}
            onClick={() => onTopicClick(topic)}
            className="text-left p-3 rounded-lg border border-wonder-purple/10 hover:bg-wonder-purple/5 transition-colors flex items-center justify-between group"
          >
            <span>{topic}</span>
            <ArrowRight className="h-4 w-4 text-wonder-purple opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelatedTopicsCard;
