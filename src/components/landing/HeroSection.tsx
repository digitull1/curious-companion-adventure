
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import WonderWhizLogo from "@/components/WonderWhizLogo";
import { 
  ArrowRight, 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  Star 
} from "lucide-react";
import { showWaitlistSuccess } from "@/utils/confetti";
import { toast } from "@/components/ui/use-toast";

const HeroSection = () => {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Email validation
  React.useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);
  
  // Submit email for waitlist
  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEmailValid) {
      toast.error("Invalid email", {
        description: "Please enter a valid email address."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Success message and confetti
      showWaitlistSuccess();
      
      // Reset form
      setEmail("");
      
      // Log for demo purposes
      console.log("Added to waitlist:", email);
    }, 1500);
  };

  return (
    <section 
      id="home"
      className="relative min-h-screen pt-24 pb-20 flex items-center z-10"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-8 text-center lg:text-left mb-12 lg:mb-0">
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-wonder-purple/10 border border-wonder-purple/20 text-wonder-purple text-sm font-medium">
              <div className="flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                <span>AI-Powered Learning for Kids</span>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
              The AI Learning
              <br />
              <span className="bg-gradient-to-r from-wonder-purple to-wonder-blue bg-clip-text text-transparent">Adventure Begins</span>
              <span className="text-[#FF5B7F]">!</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Meet WonderWhiz: The AI-powered tutor that makes curiosity
              <span className="font-bold text-white"> UNSTOPPABLE!</span>
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 sm:flex-initial">
                <form onSubmit={handleWaitlistSubmit} className="flex">
                  <input 
                    ref={emailRef}
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    className="flex-grow px-4 py-3 rounded-l-lg bg-gray-800 border border-wonder-purple/30 text-white focus:outline-none focus:ring-2 focus:ring-wonder-purple/50"
                    required
                  />
                  <button 
                    type="submit" 
                    disabled={isSubmitting || !isEmailValid}
                    className={`px-5 py-3 rounded-r-lg font-medium flex items-center justify-center transition-all ${
                      isEmailValid ? 'bg-gradient-to-r from-[#FF5B7F] to-[#FC9C6C] hover:from-[#FF4670] hover:to-[#FC8C5C] text-white' : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        <span>Join Waitlist</span>
                        <Sparkles className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
              
              <button 
                onClick={() => navigate("/onboarding")}
                className="px-5 py-3 bg-wonder-purple hover:bg-wonder-purple-dark text-white rounded-lg font-medium flex items-center justify-center transition-all"
              >
                <span>Try Demo</span>
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
            
            <div className="mt-8 flex items-center justify-center lg:justify-start">
              <div className="flex items-center text-gray-400 text-sm">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="font-medium text-white">2,500+</span>
                <span className="ml-1">parents & educators already signed up!</span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="relative z-10">
              <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 mx-auto bg-gradient-to-b from-wonder-blue to-wonder-purple rounded-full flex items-center justify-center p-1 shadow-[0_0_100px_rgba(155,135,245,0.3)]">
                <div className="w-full h-full rounded-full bg-gradient-to-b from-[#8A5CF6] to-[#0EA5E9] flex items-center justify-center overflow-hidden">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">Whizzy</div>
                    <div className="text-sm text-white/80">Your AI Learning Buddy</div>
                    <div className="mt-4 text-5xl">😊</div>
                  </div>
                </div>
              </div>
              
              {/* Topic bubbles */}
              <div className="absolute top-0 -right-10 w-20 h-20 bg-[#FF5B7F]/80 rounded-full flex items-center justify-center transform rotate-6 shadow-lg">
                <span className="text-white font-medium">History</span>
              </div>
              
              <div className="absolute bottom-10 -left-10 w-20 h-20 bg-wonder-teal/80 rounded-full flex items-center justify-center transform -rotate-6 shadow-lg">
                <span className="text-white font-medium">Space</span>
              </div>
              
              <div className="absolute bottom-1/3 -right-5 w-16 h-16 bg-wonder-blue/80 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-medium">Math</span>
              </div>
              
              <div className="absolute top-1/4 -left-16 w-24 h-24 bg-[#F59E0B]/80 rounded-full flex items-center justify-center transform rotate-12 shadow-lg">
                <span className="text-white font-medium">Dinosaurs</span>
              </div>
              
              {/* Chat bubble */}
              <div className="absolute -bottom-12 right-0 bg-white rounded-2xl rounded-br-none p-4 shadow-xl max-w-[220px]">
                <p className="text-gray-800 text-sm">Hi there! What would you like to learn today?</p>
                <div className="absolute w-4 h-4 bg-white transform rotate-45 right-0 -bottom-2"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce flex flex-col items-center">
          <span className="text-white/60 text-sm mb-2">Scroll to explore</span>
          <ChevronDown className="h-6 w-6 text-white/60" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
