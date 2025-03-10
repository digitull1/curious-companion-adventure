
import React from "react";
import WonderWhizLogo from "@/components/WonderWhizLogo";

const Footer = () => {
  return (
    <footer className="py-12 bg-[#08081A] relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <WonderWhizLogo size="md" />
          
          <div className="mt-6 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} WonderWhiz, Inc. All rights reserved.
            </p>
            
            <div className="mt-4 md:mt-0">
              <p className="text-gray-500 text-sm">
                Building the future of learning with AI
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
