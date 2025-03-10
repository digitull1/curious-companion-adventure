
import React, { useEffect } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTopButton = () => {
  useEffect(() => {
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
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <button
      id="scrollToTopBtn"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-wonder-purple text-white flex items-center justify-center shadow-magical z-50 opacity-0 transition-opacity duration-300"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};

export default ScrollToTopButton;
