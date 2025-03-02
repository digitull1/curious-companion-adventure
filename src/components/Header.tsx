
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WonderWhizLogo from "@/components/WonderWhizLogo";
import { BookOpen, Crown, LogOut, Settings, Star, UserRound } from "lucide-react";
import { toast } from "sonner";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface HeaderProps {
  points: number;
  ageRange: string;
  avatar: string;
  onAgeRangeChange: () => void;
}

const Header: React.FC<HeaderProps> = ({ points, ageRange, avatar, onAgeRangeChange }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getAvatarEmoji = () => {
    switch (avatar) {
      case "explorer": return "🧭";
      case "scientist": return "🔬";
      case "storyteller": return "📚";
      default: return "🧭";
    }
  };

  const getAvatarColor = () => {
    switch (avatar) {
      case "explorer": return "bg-gradient-to-br from-wonder-yellow to-wonder-yellow-dark";
      case "scientist": return "bg-gradient-to-br from-wonder-teal to-wonder-teal-dark";
      case "storyteller": return "bg-gradient-to-br from-wonder-coral to-wonder-coral-dark";
      default: return "bg-gradient-to-br from-wonder-yellow to-wonder-yellow-dark";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("wonderwhiz_age_range");
    localStorage.removeItem("wonderwhiz_avatar");
    navigate("/");
  };

  return (
    <header className="border-b bg-white/90 backdrop-blur-sm z-10 shadow-sm">
      <div className="w-full mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <WonderWhizLogo size="md" className="animate-float" />
          
          <div className="hidden md:flex ml-8 gap-6">
            <button className="text-sm font-medium text-muted-foreground hover:text-wonder-purple transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-wonder-purple/5">
              <BookOpen className="h-4 w-4" />
              <span className="font-rounded">Topics</span>
            </button>
            <button className="text-sm font-medium text-muted-foreground hover:text-wonder-purple transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-wonder-purple/5">
              <Star className="h-4 w-4" />
              <span className="font-rounded">Rewards</span>
            </button>
            <button className="text-sm font-medium text-muted-foreground hover:text-wonder-purple transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-wonder-purple/5">
              <Crown className="h-4 w-4" />
              <span className="font-rounded">Progress</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-wonder-purple/10 text-wonder-purple rounded-full px-4 py-1 text-sm font-semibold flex items-center gap-2 font-rounded">
            <Star className="h-3.5 w-3.5" />
            <span>{points} points</span>
          </div>
          
          <div 
            className={`h-10 w-10 rounded-full ${getAvatarColor()} text-white flex items-center justify-center shadow-magical cursor-pointer transition-all duration-300 hover:shadow-magical-hover text-lg`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {getAvatarEmoji()}
          </div>
          
          <div className="relative">
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-pixar py-3 z-50 border border-wonder-purple/10 backdrop-blur-sm bg-white/95 animate-fade-in-up">
                <div className="px-4 py-3 border-b border-wonder-purple/10">
                  <div className="flex items-center gap-3">
                    <div className={`h-14 w-14 rounded-full ${getAvatarColor()} text-white flex items-center justify-center shadow-magical text-2xl`}>
                      {getAvatarEmoji()}
                    </div>
                    <div>
                      <p className="font-bold text-foreground capitalize font-rounded">{avatar}</p>
                      <p className="text-sm text-muted-foreground font-rounded">{ageRange} years</p>
                      <div className="flex items-center mt-1 text-xs text-wonder-purple font-rounded">
                        <Crown className="h-3 w-3 mr-1" />
                        <span>Level 3 Explorer</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <button 
                    onClick={() => {
                      onAgeRangeChange();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-wonder-purple/5 flex items-center text-foreground font-rounded"
                  >
                    <UserRound className="h-4 w-4 mr-3 text-wonder-purple" />
                    Change Age Range
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-wonder-purple/5 flex items-center text-foreground font-rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-3 text-wonder-purple" />
                    Settings
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2.5 text-sm text-wonder-coral hover:bg-wonder-coral/5 flex items-center font-rounded"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
