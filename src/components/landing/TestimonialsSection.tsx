
import React from "react";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  return (
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
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-wonder-blue/20 rounded-full flex items-center justify-center">
                <span className="text-xl">👩‍💻</span>
              </div>
              <div className="ml-4">
                <h4 className="text-white font-bold">Jennifer L.</h4>
                <p className="text-gray-400 text-sm">Education Technologist</p>
              </div>
            </div>
            <p className="text-gray-300">"This is what AI in education should look like! WonderWhiz balances fun with educational value perfectly. Kids don't even realize they're learning because they're having so much fun exploring new topics."</p>
            <div className="mt-4 flex">
              <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
              <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
              <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
              <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
              <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
