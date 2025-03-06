
import React, { useState, useRef } from "react";
import WonderWhizLogo from "@/components/WonderWhizLogo";
import StatsBar from "./header/StatsBar";
import AvatarButton from "./header/AvatarButton";
import UserMenu from "./header/UserMenu";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  const handleAvatarClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="border-b bg-white/90 backdrop-blur-sm z-10 shadow-sm">
      <div className="w-full mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <WonderWhizLogo size="md" className="animate-float" />
        </div>
        
        {/* Stats Bar integrated into header */}
        <StatsBar 
          points={points}
          streakCount={streakCount}
          learningProgress={learningProgress}
          topicSectionsGenerated={topicSectionsGenerated}
        />
        
        {/* User menu container with improved positioning */}
        <div className="flex items-center ml-3 relative">
          {/* Avatar button with ref for click detection */}
          <div ref={avatarRef}>
            <AvatarButton 
              avatar={avatar} 
              onClick={handleAvatarClick}
            />
          </div>
          
          <UserMenu 
            avatar={avatar}
            isOpen={isMenuOpen}
            onClose={handleCloseMenu}
            language={language}
            onLanguageChange={onLanguageChange}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
