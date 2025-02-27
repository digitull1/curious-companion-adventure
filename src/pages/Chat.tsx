
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatInterface from "@/components/ChatInterface";
import WonderWhizLogo from "@/components/WonderWhizLogo";

const Chat = () => {
  const navigate = useNavigate();
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
  
  return (
    <div className="flex flex-col h-screen bg-wonder-background">
      <header className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <WonderWhizLogo size="md" />
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-wonder-purple text-white flex items-center justify-center mr-2">
              {getAvatarEmoji()}
            </div>
            <span className="text-sm text-muted-foreground">{ageRange} years</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden bg-gradient-wonder-soft">
        <ChatInterface ageRange={ageRange} />
      </main>
    </div>
  );
};

export default Chat;
