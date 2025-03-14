
import { Message, MessageProcessingResult } from "@/types/chat";

interface SectionHandlingProps {
  handleTocSectionClick: (section: string) => void;
  handleRelatedTopicClick: (topic: string) => void;
}

export const useSectionHandling = (
  messages: Message[],
  selectedTopic: string | null,
  completedSections: string[],
  processMessage: (prompt: string, isUserMessage?: boolean, skipUserMessage?: boolean) => Promise<MessageProcessingResult>,
  setCurrentSection: (section: string | null) => void,
  setCompletedSections: (sectionsSetter: (prev: string[]) => string[]) => void,
  setPoints: (pointsSetter: (prev: number) => number) => void,
  setLearningProgress: (progressSetter: (prev: number) => number) => void
): SectionHandlingProps => {
  const handleTocSectionClick = (section: string) => {
    console.log(`[SectionHandling] Table of Contents section clicked: ${section}`);
    
    if (!selectedTopic) {
      console.warn("[SectionHandling] No topic selected, cannot process section click.");
      return;
    }

    // Check if the section is already completed
    if (completedSections.includes(section)) {
      console.log(`[SectionHandling] Section "${section}" already completed. Showing existing content.`);
      setCurrentSection(section);
      return;
    }

    // Special handling for completion buttons
    if (section === "Generate more content" || section === "Explore other topics") {
      console.log(`[SectionHandling] Special section clicked: ${section}`);
      processMessage(section, false, true);
      return;
    }

    // Mark the current section immediately to prevent double-processing
    setCurrentSection(section);

    const sectionPrompt = `Explain the section "${section}" from the topic "${selectedTopic}" in detail.`;
    console.log(`[SectionHandling] Sending section prompt: ${sectionPrompt.substring(0, 50)}...`);
    
    processMessage(sectionPrompt, false, true)
      .then((result) => {
        console.log(`[SectionHandling] Section process result status: ${result.status}`);
        if (result.status === "completed") {
          // Update completed sections and learning progress
          setCompletedSections(prevSections => {
            if (!prevSections.includes(section)) {
              console.log(`[SectionHandling] Marking section "${section}" as completed.`);
              return [...prevSections, section];
            }
            return prevSections;
          });

          setLearningProgress(prevProgress => {
            const toc = messages.find(m => m.tableOfContents)?.tableOfContents || [];
            const increment = toc.length > 0 ? (100 / toc.length) : 10;
            const newProgress = Math.min(100, prevProgress + increment);
            console.log(`[SectionHandling] Updating learning progress: ${newProgress}% (increment: ${increment}, total sections: ${toc.length})`);
            return newProgress;
          });

          setPoints(prevPoints => {
            console.log(`[SectionHandling] Awarding points for completing section: +5 (current: ${prevPoints})`);
            return prevPoints + 5;
          });
        } else {
          console.error("[SectionHandling] Error processing section message:", result.error);
        }
      })
      .catch(error => {
        console.error("[SectionHandling] Error processing section message:", error);
      });
  };

  const handleRelatedTopicClick = (topic: string) => {
    console.log(`[SectionHandling] Related topic clicked: ${topic}`);
    processMessage(`Tell me about ${topic}`, false, true);
  };

  return {
    handleTocSectionClick,
    handleRelatedTopicClick
  };
};
