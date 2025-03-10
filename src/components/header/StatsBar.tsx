
import React from "react";
import { Star, Crown, Sparkles, BarChart2 } from "lucide-react";

interface StatsBarProps {
  points: number;
  streakCount: number;
  learningProgress: number;
  topicSectionsGenerated: boolean;
}

const StatsBar: React.FC<StatsBarProps> = ({
  points,
  streakCount,
  learningProgress,
  topicSectionsGenerated
}) => {
  return (
    <div className="flex items-center gap-3 md:gap-5">
      {topicSectionsGenerated && (
        <div className="hidden sm:flex flex-col items-end sm:flex-row sm:items-center">
          <div className="text-xs text-muted-foreground font-rounded mr-2">Progress</div>
          <div className="flex items-center">
            <div className="w-20 sm:w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-wonder-purple to-wonder-purple-light rounded-full transition-all duration-700 relative overflow-hidden"
                style={{ width: `${learningProgress}%` }}
              >
                <div className="absolute inset-0 animate-shine"></div>
              </div>
            </div>
            <span className="text-xs font-medium ml-1">{Math.round(learningProgress)}%</span>
          </div>
        </div>
      )}
      
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-wonder-purple to-wonder-purple-dark flex items-center justify-center text-white shadow-magical">
          <Star className="h-4 w-4" />
        </div>
        <div className="ml-1.5">
          <div className="text-xs text-muted-foreground font-rounded">Points</div>
          <div className="font-bold text-xs font-rounded">{points}</div>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-wonder-coral to-wonder-coral-dark flex items-center justify-center text-white shadow-magical">
          <Crown className="h-4 w-4" />
        </div>
        <div className="ml-1.5">
          <div className="text-xs text-muted-foreground font-rounded">Streak</div>
          <div className="font-bold text-xs flex items-center font-rounded">
            {streakCount} days 
            <Sparkles className="h-3 w-3 ml-1 text-wonder-yellow animate-sparkle" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
