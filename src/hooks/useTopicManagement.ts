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
  const tocGeneratedRef = useRef<Set<string>>(new Set());
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
    
    if (!currentTopic) {
      return true;
    }
    
    if (!sectionsGenerated) {
      return true;
    }
    
    const isFollowUp = trimmedInput.includes(currentTopic.toLowerCase()) || 
                       trimmedInput.startsWith("tell me more") ||
                       trimmedInput.startsWith("can you explain") ||
                       trimmedInput.startsWith("what about") ||
                       trimmedInput.includes("how about");
                       
    return !isFollowUp;
  };
  
  const handleSectionSelection = useCallback(
    async (section: string, sectionIndex: number) => {
      if (isProcessing) {
        return;
      }
      
      if (completedSections.includes(section)) {
        toast.info("You've already explored this section!");
        return;
      }
      
      setIsProcessing(true);
      setShowTypingIndicator(true);
      setCurrentSection(section);
      
      try {
        const sectionPrompt = `
          Create an educational, age-appropriate explanation about "${section}" in the context of "${selectedTopic}" for a ${ageRange} year old child.
          Be specific to this exact topic and section.
          Include interesting facts, engaging examples, and make it fun to read.
          Keep your explanation concise but comprehensive, focusing specifically on ${section} as it relates to ${selectedTopic}.
        `;
        
        const result = await generateResponse(sectionPrompt, ageRange, language);
        
        await new Promise(resolve => setTimeout(resolve, 400));
        setShowTypingIndicator(false);
        
        const sectionMessage: Message = {
          id: `ai-${Date.now()}`,
          text: result,
          isUser: false,
          blocks: ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"],
          showBlocks: true
        };
        
        setMessages(prev => [...prev, sectionMessage]);
        
        debounce(() => {
          if (!completedSections.includes(section)) {
            setCompletedSections([...completedSections, section]);
            setPoints(prev => prev + 25);
            
            const tocMessage = messages.find(msg => msg.tableOfContents);
            const totalSections = tocMessage?.tableOfContents?.length || 5;
            const completedCount = completedSections.length + 1;
            const progress = Math.min(100, Math.round((completedCount / totalSections) * 100));
            
            setLearningProgress(progress);
            
            if (tocMessage && tocMessage.tableOfContents) {
              const allSectionsCompleted = tocMessage.tableOfContents.every(s => 
                [...completedSections, section].includes(s)
              );
              
              if (allSectionsCompleted) {
                setLearningComplete(true);
                setLearningProgress(100);
                toast.success("Congratulations! You've completed this topic!");
              }
            }
          }
        }, 200);
      } catch (error) {
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
  
  const generateTopicRelations = useCallback(async () => {
    if (!selectedTopic) {
      return;
    }
    
    const cacheKey = `${selectedTopic}-${ageRange}-${language}`;
    if (tocGeneratedRef.current.has(cacheKey)) {
      return;
    }
    
    setIsProcessing(true);
    setShowTypingIndicator(true);
    
    try {
      if (!topicSectionsGenerated) {
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
        
        const tocResponse = await generateResponse(tocPrompt, ageRange, language);
        const sections = parseTOCSections(tocResponse, selectedTopic);
        
        if (sections.length === 0) {
          throw new Error("Failed to generate table of contents sections");
        }
        
        const tocMessage: Message = {
          id: `toc-${Date.now()}`,
          text: `I'd love to teach you about ${selectedTopic}! Here's what we'll cover:`,
          isUser: false,
          tableOfContents: sections
        };
        
        setMessages(prev => {
          const hasTOC = prev.some(msg => 
            msg.tableOfContents && 
            msg.text.includes(`I'd love to teach you about ${selectedTopic}`)
          );
          
          if (hasTOC) {
            return prev;
          }
          
          return [...prev, tocMessage];
        });
        
        setTopicSectionsGenerated(true);
        tocGeneratedRef.current.add(cacheKey);
      }
      
      if (relatedTopics.length === 0) {
        const newRelatedTopics = await generateRelatedTopics(selectedTopic, ageRange, language);
        setRelatedTopics(newRelatedTopics);
      }
      
      setLearningProgress(10);
    } catch (error) {
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
    
    try {
      setIsProcessing(true);
      setShowTypingIndicator(true);
      
      const cleanedTopic = inputValue.trim().replace(/^(tell me about|what is|show me|explain) /i, '');
      setSelectedTopic(cleanedTopic);
      
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        text: inputValue,
        isUser: true
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputValue("");
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      tocGeneratedRef.current.delete(`${cleanedTopic}-${ageRange}-${language}`);
      setTopicSectionsGenerated(false);
      setCompletedSections([]);
      setCurrentSection(null);
      
      await generateTopicRelations();
      
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const messages = await new Promise<Message[]>(resolve => {
        setMessages(prev => {
          resolve(prev);
          return prev;
        });
      });
      
      toast.info("Choose a section to explore!", {
        duration: 5000,
        icon: "👆"
      });
      
    } catch (error) {
      toast.error("I had trouble processing that topic. Let's try something else!");
    } finally {
      setIsProcessing(false);
      setShowTypingIndicator(false);
    }
  }, [
    inputValue,
    isProcessing,
    generateTopicRelations,
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

const parseTOCSections = (tocResponse: string, topicContext: string): string[] => {
  const numberedRegex = /\d+\.\s+\*?\*?([^*\n]+)\*?\*?/g;
  const numberedMatches = [...tocResponse.matchAll(numberedRegex)].map(match => match[1].trim());
  
  if (numberedMatches.length >= 3) {
    return filterTopicSections(numberedMatches, topicContext);
  }
  
  const simpleNumberedRegex = /\d+\.\s+([^\n]+)/g;
  const simpleNumberedMatches = [...tocResponse.matchAll(simpleNumberedRegex)].map(match => match[1].trim());
  
  if (simpleNumberedMatches.length >= 3) {
    return filterTopicSections(simpleNumberedMatches, topicContext);
  }
  
  const bulletRegex = /[•*-]\s+\*?\*?([^*\n]+)\*?\*?/g;
  const bulletMatches = [...tocResponse.matchAll(bulletRegex)].map(match => match[1].trim());
  
  if (bulletMatches.length >= 3) {
    return filterTopicSections(bulletMatches, topicContext);
  }
  
  const headerRegex = /\*\*([^*]+)\*\*/g;
  const headerMatches = [...tocResponse.matchAll(headerRegex)].map(match => match[1].trim());
  
  if (headerMatches.length >= 3) {
    return filterTopicSections(headerMatches, topicContext);
  }
  
  const lines = tocResponse.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 10 && line.length < 100)
    .slice(0, 5);
  
  if (lines.length >= 3) {
    return filterTopicSections(lines, topicContext);
  }
  
  return generateContextualFallbackSections(topicContext);
};

const filterTopicSections = (sections: string[], context: string): string[] => {
  const lowercaseContext = context.toLowerCase();
  const filteredSections = sections.filter(section => {
    const lowercaseSection = section.toLowerCase();
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
  
  if (filteredSections.length < 3) {
    return generateContextualFallbackSections(context);
  }
  
  return filteredSections.slice(0, 5);
};

const generateContextualFallbackSections = (topic: string): string[] => {
  const lowerTopic = topic.toLowerCase();
  
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
  
  return [
    `What is ${topic}?`,
    `History of ${topic}`,
    `Important facts about ${topic}`,
    `${topic} in the real world`,
    `Fun activities with ${topic}`
  ];
};

export default useTopicManagement;
