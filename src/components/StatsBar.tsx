
import React from "react";
import { Crown, Star, Sparkles } from "lucide-react";

interface StatsBarProps {
  streakCount: number;
  points: number;
  learningProgress: number;
  topicSectionsGenerated: boolean;
}

const StatsBar: React.FC<StatsBarProps> = ({ 
  streakCount, 
  points, 
  learningProgress, 
  topicSectionsGenerated
}) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm border-b border-wonder-purple/10 px-4 py-2.5 sticky top-0 z-30 safe-area-top">
      <div className="w-full mx-auto">
        <div className="flex justify-end">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-wonder-coral to-wonder-coral-dark flex items-center justify-center text-white shadow-magical">
                <Crown className="h-4 w-4" />
              </div>
              <div className="ml-2">
                <div className="text-xs text-muted-foreground font-rounded">Learning Streak</div>
                <div className="font-bold text-sm flex items-center font-rounded">
                  {streakCount} days 
                  <Sparkles className="h-3 w-3 ml-1 text-wonder-yellow animate-sparkle" />
                </div>
              </div>
            </div>
            
            <div className="h-8 border-l border-wonder-purple/10 mx-1"></div>
            
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-wonder-purple to-wonder-purple-dark flex items-center justify-center text-white shadow-magical">
                <Star className="h-4 w-4" />
              </div>
              <div className="ml-2">
                <div className="text-xs text-muted-foreground font-rounded">Points</div>
                <div className="font-bold text-sm font-rounded">{points}</div>
              </div>
            </div>
            
            {topicSectionsGenerated && (
              <div className="hidden md:flex items-center ml-3">
                <div className="text-xs text-muted-foreground font-rounded">Progress</div>
                <div className="w-24 h-2.5 bg-gray-200 rounded-full ml-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-wonder-purple to-wonder-purple-light rounded-full transition-all duration-700 relative overflow-hidden"
                    style={{ width: `${learningProgress}%` }}
                  >
                    <div className="absolute inset-0 animate-shine"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
