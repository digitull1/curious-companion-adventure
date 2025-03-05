
import React, { useRef, useEffect } from "react";
import { animate } from "@motionone/dom";
import { Award, Sparkles, Download, Share2 } from "lucide-react";
import { launchConfetti } from "@/utils/confetti";

interface LearningCertificateProps {
  topic: string;
  userName?: string;
  date?: string;
  onClose: () => void;
}

const LearningCertificate: React.FC<LearningCertificateProps> = ({ 
  topic, 
  userName = "Explorer", 
  date = new Date().toLocaleDateString(),
  onClose
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (certificateRef.current) {
      animate(
        certificateRef.current,
        { opacity: [0, 1], scale: [0.8, 1] },
        { duration: 0.6, easing: [0.25, 1, 0.5, 1] }
      );
      
      // Launch confetti for celebration
      setTimeout(() => {
        launchConfetti();
      }, 300);
    }
  }, []);
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        ref={certificateRef}
        className="bg-white rounded-xl p-1 shadow-magical max-w-2xl w-full max-h-[90vh] overflow-auto"
      >
        <div className="border-4 border-wonder-purple/20 rounded-lg p-8 relative overflow-hidden bg-gradient-to-b from-white to-wonder-purple/5">
          {/* Certificate header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <div className="bg-wonder-purple/10 p-3 rounded-full">
                <Award className="h-12 w-12 text-wonder-purple" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-wonder-purple">Certificate of Achievement</h2>
            <p className="text-muted-foreground">WonderWhiz Learning Adventure</p>
          </div>
          
          {/* Certificate content */}
          <div className="text-center mb-8">
            <p className="text-foreground mb-3">This certificate is proudly presented to</p>
            <h3 className="text-3xl font-bubbly text-wonder-purple-dark mb-3">{userName}</h3>
            <p className="text-foreground mb-6">for successfully completing</p>
            <div className="bg-wonder-purple/10 py-3 px-6 rounded-lg inline-block mb-6">
              <h4 className="text-xl font-bold text-wonder-purple">{topic}</h4>
            </div>
            <p className="text-foreground italic">
              "Learning is a treasure that will follow its owner everywhere."
            </p>
          </div>
          
          {/* Certificate footer */}
          <div className="flex justify-between items-center border-t border-wonder-purple/10 pt-6">
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 text-wonder-yellow mr-2" />
              <span className="text-sm text-muted-foreground">Issued on {date}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              WonderWhiz Learning Platform
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-radial from-wonder-purple/10 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-gradient-radial from-wonder-yellow/10 to-transparent rounded-full translate-x-1/4 translate-y-1/4"></div>
          
          {/* Certificate seal */}
          <div className="absolute bottom-12 right-12">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-wonder-purple/10 rounded-full"></div>
              <div className="absolute inset-2 border-2 border-wonder-purple/30 rounded-full flex items-center justify-center">
                <span className="text-xs text-wonder-purple font-medium">CERTIFIED</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-between items-center mt-4 px-4 pb-2">
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Close
          </button>
          
          <div className="flex gap-3">
            <button className="p-2 rounded-full bg-wonder-purple/10 text-wonder-purple hover:bg-wonder-purple/20 transition-colors">
              <Download className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full bg-wonder-purple/10 text-wonder-purple hover:bg-wonder-purple/20 transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningCertificate;
