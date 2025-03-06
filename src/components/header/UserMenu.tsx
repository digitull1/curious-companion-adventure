
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LanguageSelector from "./LanguageSelector";

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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

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
      case "scientist": return "bg-gradient-to-br from-wonder-teal to-wonder-teal-dark";
      case "storyteller": return "bg-gradient-to-br from-wonder-coral to-wonder-coral-dark";
      default: return "bg-gradient-to-br from-wonder-yellow to-wonder-yellow-dark";
    }
  };

  if (!isOpen) return null;

  return (
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
          <LanguageSelector 
            language={language} 
            onLanguageChange={onLanguageChange} 
          />

          <button 
            className="w-full text-left px-4 py-2.5 text-sm hover:bg-wonder-purple/5 flex items-center text-foreground font-rounded touch-manipulation"
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
          
          <button 
            className="w-full text-left px-4 py-2.5 text-sm text-wonder-coral hover:bg-wonder-coral/5 flex items-center font-rounded touch-manipulation"
            onClick={() => {
              handleLogout();
              onClose();
            }}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
