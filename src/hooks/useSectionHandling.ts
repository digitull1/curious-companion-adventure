
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
      console.log(`[SectionHandling] Section "${section}" already completed. Skipping.`);
      return;
    }

    // Mark the current section
    setCurrentSection(section);

    const sectionPrompt = `Explain the section "${section}" from the topic "${selectedTopic}" in detail.`;
    processMessage(sectionPrompt, false)
      .then((result) => {
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
            const newProgress = Math.min(100, prevProgress + (100 / (messages.length + 1)));
            console.log(`[SectionHandling] Updating learning progress: ${newProgress}%`);
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
    processMessage(`Tell me about ${topic}`, false);
  };

  return {
    handleTocSectionClick,
    handleRelatedTopicClick
  };
};
