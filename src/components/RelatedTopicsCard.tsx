
import React, { useRef, useEffect } from "react";
import { ArrowRight, Lightbulb } from "lucide-react";
import { animate } from "@motionone/dom";

interface RelatedTopicsCardProps {
  topics: string[];
  onTopicClick: (topic: string) => void;
}

const RelatedTopicsCard: React.FC<RelatedTopicsCardProps> = ({ topics, onTopicClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const topicsRef = useRef<(HTMLButtonElement | null)[]>([]);
  
  useEffect(() => {
    if (cardRef.current) {
      animate(
        cardRef.current,
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.5, easing: [0.25, 1, 0.5, 1], delay: 0.3 }
      );
      
      // Staggered animation for topics
      topicsRef.current.forEach((topic, index) => {
        if (topic) {
          animate(
            topic,
            { opacity: [0, 1], x: [-10, 0] },
            { duration: 0.4, easing: "ease-out", delay: 0.5 + (index * 0.1) }
          );
        }
      });
    }
  }, [topics]);
  
  if (!topics.length) return null;
  
  return (
    <div 
      className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-pixar border border-wonder-purple/10 transition-all duration-300 hover:shadow-magical relative overflow-hidden"
      ref={cardRef}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-wonder-purple/5 to-transparent pointer-events-none"></div>
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-radial from-wonder-yellow/10 to-transparent rounded-full"></div>
      
      <div className="flex items-center gap-2 mb-4 relative">
        <div className="p-2 rounded-full bg-wonder-yellow/20 text-wonder-yellow">
          <Lightbulb className="h-5 w-5" />
        </div>
        <h3 className="font-medium text-wonder-purple">
          Related topics you might enjoy:
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
        {topics.map((topic, index) => (
          <button
            key={index}
            ref={el => topicsRef.current[index] = el}
            onClick={() => onTopicClick(topic)}
            className="text-left p-3 rounded-lg border border-wonder-purple/10 hover:bg-wonder-purple/5 transition-all duration-300 
                     flex items-center justify-between group hover:border-wonder-purple/30 hover:shadow-magical
                     bg-white/70 backdrop-blur-sm transform hover:translate-y-[-2px] active:translate-y-[0px]"
            style={{ opacity: 0 }} // Start invisible for animation
          >
            <span className="font-medium">{topic}</span>
            <div className="w-6 h-6 rounded-full bg-wonder-purple/10 flex items-center justify-center transform transition-all duration-300 group-hover:bg-wonder-purple/20">
              <ArrowRight className="h-3.5 w-3.5 text-wonder-purple opacity-70 group-hover:opacity-100 transition-all transform 
                                group-hover:translate-x-0.5 duration-300" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelatedTopicsCard;
