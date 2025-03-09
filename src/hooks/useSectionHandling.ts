
import { Message, MessageProcessingResult } from "@/types/chat";
import { BlockType } from "@/components/LearningBlock";
import { toast } from "sonner";

interface SectionHandlingProps {
  handleTocSectionClick: (section: string) => void;
  handleRelatedTopicClick: (topic: string) => void;
  handleBlockClick: (type: BlockType, messageId: string, messageText: string) => void;
}

// Module-level variable to track section processing
let isSectionBeingProcessed = false;
let currentSectionId = '';

export const useSectionHandling = (
  messages: Message[],
  selectedTopic: string | null,
  completedSections: string[],
  processMessage: (prompt: string, isUserMessage?: boolean, skipUserMessage?: boolean) => Promise<MessageProcessingResult>,
  setCurrentSection: (section: string | null) => void,
  setCompletedSections: (sectionsSetter: (prev: string[]) => string[]) => void,
  setPoints: (pointsSetter: (prev: number) => number) => void,
  setLearningProgress: (progressSetter: (prev: number) => number) => void,
  handleBlockClick: (type: BlockType, messageId: string, messageText: string) => void
): SectionHandlingProps => {
  
  const handleTocSectionClick = async (section: string) => {
    const sectionId = `section-${Date.now()}`;
    currentSectionId = sectionId;
    
    console.log(`[SectionHandling][START:${sectionId}] Table of Contents section clicked: ${section}`);
    
    // Prevent multiple concurrent section processing
    if (isSectionBeingProcessed) {
      console.log(`[SectionHandling][${sectionId}] Already processing another section, ignoring this request`);
      toast.info("Please wait while the current section loads");
      return;
    }
    
    isSectionBeingProcessed = true;
    
    if (!selectedTopic) {
      console.warn(`[SectionHandling][${sectionId}] No topic selected, cannot process section click.`);
      isSectionBeingProcessed = false;
      return;
    }

    // Check if the section is already completed
    if (completedSections.includes(section)) {
      console.log(`[SectionHandling][${sectionId}] Section "${section}" already completed. Showing existing content.`);
      setCurrentSection(section);
      isSectionBeingProcessed = false;
      return;
    }

    // Special handling for completion buttons
    if (section === "Generate more content" || section === "Explore other topics") {
      console.log(`[SectionHandling][${sectionId}] Special section clicked: ${section}`);
      processMessage(section, false, true);
      isSectionBeingProcessed = false;
      return;
    }

    // Mark the current section immediately to prevent double-processing
    console.log(`[SectionHandling][${sectionId}] Setting current section to: ${section}`);
    setCurrentSection(section);

    const sectionPrompt = `Explain the section "${section}" from the topic "${selectedTopic}" in detail.`;
    console.log(`[SectionHandling][${sectionId}] Sending section prompt: ${sectionPrompt.substring(0, 50)}...`);
    
    try {
      const result = await processMessage(sectionPrompt, false, true);
      console.log(`[SectionHandling][${sectionId}] Section process result status: ${result.status}`);
      
      // Check if this operation is still relevant
      if (currentSectionId !== sectionId) {
        console.log(`[SectionHandling][${sectionId}] Operation superseded by newer request, not updating state`);
        return;
      }
      
      if (result.status === "completed") {
        // Update completed sections and learning progress
        setCompletedSections(prevSections => {
          if (!prevSections.includes(section)) {
            console.log(`[SectionHandling][${sectionId}] Marking section "${section}" as completed.`);
            return [...prevSections, section];
          }
          return prevSections;
        });

        setLearningProgress(prevProgress => {
          const toc = messages.find(m => m.tableOfContents)?.tableOfContents || [];
          const increment = toc.length > 0 ? (100 / toc.length) : 10;
          const newProgress = Math.min(100, prevProgress + increment);
          console.log(`[SectionHandling][${sectionId}] Updating learning progress: ${newProgress}% (increment: ${increment}, total sections: ${toc.length})`);
          return newProgress;
        });

        setPoints(prevPoints => {
          console.log(`[SectionHandling][${sectionId}] Awarding points for completing section: +5 (current: ${prevPoints})`);
          return prevPoints + 5;
        });
      } else {
        console.error(`[SectionHandling][${sectionId}] Error processing section message:`, result.error);
        toast.error("There was an error loading this section. Please try again.");
      }
    } catch (error) {
      console.error(`[SectionHandling][${sectionId}] Error processing section message:`, error);
      toast.error("There was an error loading this section. Please try again.");
    } finally {
      console.log(`[SectionHandling][${sectionId}][END] Finished processing section: ${section}`);
      // Release the processing lock after a short delay to prevent immediate re-clicks
      setTimeout(() => {
        if (currentSectionId === sectionId) {
          isSectionBeingProcessed = false;
          console.log(`[SectionHandling][${sectionId}] Released section processing lock`);
        } else {
          console.log(`[SectionHandling][${sectionId}] Not releasing lock as this operation is no longer active`);
        }
      }, 500);
    }
  };

  const handleRelatedTopicClick = (topic: string) => {
    console.log(`[SectionHandling] Related topic clicked: ${topic}`);
    processMessage(`Tell me about ${topic}`, false, true);
  };
  
  const handleBlockClickWrapper = (type: BlockType, messageId: string, messageText: string) => {
    console.log(`[SectionHandling] Block clicked: ${type} from message ${messageId}`);
    handleBlockClick(type, messageId, messageText);
  };

  return {
    handleTocSectionClick,
    handleRelatedTopicClick,
    handleBlockClick: handleBlockClickWrapper
  };
};
