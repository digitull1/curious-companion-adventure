
import React from "react";
import WonderWhizLogo from "@/components/WonderWhizLogo";

const Header = () => {
  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
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
            onClick={scrollToWaitlist}
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
  );
};

export default Header;
