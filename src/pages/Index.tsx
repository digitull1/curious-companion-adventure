
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WonderWhizLogo from "@/components/WonderWhizLogo";

const Index = () => {
  const navigate = useNavigate();
  
  // Check if user has already completed onboarding
  useEffect(() => {
    const ageRange = localStorage.getItem("wonderwhiz_age_range");
    const avatar = localStorage.getItem("wonderwhiz_avatar");
    
    if (ageRange && avatar) {
      // User has already onboarded, take them to chat
      navigate("/chat");
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-wonder-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-3xl animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <WonderWhizLogo size="xl" />
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-wonder rounded-full opacity-30 animate-pulse-soft"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-wonder rounded-full opacity-20 animate-pulse-soft" style={{ animationDelay: "0.5s" }}></div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-purple">
            Discover the Wonder of Learning
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 mx-auto max-w-xl">
            An AI-powered learning companion that grows with your child, making education an interactive adventure!
          </p>
          
          <button
            onClick={() => navigate("/onboarding")}
            className="px-8 py-4 rounded-xl bg-gradient-wonder text-white font-medium shadow-wonder hover:shadow-wonder-lg transition-all hover:-translate-y-1 active:translate-y-0"
          >
            Start Your Adventure
          </button>
        </div>
      </div>
      
      <div className="p-6 pb-20 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white rounded-xl p-6 shadow-wonder">
            <div className="w-12 h-12 mx-auto bg-wonder-purple/20 rounded-full flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-wonder-purple rounded-full"></div>
            </div>
            <h2 className="text-lg font-semibold mb-2">Playful Learning</h2>
            <p className="text-muted-foreground">Engaging conversations that make education feel like play</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-wonder">
            <div className="w-12 h-12 mx-auto bg-wonder-teal/20 rounded-full flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-wonder-teal rounded-full"></div>
            </div>
            <h2 className="text-lg font-semibold mb-2">Visual Exploration</h2>
            <p className="text-muted-foreground">AI-generated images that bring learning concepts to life</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-wonder">
            <div className="w-12 h-12 mx-auto bg-wonder-coral/20 rounded-full flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-wonder-coral rounded-full"></div>
            </div>
            <h2 className="text-lg font-semibold mb-2">Interactive Quizzes</h2>
            <p className="text-muted-foreground">Fun challenges that reinforce learning through gamification</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
