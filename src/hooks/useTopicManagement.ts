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
    
    console.log(`[TopicManagement][Debug] Checking if '${trimmedInput}' is a new topic request`);
    console.log(`[TopicManagement][Debug] Current topic: ${currentTopic}, Sections generated: ${sectionsGenerated}`);
    
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
        
        // Mark the section as completed - Fixed to use direct array instead of functional update
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
  
  // Modify the generateTopicRelations function to use the cache and ensure language is passed correctly
  const generateTopicRelations = useCallback(async () => {
    if (!selectedTopic) {
      console.error("[TopicManagement][Error] Cannot generate topic relations: No selected topic");
      return;
    }
    
    console.log(`[TopicManagement][Debug] Checking if TOC already generated for: ${selectedTopic} with language: ${language}`);
    
    // Skip regeneration if we've already done it for this topic
    const cacheKey = `${selectedTopic}-${ageRange}-${language}`;
    if (tocGeneratedRef.current.has(cacheKey)) {
      console.log("[TopicManagement][Debug] TOC already generated for this topic, skipping");
      return;
    }
    
    console.log(`[TopicManagement][Debug] Generating TOC and related topics for: ${selectedTopic}`);
    setIsProcessing(true);
    setShowTypingIndicator(true);
    
    try {
      // Generate the table of contents
      if (!topicSectionsGenerated) {
        console.log("[TopicManagement][Debug] Topic sections not yet generated, creating TOC");
        
        // IMPROVED PROMPT: Make it more specific to generate contextual sections based on user query
        const tocPrompt = `Generate a concise table of contents with exactly 5 specific, contextual sections for learning about "${selectedTopic}". The sections must be directly related to this specific topic: "${selectedTopic}". Format as a simple numbered list. No welcome or introduction sections, focus only on educational content about ${selectedTopic}.`;
        
        console.log(`[TopicManagement][Debug] TOC Prompt: ${tocPrompt}`);
        const tocResponse = await generateResponse(tocPrompt, ageRange, language);
        console.log(`[TopicManagement][Debug] Raw TOC Response: ${tocResponse.substring(0, 300)}...`);
        
        // Parse TOC sections - improved with clearer section extraction
        const sections = parseTOCSections(tocResponse);
        console.log("[TopicManagement][Debug] Generated TOC sections:", sections);
        
        if (sections.length === 0) {
          console.error("[TopicManagement][Error] Failed to parse any sections from the TOC response");
          throw new Error("Failed to generate table of contents sections");
        }
        
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
            console.log("[TopicManagement][Debug] TOC message already exists, not adding duplicate");
            return prev;
          }
          
          console.log("[TopicManagement][Debug] Adding TOC message to messages");
          return [...prev, tocMessage];
        });
        
        // Explicitly log the current state after setting the TOC
        setTimeout(() => {
          console.log("[TopicManagement][Debug] After TOC generation - messages state:", 
            messages.filter(m => m.tableOfContents).map(m => ({
              id: m.id,
              hasTOC: !!m.tableOfContents,
              tocSections: m.tableOfContents
            }))
          );
        }, 100);
        
        setTopicSectionsGenerated(true);
        tocGeneratedRef.current.add(cacheKey);
      }
      
      // Generate related topics only if needed
      if (relatedTopics.length === 0) {
        console.log(`[TopicManagement][Debug] Generating related topics for: ${selectedTopic} with language: ${language}`);
        const newRelatedTopics = await generateRelatedTopics(selectedTopic, ageRange, language);
        setRelatedTopics(newRelatedTopics);
      } else {
        console.log("[TopicManagement][Debug] Related topics already exist:", relatedTopics);
      }
      
      // Set learning progress for this section
      setLearningProgress(10); // 10% progress for seeing TOC
    } catch (error) {
      console.error("[TopicManagement][Error] Error generating topic relations:", error);
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
    messages,
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
      
      console.log("[TopicManagement][Debug] Processing new topic:", inputValue);
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
      console.log("[TopicManagement][Debug] Calling generateTopicRelations");
      await generateTopicRelations();
      
      // Wait a bit more for proper rendering before fetching the first section
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Debug log current messages to see if TOC was added
      console.log("[TopicManagement][Debug] Messages after TOC generation:", 
        messages.filter(m => m.tableOfContents).map(m => ({
          id: m.id, 
          hasTOC: !!m.tableOfContents,
          sections: m.tableOfContents
        }))
      );
      
      // Fixed: Find TOC sections from messages directly after the state update
      // This guarantees we have the latest state
      const tocMessage = messages.find(msg => msg.tableOfContents);
      const sections = tocMessage?.tableOfContents || [];
      
      console.log("[TopicManagement][Debug] Found TOC message:", !!tocMessage);
      console.log("[TopicManagement][Debug] Available sections for selection:", sections);
      
      // Start with the first section if sections are available
      if (sections.length > 0) {
        console.log(`[TopicManagement][Debug] Selecting first section: ${sections[0]}`);
        await handleSectionSelection(sections[0], 0);
      } else {
        console.error("[TopicManagement][Error] No sections available to select from TOC");
        
        // Fallback: manually create a TOC if none exists
        if (!tocMessage) {
          console.log("[TopicManagement][Debug] No TOC message found, creating fallback TOC");
          const fallbackSections = [
            "Introduction to the Topic",
            "Key Concepts and Ideas",
            "Interesting Examples",
            "Real-world Applications",
            "Fun Activities and Experiments"
          ];
          
          const fallbackTocMessage: Message = {
            id: `fallback-toc-${Date.now()}`,
            text: `I'd love to teach you about ${inputValue}! Here's what we'll cover:`,
            isUser: false,
            tableOfContents: fallbackSections
          };
          
          setMessages(prev => [...prev, fallbackTocMessage]);
          setTopicSectionsGenerated(true);
          
          // Select the first fallback section
          setTimeout(() => {
            handleSectionSelection(fallbackSections[0], 0);
          }, 300);
        }
      }
      
    } catch (error) {
      console.error("[TopicManagement][Error] Error handling new topic:", error);
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

// IMPROVED PARSING FUNCTION: Enhanced to extract more relevant sections
const parseTOCSections = (tocResponse: string): string[] => {
  console.log("[TopicManagement][Debug] Parsing TOC sections from:", tocResponse.substring(0, 100) + "...");
  
  // Try numbered list pattern first (most common format)
  const numberedRegex = /\d+\.\s+\*?\*?([^*\n]+)\*?\*?/g;
  const numberedMatches = [...tocResponse.matchAll(numberedRegex)].map(match => match[1].trim());
  
  console.log("[TopicManagement][Debug] Numbered matches:", numberedMatches);
  
  if (numberedMatches.length >= 3) {
    return numberedMatches;
  }
  
  // Try numbered list pattern without markdown formatting
  const simpleNumberedRegex = /\d+\.\s+([^\n]+)/g;
  const simpleNumberedMatches = [...tocResponse.matchAll(simpleNumberedRegex)].map(match => match[1].trim());
  
  console.log("[TopicManagement][Debug] Simple numbered matches:", simpleNumberedMatches);
  
  if (simpleNumberedMatches.length >= 3) {
    return simpleNumberedMatches;
  }
  
  // Try bulleted list pattern
  const bulletRegex = /[•*-]\s+\*?\*?([^*\n]+)\*?\*?/g;
  const bulletMatches = [...tocResponse.matchAll(bulletRegex)].map(match => match[1].trim());
  
  console.log("[TopicManagement][Debug] Bullet matches:", bulletMatches);
  
  if (bulletMatches.length >= 3) {
    return bulletMatches;
  }
  
  // Try section headers
  const headerRegex = /\*\*([^*]+)\*\*/g;
  const headerMatches = [...tocResponse.matchAll(headerRegex)].map(match => match[1].trim());
  
  console.log("[TopicManagement][Debug] Header matches:", headerMatches);
  
  if (headerMatches.length >= 3) {
    return headerMatches;
  }
  
  // Fallback: just find any lines that might be sections
  const lines = tocResponse.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 10 && line.length < 100)
    .slice(0, 5);
  
  console.log("[TopicManagement][Debug] Line break matches:", lines);
  
  if (lines.length >= 3) {
    return lines;
  }
  
  // If all else fails, try splitting by periods to find sentence-based sections
  const sentences = tocResponse.split('.')
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 10 && sentence.length < 100)
    .slice(0, 5);
    
  console.log("[TopicManagement][Debug] Sentence matches:", sentences);
  
  if (sentences.length >= 3) {
    return sentences;
  }
  
  console.log("[TopicManagement][Debug] All parsing methods failed, using generic fallback");
  
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
