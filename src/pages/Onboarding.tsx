
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WonderWhizLogo from "@/components/WonderWhizLogo";
import { BookOpen, ChevronRight, MapPin, Rocket, Sparkles, Star, HelpCircle, Award } from "lucide-react";
import { animate } from "@motionone/dom";
import { launchConfetti } from "@/utils/confetti";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import InterestSelection from "@/components/InterestSelection";

const Onboarding = () => {
  const [ageRange, setAgeRange] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [interests, setInterests] = useState<string[]>([]);
  const [step, setStep] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const navigate = useNavigate();
  
  // Animated welcome screen effect
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);
  
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
      color: "bg-gradient-to-r from-wonder-teal to-wonder-blue",
      description: "Discover amazing places and facts about our world!",
      tooltip: "Choose me if you love exploring new places and uncovering fascinating facts!"
    },
    { 
      value: "scientist", 
      label: "Scientist", 
      emoji: "🔬",
      color: "bg-gradient-to-r from-wonder-purple to-wonder-blue",
      description: "Conduct experiments and learn how things work!",
      tooltip: "Choose me if you're curious about how everything works and love doing experiments!"
    },
    { 
      value: "storyteller", 
      label: "Storyteller", 
      emoji: "📚",
      color: "bg-gradient-to-r from-wonder-coral to-wonder-yellow",
      description: "Dive into amazing stories and create your own!",
      tooltip: "Choose me if you love reading and creating fantastic stories!"
    }
  ];
  
  // More engaging and interactive transition between steps
  const handleContinue = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (step === 1 && ageRange) {
      // Animate current step out
      const currentStep = document.querySelector(".step-content");
      if (currentStep) {
        animate(
          currentStep,
          { opacity: [1, 0], x: [0, -20] },
          { duration: 0.3, easing: "ease-out" }
        );
        
        // Wait for animation to complete
        setTimeout(() => {
          setStep(2);
          setIsAnimating(false);
        }, 300); // Match duration with the animation
      }
    } else if (step === 2 && avatar) {
      // Animate current step out
      const currentStep = document.querySelector(".step-content");
      if (currentStep) {
        animate(
          currentStep,
          { opacity: [1, 0], x: [0, -20] },
          { duration: 0.3, easing: "ease-out" }
        );
        
        // Wait for animation to complete
        setTimeout(() => {
          setStep(3);
          setIsAnimating(false);
        }, 300);
      }
    } else if (step === 3 && interests.length > 0) {
      // Show celebration screen
      setShowCelebration(true);
      
      // Celebration effect when completing onboarding
      try {
        // Launch multiple confetti bursts for a more exciting effect
        setTimeout(() => {
          launchConfetti({ 
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6, x: 0.3 }
          });
        }, 0);
        
        setTimeout(() => {
          launchConfetti({ 
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6, x: 0.7 }
          });
        }, 300);
      } catch (error) {
        console.log("Using fallback confetti:", error);
      }
      
      // In a real app, you'd store these in a state management solution
      localStorage.setItem("wonderwhiz_age_range", ageRange);
      localStorage.setItem("wonderwhiz_avatar", avatar);
      localStorage.setItem("wonderwhiz_interests", JSON.stringify(interests));
      
      setTimeout(() => {
        navigate("/chat");
      }, 3000);
    }
  };
  
  const handleBack = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (step === 2 || step === 3) {
      // Animate current step out
      const currentStep = document.querySelector(".step-content");
      if (currentStep) {
        animate(
          currentStep,
          { opacity: [1, 0], x: [0, 20] },
          { duration: 0.3, easing: "ease-out" }
        );
        
        // Wait for animation to complete
        setTimeout(() => {
          setStep(step === 3 ? 2 : 1);
          setIsAnimating(false);
        }, 300); // Match duration with the animation
      }
    }
  };

  // Welcome animation screen
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-wonder-background to-white flex flex-col items-center justify-center p-6">
        <div className="animate-fade-in-up text-center">
          <WonderWhizLogo size="xl" className="justify-center mb-8" />
          <h1 className="text-4xl font-bold text-foreground mb-3 relative inline-flex">
            Welcome to 
            <span className="text-wonder-purple ml-2">WonderWhiz</span>
            <Sparkles className="absolute -top-4 -right-8 h-8 w-8 text-wonder-yellow animate-sparkle" />
          </h1>
          <p className="text-xl text-muted-foreground mt-4">
            Let's begin an amazing journey of discovery!
          </p>
        </div>
      </div>
    );
  }
  
  // Celebration screen
  if (showCelebration) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-wonder-background to-white flex flex-col items-center justify-center p-6 overflow-hidden">
        <div className="text-center animate-scale-in">
          <div className="relative mb-8">
            <WonderWhizLogo size="xl" className="justify-center" />
            <div className="absolute -top-6 -right-10">
              <Award className="h-12 w-12 text-wonder-yellow fill-wonder-yellow animate-pulse-soft" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            You're all set!
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Your adventure is about to begin. Get ready for an amazing journey of discovery with WonderWhiz!
          </p>
          
          <div className="mt-8 inline-block">
            <div className="animate-bounce-subtle">
              <span className="text-5xl">{avatars.find(a => a.value === avatar)?.emoji}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-wonder-background to-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Enhanced animated particles with stars and sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className={`absolute rounded-full ${i % 3 === 0 ? 'bg-wonder-yellow/30' : i % 3 === 1 ? 'bg-wonder-purple/20' : 'bg-wonder-teal/20'} animate-float`}
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
        {/* Add star shapes */}
        {[...Array(5)].map((_, i) => (
          <div 
            key={`star-${i}`}
            className="absolute text-wonder-yellow/50 animate-pulse-glow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${Math.random() * 20 + 14}px`
            }}
          >
            <Star fill="currentColor" />
          </div>
        ))}
      </div>
      
      <div className="w-full max-w-xl relative z-10">
        <div className="text-center mb-10">
          <WonderWhizLogo size="lg" className="justify-center mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-3">
            {step === 1 ? (
              <span className="relative inline-flex items-center">
                Welcome to WonderWhiz!
                <Sparkles className="absolute -top-4 -right-4 h-5 w-5 text-wonder-yellow animate-pulse-soft" />
              </span>
            ) : step === 2 ? (
              "Choose Your Adventure"
            ) : (
              "What Do You Like?"
            )}
          </h1>
          <p className="text-lg text-muted-foreground">
            {step === 1 
              ? "Let's personalize your learning journey" 
              : step === 2
              ? "Select a character to guide your exploration"
              : "Select topics you'd love to learn about"}
          </p>
          
          {/* Enhanced progress indicator */}
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-3 items-center bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm">
              <div className="flex flex-col items-center">
                <div 
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    step === 1 ? 'bg-wonder-purple scale-125' : step > 1 ? 'bg-wonder-green' : 'bg-gray-300'
                  }`}
                ></div>
                <span className={`text-xs mt-1 ${step === 1 ? 'text-wonder-purple font-bold' : step > 1 ? 'text-wonder-green' : 'text-gray-400'}`}>Age</span>
              </div>
              
              <div className={`h-px w-6 transition-all duration-300 ${step > 1 ? 'bg-wonder-green' : 'bg-gray-300'}`}></div>
              
              <div className="flex flex-col items-center">
                <div 
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    step === 2 ? 'bg-wonder-purple scale-125' : step > 2 ? 'bg-wonder-green' : 'bg-gray-300'
                  }`}
                ></div>
                <span className={`text-xs mt-1 ${step === 2 ? 'text-wonder-purple font-bold' : step > 2 ? 'text-wonder-green' : 'text-gray-400'}`}>Avatar</span>
              </div>
              
              <div className={`h-px w-6 transition-all duration-300 ${step > 2 ? 'bg-wonder-green' : 'bg-gray-300'}`}></div>
              
              <div className="flex flex-col items-center">
                <div 
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    step === 3 ? 'bg-wonder-purple scale-125' : 'bg-gray-300'
                  }`}
                ></div>
                <span className={`text-xs mt-1 ${step === 3 ? 'text-wonder-purple font-bold' : 'text-gray-400'}`}>Interests</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Step content with animation */}
        <div className="step-content animate-fade-in-up">
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
                            ? "bg-wonder-purple text-white transform scale-[1.02] shadow-magical"
                            : "bg-white border border-wonder-purple/20 hover:bg-wonder-purple/10 hover:scale-[1.01]"
                        }`}
                      >
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl mr-4 transition-all ${
                          ageRange === range.value 
                            ? "bg-white/20 animate-bounce-subtle"
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
            ) : step === 2 ? (
              <div className="p-6 pb-4">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-wonder-purple/10 text-wonder-purple mr-3">2</span>
                  I want to be a...
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {avatars.map((char) => (
                    <TooltipProvider key={char.value}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setAvatar(char.value)}
                            className={`rounded-xl transition-all duration-300 overflow-hidden transform group ${
                              avatar === char.value
                                ? "ring-4 ring-wonder-purple ring-offset-2 scale-[1.02] shadow-wonder"
                                : "hover:shadow-wonder hover:scale-[1.01]"
                            }`}
                          >
                            <div className={`flex items-center p-4 ${char.color}`}>
                              <div className={`h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-3xl mr-4 ${
                                avatar === char.value ? "animate-bounce-subtle" : "group-hover:animate-pulse-soft"
                              }`}>
                                {char.emoji}
                              </div>
                              <div className="text-left text-white">
                                <div className="text-xl font-bold">{char.label}</div>
                                <div className="text-white/90">{char.description}</div>
                              </div>
                              <HelpCircle className="ml-auto h-5 w-5 text-white/70 group-hover:text-white/90" />
                            </div>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="p-3 max-w-[220px]">
                          <p>{char.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 pb-4">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-wonder-purple/10 text-wonder-purple mr-3">3</span>
                  What would you like to learn about?
                </h2>
                <InterestSelection 
                  selectedInterests={interests} 
                  onInterestsChange={setInterests}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="py-3 px-6 rounded-xl font-medium transition-all text-muted-foreground hover:text-foreground hover:bg-white/70 hover:shadow-sm"
            >
              Back
            </button>
          ) : (
            <div></div> // Empty div to maintain layout with flex justify-between
          )}
          
          <button
            onClick={handleContinue}
            disabled={step === 1 ? !ageRange : step === 2 ? !avatar : interests.length === 0}
            className={`py-3 px-6 rounded-xl font-medium transition-all flex items-center ${
              (step === 1 ? ageRange : step === 2 ? avatar : interests.length > 0)
                ? "bg-gradient-to-r from-wonder-purple to-wonder-purple-dark text-white shadow-wonder hover:shadow-wonder-lg hover:-translate-y-1 active:translate-y-0"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {step === 1 ? "Continue" : step === 2 ? "Continue" : "Start Adventure"} 
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
