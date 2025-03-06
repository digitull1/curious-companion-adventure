
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [menuPortalElement, setMenuPortalElement] = useState<HTMLElement | null>(null);

  console.log("Header rendering, isMenuOpen:", isMenuOpen);

  useEffect(() => {
    // Create a portal container at the document level to avoid backdrop filter inheritance
    const portalContainer = document.createElement('div');
    portalContainer.id = 'menu-portal-container';
    // Set styles to ensure it's positioned correctly at the top level
    portalContainer.style.position = 'fixed';
    portalContainer.style.top = '0';
    portalContainer.style.left = '0';
    portalContainer.style.width = '100%';
    portalContainer.style.height = '100%';
    portalContainer.style.pointerEvents = 'none';
    portalContainer.style.zIndex = '9999';
    
    document.body.appendChild(portalContainer);
    setMenuPortalElement(portalContainer);
    
    return () => {
      document.body.removeChild(portalContainer);
    };
  }, []);

  const handleAvatarClick = () => {
    console.log("Avatar clicked, toggling menu");
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    console.log("Closing menu");
    setIsMenuOpen(false);
  };

  // Get avatar button position for menu placement
  const getMenuPosition = () => {
    if (!avatarRef.current) return { top: 0, right: 0 };
    
    const rect = avatarRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY,
      right: window.innerWidth - rect.right - window.scrollX
    };
  };

  return (
    <header className="border-b bg-white/90 z-10 shadow-sm">
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
          {/* Avatar button with ref for position calculation */}
          <div ref={avatarRef}>
            <AvatarButton 
              avatar={avatar} 
              onClick={handleAvatarClick}
            />
          </div>
          
          {/* Render menu through portal to avoid backdrop filter inheritance */}
          {menuPortalElement && isMenuOpen && createPortal(
            <div 
              className="fixed inset-0 z-50 pointer-events-none"
              onClick={(e) => {
                // Stop propagation to prevent immediate closing
                e.stopPropagation();
                // Only close if clicking the overlay (not the menu itself)
                if (e.target === e.currentTarget) {
                  handleCloseMenu();
                }
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  top: `${getMenuPosition().top}px`,
                  right: `${getMenuPosition().right}px`,
                  pointerEvents: 'auto',
                  // Add some debug styling to clearly see the menu
                  boxShadow: '0 0 20px rgba(0,0,0,0.2)',
                  borderRadius: '0.75rem',
                  backgroundColor: 'white',
                  zIndex: 9999
                }}
              >
                <UserMenu 
                  avatar={avatar}
                  isOpen={true} // Always true since we conditionally render
                  onClose={handleCloseMenu}
                  language={language}
                  onLanguageChange={onLanguageChange}
                />
              </div>
            </div>,
            menuPortalElement
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
