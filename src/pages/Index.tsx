
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WonderWhizLogo from "@/components/WonderWhizLogo";
import { Sparkles } from "lucide-react";

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
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-wonder-background via-white to-wonder-background relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-gradient-wonder opacity-10 animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 15}s`
            }}
          />
        ))}
      </div>
      
      <div className="flex flex-col min-h-screen relative z-10">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-center max-w-3xl animate-fade-in">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <WonderWhizLogo size="xl" />
                <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-wonder rounded-full opacity-30 animate-pulse-soft"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-wonder rounded-full opacity-20 animate-pulse-soft" style={{ animationDelay: "0.5s" }}></div>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-purple">
              Discover the <span className="relative inline-block">
                Wonder
                <Sparkles className="absolute -top-6 -right-5 h-5 w-5 text-wonder-yellow animate-pulse-soft" />
              </span> of Learning
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 mx-auto max-w-xl leading-relaxed">
              An AI-powered learning companion that grows with your child, making education an interactive adventure filled with discovery!
            </p>
            
            <button
              onClick={() => navigate("/onboarding")}
              className="group px-10 py-5 rounded-xl bg-gradient-wonder text-white font-medium shadow-wonder hover:shadow-wonder-lg transition-all duration-500 hover:-translate-y-1 active:translate-y-0 relative overflow-hidden"
            >
              <span className="relative z-10">Start Your Adventure</span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              <span className="absolute -inset-x-full bottom-0 h-px bg-white/30 animate-slide-right"></span>
            </button>
          </div>
        </div>
        
        <div className="py-16 px-6 bg-white rounded-t-[40px] shadow-lg">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-wonder">The Magic of WonderWhiz</h2>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-white rounded-2xl p-8 shadow-wonder hover:shadow-wonder-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto bg-wonder-purple/10 rounded-full flex items-center justify-center mb-5">
                  <div className="w-8 h-8 bg-wonder-purple rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Playful Learning</h3>
                <p className="text-muted-foreground leading-relaxed">Engaging conversations that make education feel like play, sparking curiosity and joy</p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-wonder hover:shadow-wonder-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto bg-wonder-teal/10 rounded-full flex items-center justify-center mb-5">
                  <div className="w-8 h-8 bg-wonder-teal rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Visual Exploration</h3>
                <p className="text-muted-foreground leading-relaxed">AI-generated images that bring learning concepts to life through vibrant illustrations</p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-wonder hover:shadow-wonder-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto bg-wonder-coral/10 rounded-full flex items-center justify-center mb-5">
                  <div className="w-8 h-8 bg-wonder-coral rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Interactive Quizzes</h3>
                <p className="text-muted-foreground leading-relaxed">Fun challenges that reinforce learning through gamification and celebration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
