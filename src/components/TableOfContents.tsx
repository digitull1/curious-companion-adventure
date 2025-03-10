
import React from "react";

interface TableOfContentsProps {
  sections: string[];
  completedSections: string[];
  currentSection: string | null;
  onSectionClick: (section: string) => void;
  progress: number;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  sections,
  completedSections,
  currentSection,
  onSectionClick,
  progress,
}) => {
  console.log("[TableOfContents] Rendering with:", {
    sectionsCount: sections.length,
    sections,
    completedSections,
    currentSection,
    progress
  });

  if (!sections || sections.length === 0) {
    console.log("[TableOfContents] No sections provided, not rendering");
    return null;
  }

  return (
    <div className="table-of-contents">
      <h2 className="text-lg font-bold">Table of Contents</h2>
      <ul className="list-disc pl-5">
        {sections.map((section, index) => (
          <li 
            key={index} 
            className={`cursor-pointer ${completedSections.includes(section) ? 'line-through' : ''} ${currentSection === section ? 'font-bold text-wonder-purple' : ''}`} 
            onClick={() => onSectionClick(section)}
          >
            {section}
          </li>
        ))}
      </ul>
      <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-wonder-purple rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
};

export default TableOfContents;
