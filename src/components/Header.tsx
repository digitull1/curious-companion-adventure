
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import WonderWhizLogo from "@/components/WonderWhizLogo";
import { LogOut, Settings, Star, Crown, BarChart2, Sparkles, Globe } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  avatar: string;
  streakCount: number;
  points: number;
  learningProgress: number;
  topicSectionsGenerated: boolean;
  language?: string;
  onLanguageChange?: (newLanguage: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  avatar, 
  streakCount, 
  points, 
  learningProgress, 
  topicSectionsGenerated,
  language,
  onLanguageChange
}) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log("Click event detected, isMenuOpen:", isMenuOpen);
      
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        avatarRef.current && 
        !avatarRef.current.contains(event.target as Node)
      ) {
        console.log("Click outside menu detected, closing menu");
        setIsMenuOpen(false);
      } else {
        console.log("Click inside menu or avatar detected");
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      console.log("Added click outside listener");
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      console.log("Removed click outside listener");
    };
  }, [isMenuOpen]);

  // Add a click handler specifically for menu items
  const handleMenuItemClick = (action: () => void) => {
    console.log("Menu item clicked");
    // Execute the action
    action();
    // Close the menu
    setIsMenuOpen(false);
  };

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

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "it", name: "Italiano" },
    { code: "pt", name: "Português" },
    { code: "hi", name: "हिन्दी" },
    { code: "zh", name: "中文" },
    { code: "ja", name: "日本語" },
    { code: "ko", name: "한국어" },
  ];

  // Debug log for menu state
  console.log("Header rendering, isMenuOpen:", isMenuOpen);

  const handleAvatarClick = () => {
    console.log("Avatar clicked, toggling menu state");
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="border-b bg-white/90 backdrop-blur-sm z-10 shadow-sm">
      <div className="w-full mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <WonderWhizLogo size="md" className="animate-float" />
        </div>
        
        {/* Stats Bar integrated into header */}
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
        
        {/* User menu container with improved positioning */}
        <div className="flex items-center ml-3 relative">
          {/* Avatar button with ref for click detection */}
          <div 
            ref={avatarRef}
            className={`h-10 w-10 rounded-full ${getAvatarColor()} text-white flex items-center justify-center shadow-magical cursor-pointer transition-all duration-300 hover:shadow-magical-hover text-lg touch-manipulation z-20`}
            onClick={handleAvatarClick}
            aria-label="Open user menu"
          >
            {getAvatarEmoji()}
          </div>
          
          {/* Menu container with improved styling and positioning */}
          {isMenuOpen && (
            <div 
              ref={menuRef} 
              className="absolute right-0 top-12 z-50"
              style={{ pointerEvents: 'auto' }}
            >
              <div className="w-64 bg-white rounded-xl shadow-pixar py-3 border border-wonder-purple/10 animate-fade-in-up isolate">
                <div className="px-4 py-3 border-b border-wonder-purple/10">
                  <div className="flex items-center gap-3">
                    <div className={`h-14 w-14 rounded-full ${getAvatarColor()} text-white flex items-center justify-center shadow-magical text-2xl`}>
                      {getAvatarEmoji()}
                    </div>
                    <div>
                      <p className="font-bold text-foreground capitalize font-rounded">{avatar}</p>
                      <p className="text-sm text-muted-foreground font-rounded">
                        {localStorage.getItem("wonderwhiz_age_range") || "Not specified"} years
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  {/* Language Selection */}
                  {onLanguageChange && (
                    <div className="px-4 py-2.5">
                      <div className="text-sm mb-2 text-muted-foreground">Language / भाषा</div>
                      <div className="grid grid-cols-2 gap-1">
                        {languages.slice(0, 6).map((lang) => (
                          <button
                            key={lang.code}
                            className={`text-left px-2 py-1 text-xs rounded-md ${
                              language === lang.code
                                ? "bg-wonder-purple/20 text-wonder-purple font-medium"
                                : "hover:bg-wonder-purple/5"
                            }`}
                            onClick={() => {
                              console.log("Language selected:", lang.code);
                              if (onLanguageChange) {
                                onLanguageChange(lang.code);
                              }
                              setIsMenuOpen(false);
                            }}
                          >
                            {lang.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button 
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-wonder-purple/5 flex items-center text-foreground font-rounded touch-manipulation"
                    onClick={() => {
                      console.log("Settings clicked");
                      toast({
                        title: "Settings",
                        description: "Settings feature coming soon!",
                      });
                      setIsMenuOpen(false);
                    }}
                  >
                    <Settings className="h-4 w-4 mr-3 text-wonder-purple" />
                    Settings
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2.5 text-sm text-wonder-coral hover:bg-wonder-coral/5 flex items-center font-rounded touch-manipulation"
                    onClick={() => handleMenuItemClick(handleLogout)}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
