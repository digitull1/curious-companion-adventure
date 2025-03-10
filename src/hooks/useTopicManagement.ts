
import { useState, useCallback, useRef } from "react";
import { Message } from "@/types/chat";
import { toast } from "sonner";

export const useTopicManagement = (
  selectedTopic: string | null,
  topicSectionsGenerated: boolean,
  messages: Message[],
  completedSections: string[],
  relatedTopics: string[],
  generateResponse: (prompt: string, ageRange: string, language: string) => Promise<string>,
  ageRange: string,
  language: string,
  setLearningComplete: (learningComplete: boolean) => void,
  setRelatedTopics: (relatedTopics: string[]) => void,
  generateRelatedTopics: (topic: string, ageRange: string, language: string) => Promise<string[]>,
  inputValue: string,
  isProcessing: boolean,
  setMessages: (messageSetter: (prev: Message[]) => Message[]) => void,
  setInputValue: (value: string) => void,
  setIsProcessing: (isProcessing: boolean) => void,
  setShowTypingIndicator: (show: boolean) => void,
  setSelectedTopic: (topic: string | null) => void,
  setTopicSectionsGenerated: (topicSectionsGenerated: boolean) => void,
  setCompletedSections: (completedSections: string[]) => void,
  setCurrentSection: (currentSection: string | null) => void,
  setPreviousTopics: (previousTopics: string[]) => void,
  setPoints: (pointsSetter: (prev: number) => number) => void,
  setLearningProgress: (learningProgress: number) => void
) => {
  // Add a ref to track if TOC has been generated for this topic
  const tocGeneratedRef = useRef<Set<string>>(new Set());
  
  const isNewTopicRequest = (input: string, currentTopic: string | null, sectionsGenerated: boolean): boolean => {
    const trimmedInput = input.trim();
    
    // If there's no current topic, it's definitely a new topic
    if (!currentTopic) {
      console.log("[TopicManagement] No current topic, new topic request");
      return true;
    }
    
    // If sections haven't been generated, it's likely a new topic
    if (!sectionsGenerated) {
      console.log("[TopicManagement] Sections not generated, new topic request");
      return true;
    }
    
    // Check if the input is different from the current topic
    if (trimmedInput.toLowerCase() !== currentTopic.toLowerCase()) {
      console.log("[TopicManagement] Input differs from current topic, new topic request");
      return true;
    }
    
    // If none of the above conditions are met, it's not a new topic
    console.log("[TopicManagement] Input matches current topic, not a new topic request");
    return false;
  };
  
  const handleSectionSelection = useCallback(
    async (section: string, sectionIndex: number) => {
      if (isProcessing) {
        console.log("[TopicManagement] Already processing, skipping section selection");
        return;
      }
      
      console.log(`[TopicManagement] Handling section selection: ${section} at index: ${sectionIndex}`);
      
      // Check if the section is already completed
      if (completedSections.includes(section)) {
        console.log("[TopicManagement] Section already completed, skipping");
        toast.info("You've already explored this section!");
        return;
      }
      
      setIsProcessing(true);
      setShowTypingIndicator(true);
      setCurrentSection(section);
      
      try {
        // Process the section content
        const sectionPrompt = `Explain the following topic in detail for a ${ageRange} year old: ${section}.`;
        const result = await generateResponse(sectionPrompt, ageRange, language);
        
        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setShowTypingIndicator(false);
        
        // Add section message
        const sectionMessage: Message = {
          id: Date.now().toString(),
          text: result,
          isUser: false,
          blocks: ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"],
          showBlocks: true
        };
        
        setMessages(prev => [...prev, sectionMessage]);
        
        // Mark the section as completed - Fixed with direct array instead of functional update
        if (!completedSections.includes(section)) {
          console.log(`[TopicManagement] Marking section as completed: ${section}`);
          const newCompletedSections = [...completedSections, section];
          setCompletedSections(newCompletedSections);
        }
        
        // Award points for completing a section
        setPoints(prev => {
          console.log(`[TopicManagement] Awarding points: +25 (current: ${prev})`);
          return prev + 25;
        });
        
        // Update learning progress
        const newProgress = Math.min(100, 10 + (sectionIndex + 1) * (80 / 5));
        setLearningProgress(newProgress);
        
        // Check if all sections are completed
        const tocMessage = messages.find(msg => msg.tableOfContents);
        if (tocMessage && tocMessage.tableOfContents) {
          const allSectionsCompleted = tocMessage.tableOfContents.every(s => 
            [...completedSections, section].includes(s)
          );
          
          if (allSectionsCompleted) {
            console.log("[TopicManagement] All sections completed for this topic!");
            setLearningComplete(true);
            setLearningProgress(100);
            toast.success("Congratulations! You've completed this topic!");
          }
        }
      } catch (error) {
        console.error("[TopicManagement] Error handling section selection:", error);
        toast.error("I had trouble loading this section. Let's try another one!");
      } finally {
        setIsProcessing(false);
        setShowTypingIndicator(false);
      }
    },
    [
      ageRange,
      completedSections,
      generateResponse,
      isProcessing,
      language,
      messages,
      setCompletedSections,
      setCurrentSection,
      setIsProcessing,
      setLearningComplete,
      setMessages,
      setPoints,
      setShowTypingIndicator,
      setLearningProgress
    ]
  );
  
  // Modify the generateTopicRelations function to use the cache
  const generateTopicRelations = useCallback(async () => {
    if (!selectedTopic) return;
    
    console.log("Checking if TOC already generated for:", selectedTopic);
    
    // Skip regeneration if we've already done it for this topic
    const cacheKey = `${selectedTopic}-${ageRange}-${language}`;
    if (tocGeneratedRef.current.has(cacheKey)) {
      console.log("TOC already generated for this topic, skipping");
      return;
    }
    
    console.log("Generating TOC and related topics for:", selectedTopic);
    setIsProcessing(true);
    setShowTypingIndicator(true);
    
    try {
      // Generate the table of contents
      if (!topicSectionsGenerated) {
        console.log("Topic sections not yet generated, creating TOC");
        const tocPrompt = `Generate a concise table of contents with exactly 5 short, focused sections for learning about: ${selectedTopic}. Format as a simple numbered list. No welcome or introduction sections, focus only on educational content.`;
        const tocResponse = await generateResponse(tocPrompt, ageRange, language);
        
        // Parse TOC sections - improved with clearer section extraction
        const sections = parseTOCSections(tocResponse);
        console.log("Generated TOC sections:", sections);
        
        // Add TOC message
        const tocMessage: Message = {
          id: Date.now().toString(),
          text: `I'd love to teach you about ${selectedTopic}! Here's what we'll cover:`,
          isUser: false,
          tableOfContents: sections
        };
        
        // Update state - make sure this happens only once per topic
        setMessages(prev => {
          // Check if we already have a TOC message for this topic
          const hasTOC = prev.some(msg => 
            msg.tableOfContents && 
            msg.text.includes(`I'd love to teach you about ${selectedTopic}`)
          );
          
          if (hasTOC) {
            console.log("TOC message already exists, not adding duplicate");
            return prev;
          }
          
          return [...prev, tocMessage];
        });
        
        setTopicSectionsGenerated(true);
        tocGeneratedRef.current.add(cacheKey);
      }
      
      // Generate related topics only if needed
      if (relatedTopics.length === 0) {
        console.log("Generating related topics for:", selectedTopic);
        const newRelatedTopics = await generateRelatedTopics(selectedTopic, ageRange, language);
        setRelatedTopics(newRelatedTopics);
      } else {
        console.log("Related topics already exist:", relatedTopics);
      }
      
      // Set learning progress for this section
      setLearningProgress(10); // 10% progress for seeing TOC
    } catch (error) {
      console.error("Error generating topic relations:", error);
      toast.error("Oops! Something went wrong while creating your learning path. Let's try again!");
    } finally {
      setIsProcessing(false);
      setShowTypingIndicator(false);
    }
  }, [
    selectedTopic, 
    ageRange, 
    language, 
    topicSectionsGenerated, 
    relatedTopics.length,
    generateResponse, 
    generateRelatedTopics, 
    setMessages, 
    setTopicSectionsGenerated, 
    setIsProcessing, 
    setShowTypingIndicator, 
    setRelatedTopics,
    setLearningProgress
  ]);
  
  const handleNewTopicRequest = useCallback(async () => {
    if (!inputValue.trim() || isProcessing) return;
    
    // Modify to better handle state transitions and prevent refreshes
    try {
      setIsProcessing(true);
      setShowTypingIndicator(true);
      
      console.log("Processing new topic:", inputValue);
      setSelectedTopic(inputValue);
      
      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        text: inputValue,
        isUser: true
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputValue("");
      
      // Wait for the user message to be properly rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Now generate topic relations (TOC and related topics)
      await generateTopicRelations();
      
      // Wait a bit more for proper rendering before fetching the first section
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Start with the first section if this is truly a new topic
      const sections = messages.find(msg => msg.tableOfContents)?.tableOfContents || [];
      if (sections.length > 0) {
        await handleSectionSelection(sections[0], 0);
      }
      
    } catch (error) {
      console.error("Error handling new topic:", error);
      toast.error("I had trouble processing that topic. Let's try something else!");
    } finally {
      setIsProcessing(false);
      setShowTypingIndicator(false);
    }
  }, [
    inputValue,
    isProcessing,
    generateTopicRelations,
    handleSectionSelection,
    messages,
    setMessages,
    setInputValue,
    setIsProcessing,
    setShowTypingIndicator,
    setSelectedTopic
  ]);
  
  return { handleNewTopicRequest, isNewTopicRequest, generateTopicRelations };
};

