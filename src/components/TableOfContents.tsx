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
          <li key={index} className={`cursor-pointer ${completedSections.includes(section) ? 'line-through' : ''}`} onClick={() => onSectionClick(section)}>
            {section}
          </li>
        ))}
      </ul>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default TableOfContents;
