
import { useCallback } from "react";
import { Message } from "@/types/chat";

export const useSectionHandling = (
  messages: Message[],
  selectedTopic: string | null,
  completedSections: string[],
  processMessage: (prompt: string, isUserMessage?: boolean, skipUserMessage?: boolean) => Promise<void>,
  setCurrentSection: (section: string | null) => void,
  setCompletedSections: (sectionsSetter: (prev: string[]) => string[]) => void,
  setPoints: (pointsSetter: (prev: number) => number) => void,
  setLearningProgress: (progress: number) => void
) => {
  // Handle TOC section click
  const handleTocSectionClick = useCallback((section: string) => {
    // If clicking on the same section that's already current, don't do anything
    if (section === messages.find(m => m.tableOfContents)?.tableOfContents?.find(
      s => s.toLowerCase() === section.toLowerCase()
    )) {
      console.log("Same section clicked, ignoring:", section);
      return;
    }
    
    console.log("Clicked TOC section:", section);
    
    // Set the current section immediately for a more responsive feel
    setCurrentSection(section);
    
    // Check if this section is in the TOC
    const matchedSection = messages.find(m => m.tableOfContents)?.tableOfContents?.find(
      s => s.toLowerCase() === section.toLowerCase()
    );

    if (matchedSection) {
      // If not already completed, mark as completed
      if (!completedSections.includes(matchedSection)) {
        console.log("Marking section as completed:", matchedSection);
        setCompletedSections(prev => [...prev, matchedSection]);
        
        // Add more points for completing a section
        setPoints(prev => prev + 15);
        
        // Update learning progress
        const totalSections = messages.find(m => m.tableOfContents)?.tableOfContents?.length || 5;
        const newProgress = Math.min(100, 10 + (completedSections.length + 1) * (90 / totalSections));
        setLearningProgress(newProgress);
      }
    }
    
    // Process the section request directly, skipping the user message display
    processMessage(`Tell me about "${section}" in detail`, false, true);
  }, [messages, completedSections, setCurrentSection, setCompletedSections, setPoints, setLearningProgress, processMessage]);

  // Handle related topic click
  const handleRelatedTopicClick = useCallback((topic: string) => {
    console.log("Clicked related topic:", topic);
    
    // Process the related topic as a new user message
    processMessage(`Tell me about ${topic}`, true);
  }, [processMessage]);

  return {
    handleTocSectionClick,
    handleRelatedTopicClick
  };
};
