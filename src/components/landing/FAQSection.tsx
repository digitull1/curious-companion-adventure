
import React from "react";

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Got questions? We've got answers!
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-6">
          {/* FAQ Item 1 */}
          <div className="bg-white/5 backdrop-blur-sm border border-wonder-purple/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">Is WonderWhiz safe for my child?</h3>
            <p className="text-gray-300">Absolutely! Safety is our top priority. WonderWhiz is fully COPPA compliant, with built-in content filtering and age-appropriate responses. Parents can monitor all interactions and set custom safety guardrails.</p>
          </div>
          
          {/* FAQ Item 2 */}
          <div className="bg-white/5 backdrop-blur-sm border border-wonder-purple/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">What age range is WonderWhiz designed for?</h3>
            <p className="text-gray-300">WonderWhiz is perfect for curious minds ages 5-13. The AI automatically adjusts its language and content complexity based on the child's age and learning level, growing with them as they advance.</p>
          </div>
          
          {/* FAQ Item 3 */}
          <div className="bg-white/5 backdrop-blur-sm border border-wonder-purple/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">How does WonderWhiz handle privacy?</h3>
            <p className="text-gray-300">We take privacy seriously! We collect minimal personal information, never sell data to third parties, and employ enterprise-grade encryption. Parents have full control over data retention and can request deletion at any time.</p>
          </div>
          
          {/* FAQ Item 4 */}
          <div className="bg-white/5 backdrop-blur-sm border border-wonder-purple/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">Can WonderWhiz replace traditional learning?</h3>
            <p className="text-gray-300">WonderWhiz is designed to complement traditional education, not replace it. It's an incredible supplementary tool that reinforces school lessons while encouraging curiosity beyond the curriculum.</p>
          </div>
          
          {/* FAQ Item 5 */}
          <div className="bg-white/5 backdrop-blur-sm border border-wonder-purple/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">When will WonderWhiz be available?</h3>
            <p className="text-gray-300">WonderWhiz is currently in private beta. Sign up for the waitlist to be notified when we launch! Early waitlist members will receive special early access and founding member benefits.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
