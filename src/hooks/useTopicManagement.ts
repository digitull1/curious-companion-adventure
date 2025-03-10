
import { useCallback } from "react";

// Define generateTopicRelations function
const generateTopicRelations = async (
  topic: string,
  generateResponse: (prompt: string, ageRange: string, language: string) => Promise<string>,
  ageRange: string,
  language: string,
  setRelatedTopics: (topics: string[]) => void
) => {
  try {
    console.log("[TopicManagement] Generating related topics for:", topic);
    
    const prompt = `Generate 5 related educational topics that a child interested in "${topic}" might also want to learn about. 
    Return just a simple numbered list with no additional text or description. Each topic should be 3-6 words long.
    Example:
    1. Ocean Ecosystems
    2. Marine Mammals
    3. Coral Reef Conservation
    4. Deep Sea Exploration
    5. Ocean Pollution Solutions`;
    
    const response = await generateResponse(prompt, ageRange, language);
    console.log("[TopicManagement] Related topics response:", response);
    
    // Extract the topics
    const topicsList: string[] = [];
    const lines = response.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      // Match lines that start with a number and dot/parenthesis
      const match = trimmed.match(/^\d+[\.\)]?\s+(.*)/);
      if (match && match[1]) {
        topicsList.push(match[1].trim());
      }
    }
    
    console.log("[TopicManagement] Extracted related topics:", topicsList);
    
    // Only update if we have topics
    if (topicsList.length > 0) {
      setRelatedTopics(topicsList);
    }
  } catch (error) {
    console.error("[TopicManagement] Error generating related topics:", error);
  }
};

