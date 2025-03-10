
import React, { useState, useRef } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { showWaitlistSuccess } from "@/utils/confetti";
import { toast } from "@/components/ui/use-toast";

const WaitlistSection = () => {
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
    <section id="waitlist" className="py-24 relative z-10 bg-gradient-to-b from-[#0B0B1A] to-[#1A1A3A]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Join the WonderWhiz Waitlist
          </h2>
          <p className="text-gray-300 text-lg mb-10">
            Be among the first to experience the future of learning. Sign up now for exclusive early access and special founding member benefits!
          </p>
          
          <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row max-w-xl mx-auto gap-4">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address" 
              className="flex-grow px-4 py-3 rounded-lg bg-gray-800 border border-wonder-purple/30 text-white focus:outline-none focus:ring-2 focus:ring-wonder-purple/50"
              required
            />
            <button 
              type="submit" 
              disabled={isSubmitting || !isEmailValid}
              className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-all ${
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
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center text-gray-400 text-sm">
              <CheckCircle className="h-4 w-4 text-wonder-green mr-2" />
              <span>No spam, ever. Unsubscribe anytime.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitlistSection;
