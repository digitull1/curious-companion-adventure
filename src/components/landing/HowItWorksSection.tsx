
import React from "react";
import { Sparkles } from "lucide-react";

const HowItWorksSection = () => {
  return (
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
  );
};

export default HowItWorksSection;
