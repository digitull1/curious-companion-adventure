
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatInterface from "@/components/ChatInterface";
import WonderWhizLogo from "@/components/WonderWhizLogo";
import { LogOut, Settings, UserRound } from "lucide-react";

const Chat = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ageRange = localStorage.getItem("wonderwhiz_age_range") || "8-10";
  const avatar = localStorage.getItem("wonderwhiz_avatar") || "explorer";
  
  useEffect(() => {
    // If user hasn't completed onboarding, redirect them
    if (!ageRange || !avatar) {
      navigate("/");
    }
  }, [ageRange, avatar, navigate]);
  
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
      case "explorer": return "bg-gradient-yellow";
      case "scientist": return "bg-gradient-teal";
      case "storyteller": return "bg-gradient-coral";
      default: return "bg-gradient-yellow";
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("wonderwhiz_age_range");
    localStorage.removeItem("wonderwhiz_avatar");
    navigate("/");
  };
  
  return (
    <div className="flex flex-col h-screen bg-wonder-background">
      <header className="border-b bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <WonderWhizLogo size="md" />
          
          <div className="flex items-center">
            <div 
              className={`h-10 w-10 rounded-full ${getAvatarColor()} text-white flex items-center justify-center mr-3 shadow-sm cursor-pointer`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {getAvatarEmoji()}
            </div>
            
            <div className="relative">
              <div 
                className="flex items-center gap-2 py-1 px-3 rounded-full bg-muted/50 hover:bg-muted cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="text-sm text-muted-foreground">{ageRange} years</span>
                <UserRound className="h-4 w-4 text-muted-foreground" />
              </div>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-20 animate-scale-in">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium">Signed in as</p>
                    <p className="text-muted-foreground text-sm">{avatar}</p>
                  </div>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted/50 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden bg-gradient-to-br from-wonder-background via-white/50 to-wonder-background">
        <div className="h-full relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-wonder-purple/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-wonder-teal/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          </div>
          
          {/* Chat interface with improved z-index to display above background */}
          <div className="relative z-10 h-full">
            <ChatInterface ageRange={ageRange} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