// Helper function to parse TOC sections
const parseTOCSections = (tocResponse: string): string[] => {
  // Try numbered list pattern first (most common format)
  const numberedRegex = /\d+\.\s+\*\*([^*]+)\*\*/g;
  const numberedMatches = [...tocResponse.matchAll(numberedRegex)].map(match => match[1].trim());
  
  if (numberedMatches.length >= 3) {
    return numberedMatches;
  }
  
  // Try bulleted list pattern
  const bulletRegex = /[•*-]\s+\*\*([^*]+)\*\*/g;
  const bulletMatches = [...tocResponse.matchAll(bulletRegex)].map(match => match[1].trim());
  
  if (bulletMatches.length >= 3) {
    return bulletMatches;
  }
  
  // Try section headers
  const headerRegex = /\*\*([^*]+)\*\*/g;
  const headerMatches = [...tocResponse.matchAll(headerRegex)].map(match => match[1].trim());
  
  if (headerMatches.length >= 3) {
    return headerMatches;
  }
  
  // Fallback: just find any lines that might be sections
  const lines = tocResponse.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 10 && line.length < 100)
    .slice(0, 5);
  
  if (lines.length >= 3) {
    return lines;
  }
  
  // If all else fails, use a generic fallback
  return [
    "Introduction to the Topic",
    "Key Facts and Information",
    "Interesting Details",
    "Real-World Applications",
    "Fun Activities to Try"
  ];
};

export default useTopicManagement;
