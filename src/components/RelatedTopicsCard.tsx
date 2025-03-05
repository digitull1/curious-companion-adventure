
import React, { useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { animate } from "@motionone/dom";
import { Topic } from "@/types/learning";

interface RelatedTopicsCardProps {
  topics: Topic[];
  onTopicClick: (topic: string) => void;
}

const RelatedTopicsCard: React.FC<RelatedTopicsCardProps> = ({ topics, onTopicClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topicRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    if (containerRef.current) {
      animate(
        containerRef.current,
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.5, easing: [0.25, 1, 0.5, 1] }
      );
      
      topicRefs.current.forEach((topic, index) => {
        if (topic) {
          animate(
            topic,
            { opacity: [0, 1], scale: [0.9, 1], y: [10, 0] },
            { duration: 0.4, delay: 0.1 * (index + 1), easing: "ease-out" }
          );
        }
      });
    }
  }, [topics]);
  
  if (!topics || topics.length === 0) return null;
  
  return (
    <div 
      ref={containerRef}
      className="mt-6 p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-wonder-yellow/20 shadow-pixar"
    >
      <h3 className="text-wonder-yellow-dark font-bold mb-3 flex items-center">
        <span className="inline-block p-1 bg-wonder-yellow/20 rounded-lg mr-2">
          <ChevronRight className="h-4 w-4 text-wonder-yellow-dark" />
        </span>
        Continue Your Learning Adventure
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {topics.map((topic, index) => (
          <div
            key={index}
            ref={el => topicRefs.current[index] = el}
            onClick={() => onTopicClick(topic.title)}
            className="related-topic p-4 bg-white rounded-xl border border-wonder-yellow/10 
                      hover:border-wonder-yellow/30 shadow-sm hover:shadow-magical cursor-pointer 
                      transition-all duration-300 hover:-translate-y-1 transform touch-manipulation"
            style={{ opacity: 0 }} // Start invisible for animation
          >
            <div className="flex justify-between items-start mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-wonder-yellow/20 to-wonder-yellow 
                             flex items-center justify-center text-wonder-yellow-dark text-lg">
                {topic.emoji || "✨"}
              </div>
              <ChevronRight className="h-4 w-4 text-wonder-yellow-dark/60" />
            </div>
            <h3 className="font-bold text-wonder-yellow-dark mb-1">{topic.title}</h3>
            <p className="text-xs text-muted-foreground">{topic.description}</p>
            <div className="mt-2 text-xs text-wonder-yellow-dark font-medium">
              Click to explore →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedTopicsCard;
