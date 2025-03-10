import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import WonderWhizLogo from "@/components/WonderWhizLogo";
import { 
  ArrowRight, 
  ArrowUp, 
  Brain, 
  CheckCircle, 
  ChevronDown, 
  ChevronRight, 
  Lock, 
  MessageCircle, 
  Rocket, 
  Sparkles, 
  Star, 
  Trophy,
  X 
} from "lucide-react";
import { createStarryBackground, showWaitlistSuccess } from "@/utils/confetti";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const starBackgroundRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if user has already completed onboarding
  useEffect(() => {
    const ageRange = localStorage.getItem("wonderwhiz_age_range");
    const avatar = localStorage.getItem("wonderwhiz_avatar");
    
    if (ageRange && avatar) {
      // User has already onboarded, take them to chat
      navigate("/chat");
    }
  }, [navigate]);
  
  // Create starry background effect
  useEffect(() => {
    if (starBackgroundRef.current) {
      createStarryBackground(starBackgroundRef.current);
    }
    
    // Add scroll to top button visibility logic
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const handleScroll = () => {
      if (scrollToTopBtn) {
        if (window.scrollY > 300) {
          scrollToTopBtn.classList.remove('opacity-0');
          scrollToTopBtn.classList.add('opacity-100');
        } else {
          scrollToTopBtn.classList.remove('opacity-100');
          scrollToTopBtn.classList.add('opacity-0');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Email validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);
  
  // Submit email for waitlist
  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEmailValid) {
      // Fix: Using the correct Sonner toast API format
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
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <div className="relative">
      {/* Starry space background */}
      <div 
        ref={starBackgroundRef}
        className="fixed inset-0 bg-gradient-to-b from-[#0B0B1A] via-[#1A1A3A] to-[#0B0B1A] overflow-hidden z-0"
      >
        {/* This div will be filled with stars via JS */}
      </div>
      
      {/* Scroll to top button */}
      <button
        id="scrollToTopBtn"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-wonder-purple text-white flex items-center justify-center shadow-magical z-50 opacity-0 transition-opacity duration-300"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
      
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-opacity-10 backdrop-blur-md bg-[#0B0B1A] border-b border-wonder-purple/20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <WonderWhizLogo size="sm" />
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-200 hover:text-white transition-colors">Home</a>
              <a href="#features" className="text-gray-200 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-200 hover:text-white transition-colors">How It Works</a>
              <a href="#testimonials" className="text-gray-200 hover:text-white transition-colors">Testimonials</a>
              <a href="#faq" className="text-gray-200 hover:text-white transition-colors">FAQ</a>
            </nav>
            
            <button 
              onClick={() => {
                const waitlistSection = document.getElementById('waitlist');
                if (waitlistSection) {
                  waitlistSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="hidden md:block bg-gradient-to-r from-[#FF5B7F] to-[#FC9C6C] hover:from-[#FF4670] hover:to-[#FC8C5C] text-white px-5 py-2 rounded-full font-medium transition-all transform hover:scale-105 shadow-lg"
            >
              Join Waitlist
            </button>
            
            {/* Mobile menu button */}
            <button className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
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
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-[#0B0B1A]/70 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              A Learning Experience Like
              <span className="text-wonder-purple"> Never Before!</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              See how WonderWhiz transforms education into an exciting adventure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/5 backdrop-blur-sm border border-wonder-purple/10 rounded-2xl p-6 transform transition-all hover:scale-105 hover:bg-white/10">
              <div className="w-14 h-14 bg-wonder-purple/20 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="h-7 w-7 text-wonder-purple" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Conversational AI That Feels Like Magic</h3>
              <p className="text-gray-300">Learning feels like chatting with a super-smart friend! WonderWhiz responds naturally to questions, making complex topics simple and fun.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white/5 backdrop-blur-sm border border-wonder-purple/10 rounded-2xl p-6 transform transition-all hover:scale-105 hover:bg-white/10">
              <div className="w-14 h-14 bg-wonder-teal/20 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="h-7 w-7 text-wonder-teal" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Click-to-Explore Learning Paths</h3>
              <p className="text-gray-300">Every answer unlocks 5 more paths to discover! Endless curiosity! Knowledge branches out like a tree - one question leads to countless explorations.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white/5 backdrop-blur-sm border border-wonder-purple/10 rounded-2xl p-6 transform transition-all hover:scale-105 hover:bg-white/10">
              <div className="w-14 h-14 bg-wonder-blue/20 rounded-full flex items-center justify-center mb-6">
                <Star className="h-7 w-7 text-wonder-blue" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI-Powered Image Generation</h3>
              <p className="text-gray-300">Ask about dinosaurs? AI creates a hyper-realistic dino on the spot! Visual learning comes to life with AI-generated images that aid understanding.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white/5 backdrop-blur-sm border border-wonder-purple/10 rounded-2xl p-6 transform transition-all hover:scale-105 hover:bg-white/10">
              <div className="w-14 h-14 bg-wonder-yellow/20 rounded-full flex items-center justify-center mb-6">
                <Trophy className="h-7 w-7 text-wonder-yellow" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Gamified Learning – Points & Achievements!</h3>
              <p className="text-gray-300">Complete challenges, earn rewards, and level up! Learning becomes a game with achievement badges, progress tracking, and exciting rewards.</p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white/5 backdrop-blur-sm border border-wonder-purple/10 rounded-2xl p-6 transform transition-all hover:scale-105 hover:bg-white/10">
              <div className="w-14 h-14 bg-[#FF5B7F]/20 rounded-full flex items-center justify-center mb-6">
                <Brain className="h-7 w-7 text-[#FF5B7F]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Personalized for Every Child</h3>
              <p className="text-gray-300">WonderWhiz adapts to every child's age & learning level! AI technology tailors content to match each child's abilities and interests.</p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white/5 backdrop-blur-sm border border-wonder-purple/10 rounded-2xl p-6 transform transition-all hover:scale-105 hover:bg-white/10">
              <div className="w-14 h-14 bg-wonder-green/20 rounded-full flex items-center justify-center mb-6">
                <Lock className="h-7 w-7 text-wonder-green" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Safe & Privacy-Focused</h3>
              <p className="text-gray-300">COPPA compliant with strong data protection. Parents can monitor learning progress while maintaining their child's privacy and security.</p>
            </div>
          </div>
          
          {/* CTA Card */}
          <div className="mt-16 bg-gradient-to-r from-wonder-purple to-wonder-blue rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to transform learning?</h3>
            <p className="text-white/90 mb-6">Be among the first to experience the future of education with WonderWhiz!</p>
            <button 
              onClick={() => {
                const waitlistSection = document.getElementById('waitlist');
                if (waitlistSection) {
                  waitlistSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-8 py-3 bg-white text-wonder-purple font-medium rounded-full transform transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center mx-auto"
            >
              <Rocket className="mr-2 h-5 w-5" />
              <span>Join the Waitlist – Be the First to Try It!</span>
            </button>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How WonderWhiz Works</h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              A simple 5-step journey to transform how your child learns
            </p>
          </div>
          
          {/* Steps timeline */}
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute top-10 left-4 md:left-1/2 md:-ml-1 w-2 md:w-full h-[calc(100%-4rem)] md:h-2 bg-gray-700"></div>
            
            <div className="space-y-16 md:space-y-0 md:grid md:grid-cols-5 mb-10">
              {/* Step 1 */}
              <div className="relative md:text-center">
                <div className="flex md:block items-center">
                  <div className="z-10 flex items-center justify-center w-8 h-8 bg-wonder-purple text-white rounded-full relative left-0 md:left-1/2 md:-ml-4 md:mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-white ml-6 md:ml-0">Ask Anything!</h3>
                </div>
                <div className="pl-14 md:pl-0 md:px-4 mt-2 text-gray-300">
                  Type any question and get engaging, age-appropriate responses.
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative md:text-center">
                <div className="flex md:block items-center">
                  <div className="z-10 flex items-center justify-center w-8 h-8 bg-[#FF5B7F] text-white rounded-full relative left-0 md:left-1/2 md:-ml-4 md:mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-white ml-6 md:ml-0">Click & Explore</h3>
                </div>
                <div className="pl-14 md:pl-0 md:px-4 mt-2 text-gray-300">
                  Dive deeper with interactive elements and discover related topics.
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative md:text-center">
                <div className="flex md:block items-center">
                  <div className="z-10 flex items-center justify-center w-8 h-8 bg-wonder-teal text-white rounded-full relative left-0 md:left-1/2 md:-ml-4 md:mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-white ml-6 md:ml-0">See It in Action!</h3>
                </div>
                <div className="pl-14 md:pl-0 md:px-4 mt-2 text-gray-300">
                  Visualize concepts with AI-generated images and illustrations.
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="relative md:text-center">
                <div className="flex md:block items-center">
                  <div className="z-10 flex items-center justify-center w-8 h-8 bg-wonder-yellow text-white rounded-full relative left-0 md:left-1/2 md:-ml-4 md:mb-4">
                    4
                  </div>
                  <h3 className="text-xl font-bold text-white ml-6 md:ml-0">Test Your Knowledge</h3>
                </div>
                <div className="pl-14 md:pl-0 md:px-4 mt-2 text-gray-300">
                  Take interactive quizzes to reinforce learning with immediate feedback.
                </div>
              </div>
              
              {/* Step 5 */}
              <div className="relative md:text-center">
                <div className="flex md:block items-center">
                  <div className="z-10 flex items-center justify-center w-8 h-8 bg-wonder-blue text-white rounded-full relative left-0 md:left-1/2 md:-ml-4 md:mb-4">
                    5
                  </div>
                  <h3 className="text-xl font-bold text-white ml-6 md:ml-0">Earn Points & Rewards</h3>
                </div>
                <div className="pl-14 md:pl-0 md:px-4 mt-2 text-gray-300">
                  Get certificates and achievements to celebrate learning milestones.
                </div>
              </div>
            </div>
            
            {/* Demo example */}
            <div className="mt-20 bg-[#0F0F2E] rounded-2xl border border-wonder-purple/20 overflow-hidden shadow-2xl max-w-3xl mx-auto">
              <div className="px-6 py-4 bg-[#0D0D26] flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-gray-300 text-sm">WonderWhiz Chat</div>
                <div></div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start mb-6">
                  <div className="flex-shrink-0 bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center text-lg">
                    👧
                  </div>
                  <div className="ml-4 bg-gray-700 rounded-2xl rounded-tl-none px-4 py-3 text-white max-w-sm">
                    <p>How do volcanoes work?</p>
                  </div>
                </div>
                
                <div className="flex items-start mb-6">
                  <div className="flex-shrink-0 bg-wonder-purple rounded-full w-10 h-10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 bg-wonder-purple/90 rounded-2xl rounded-tl-none px-4 py-3 text-white max-w-md">
                    <p>Volcanoes are like Earth's pressure valves! Imagine hot liquid rock (magma) under the Earth's crust trying to escape. When it finds a weak spot—BOOM! The magma, now called lava, bursts through creating mountains that can explode dramatically! Want to see what's happening inside?</p>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button className="bg-white/20 hover:bg-white/30 rounded-full px-3 py-1 text-sm transition-colors">
                        See inside a volcano
                      </button>
                      <button className="bg-white/20 hover:bg-white/30 rounded-full px-3 py-1 text-sm transition-colors">
                        Types of volcanoes
                      </button>
                      <button className="bg-white/20 hover:bg-white/30 rounded-full px-3 py-1 text-sm transition-colors">
                        Famous eruptions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-[#0B0B1A]/70 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Parents & Educators Are Already Raving About WonderWhiz!
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              See what real people are saying about their experience with WonderWhiz.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white/5 backdrop-blur-sm border border-wonder-purple/10 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-wonder-purple/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">👩‍👦</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-bold">Sarah T.</h4>
                  <p className="text-gray-400 text-sm">Parent of 8-year-old</p>
                </div>
              </div>
              <p className="text-gray-300">"My son used to dread learning, but now he can't wait to chat with WonderWhiz! He's asking questions I never thought he'd be interested in—from dinosaurs to outer space. It's amazing to see his curiosity explode!"</p>
              <div className="mt-4 flex">
                <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white/5 backdrop-blur-sm border border-wonder-purple/10 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-wonder-teal/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">👨‍🏫</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-bold">Michael R.</h4>
                  <p className="text-gray-400 text-sm">Elementary Teacher</p>
                </div>
              </div>
              <p className="text-gray-300">"As a teacher with 25 students, it's impossible to give everyone individual attention. WonderWhiz helps by providing personalized learning paths for each child. It's like having a teaching assistant who never gets tired!"</p>
              <div className="mt-4 flex">
                <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white/5 backdrop-blur-sm border border-wonder-purple/10 rounded-2xl p-6">
              <div className