export const useTopicManagement = (
  selectedTopic: string | null,
  topicSectionsGenerated: boolean,
  messages: any[],
  completedSections: string[],
  relatedTopics: string[],
  generateResponse: (prompt: string, ageRange: string, language: string) => Promise<string>,
  ageRange: string,
  language: string,
  setLearningComplete: (complete: boolean) => void,
  setRelatedTopics: (topics: string[]) => void,
  generateRelatedTopics: (topic: string) => void,
  inputValue: string,
  isProcessing: boolean,
  setMessages: (messagesSetter: (prev: any[]) => any[]) => void,
  setInputValue: (value: string) => void,
  setIsProcessing: (isProcessing: boolean) => void,
  setShowTypingIndicator: (show: boolean) => void,
  setSelectedTopic: (topic: string | null) => void,
  setTopicSectionsGenerated: (generated: boolean) => void,
  setCompletedSections: (sectionsSetter: (prev: string[]) => string[]) => void,
  setCurrentSection: (section: string | null) => void,
  setPreviousTopics: (topicsSetter: (prev: string[]) => string[]) => void,
  setPoints: (pointsSetter: (prev: number) => number) => void,
  setLearningProgress: (progress: number) => void
) => {
  // Add improved logging for topic detection and TOC generation
  const isNewTopicRequest = useCallback((inputText: string, currentTopic: string | null, topicGenerated: boolean) => {
    console.log("[TopicManagement] Checking if new topic:", {
      inputText,
      currentTopic,
      topicGenerated,
      inputLength: inputText.length
    });
    
    // Skip if already processing a topic
    if (topicGenerated) {
      console.log("[TopicManagement] Already generated sections for the current topic");
      return false;
    }
    
    // If the input is longer than a topic request or contains questions, it's likely not a topic
    if (inputText.length > 100 || inputText.includes("?")) {
      console.log("[TopicManagement] Input appears to be a question, not a topic request");
      return false;
    }
    
    // Check if it's a simple topic phrase (3-5 words)
    const wordCount = inputText.split(/\s+/).filter(word => word.length > 0).length;
    const isTopic = wordCount >= 1 && wordCount <= 7;
    
    console.log("[TopicManagement] Topic detection result:", {
      wordCount,
      isTopic
    });
    
    return isTopic;
  }, []);

  const handleNewTopicRequest = useCallback(async () => {
    console.log("[TopicManagement] Starting new topic request process");
    
    if (isProcessing) {
      console.log("[TopicManagement] Can't handle new topic, already processing");
      return;
    }
    
    // Reset states for new topic
    setIsProcessing(true);
    setShowTypingIndicator(true);
    
    try {
      // Get the user's topic text
      const userTopic = inputValue.trim();
      console.log("[TopicManagement] User topic:", userTopic);
      
      // Add user message to chat
      const userMessageId = `user-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: userMessageId,
        text: userTopic,
        isUser: true
      }]);

      console.log("[TopicManagement] Setting selected topic:", userTopic);
      setSelectedTopic(userTopic);
      
      // Generate table of contents from the topic
      console.log("[TopicManagement] Generating TOC for topic:", userTopic);
      
      // Special prompt for TOC generation
      const tocPrompt = `For the topic "${userTopic}", generate a table of contents with 4-6 sections that would be interesting and educational for children aged ${ageRange}. 
      Return ONLY a numbered list with no additional text. Each section should be clear and concise.
      Example:
      1. What are planets?
      2. How planets form
      3. The types of planets in our solar system
      4. Could life exist on other planets?
      5. Future of planet exploration`;
      
      const tocResponse = await generateResponse(tocPrompt, ageRange, language);
      console.log("[TopicManagement] TOC response received:", tocResponse);
      
      // Extract sections from the response
      const sections = extractTOCSections(tocResponse);
      console.log("[TopicManagement] Extracted TOC sections:", sections);
      
      if (sections.length === 0) {
        console.error("[TopicManagement] Failed to extract valid TOC sections");
        // If extraction failed, create fallback sections
        const fallbackSections = generateFallbackTOC(userTopic);
        console.log("[TopicManagement] Using fallback TOC:", fallbackSections);
        
        // Create AI message with TOC
        const aiMessageId = `ai-toc-${Date.now()}`;
        setMessages(prev => [...prev, {
          id: aiMessageId,
          text: `Let's explore "${userTopic}"! Here's what we'll cover:`,
          isUser: false,
          tableOfContents: fallbackSections,
          isIntroduction: true
        }]);
        
        setTopicSectionsGenerated(true);
      } else {
        // Create AI message with TOC
        const aiMessageId = `ai-toc-${Date.now()}`;
        setMessages(prev => [...prev, {
          id: aiMessageId,
          text: `Let's explore "${userTopic}"! Here's what we'll cover:`,
          isUser: false,
          tableOfContents: sections,
          isIntroduction: true
        }]);
        
        console.log("[TopicManagement] Setting topicSectionsGenerated to true");
        setTopicSectionsGenerated(true);
        
        // Update learning progress
        setLearningProgress(0);
      }
      
      // Generate related topics in the background
      generateTopicRelations(
        userTopic, 
        generateResponse, 
        ageRange, 
        language, 
        setRelatedTopics
      );
    } catch (error) {
      console.error("[TopicManagement] Error in handleNewTopicRequest:", error);
      // Create error message
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        text: "I had trouble creating a learning plan for that topic. Can you try another one?",
        isUser: false,
        error: {
          message: error instanceof Error ? error.message : "Unknown error in topic processing"
        }
      }]);
    } finally {
      setShowTypingIndicator(false);
      setIsProcessing(false);
      setInputValue("");
    }
  }, [
    ageRange, 
    generateResponse, 
    inputValue, 
    isProcessing, 
    language, 
    setInputValue, 
    setIsProcessing, 
    setMessages, 
    setSelectedTopic, 
    setShowTypingIndicator, 
    setTopicSectionsGenerated, 
    setLearningProgress,
    setRelatedTopics
  ]);

  // Improved function to extract TOC sections
  const extractTOCSections = (text: string): string[] => {
    console.log("[TopicManagement] Raw TOC text to parse:", text);
    
    // Try multiple parsing approaches
    let sections: string[] = [];
    
    // Method 1: Look for numbered list (1. Item)
    const numberedRegex = /\d+\.\s*([^\n]+)/g;
    let match;
    while ((match = numberedRegex.exec(text)) !== null) {
      if (match[1] && match[1].trim().length > 0) {
        sections.push(match[1].trim());
      }
    }
    
    // Log the results of method 1
    console.log("[TopicManagement] Sections from numbered regex:", sections);
    
    // If numbering extraction failed, try line-by-line approach
    if (sections.length === 0) {
      sections = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim()) // Remove any numbering
        .filter(line => 
          line.length > 5 && 
          !line.toLowerCase().includes('table of contents') &&
          !line.toLowerCase().includes('here') &&
          !line.toLowerCase().includes('topic') &&
          !line.toLowerCase().includes('section') &&
          !line.toLowerCase().includes('introduction') &&
          !line.toLowerCase().includes('conclusion')
        );
      
      console.log("[TopicManagement] Sections from line-by-line approach:", sections);
    }
    
    // Remove any descriptions after colons if they exist
    sections = sections.map(section => {
      const colonIndex = section.indexOf(':');
      return colonIndex > 0 ? section.substring(0, colonIndex).trim() : section;
    });
    
    // Truncate sections to ensure they're not too long
    sections = sections.map(section => 
      section.length > 50 ? section.substring(0, 50) + '...' : section
    );
    
    // Take only a reasonable number of sections (4-6)
    if (sections.length > 6) {
      sections = sections.slice(0, 6);
    }
    
    console.log("[TopicManagement] Final processed TOC sections:", sections);
    return sections;
  };

  // Add a fallback TOC generator
  const generateFallbackTOC = (topic: string): string[] => {
    const lowerTopic = topic.toLowerCase();
    
    // Space/Astronomy related topics
    if (lowerTopic.includes('space') || lowerTopic.includes('planet') || 
        lowerTopic.includes('star') || lowerTopic.includes('universe')) {
      return [
        "What is in our solar system?",
        "How planets form and evolve",
        "The different types of planets",
        "Amazing facts about space",
        "Space exploration history"
      ];
    }
    
    // Animals/Nature related topics
    else if (lowerTopic.includes('animal') || lowerTopic.includes('wildlife') || 
             lowerTopic.includes('nature') || lowerTopic.includes('ocean')) {
      return [
        "Introduction to the topic",
        "Where they live and what they eat",
        "Amazing adaptations",
        "Interesting facts and behaviors",
        "Conservation and protection"
      ];
    }
    
    // History related topics
    else if (lowerTopic.includes('history') || lowerTopic.includes('ancient') || 
             lowerTopic.includes('civilization') || lowerTopic.includes('war')) {
      return [
        "Background and timeline",
        "Important people and events",
        "Daily life during this period",
        "Inventions and discoveries",
        "Legacy and impact today"
      ];
    }
    
    // Default generic sections
    return [
      "Introduction to " + topic,
      "Key concepts and ideas",
      "Interesting facts and discoveries",
      "Real-world applications",
      "Fun activities to try"
    ];
  };

  return { isNewTopicRequest, handleNewTopicRequest };
};

export default useTopicManagement;
