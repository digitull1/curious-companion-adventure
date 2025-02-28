
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WonderWhizLogo from "@/components/WonderWhizLogo";
import { BookOpen, ChevronRight, MapPin, Rocket, Sparkles } from "lucide-react";

const Onboarding = () => {
  const [ageRange, setAgeRange] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const navigate = useNavigate();
  
  const ageRanges = [
    { value: "5-7", label: "5-7 years", emoji: "🧒", description: "Just starting to read and explore" },
    { value: "8-10", label: "8-10 years", emoji: "👧", description: "Curious about how things work" },
    { value: "11-13", label: "11-13 years", emoji: "🧑", description: "Ready for more complex topics" }
  ];
  
  const avatars = [
    { 
      value: "explorer", 
      label: "Explorer", 
      emoji: "🧭",
      color: "bg-gradient-yellow",
      description: "Discover amazing places and facts about our world!"
    },
    { 
      value: "scientist", 
      label: "Scientist", 
      emoji: "🔬",
      color: "bg-gradient-teal",
      description: "Conduct experiments and learn how things work!"
    },
    { 
      value: "storyteller", 
      label: "Storyteller", 
      emoji: "📚",
      color: "bg-gradient-coral",
      description: "Dive into amazing stories and create your own!"
    }
  ];
  
  const handleContinue = () => {
    if (step === 1 && ageRange) {
      setStep(2);
    } else if (step === 2 && avatar) {
      // In a real app, you'd store these in a state management solution
      localStorage.setItem("wonderwhiz_age_range", ageRange);
      localStorage.setItem("wonderwhiz_avatar", avatar);
      navigate("/chat");
    }
  };
  
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-wonder-background to-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-gradient-wonder opacity-10 animate-float"
            style={{
              width: `${Math.random() * 80 + 20}px`,
              height: `${Math.random() * 80 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
      </div>
      
      <div className="w-full max-w-xl relative z-10">
        <div className="text-center mb-10">
          <WonderWhizLogo size="lg" className="justify-center mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-3">
            {step === 1 ? (
              <span className="relative">
                Welcome to WonderWhiz!
                <Sparkles className="absolute -top-4 -right-4 h-5 w-5 text-wonder-yellow animate-pulse-soft" />
              </span>
            ) : (
              "Choose Your Adventure"
            )}
          </h1>
          <p className="text-lg text-muted-foreground">
            {step === 1 
              ? "Let's personalize your learning journey" 
              : "Select a character to guide your exploration"}
          </p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-wonder overflow-hidden mb-6">
          {step === 1 ? (
            <div className="divide-y">
              <div className="p-6 pb-4">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-wonder-purple/10 text-wonder-purple mr-3">1</span>
                  I am...
                </h2>
                <div className="space-y-4">
                  {ageRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setAgeRange(range.value)}
                      className={`w-full py-4 px-5 rounded-xl transition-all group flex items-center ${
                        ageRange === range.value
                          ? "bg-wonder-purple text-white"
                          : "bg-white border border-wonder-purple/20 hover:bg-wonder-purple/10"
                      }`}
                    >
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl mr-4 transition-all ${
                        ageRange === range.value 
                          ? "bg-white/20"
                          : "bg-wonder-purple/10 group-hover:bg-wonder-purple/20"
                      }`}>
                        {range.emoji}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{range.label}</div>
                        <div className={`text-sm ${
                          ageRange === range.value 
                            ? "text-white/80"
                            : "text-muted-foreground"
                        }`}>{range.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 pb-4">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-wonder-purple/10 text-wonder-purple mr-3">2</span>
                I want to be a...
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {avatars.map((char) => (
                  <button
                    key={char.value}
                    onClick={() => setAvatar(char.value)}
                    className={`rounded-xl transition-all duration-300 overflow-hidden ${
                      avatar === char.value
                        ? "ring-4 ring-wonder-purple ring-offset-2"
                        : "hover:shadow-wonder"
                    }`}
                  >
                    <div className={`flex items-center p-4 ${char.color}`}>
                      <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-3xl mr-4">
                        {char.emoji}
                      </div>
                      <div className="text-left text-white">
                        <div className="text-xl font-bold">{char.label}</div>
                        <div className="text-white/90">{char.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          {step === 2 ? (
            <button
              onClick={handleBack}
              className="py-3 px-6 rounded-xl font-medium transition-all text-muted-foreground hover:text-foreground"
            >
              Back
            </button>
          ) : (
            <div></div> // Empty div to maintain layout with flex justify-between
          )}
          
          <button
            onClick={handleContinue}
            disabled={step === 1 ? !ageRange : !avatar}
            className={`py-3 px-6 rounded-xl font-medium transition-all flex items-center ${
              (step === 1 ? ageRange : avatar)
                ? "bg-gradient-wonder text-white shadow-wonder hover:shadow-wonder-lg hover:-translate-y-1 active:translate-y-0"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {step === 1 ? "Continue" : "Start Adventure"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        {/* Step indicator */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <div className="flex space-x-2">
            <div className={`h-2 w-${step === 1 ? '6' : '2'} rounded-full transition-all duration-300 ${step === 1 ? 'bg-wonder-purple' : 'bg-gray-300'}`}></div>
            <div className={`h-2 w-${step === 2 ? '6' : '2'} rounded-full transition-all duration-300 ${step === 2 ? 'bg-wonder-purple' : 'bg-gray-300'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
