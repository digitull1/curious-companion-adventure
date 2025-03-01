
import React from "react";
import { ArrowRight, Lightbulb } from "lucide-react";

interface RelatedTopicsCardProps {
  topics: string[];
  onTopicClick: (topic: string) => void;
}

const RelatedTopicsCard: React.FC<RelatedTopicsCardProps> = ({ topics, onTopicClick }) => {
  if (!topics.length) return null;
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-wonder border border-wonder-purple/10 transition-all hover:shadow-wonder-lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-wonder-yellow" />
        <h3 className="font-medium text-wonder-purple">
          Related topics you might enjoy:
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {topics.map((topic, index) => (
          <button
            key={index}
            onClick={() => onTopicClick(topic)}
            className="text-left p-3 rounded-lg border border-wonder-purple/10 hover:bg-wonder-purple/5 transition-all duration-200 
                       flex items-center justify-between group hover:border-wonder-purple/30"
          >
            <span>{topic}</span>
            <ArrowRight className="h-4 w-4 text-wonder-purple opacity-0 group-hover:opacity-100 transition-opacity transform 
                                  group-hover:translate-x-1 duration-200" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelatedTopicsCard;
