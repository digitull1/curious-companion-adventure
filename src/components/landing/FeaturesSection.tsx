
import React from "react";
import { 
  MessageCircle, 
  Sparkles, 
  Star, 
  Trophy, 
  Brain, 
  Lock,
  Rocket 
} from "lucide-react";

const FeaturesSection = () => {
  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
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
            onClick={scrollToWaitlist}
            className="px-8 py-3 bg-white text-wonder-purple font-medium rounded-full transform transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center mx-auto"
          >
            <Rocket className="mr-2 h-5 w-5" />
            <span>Join the Waitlist – Be the First to Try It!</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
