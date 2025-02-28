
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatInterface from "@/components/ChatInterface";
import WonderWhizLogo from "@/components/WonderWhizLogo";
import { BookOpen, Crown, LogOut, Settings, Star, UserRound } from "lucide-react";

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
          <div className="flex items-center">
            <WonderWhizLogo size="md" />
            
            <div className="hidden md:flex ml-8 gap-6">
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>Topics</span>
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>Rewards</span>
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <Crown className="h-4 w-4" />
                <span>Progress</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            <div 
              className={`h-10 w-10 rounded-full ${getAvatarColor()} text-white flex items-center justify-center mr-3 shadow-wonder cursor-pointer`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {getAvatarEmoji()}
            </div>
            
            <div className="relative">
              <div 
                className="flex items-center gap-2 py-1 px-3 rounded-full bg-gradient-wonder/10 hover:bg-gradient-wonder/20 cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="text-sm text-wonder-purple font-medium">{ageRange} years</span>
                <UserRound className="h-4 w-4 text-wonder-purple" />
              </div>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-wonder-lg py-3 z-20 animate-scale-in">
                  <div className="px-4 py-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-full ${getAvatarColor()} text-white flex items-center justify-center shadow-sm text-xl`}>
                        {getAvatarEmoji()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{avatar}</p>
                        <p className="text-sm text-muted-foreground">{ageRange} years</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <button 
                      className="w-full text-left px-4 py-2 text-sm hover:bg-muted/50 flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-3 text-muted-foreground" />
                      Settings
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center"
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
      
      <main className="flex-1 overflow-hidden bg-gradient-to-br from-wonder-background via-white/50 to-wonder-background">
        <div className="h-full relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-wonder-purple/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-wonder-teal/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          </div>
          
          {/* Animated particles for visual interest */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-gradient-wonder opacity-10 animate-float"
                style={{
                  width: `${Math.random() * 60 + 20}px`,
                  height: `${Math.random() * 60 + 20}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 10 + 10}s`
                }}
              />
            ))}
          </div>
          
          {/* Chat interface with improved z-index to display above background */}
          <div className="relative z-10 h-full">
            <ChatInterface ageRange={ageRange} />
          </div>
        </div>
      </main>
      
      {/* Footer with minimal branding */}
      <div className="bg-white border-t py-1.5 px-4 text-center text-xs text-muted-foreground">
        WonderWhiz by leading IB educationalists & Cambridge University child psychologists
      </div>
    </div>
  );
};

export default Chat;
