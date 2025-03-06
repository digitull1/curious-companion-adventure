
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WonderWhizLogo from "@/components/WonderWhizLogo";
import { BookOpen, ChevronRight, MapPin, Rocket, Sparkles, Star, Globe } from "lucide-react";
import confetti from "canvas-confetti";
import { animate } from "@motionone/dom";
import { launchConfetti } from "@/utils/confetti";

const Onboarding = () => {
  const [ageRange, setAgeRange] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [language, setLanguage] = useState<string>("english");
  const [step, setStep] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
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
      description: "Discover amazing places and facts about our world!"
    },
    { 
      value: "scientist", 
      label: "Scientist", 
      emoji: "🔬",
      color: "bg-gradient-to-r from-wonder-purple to-wonder-blue",
      description: "Conduct experiments and learn how things work!"
    },
    { 
      value: "storyteller", 
      label: "Storyteller", 
      emoji: "📚",
      color: "bg-gradient-to-r from-wonder-coral to-wonder-yellow",
      description: "Dive into amazing stories and create your own!"
    }
  ];

  // Global languages + Indian languages + Southeast Asian languages
  const languages = [
    // Global top 10
    { value: "english", label: "English", region: "Global" },
    { value: "spanish", label: "Spanish (Español)", region: "Global" },
    { value: "mandarin", label: "Mandarin (普通话)", region: "Global" },
    { value: "hindi", label: "Hindi (हिन्दी)", region: "Global" },
    { value: "arabic", label: "Arabic (العربية)", region: "Global" },
    { value: "portuguese", label: "Portuguese (Português)", region: "Global" },
    { value: "bengali", label: "Bengali (বাংলা)", region: "Global" },
    { value: "russian", label: "Russian (Русский)", region: "Global" },
    { value: "japanese", label: "Japanese (日本語)", region: "Global" },
    { value: "german", label: "German (Deutsch)", region: "Global" },
    
    // Indian top 10 (excluding already listed Hindi and Bengali)
    { value: "telugu", label: "Telugu (తెలుగు)", region: "India" },
    { value: "marathi", label: "Marathi (मराठी)", region: "India" },
    { value: "tamil", label: "Tamil (தமிழ்)", region: "India" },
    { value: "urdu", label: "Urdu (اردو)", region: "India" },
    { value: "gujarati", label: "Gujarati (ગુજરાતી)", region: "India" },
    { value: "kannada", label: "Kannada (ಕನ್ನಡ)", region: "India" },
    { value: "odia", label: "Odia (ଓଡ଼ିଆ)", region: "India" },
    { value: "punjabi", label: "Punjabi (ਪੰਜਾਬੀ)", region: "India" },
    { value: "malayalam", label: "Malayalam (മലയാളം)", region: "India" },
    { value: "assamese", label: "Assamese (অসমীয়া)", region: "India" },
    
    // Southeast Asian 5
    { value: "indonesian", label: "Indonesian (Bahasa Indonesia)", region: "Southeast Asia" },
    { value: "vietnamese", label: "Vietnamese (Tiếng Việt)", region: "Southeast Asia" },
    { value: "thai", label: "Thai (ภาษาไทย)", region: "Southeast Asia" },
    { value: "malay", label: "Malay (Bahasa Melayu)", region: "Southeast Asia" },
    { value: "khmer", label: "Khmer (ភាសាខ្មែរ)", region: "Southeast Asia" }
  ];
  
  // More engaging and interactive transition between steps
  const handleContinue = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (step === 1 && ageRange) {
      // Animate current step out
      const currentStep = document.querySelector(".step-content");
      if (currentStep) {
        // Fix: Store the animation promise and handle properly
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
      // Animate current step out for name and language
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
    } else if (step === 3 && userName) {
      // Animate current step out for language selection
      const currentStep = document.querySelector(".step-content");
      if (currentStep) {
        animate(
          currentStep,
          { opacity: [1, 0], x: [0, -20] },
          { duration: 0.3, easing: "ease-out" }
        );
        
        // Wait for animation to complete
        setTimeout(() => {
          setStep(4);
          setIsAnimating(false);
        }, 300);
      }
    } else if (step === 4 && language) {
      // Celebration effect when completing onboarding
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (error) {
        // Fallback to our own confetti implementation if canvas-confetti fails
        launchConfetti();
        console.log("Using fallback confetti:", error);
      }
      
      // Store user preferences in local storage
      localStorage.setItem("wonderwhiz_age_range", ageRange);
      localStorage.setItem("wonderwhiz_avatar", avatar);
      localStorage.setItem("wonderwhiz_username", userName || "Explorer");
      localStorage.setItem("wonderwhiz_language", language);
      
      setTimeout(() => {
        navigate("/chat");
      }, 1000);
    }
  };
  
  const handleBack = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (step > 1) {
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
          setStep(step - 1);
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
            ) : step === 3 ? (
              "What Should We Call You?"
            ) : (
              "Choose Your Language"
            )}
          </h1>
          <p className="text-lg text-muted-foreground">
            {step === 1 
              ? "Let's personalize your learning journey" 
              : step === 2
              ? "Select a character to guide your exploration"
              : step === 3
              ? "Tell us your name so we can make your experience more personal"
              : "Select your preferred language for learning"}
          </p>
          
          {/* Enhanced progress indicator */}
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-2 items-center bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full">
              <div 
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  step === 1 ? 'bg-wonder-purple scale-125' : 'bg-gray-300'
                }`}
              ></div>
              <div className="h-px w-4 bg-gray-300"></div>
              <div 
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  step === 2 ? 'bg-wonder-purple scale-125' : 'bg-gray-300'
                }`}
              ></div>
              <div className="h-px w-4 bg-gray-300"></div>
              <div 
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  step === 3 ? 'bg-wonder-purple scale-125' : 'bg-gray-300'
                }`}
              ></div>
              <div className="h-px w-4 bg-gray-300"></div>
              <div 
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  step === 4 ? 'bg-wonder-purple scale-125' : 'bg-gray-300'
                }`}
              ></div>
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
                    <button
                      key={char.value}
                      onClick={() => setAvatar(char.value)}
                      className={`rounded-xl transition-all duration-300 overflow-hidden transform ${
                        avatar === char.value
                          ? "ring-4 ring-wonder-purple ring-offset-2 scale-[1.02] shadow-wonder"
                          : "hover:shadow-wonder hover:scale-[1.01]"
                      }`}
                    >
                      <div className={`flex items-center p-4 ${char.color}`}>
                        <div className={`h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-3xl mr-4 ${
                          avatar === char.value ? "animate-bounce-subtle" : ""
                        }`}>
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
            ) : step === 3 ? (
              // Name input step
              <div className="p-6 pb-4">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-wonder-purple/10 text-wonder-purple mr-3">3</span>
                  My name is...
                </h2>
                <div className="space-y-4">
                  <div className="bg-wonder-purple/5 border border-wonder-purple/20 rounded-xl p-4">
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full p-3 rounded-lg border border-wonder-purple/30 focus:ring-2 focus:ring-wonder-purple focus:outline-none text-center text-lg"
                      autoFocus
                    />
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      This helps us personalize your learning experience
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Language selection step
              <div className="p-6 pb-4">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-wonder-purple/10 text-wonder-purple mr-3">4</span>
                  <div className="flex items-center">
                    Language
                    <Globe className="ml-2 h-5 w-5 text-wonder-purple" />
                  </div>
                </h2>
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                  {/* Group languages by region */}
                  {["Global", "India", "Southeast Asia"].map(region => (
                    <div key={region}>
                      <h3 className="text-sm font-medium text-wonder-purple/70 mb-2">{region}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        {languages
                          .filter(lang => lang.region === region)
                          .map((lang) => (
                            <button
                              key={lang.value}
                              onClick={() => setLanguage(lang.value)}
                              className={`py-2 px-3 rounded-lg transition-all flex items-center ${
                                language === lang.value
                                  ? "bg-wonder-purple text-white transform scale-[1.02]"
                                  : "bg-white border border-wonder-purple/20 hover:bg-wonder-purple/10"
                              }`}
                            >
                              <div className="text-left">
                                <div className="font-medium text-sm">{lang.label}</div>
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
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
            disabled={step === 1 ? !ageRange : step === 2 ? !avatar : step === 3 ? !userName : !language}
            className={`py-3 px-6 rounded-xl font-medium transition-all flex items-center ${
              (step === 1 ? ageRange : step === 2 ? avatar : step === 3 ? userName : language)
                ? "bg-gradient-to-r from-wonder-purple to-wonder-purple-dark text-white shadow-wonder hover:shadow-wonder-lg hover:-translate-y-1 active:translate-y-0"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {step < 4 ? "Continue" : "Start Adventure"} 
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
