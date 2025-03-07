import { useCallback, useEffect } from "react";
import { Message } from "@/types/chat";
import { toast } from "sonner";
import { processTopicsFromResponse } from "@/utils/topicUtils";

export const useTopicManagement = (
  selectedTopic: string | null,
  topicSectionsGenerated: boolean,
  messages: Message[],
  completedSections: string[],
  relatedTopics: string[],
  generateResponse: (prompt: string, ageRange: string, language: string) => Promise<string>,
  ageRange: string,
  language: string,
  setLearningComplete: (complete: boolean) => void,
  setRelatedTopics: (topics: string[]) => void,
  generateRelatedTopics: (topic: string, ageRange: string, language: string) => Promise<string[]>,
  inputValue: string,
  isProcessing: boolean,
  setMessages: (messageSetter: (prev: Message[]) => Message[]) => void,
  setInputValue: (value: string) => void,
  setIsProcessing: (processing: boolean) => void,
  setShowTypingIndicator: (show: boolean) => void,
  setSelectedTopic: (topic: string | null) => void,
  setTopicSectionsGenerated: (generated: boolean) => void,
  setCompletedSections: (sections: string[]) => void,
  setCurrentSection: (section: string | null) => void,
  setPreviousTopics: (topicsSetter: (prev: string[]) => string[]) => void,
  setPoints: (pointsSetter: (prev: number) => number) => void,
  setLearningProgress: (progress: number) => void
) => {
  // Check if all sections are completed
  useEffect(() => {
    if (topicSectionsGenerated && messages.some(m => m.tableOfContents)) {
      const sections = messages.find(m => m.tableOfContents)?.tableOfContents || [];
      if (sections.length > 0 && completedSections.length === sections.length) {
        console.log("All sections completed, setting learningComplete to true");
        setLearningComplete(true);
        
        // Generate related topics if not already generated
        if (relatedTopics.length === 0 && selectedTopic) {
          generateTopicRelations(selectedTopic);
        }
      }
    }
  }, [completedSections, topicSectionsGenerated, messages, selectedTopic]);

  // Generate related topics
  const generateTopicRelations = useCallback(async (topic: string) => {
    try {
      const topics = await generateRelatedTopics(topic, ageRange, language);
      setRelatedTopics(topics);
    } catch (error) {
      console.error("Error in generateTopicRelations:", error);
      setRelatedTopics([
        "Space exploration", 
        "Astronomy facts", 
        "Planets and moons", 
        "Solar system formation", 
        "Black holes"
      ]);
    }
  }, [ageRange, language, generateRelatedTopics, setRelatedTopics]);

  // Handle new topic request
  const handleNewTopicRequest = async () => {
    console.log("Handling new topic request");
    
    // Record previous topic if exists
    if (selectedTopic) {
      console.log("Saving previous topic:", selectedTopic);
      setPreviousTopics(prev => [...prev, selectedTopic]);
    }
    
    // IMPORTANT: Reset states for new topic before adding new messages
    console.log("RESET: Clearing state for new topic request");
    setTopicSectionsGenerated(false);
    setCompletedSections([]);
    setCurrentSection(null);
    setLearningComplete(false);
    setRelatedTopics([]);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true
    };
    
    console.log("Adding user message for new topic:", userMessage);
    setMessages(prev => {
      // Keep only the welcome message, remove all topic-specific messages
      const welcomeMsg = prev.find(m => m.isIntroduction && !m.tableOfContents);
      return welcomeMsg ? [welcomeMsg, userMessage] : [userMessage];
    });
    
    setInputValue("");
    setIsProcessing(true);
    setShowTypingIndicator(true);

    try {
      console.log("Generating TOC for new topic:", inputValue);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowTypingIndicator(false);
      
      // Generate table of contents for encyclopedia-style approach
      const tocPrompt = `Generate a concise table of contents with 4-5 sections for learning about: ${inputValue}. Format as a numbered list.`;
      const tocResponse = await generateResponse(tocPrompt, ageRange, language);
      console.log("Generated TOC response:", tocResponse);
      
      // Parse the TOC into sections
      const sections = processTopicsFromResponse(tocResponse);
      console.log("Parsed TOC sections:", sections);
      
      // Create introduction message with TOC
      const tocMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I'd love to teach you about ${inputValue}! Here's what we'll explore:`,
        isUser: false,
        tableOfContents: sections,
        isIntroduction: true
      };
      
      console.log("Adding TOC message:", tocMessage);
      setMessages(prev => {
        // Find and keep the welcome message and user message
        const welcomeMsg = prev.find(m => m.isIntroduction && !m.tableOfContents);
        const userMsg = prev.find(m => m.isUser && m.text === inputValue);
        
        const baseMessages = [];
        if (welcomeMsg) baseMessages.push(welcomeMsg);
        if (userMsg) baseMessages.push(userMsg);
        
        return [...baseMessages, tocMessage];
      });
      
      setSelectedTopic(inputValue);
      setTopicSectionsGenerated(true);
      
      // Generate related topics based on the main topic
      generateTopicRelations(inputValue);
      
      // Add points for starting a new learning journey
      setPoints(prev => prev + 25);
      setLearningProgress(10);
    } catch (error) {
      console.error("Error generating TOC:", error);
      toast.error("Sorry, there was an error processing your request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if this is a new topic request
  const isNewTopicRequest = useCallback((input: string, currentTopic: string | null, sectionsGenerated: boolean) => {
    return !currentTopic || !sectionsGenerated || 
           (input.toLowerCase().indexOf("tell me about") === 0) ||
           (input.toLowerCase().indexOf("what is") === 0) ||
           (input.toLowerCase().indexOf("how does") === 0);
  }, []);

  return {
    handleNewTopicRequest,
    isNewTopicRequest,
    generateTopicRelations
  };
};
