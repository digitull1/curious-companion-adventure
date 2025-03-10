
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import components
import Header from "@/components/landing/Header";
import StarBackground from "@/components/landing/StarBackground";
import ScrollToTopButton from "@/components/landing/ScrollToTopButton";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import WaitlistSection from "@/components/landing/WaitlistSection";
import Footer from "@/components/landing/Footer";

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
    <div className="relative">
      {/* Background and fixed elements */}
      <StarBackground />
      <ScrollToTopButton />
      
      {/* Header */}
      <Header />
      
      {/* Main content sections */}
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <WaitlistSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
