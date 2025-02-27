
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WonderWhizLogo from "@/components/WonderWhizLogo";

const Onboarding = () => {
  const [ageRange, setAgeRange] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const navigate = useNavigate();
  
  const ageRanges = [
    { value: "5-7", label: "5-7 years" },
    { value: "8-10", label: "8-10 years" },
    { value: "11-13", label: "11-13 years" }
  ];
  
  const avatars = [
    { value: "explorer", label: "Explorer", emoji: "🧭" },
    { value: "scientist", label: "Scientist", emoji: "🔬" },
    { value: "storyteller", label: "Storyteller", emoji: "📚" }
  ];
  
  const handleContinue = () => {
    if (ageRange && avatar) {
      // In a real app, you'd store these in a state management solution
      localStorage.setItem("wonderwhiz_age_range", ageRange);
      localStorage.setItem("wonderwhiz_avatar", avatar);
      navigate("/chat");
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-wonder-background to-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <WonderWhizLogo size="xl" className="justify-center mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to WonderWhiz!</h1>
          <p className="text-muted-foreground">Let's personalize your learning adventure</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-wonder p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">I am...</h2>
          <div className="space-y-3 mb-6">
            {ageRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setAgeRange(range.value)}
                className={`w-full py-3 px-4 rounded-xl transition-all ${
                  ageRange === range.value
                    ? "bg-wonder-purple text-white"
                    : "bg-white border border-wonder-purple/20 hover:bg-wonder-purple/10"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          
          <h2 className="text-lg font-semibold mb-4">I want to be a...</h2>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {avatars.map((char) => (
              <button
                key={char.value}
                onClick={() => setAvatar(char.value)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                  avatar === char.value
                    ? "bg-wonder-purple text-white"
                    : "bg-white border border-wonder-purple/20 hover:bg-wonder-purple/10"
                }`}
              >
                <div className="text-3xl mb-2">{char.emoji}</div>
                <div className="text-sm">{char.label}</div>
              </button>
            ))}
          </div>
        </div>
        
        <button
          onClick={handleContinue}
          disabled={!ageRange || !avatar}
          className={`w-full py-3 rounded-xl font-medium transition-all btn-bounce ${
            ageRange && avatar
              ? "bg-gradient-wonder text-white shadow-wonder"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          Start My Adventure
        </button>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full overflow-hidden h-32 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-wonder opacity-20"></div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 bg-white/30 rounded-full animate-float"
            style={{
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 3}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Onboarding;
