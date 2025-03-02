
import React from "react";
import { Crown, ListTodo, Star, Sparkles, UserRound } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface StatsBarProps {
  streakCount: number;
  points: number;
  learningProgress: number;
  topicSectionsGenerated: boolean;
  ageRange: string;
  onAgeRangeChange: () => void;
}

const StatsBar: React.FC<StatsBarProps> = ({ 
  streakCount, 
  points, 
  learningProgress, 
  topicSectionsGenerated,
  ageRange,
  onAgeRangeChange
}) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm border-b border-wonder-purple/10 px-4 py-2.5">
      <div className="w-full mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
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
          
          <div className="h-8 border-l border-wonder-purple/10 mx-2"></div>
          
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
            <>
              <div className="h-8 border-l border-wonder-purple/10 mx-2"></div>
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-wonder-blue to-wonder-blue-dark flex items-center justify-center text-white shadow-magical">
                  <ListTodo className="h-4 w-4" />
                </div>
                <div className="ml-2">
                  <div className="text-xs text-muted-foreground font-rounded">Progress</div>
                  <div className="w-24 h-2.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-wonder-purple to-wonder-purple-light rounded-full transition-all duration-700 relative overflow-hidden"
                      style={{ width: `${learningProgress}%` }}
                    >
                      <div className="absolute inset-0 animate-shine"></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="flex items-center gap-1.5 bg-gradient-to-r from-wonder-purple/20 to-wonder-purple-light/20 hover:from-wonder-purple/30 hover:to-wonder-purple-light/30 px-3.5 py-1.5 rounded-full text-wonder-purple text-sm font-medium transition-all duration-300 border border-wonder-purple/20 shadow-sm font-rounded"
                onClick={onAgeRangeChange}
              >
                <UserRound className="h-3.5 w-3.5 mr-1" />
                Age: {ageRange}
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-white/95 backdrop-blur-sm border border-wonder-purple/20 shadow-magical">
              <p className="font-rounded text-sm">Change your age range for personalized content</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default StatsBar;
