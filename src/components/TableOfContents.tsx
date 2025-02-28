
import React from "react";
import { CheckCircle } from "lucide-react";

interface TableOfContentsProps {
  sections: string[];
  completedSections: string[];
  onSectionClick: (section: string) => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  sections, 
  completedSections,
  onSectionClick
}) => {
  return (
    <div className="mt-4 bg-white/80 rounded-xl p-5 shadow-wonder">
      <h3 className="font-bold text-lg mb-4 flex items-center">
        <span className="mr-2 text-wonder-purple">📚</span> 
        Table of Contents
      </h3>
      
      <div className="space-y-3">
        {sections.map((section, index) => (
          <button
            key={index}
            onClick={() => onSectionClick(section)}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-all ${
              completedSections.includes(section)
                ? "bg-wonder-purple/10 border border-wonder-purple/20"
                : "bg-white border border-gray-100 hover:border-wonder-purple/20 hover:bg-wonder-purple/5"
            }`}
          >
            <div className="flex items-center">
              <span className="bg-wonder-purple/10 text-wonder-purple w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">
                {index + 1}
              </span>
              <span className={completedSections.includes(section) ? "text-wonder-purple font-medium" : ""}>
                {section}
              </span>
            </div>
            
            {completedSections.includes(section) && (
              <CheckCircle className="h-4 w-4 text-wonder-purple" />
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        Click on any section to explore it in depth
      </div>
    </div>
  );
};

export default TableOfContents;
