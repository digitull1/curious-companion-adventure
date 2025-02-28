
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import WonderWhizLogo from "@/components/WonderWhizLogo";
import { BookOpen, Brain, Lightbulb, Sparkles, Star } from "lucide-react";

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
          <div className="magical-orb w-[500px] h-[500px] top-[-200px] right-[-200px]"></div>
          <div className="magical-orb w-[400px] h-[400px] bottom-[-150px] left-[-150px]" 
               style={{animationDelay: '2s'}}></div>
          
          {/* Smaller floating particles */}
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-gradient-wonder opacity-10 animate-float"
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
          <div className="mb-12 inline-block relative">
            <div className="animate-glow absolute inset-0 rounded-full blur-xl opacity-50"></div>
            <WonderWhizLogo size="xl" />
          </div>
          
          {/* Headline with enhanced typography and animation */}
          <h1 className="text-6xl font-bold mb-6 leading-tight tracking-tight relative">
            <span className="text-gradient-purple">Where </span>
            <span className="text-gradient-wonder relative inline-block">
              Curiosity
              <Sparkles className="absolute -top-6 -right-5 h-5 w-5 text-wonder-yellow animate-pulse-soft" />
            </span>
            <span className="text-gradient-purple"> Meets </span>
            <span className="text-gradient-teal">AI</span>
          </h1>
          
          {/* Subheading with refined copywriting */}
          <p className="text-xl text-muted-foreground mb-10 mx-auto max-w-2xl leading-relaxed">
            An AI-powered learning companion designed with the elegance of Apple
            and the magic of Pixar, making education an extraordinary adventure for curious minds.
          </p>
          
          {/* Primary action button with enhanced styling */}
          <div className="relative inline-block group mb-16">
            {/* Button highlight/glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-wonder rounded-full opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <button
              onClick={() => navigate("/onboarding")}
              className="relative btn-wonder group px-10 py-5 text-lg rounded-full"
            >
              <span className="relative z-10 inline-flex items-center">
                Begin Your Adventure
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
            <h2 className="text-4xl font-bold mb-4 text-gradient-wonder inline-flex items-center">
              <Lightbulb className="h-8 w-8 mr-3 text-wonder-yellow" />
              Designed for Young Minds
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Crafted with the design principles that made Apple products magical,
              and the storytelling touch that brings Pixar characters to life
            </p>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-wonder rounded-full"></div>
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
                <h3 className="text-2xl font-bold mb-3 text-foreground">Adaptive Learning</h3>
                <p className="text-muted-foreground leading-relaxed flex-grow">
                  AI that understands each child's unique learning style and adapts content to match their pace and interests
                </p>
                <div className="mt-4 h-12 flex items-center justify-center">
                  <div className="w-16 h-[3px] rounded-full bg-gradient-wonder opacity-40"></div>
                </div>
              </div>
            </div>
            
            <div className="feature-card opacity-0" style={{transitionDelay: '0.2s'}}>
              <div className="flex flex-col items-center text-center h-full">
                <div className="illustration-container mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-wonder-teal/10 flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-wonder-teal" />
                  </div>
                  <div className="illustration-shadow"></div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Visual Exploration</h3>
                <p className="text-muted-foreground leading-relaxed flex-grow">
                  Breathtaking visuals that bring complex concepts to life, inspired by Pixar's attention to detail and wonder
                </p>
                <div className="mt-4 h-12 flex items-center justify-center">
                  <div className="w-16 h-[3px] rounded-full bg-gradient-wonder opacity-40"></div>
                </div>
              </div>
            </div>
            
            <div className="feature-card opacity-0" style={{transitionDelay: '0.3s'}}>
              <div className="flex flex-col items-center text-center h-full">
                <div className="illustration-container mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-wonder-coral/10 flex items-center justify-center">
                    <Star className="h-10 w-10 text-wonder-coral" />
                  </div>
                  <div className="illustration-shadow"></div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Magical Interactions</h3>
                <p className="text-muted-foreground leading-relaxed flex-grow">
                  Delightful, responsive UI with micro-animations that create moments of joy and discovery in every interaction
                </p>
                <div className="mt-4 h-12 flex items-center justify-center">
                  <div className="w-16 h-[3px] rounded-full bg-gradient-wonder opacity-40"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial/showcase section with Apple-like minimal design */}
      <section className="relative bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium text-wonder-purple uppercase tracking-wider mb-4">Trusted by Parents & Educators</p>
          <h2 className="text-3xl font-bold mb-8">
            "WonderWhiz transforms learning from a <span className="text-gradient-wonder">task</span> into an <span className="text-gradient-wonder">adventure</span>"
          </h2>
          
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-12">
            <div className="w-32 h-20 bg-muted/30 rounded-lg flex items-center justify-center">
              <p className="font-bold text-muted-foreground">EdTech Monthly</p>
            </div>
            <div className="w-32 h-20 bg-muted/30 rounded-lg flex items-center justify-center">
              <p className="font-bold text-muted-foreground">Parent Choice</p>
            </div>
            <div className="w-32 h-20 bg-muted/30 rounded-lg flex items-center justify-center">
              <p className="font-bold text-muted-foreground">Kid's Tech</p>
            </div>
            <div className="w-32 h-20 bg-muted/30 rounded-lg flex items-center justify-center">
              <p className="font-bold text-muted-foreground">Future Learn</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA section with premium aesthetic */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-wonder-background to-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="magical-orb w-[600px] h-[600px] top-[-300px] left-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to <span className="text-gradient-wonder">Wonder</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands of young explorers discovering the joy of learning with WonderWhiz
          </p>
          
          <button
            onClick={() => navigate("/onboarding")}
            className="btn-wonder text-lg px-12 py-5"
          >
            Start Free
          </button>
          
          <p className="mt-6 text-sm text-muted-foreground">No credit card required</p>
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
