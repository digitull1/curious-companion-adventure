import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, Moon, Sun, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LanguageSelector from "./LanguageSelector";
import { animate } from "@motionone/dom";

interface UserMenuProps {
  avatar: string;
  isOpen: boolean;
  onClose: () => void;
  language?: string;
  onLanguageChange?: (newLanguage: string) => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  avatar,
  isOpen,
  onClose,
  language,
  onLanguageChange
}) => {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animate menu when it opens
  useEffect(() => {
    if (isOpen && menuRef.current) {
      setIsAnimating(true);
      
      // Animate the menu
      animate(
        menuRef.current,
        { opacity: [0, 1], y: [-10, 0], scale: [0.95, 1] },
        { duration: 0.3, easing: [0.16, 1, 0.3, 1] }
      );
      
      // Set isAnimating to false after animation duration
      const animationTimeout = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Same as the duration of the animation (0.3s)
      
      // Animate menu items with staggered delay
      const menuItems = menuRef.current.querySelectorAll('.menu-item');
      menuItems.forEach((item, index) => {
        animate(
          item,
          { opacity: [0, 1], x: [-5, 0] },
          { duration: 0.2, delay: 0.05 * index + 0.1, easing: "ease-out" }
        );
      });
      
      // Clean up timeout on unmount
      return () => clearTimeout(animationTimeout);
    }
  }, [isOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node)
      ) {
        if (!isAnimating) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, isAnimating]);

  const handleLogout = () => {
    localStorage.removeItem("wonderwhiz_age_range");
    localStorage.removeItem("wonderwhiz_avatar");
    navigate("/");
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
      case "scientist": return "bg-gradient-to-br from-wonder-blue to-wonder-blue-dark";
      case "storyteller": return "bg-gradient-to-br from-wonder-coral to-wonder-coral-dark";
      default: return "bg-gradient-to-br from-wonder-yellow to-wonder-yellow-dark";
    }
  };

  // If menu is not open, don't render anything
  if (!isOpen) {
    return null;
  }
  
  return (
    <div 
      ref={menuRef}
      id="user-menu-container" 
      className="absolute right-0 top-12 z-50"
      style={{ 
        pointerEvents: 'auto',
        opacity: 0 // Start invisible and animate in
      }}
    >
      <div 
        id="user-menu-content"
        className="w-64 bg-white rounded-xl shadow-wonder py-3 border border-wonder-purple/10 isolate overflow-hidden"
        style={{
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          backgroundColor: 'white'
        }}
      >
        {/* Animated background sparkles */}
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-wonder-yellow/10 rounded-full animate-pulse-glow"></div>
        <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-wonder-purple/10 rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        
        {/* User profile section */}
        <div className="px-4 py-3 border-b border-wonder-purple/10 relative">
          <div className="flex items-center gap-3">
            <div className={`h-14 w-14 rounded-full ${getAvatarColor()} text-white flex items-center justify-center shadow-magical text-2xl relative overflow-hidden group`}>
              {getAvatarEmoji()}
              <span className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white/80" />
              </span>
            </div>
            <div>
              <p className="font-bold text-foreground capitalize font-rounded">{avatar}</p>
              <p className="text-sm text-muted-foreground font-rounded flex items-center">
                <span>{localStorage.getItem("wonderwhiz_age_range") || "Not specified"} years</span>
                <span className="ml-1 inline-block w-2 h-2 bg-wonder-purple/50 rounded-full animate-pulse"></span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          {/* Language Selection */}
          <LanguageSelector 
            language={language} 
            onLanguageChange={onLanguageChange} 
          />

          {/* Settings button */}
          <button 
            className="menu-item w-full text-left px-4 py-2.5 text-sm hover:bg-wonder-purple/5 flex items-center text-foreground font-rounded touch-manipulation opacity-0 transition-all duration-200"
            onClick={() => {
              toast({
                title: "Settings",
                description: "Settings feature coming soon!",
              });
              onClose();
            }}
          >
            <Settings className="h-4 w-4 mr-3 text-wonder-purple" />
            Settings
          </button>
          
          {/* Dark mode button - Note: To be implemented with user theme preference */}
          <button 
            className="menu-item w-full text-left px-4 py-2.5 text-sm hover:bg-wonder-purple/5 flex items-center text-foreground font-rounded touch-manipulation opacity-0 transition-all duration-200"
            onClick={() => {
              toast({
                title: "Coming Soon",
                description: "Dark mode will be available soon!",
              });
              onClose();
            }}
          >
            <Sun className="h-4 w-4 mr-3 text-wonder-yellow" />
            Light mode
          </button>
          
          {/* Sign out button */}
          <button 
            className="menu-item w-full text-left px-4 py-2.5 text-sm text-wonder-coral hover:bg-wonder-coral/5 flex items-center font-rounded touch-manipulation opacity-0 transition-all duration-200"
            onClick={() => {
              handleLogout();
              onClose();
            }}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign out
          </button>
        </div>
        
        {/* Version indicator */}
        <div className="px-4 pt-2 pb-1 mt-2 border-t border-wonder-purple/10">
          <p className="text-[10px] text-muted-foreground/50 text-center">
            WonderWhiz v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
