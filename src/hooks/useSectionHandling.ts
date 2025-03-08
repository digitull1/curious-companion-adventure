
import { Message, MessageProcessingResult } from "@/types/chat";
import { toast } from "sonner";

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
  // Use this flag to prevent multiple section clicks from being processed simultaneously
  let isSectionBeingProcessed = false;
  
  const handleTocSectionClick = async (section: string) => {
    console.log(`[SectionHandling][START] Table of Contents section clicked: ${section}`);
    
    // Prevent multiple concurrent section processing
    if (isSectionBeingProcessed) {
      console.log(`[SectionHandling] Already processing another section, ignoring this request`);
      toast.info("Please wait while we prepare this section for you!");
      return;
    }
    
    isSectionBeingProcessed = true;
    
    if (!selectedTopic) {
      console.warn("[SectionHandling] No topic selected, cannot process section click.");
      toast.error("Oops! We couldn't load this section. Please try again.");
      isSectionBeingProcessed = false;
      return;
    }

    // Check if the section is already completed
    if (completedSections.includes(section)) {
      console.log(`[SectionHandling] Section "${section}" already completed. Showing existing content.`);
      setCurrentSection(section);
      toast.success(`Revisiting: ${section}`, {
        description: "You've already completed this section!"
      });
      isSectionBeingProcessed = false;
      return;
    }

    // Special handling for completion buttons
    if (section === "Generate more content" || section === "Explore other topics") {
      console.log(`[SectionHandling] Special section clicked: ${section}`);
      toast.info(section === "Generate more content" ? 
        "Generating more awesome content for you!" : 
        "Let's explore something new!");
      processMessage(section, false, true);
      isSectionBeingProcessed = false;
      return;
    }

    // Mark the current section immediately to prevent double-processing
    console.log(`[SectionHandling] Setting current section to: ${section}`);
    setCurrentSection(section);
    
    // Show a loading toast that will be dismissed when content is ready
    toast.loading(`Loading: ${section}`, {
      id: `section-${section}`,
      duration: 10000 // Will be dismissed when content loads
    });

    const sectionPrompt = `Explain the section "${section}" from the topic "${selectedTopic}" in detail.`;
    console.log(`[SectionHandling] Sending section prompt: ${sectionPrompt.substring(0, 50)}...`);
    
    try {
      const result = await processMessage(sectionPrompt, false, true);
      console.log(`[SectionHandling] Section process result status: ${result.status}`);
      
      // Dismiss the loading toast
      toast.dismiss(`section-${section}`);
      
      if (result.status === "completed") {
        // Update completed sections and learning progress
        setCompletedSections(prevSections => {
          if (!prevSections.includes(section)) {
            console.log(`[SectionHandling] Marking section "${section}" as completed.`);
            
            // Show a success toast when completing a new section
            const isNewCompletion = !prevSections.includes(section);
            if (isNewCompletion) {
              toast.success(`Section Complete: ${section}`, {
                description: "You've earned 5 points!",
              });
            }
            
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
        toast.error("Oops! Something went wrong", {
          description: "We couldn't load this section. Please try again."
        });
      }
    } catch (error) {
      console.error("[SectionHandling] Error processing section message:", error);
      toast.error("Oops! Something went wrong", {
        description: "We couldn't load this section. Please try again."
      });
    } finally {
      console.log(`[SectionHandling][END] Finished processing section: ${section}`);
      // Release the processing lock after a short delay to prevent immediate re-clicks
      setTimeout(() => {
        isSectionBeingProcessed = false;
      }, 300);
    }
  };

  const handleRelatedTopicClick = (topic: string) => {
    console.log(`[SectionHandling] Related topic clicked: ${topic}`);
    toast.info(`Exploring: ${topic}`, {
      description: "Let's discover something new!",
    });
    processMessage(`Tell me about ${topic}`, false, true);
  };

  return {
    handleTocSectionClick,
    handleRelatedTopicClick
  };
};
