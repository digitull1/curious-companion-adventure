
import React from "react";
import { Star, Award, Download } from "lucide-react";

interface CertificateProps {
  name: string;
  topic: string;
  points: number;
  onDownload?: () => void;
}

const Certificate: React.FC<CertificateProps> = ({ name, topic, points, onDownload }) => {
  return (
    <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-xl shadow-wonder-lg animate-fade-in">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      <div className="relative bg-white rounded-lg p-6 border-dashed border-2 border-purple-300">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-wonder-purple">Certificate of Achievement</h3>
            <p className="text-muted-foreground text-sm">WonderWhiz Learning Program</p>
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-wonder-yellow fill-wonder-yellow" />
            ))}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">This certificate is proudly presented to</p>
          <h2 className="text-2xl font-bold mt-1 mb-2 text-wonder-purple">{name}</h2>
          <p className="text-muted-foreground">for successfully completing</p>
          <h3 className="text-xl font-semibold my-2">"{topic}"</h3>
          <p className="text-sm text-muted-foreground">Earning {points} learning points</p>
        </div>
        
        <div className="mt-5 flex justify-center">
          <div className="rounded-full p-3 bg-wonder-purple/10">
            <Award className="h-10 w-10 text-wonder-purple" />
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Certified by the WonderWhiz Educational Team
        </div>
        
        {onDownload && (
          <button 
            onClick={onDownload}
            className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-wonder-purple text-white hover:bg-wonder-purple-dark transition-colors"
          >
            <Download className="h-4 w-4" />
            Download Certificate
          </button>
        )}
      </div>
    </div>
  );
};

export default Certificate;
