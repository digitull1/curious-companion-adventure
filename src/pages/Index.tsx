
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import WonderWhizLogo from "@/components/WonderWhizLogo";
import { Award, BookOpen, Brain, CheckCircle, Lightbulb, Sparkles, Star, Trophy } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresSectionRef = useRef<HTMLDivElement>(null);
  
  // Check if user has already completed onboarding
  useEffect(() => {
    const ageRange = localStorage.getItem("wonderwhiz_age_range");
    const avatar = localStorage.getItem("wonderwhiz_avatar");
    
    if (ageRange && avatar) {
      // User has already onboarded, take them to chat
      navigate("/chat");
    }
  }, [navigate]);
  
  // Add mouse movement effect for a subtle parallax on the hero section
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate the position of the mouse as a percentage of the window
      const percentX = clientX / innerWidth;
      const percentY = clientY / innerHeight;
      
      // Calculate the offset for different elements based on the mouse position
      // This creates a subtle parallax effect
      const orbs = heroRef.current.querySelectorAll('.magical-orb');
      orbs.forEach((orb, index) => {
        const speedFactor = 0.03 + (index * 0.01);
        const xOffset = (percentX - 0.5) * 100 * speedFactor; 
        const yOffset = (percentY - 0.5) * 100 * speedFactor;
        (orb as HTMLElement).style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      });
      
      // Move the sparkles in the opposite direction for contrast
      const sparkles = heroRef.current.querySelectorAll('.sparkle');
      sparkles.forEach((sparkle, index) => {
        const speedFactor = 0.02 + (index * 0.005);
        const xOffset = (0.5 - percentX) * 100 * speedFactor; 
        const yOffset = (0.5 - percentY) * 100 * speedFactor;
        (sparkle as HTMLElement).style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Add intersection observer for animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card) => {
      observer.observe(card);
      // Initially hide the cards
      card.classList.add('opacity-0');
    });
    
    return () => {
      featureCards.forEach((card) => {
        observer.unobserve(card);
      });
    };
  }, []);
  
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-wonder-background via-white to-wonder-background relative">
      {/* Hero Section with enhanced visual magic */}
      <section 
        ref={heroRef} 
        className="relative min-h-screen flex items-center justify-center overflow-hidden py-20"
      >
        {/* Animated background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large magical orbs with parallax effect */}
          <div className="magical-orb w-[500px] h-[500px] top-[-200px] right-[-200px] bg-gradient-fun"></div>
          <div className="magical-orb w-[400px] h-[400px] bottom-[-150px] left-[-150px] bg-gradient-rainbow" 
               style={{animationDelay: '2s'}}></div>
          
          {/* Smaller floating particles */}
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-gradient-fun opacity-10 animate-float"
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
          
          {/* Sparkle elements */}
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="sparkle"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Enhanced logo with glowing effects */}
          <div className="mb-8 inline-block relative">
            <div className="animate-glow absolute inset-0 rounded-full blur-xl opacity-50"></div>
            <WonderWhizLogo size="xl" />
          </div>
          
          {/* Award badges */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full pl-1 pr-3 py-1 shadow-wonder">
              <div className="award-badge w-6 h-6 mr-2">
                <div className="award-badge-content text-wonder-purple">
                  <Trophy className="h-3 w-3" />
                </div>
              </div>
              <span className="text-xs font-medium">Educational Excellence Award</span>
            </div>
            
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full pl-1 pr-3 py-1 shadow-wonder">
              <div className="award-badge w-6 h-6 mr-2">
                <div className="award-badge-content text-wonder-teal">
                  <Award className="h-3 w-3" />
                </div>
              </div>
              <span className="text-xs font-medium">IB Curriculum Certified</span>
            </div>
          </div>
          
          {/* Headline with enhanced typography and animation */}
          <h1 className="text-6xl font-bold mb-4 leading-tight tracking-tight relative">
            <span className="text-gradient-purple">Where </span>
            <span className="text-gradient-wonder relative inline-block">
              Curiosity
              <Sparkles className="absolute -top-6 -right-5 h-5 w-5 text-wonder-yellow animate-pulse-soft" />
            </span>
            <span className="text-gradient-purple"> Meets </span>
            <span className="text-gradient-teal">AI</span>
          </h1>
          
          {/* Subheading with refined copywriting */}
          <p className="text-xl text-muted-foreground mb-6 mx-auto max-w-2xl leading-relaxed">
            An award-winning AI learning companion developed by leading IB educationalists 
            and child psychology PhDs from Cambridge University
          </p>
          
          {/* Reinforcing educational credentials */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-wonder-purple flex items-center shadow-sm">
              <CheckCircle className="h-3 w-3 mr-1" /> Age-appropriate
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-wonder-teal flex items-center shadow-sm">
              <CheckCircle className="h-3 w-3 mr-1" /> Gamified learning
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-wonder-blue flex items-center shadow-sm">
              <CheckCircle className="h-3 w-3 mr-1" /> Interactive quizzes
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-wonder-orange flex items-center shadow-sm">
              <CheckCircle className="h-3 w-3 mr-1" /> Visual explanations
            </div>
          </div>
          
          {/* Primary action button with enhanced styling */}
          <div className="relative inline-block group mb-16">
            {/* Button highlight/glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-rainbow opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <button
              onClick={() => navigate("/onboarding")}
              className="relative btn-wonder group px-10 py-5 text-lg rounded-full bg-gradient-rainbow"
            >
              <span className="relative z-10 inline-flex items-center">
                Begin Your Learning Adventure
                <Star className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:rotate-45" />
              </span>
            </button>
          </div>
          
          {/* Scroll indicator with animation */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-60">
            <div className="w-6 h-10 rounded-full border-2 border-wonder-purple flex items-start justify-center p-1">
              <div className="w-1.5 h-2.5 bg-wonder-purple rounded-full animate-levitate"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feature section with premium card design */}
      <section 
        ref={featuresSectionRef}
        className="relative py-24 px-6 bg-gradient-to-b from-white to-wonder-background overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          {/* Section heading with elegant design */}
          <div className="relative mb-16 text-center">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-rainbow bg-clip-text text-transparent inline-flex items-center">
              <Lightbulb className="h-8 w-8 mr-3 text-wonder-yellow" />
              Developed By Educational Experts
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our team of IB educationalists and Cambridge University child psychologists have
              created the ultimate learning tool for curious young minds
            </p>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-rainbow rounded-full"></div>
          </div>
          
          {/* Feature cards with premium styling */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card opacity-0" style={{transitionDelay: '0.1s'}}>
              <div className="flex flex-col items-center text-center h-full">
                <div className="illustration-container mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-wonder-purple/10 flex items-center justify-center">
                    <Brain className="h-10 w-10 text-wonder-purple" />
                  </div>
                  <div className="illustration-shadow"></div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Age-Appropriate Content</h3>
                <p className="text-muted-foreground leading-relaxed flex-grow">
                  Every interaction is tailored to your child's age (5-16), ensuring content is challenging yet accessible
                </p>
                <div className="mt-4 h-12 flex items-center justify-center">
                  <div className="point-counter">+25 Learning Points</div>
                </div>
              </div>
            </div>
            
            <div className="feature-card opacity-0" style={{transitionDelay: '0.2s'}}>
              <div className="flex flex-col items-center text-center h-full">
                <div className="illustration-container mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-wonder-blue/10 flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-wonder-blue" />
                  </div>
                  <div className="illustration-shadow"></div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Encyclopedia Approach</h3>
                <p className="text-muted-foreground leading-relaxed flex-grow">
                  Topics are broken down into digestible sections with a table of contents for deeper, focused exploration
                </p>
                <div className="mt-4 h-12 flex items-center justify-center">
                  <div className="achievement-unlock p-0.5">
                    <div className="achievement-content flex items-center justify-center gap-2">
                      <Trophy className="h-5 w-5 text-wonder-yellow" />
                      <span className="text-xs font-medium">Knowledge Explorer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="feature-card opacity-0" style={{transitionDelay: '0.3s'}}>
              <div className="flex flex-col items-center text-center h-full">
                <div className="illustration-container mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-wonder-green/10 flex items-center justify-center">
                    <Star className="h-10 w-10 text-wonder-green" />
                  </div>
                  <div className="illustration-shadow"></div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Interactive Quizzes</h3>
                <p className="text-muted-foreground leading-relaxed flex-grow">
                  Test understanding with engaging quizzes and earn certificates of completion that can be shared and printed
                </p>
                <div className="mt-4 h-12 flex items-center justify-center">
                  <div className="progress-track w-32">
                    <div className="progress-bar w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Learning path visualization */}
          <div className="mt-24 relative">
            <h3 className="text-3xl font-bold mb-10 text-center">Your Child's Learning Journey</h3>
            
            <div className="relative mx-auto max-w-3xl">
              <div className="learning-path-connector w-[calc(100%-40px)]"></div>
              
              <div className="flex justify-between">
                <div className="flex flex-col items-center gap-3">
                  <div className="learning-path-node">1</div>
                  <div className="text-center">
                    <h4 className="font-bold">Explore</h4>
                    <p className="text-sm text-muted-foreground">Ask questions on any topic</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-3">
                  <div className="learning-path-node">2</div>
                  <div className="text-center">
                    <h4 className="font-bold">Learn</h4>
                    <p className="text-sm text-muted-foreground">Dive deep with detailed topics</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-3">
                  <div className="learning-path-node">3</div>
                  <div className="text-center">
                    <h4 className="font-bold">Quiz</h4>
                    <p className="text-sm text-muted-foreground">Test your knowledge</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-3">
                  <div className="learning-path-node">4</div>
                  <div className="text-center">
                    <h4 className="font-bold">Achieve</h4>
                    <p className="text-sm text-muted-foreground">Earn certificates & rewards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* School endorsement section */}
      <section className="relative bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium text-wonder-purple uppercase tracking-wider mb-4">Trusted by Top International Schools</p>
          <h2 className="text-3xl font-bold mb-8">
            "WonderWhiz transforms learning from a <span className="bg-gradient-rainbow bg-clip-text text-transparent">task</span> into an <span className="bg-gradient-rainbow bg-clip-text text-transparent">adventure</span>"
          </h2>
          
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-12">
            <div className="w-32 h-20 bg-muted/30 rounded-lg flex items-center justify-center">
              <p className="font-bold text-muted-foreground">IB Schools</p>
            </div>
            <div className="w-32 h-20 bg-muted/30 rounded-lg flex items-center justify-center">
              <p className="font-bold text-muted-foreground">Cambridge Ed</p>
            </div>
            <div className="w-32 h-20 bg-muted/30 rounded-lg flex items-center justify-center">
              <p className="font-bold text-muted-foreground">EdTech Awards</p>
            </div>
            <div className="w-32 h-20 bg-muted/30 rounded-lg flex items-center justify-center">
              <p className="font-bold text-muted-foreground">Learning Lab</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Sample certificate showcase */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-wonder-background to-white overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Personalized Learning Achievements</h2>
            <p className="text-lg text-muted-foreground">Children earn custom certificates after mastering topics</p>
          </div>
          
          <div className="certificate max-w-2xl mx-auto">
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold bg-gradient-rainbow bg-clip-text text-transparent uppercase">Certificate of Achievement</h3>
              <p className="text-sm text-muted-foreground">Proudly presented to</p>
            </div>
            
            <div className="my-8 text-center">
              <p className="text-3xl font-bold text-wonder-purple">Emma Johnson</p>
              <div className="h-px w-48 mx-auto bg-wonder-purple/20 my-2"></div>
              <p className="text-sm text-muted-foreground">For successfully completing</p>
              <p className="text-xl font-medium text-foreground mt-1">The Solar System Explorer Challenge</p>
            </div>
            
            <div className="flex justify-between items-center mt-12">
              <div className="flex items-center gap-2">
                <div className="trophy">
                  <Trophy className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Achievement Points</p>
                  <p className="font-bold">250 pts</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-right text-muted-foreground">Date Completed</p>
                <p className="font-medium">June 15, 2023</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA section with premium aesthetic */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-wonder-background to-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="magical-orb w-[600px] h-[600px] top-[-300px] left-1/2 -translate-x-1/2 bg-gradient-rainbow"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to <span className="bg-gradient-rainbow bg-clip-text text-transparent">Wonder</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands of young explorers discovering the joy of learning with WonderWhiz
          </p>
          
          <button
            onClick={() => navigate("/onboarding")}
            className="btn-wonder text-lg px-12 py-5 bg-gradient-rainbow"
          >
            Start Your Child's Journey
          </button>
          
          <p className="mt-6 text-sm text-muted-foreground">Trusted by leading educators worldwide</p>
        </div>
      </section>
      
      {/* Footer with minimal Apple-like design */}
      <footer className="bg-white py-12 px-6 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <WonderWhizLogo size="md" />
            <p className="text-sm text-muted-foreground mt-2">© 2023 WonderWhiz. All rights reserved.</p>
          </div>
          
          <div className="flex gap-8">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
