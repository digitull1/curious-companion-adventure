
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
  
  // Debounce function to prevent multiple rapid updates
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const debounce = (fn: Function, ms = 300) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      fn();
      debounceTimeoutRef.current = null;
    }, ms);
  };
  
  const isNewTopicRequest = (input: string, currentTopic: string | null, sectionsGenerated: boolean): boolean => {
    const trimmedInput = input.trim().toLowerCase();
    
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
    // More sophisticated check - is this a new question vs a followup
    const isFollowUp = trimmedInput.includes(currentTopic.toLowerCase()) || 
                       trimmedInput.startsWith("tell me more") ||
                       trimmedInput.startsWith("can you explain") ||
                       trimmedInput.startsWith("what about") ||
                       trimmedInput.includes("how about");
                       
    if (!isFollowUp) {
      console.log("[TopicManagement] Input appears to be a new topic, not a follow-up");
      return true;
    }
    
    // If none of the above conditions are met, it's not a new topic
    console.log("[TopicManagement] Input appears to be a follow-up, not a new topic");
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
        // Process the section content with improved prompt
        const sectionPrompt = `
          Create an educational, age-appropriate explanation about "${section}" in the context of "${selectedTopic}" for a ${ageRange} year old child.
          Be specific to this exact topic and section.
          Include interesting facts, engaging examples, and make it fun to read.
          Keep your explanation concise but comprehensive, focusing specifically on ${section} as it relates to ${selectedTopic}.
        `;
        
        console.log(`[TopicManagement][Debug] Section prompt: ${sectionPrompt.substring(0, 100)}...`);
        const result = await generateResponse(sectionPrompt, ageRange, language);
        
        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 400));
        setShowTypingIndicator(false);
        
        // Add section message
        const sectionMessage: Message = {
          id: `ai-${Date.now()}`,
          text: result,
          isUser: false,
          blocks: ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"],
          showBlocks: true
        };
        
        setMessages(prev => [...prev, sectionMessage]);
        
        // Mark the section as completed - directly using the array approach
        debounce(() => {
          if (!completedSections.includes(section)) {
            console.log(`[TopicManagement] Marking section as completed: ${section}`);
            setCompletedSections([...completedSections, section]);
            
            // Award points for completing a section
            setPoints(prev => {
              console.log(`[TopicManagement] Awarding points: +25 (current: ${prev})`);
              return prev + 25;
            });
            
            // Update learning progress
            const tocMessage = messages.find(msg => msg.tableOfContents);
            const totalSections = tocMessage?.tableOfContents?.length || 5;
            const completedCount = completedSections.length + 1;
            const progress = Math.min(100, Math.round((completedCount / totalSections) * 100));
            
            console.log(`[TopicManagement] Updating progress: ${progress}% (${completedCount}/${totalSections})`);
            setLearningProgress(progress);
            
            // Check if all sections are completed
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
          }
        }, 200);
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
      selectedTopic,
      setCompletedSections,
      setCurrentSection,
      setIsProcessing,
      setLearningComplete,
      setLearningProgress,
      setMessages,
      setPoints,
      setShowTypingIndicator
    ]
  );
  
  // Improved TOC generation function with better context awareness
  const generateTopicRelations = useCallback(async () => {
    if (!selectedTopic) {
      console.error("[TopicManagement][Error] Cannot generate topic relations: No selected topic");
      return;
    }
    
    console.log(`[TopicManagement][Debug] Generating TOC for: "${selectedTopic}" (age: ${ageRange}, language: ${language})`);
    
    // Skip regeneration if we've already done it for this topic
    const cacheKey = `${selectedTopic}-${ageRange}-${language}`;
    if (tocGeneratedRef.current.has(cacheKey)) {
      console.log("[TopicManagement][Debug] TOC already generated for this topic, skipping");
      return;
    }
    
    setIsProcessing(true);
    setShowTypingIndicator(true);
    
    try {
      // Generate the table of contents with SIGNIFICANTLY improved prompt
      if (!topicSectionsGenerated) {
        console.log("[TopicManagement][Debug] Topic sections not yet generated, creating TOC");
        
        // GREATLY IMPROVED PROMPT: Much more specific and contextual
        const tocPrompt = `
          You are an expert educator tasked with creating a contextual, educational learning path for "${selectedTopic}".
          
          Generate exactly 5 specific, highly relevant educational sections for a ${ageRange} year old learning about "${selectedTopic}".
          
          Your response must:
          1. Be SPECIFICALLY about "${selectedTopic}" with NO generic sections.
          2. Include sections that directly address different aspects of "${selectedTopic}".
          3. Be presented as a simple numbered list (1. Section Name).
          4. Be age-appropriate for a ${ageRange} year old.
          5. NOT include any welcome messages, introductions, or explanations.
          6. NOT include "Introduction", "Welcome", "Let's explore", or other generic titles.
          
          Example format:
          1. The Building of the Taj Mahal
          2. The Love Story Behind the Monument
          3. Architecture and Design Features
          4. Mughal Artistic Influences
          5. Preservation and Challenges Today
          
          Remember: All sections must be DIRECTLY about "${selectedTopic}" and not generic.
        `;
        
        console.log(`[TopicManagement][Debug] TOC Prompt: ${tocPrompt.substring(0, 100)}...`);
        const tocResponse = await generateResponse(tocPrompt, ageRange, language);
        console.log(`[TopicManagement][Debug] Raw TOC Response: ${tocResponse.substring(0, 300)}...`);
        
        // Parse TOC sections with enhanced parsing
        const sections = parseTOCSections(tocResponse, selectedTopic);
        console.log("[TopicManagement][Debug] Generated TOC sections:", sections);
        
        if (sections.length === 0) {
          console.error("[TopicManagement][Error] Failed to parse any sections from the TOC response");
          throw new Error("Failed to generate table of contents sections");
        }
        
        // Add TOC message
        const tocMessage: Message = {
          id: `toc-${Date.now()}`,
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
        console.log(`[TopicManagement][Debug] Generating related topics for: ${selectedTopic}`);
        
        // Improved prompt for related topics too
        const relatedPrompt = `
          Generate 5 fascinating, related topics that a ${ageRange} year old might also be interested in after learning about "${selectedTopic}".
          Keep them directly related to aspects of ${selectedTopic} but exploring different angles.
          Return as a simple comma-separated list with no numbering or explanation.
        `;
        
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
  
  // Improved new topic request handler with better state management
  const handleNewTopicRequest = useCallback(async () => {
    if (!inputValue.trim() || isProcessing) return;
    
    try {
      setIsProcessing(true);
      setShowTypingIndicator(true);
      
      console.log("[TopicManagement][Debug] Processing new topic:", inputValue);
      const cleanedTopic = inputValue.trim().replace(/^(tell me about|what is|show me|explain) /i, '');
      setSelectedTopic(cleanedTopic);
      
      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        text: inputValue,
        isUser: true
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputValue("");
      
      // Wait for the user message to be properly rendered before continuing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Reset topic-related states to prevent conflicts
      tocGeneratedRef.current.delete(`${cleanedTopic}-${ageRange}-${language}`);
      setTopicSectionsGenerated(false);
      setCompletedSections([]);
      setCurrentSection(null);
      
      // Generate topic relations with improved debouncing
      console.log("[TopicManagement][Debug] Calling generateTopicRelations for new topic");
      await generateTopicRelations();
      
      // Wait to ensure proper state updates before proceeding
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Find TOC message and select first section
      const messages = await new Promise<Message[]>(resolve => {
        setMessages(prev => {
          resolve(prev);
          return prev;
        });
      });
      
      const tocMessage = messages.find(msg => msg.tableOfContents);
      if (tocMessage && tocMessage.tableOfContents && tocMessage.tableOfContents.length > 0) {
        console.log(`[TopicManagement][Debug] Selecting first section: ${tocMessage.tableOfContents[0]}`);
        // Short delay to ensure UI is updated
        setTimeout(() => {
          handleSectionSelection(tocMessage.tableOfContents[0], 0);
        }, 300);
      } else {
        console.error("[TopicManagement][Error] No TOC sections available after generation");
        
        // Create fallback TOC only if really needed
        const topic = cleanedTopic.toLowerCase();
        const fallbackSections = generateContextualFallbackSections(topic);
        
        const fallbackTocMessage: Message = {
          id: `fallback-toc-${Date.now()}`,
          text: `I'd love to teach you about ${cleanedTopic}! Here's what we'll cover:`,
          isUser: false,
          tableOfContents: fallbackSections
        };
        
        setMessages(prev => [...prev, fallbackTocMessage]);
        setTopicSectionsGenerated(true);
        
        setTimeout(() => {
          handleSectionSelection(fallbackSections[0], 0);
        }, 300);
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
    ageRange,
    language,
    setMessages,
    setInputValue,
    setIsProcessing,
    setShowTypingIndicator,
    setSelectedTopic,
    setTopicSectionsGenerated,
    setCompletedSections,
    setCurrentSection
  ]);
  
  return { handleNewTopicRequest, isNewTopicRequest, generateTopicRelations };
};

// SIGNIFICANTLY IMPROVED PARSING FUNCTION
const parseTOCSections = (tocResponse: string, topicContext: string): string[] => {
  console.log("[TopicManagement][Debug] Parsing TOC sections with context:", topicContext);
  
  // Try numbered list pattern first (most common format)
  const numberedRegex = /\d+\.\s+\*?\*?([^*\n]+)\*?\*?/g;
  const numberedMatches = [...tocResponse.matchAll(numberedRegex)].map(match => match[1].trim());
  
  console.log("[TopicManagement][Debug] Numbered matches:", numberedMatches);
  
  if (numberedMatches.length >= 3) {
    return filterTopicSections(numberedMatches, topicContext);
  }
  
  // Try numbered list pattern without markdown formatting
  const simpleNumberedRegex = /\d+\.\s+([^\n]+)/g;
  const simpleNumberedMatches = [...tocResponse.matchAll(simpleNumberedRegex)].map(match => match[1].trim());
  
  console.log("[TopicManagement][Debug] Simple numbered matches:", simpleNumberedMatches);
  
  if (simpleNumberedMatches.length >= 3) {
    return filterTopicSections(simpleNumberedMatches, topicContext);
  }
  
  // Try bulleted list pattern
  const bulletRegex = /[•*-]\s+\*?\*?([^*\n]+)\*?\*?/g;
  const bulletMatches = [...tocResponse.matchAll(bulletRegex)].map(match => match[1].trim());
  
  console.log("[TopicManagement][Debug] Bullet matches:", bulletMatches);
  
  if (bulletMatches.length >= 3) {
    return filterTopicSections(bulletMatches, topicContext);
  }
  
  // Try section headers
  const headerRegex = /\*\*([^*]+)\*\*/g;
  const headerMatches = [...tocResponse.matchAll(headerRegex)].map(match => match[1].trim());
  
  console.log("[TopicManagement][Debug] Header matches:", headerMatches);
  
  if (headerMatches.length >= 3) {
    return filterTopicSections(headerMatches, topicContext);
  }
  
  // Fallback: just find any lines that might be sections
  const lines = tocResponse.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 10 && line.length < 100)
    .slice(0, 5);
  
  console.log("[TopicManagement][Debug] Line break matches:", lines);
  
  if (lines.length >= 3) {
    return filterTopicSections(lines, topicContext);
  }
  
  // If all parsing methods failed, generate contextual fallback sections
  console.log("[TopicManagement][Debug] All parsing methods failed, using contextual fallback");
  return generateContextualFallbackSections(topicContext);
};

// Filter out non-contextual and generic sections
const filterTopicSections = (sections: string[], context: string): string[] => {
  const lowercaseContext = context.toLowerCase();
  const filteredSections = sections.filter(section => {
    const lowercaseSection = section.toLowerCase();
    
    // Filter out generic sections and those not relevant to the context
    return !(
      lowercaseSection.includes("welcome") ||
      lowercaseSection.includes("introduction") ||
      lowercaseSection.includes("get started") ||
      lowercaseSection.includes("conclusion") ||
      lowercaseSection.includes("summary") ||
      lowercaseSection.includes("let's explore") ||
      lowercaseSection.includes("what we'll cover") ||
      lowercaseSection.includes("table of content")
    );
  });
  
  // Make sure we have at least 3 sections; if not, use contextual ones
  if (filteredSections.length < 3) {
    return generateContextualFallbackSections(context);
  }
  
  return filteredSections.slice(0, 5); // Limit to 5 sections
};

// Generate context-aware fallback sections
const generateContextualFallbackSections = (topic: string): string[] => {
  const lowerTopic = topic.toLowerCase();
  
  // History and monuments
  if (
    lowerTopic.includes("taj mahal") || 
    lowerTopic.includes("pyramid") || 
    lowerTopic.includes("colosseum") || 
    lowerTopic.includes("monument") || 
    lowerTopic.includes("castle") ||
    lowerTopic.includes("palace")
  ) {
    return [
      `History of the ${topic}`,
      `Architecture and Design of the ${topic}`,
      `Cultural Significance of the ${topic}`,
      `Interesting Facts about the ${topic}`,
      `Fun Activities and Experiments`
    ];
  }
  
  // Animals
  if (
    lowerTopic.includes("animal") || 
    lowerTopic.includes("tiger") || 
    lowerTopic.includes("lion") || 
    lowerTopic.includes("elephant") || 
    lowerTopic.includes("dog") || 
    lowerTopic.includes("cat") ||
    lowerTopic.includes("fish") ||
    lowerTopic.includes("bird")
  ) {
    return [
      `What is a ${topic}?`,
      `Where do ${topic}s live?`,
      `How do ${topic}s survive?`,
      `Amazing facts about ${topic}s`,
      `How humans interact with ${topic}s`
    ];
  }
  
  // Space topics
  if (
    lowerTopic.includes("space") || 
    lowerTopic.includes("planet") || 
    lowerTopic.includes("star") || 
    lowerTopic.includes("galaxy") || 
    lowerTopic.includes("moon") || 
    lowerTopic.includes("sun") ||
    lowerTopic.includes("universe") ||
    lowerTopic.includes("mars")
  ) {
    return [
      `What is ${topic}?`,
      `Discovery of ${topic}`,
      `Scientific facts about ${topic}`,
      `Exploration of ${topic}`,
      `Fun activities about ${topic}`
    ];
  }
  
  // Technology topics
  if (
    lowerTopic.includes("robot") || 
    lowerTopic.includes("computer") || 
    lowerTopic.includes("technology") || 
    lowerTopic.includes("internet") || 
    lowerTopic.includes("ai") || 
    lowerTopic.includes("machine")
  ) {
    return [
      `What is ${topic}?`,
      `How ${topic}s work`,
      `Different types of ${topic}s`,
      `${topic}s in our daily lives`,
      `Future of ${topic}s`
    ];
  }
  
  // Generic but contextual fallback
  return [
    `What is ${topic}?`,
    `History of ${topic}`,
    `Important facts about ${topic}`,
    `${topic} in the real world`,
    `Fun activities with ${topic}`
  ];
};

export default useTopicManagement;
