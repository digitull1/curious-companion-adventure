
import { BlockType, Message } from "@/types/chat";
import { toast } from "sonner";

// Ensure we have a single instance of this flag across the application
let isBlockProcessing = false;

export const handleBlockClick = async (
  type: BlockType,
  messageId: string,
  messageText: string,
  ageRange: string,
  language: string,
  setIsProcessing: (isProcessing: boolean) => void,
  setShowTypingIndicator: (show: boolean) => void,
  setPoints: (pointsSetter: (prev: number) => number) => void,
  setMessages: (messageSetter: (prev: Message[]) => Message[]) => void,
  generateResponse: (prompt: string, ageRange: string, language: string) => Promise<string>,
  generateQuiz: (topic: string, language: string) => Promise<any>
) => {
  const blockId = `block-${Date.now()}-${type}`;
  console.log(`[LearningBlock][START:${blockId}] Processing ${type} block for message: ${messageId.substring(0, 8)}...`);
  console.log(`[LearningBlock][${blockId}] Message text: "${messageText.substring(0, 50)}..."`);
  
  // Check for existing block processing - return early to prevent race conditions
  if (isBlockProcessing) {
    console.log(`[LearningBlock][${blockId}] Already processing another block, ignoring this request`);
    toast.info("Already processing a request, please wait...");
    return;
  }
  
  try {
    // Set processing flag immediately to prevent multiple clicks
    isBlockProcessing = true;
    console.log(`[LearningBlock][${blockId}] Setting isBlockProcessing flag to true`);
    
    setIsProcessing(true);
    setShowTypingIndicator(true);
    let blockResponse = "";
    let imagePrompt = "";
    let quiz = undefined;
    
    // Award points for exploring content
    setPoints(prev => {
      console.log(`[LearningBlock][${blockId}] Awarding points: +15 (current: ${prev})`);
      return prev + 15;
    });
    
    switch (type) {
      case "did-you-know":
        console.log(`[LearningBlock][${blockId}] Generating 'did-you-know' content for age: ${ageRange}, language: ${language}`);
        blockResponse = await generateResponse(`Give me an interesting fact related to: ${messageText} that would amaze a ${ageRange} year old. Be fun and educational.`, ageRange, language);
        break;
      case "mind-blowing":
        console.log(`[LearningBlock][${blockId}] Generating 'mind-blowing' content for age: ${ageRange}, language: ${language}`);
        blockResponse = await generateResponse(`Tell me something mind-blowing about the science related to: ${messageText} that would fascinate a ${ageRange} year old. Use an enthusiastic tone.`, ageRange, language);
        break;
      case "amazing-stories":
        console.log(`[LearningBlock][${blockId}] Generating 'amazing-stories' content for age: ${ageRange}, language: ${language}`);
        blockResponse = await generateResponse(`Share an amazing story or legend related to: ${messageText} appropriate for a ${ageRange} year old. Keep it engaging and educational.`, ageRange, language);
        break;
      case "see-it":
        try {
          console.log(`[LearningBlock][${blockId}] Generating 'see-it' visual content`);
          blockResponse = "Here's a visual representation I created for you:";
          // Create a specific image prompt string
          imagePrompt = `${messageText} in a style that appeals to ${ageRange} year old children, educational, detailed, colorful, Pixar style illustration`;
          console.log(`[LearningBlock][${blockId}] Image prompt created: ${imagePrompt.substring(0, 50)}...`);
        } catch (error) {
          console.error(`[LearningBlock][${blockId}] Error generating image:`, error);
          blockResponse = "I'm sorry, I couldn't create an image right now. Let me tell you about it instead!";
          console.log(`[LearningBlock][${blockId}] Falling back to text description`);
          const fallbackResponse = await generateResponse(`Describe ${messageText} visually for a ${ageRange} year old in vivid, colorful terms.`, ageRange, language);
          blockResponse += "\n\n" + fallbackResponse;
        }
        break;
      case "quiz":
        console.log(`[LearningBlock][${blockId}] Generating quiz for topic: ${messageText.substring(0, 30)}...`);
        blockResponse = "Let's test your knowledge with a quick quiz! Get all answers right to earn bonus points! 🎯";
        try {
          quiz = await generateQuiz(messageText, language);
          console.log(`[LearningBlock][${blockId}] Quiz generated successfully with ${quiz?.options?.length || 0} options`);
        } catch (error) {
          console.error(`[LearningBlock][${blockId}] Error generating quiz:`, error);
          toast.error("There was an issue creating your quiz. Using a simple one instead!");
          quiz = {
            question: "Which of these is a fact about this topic?",
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswer: 0
          };
        }
        break;
      default:
        console.warn(`[LearningBlock][${blockId}] Unknown block type: ${type}`);
        blockResponse = "I'm not sure how to process this block type. Let's try something else!";
    }

    // Simulate typing delay
    console.log(`[LearningBlock][${blockId}] Simulating typing delay before showing response`);
    await new Promise(resolve => setTimeout(resolve, 800));
    setShowTypingIndicator(false);

    // Create the block message with the correct structure
    const blockMessage: Message = {
      id: blockId,
      text: blockResponse,
      isUser: false,
      blockType: type, // Set the block type to identify this message
    };

    // Add specific properties based on block type
    if (imagePrompt) {
      blockMessage.imagePrompt = imagePrompt;
      console.log(`[LearningBlock][${blockId}] Added image prompt to message: ${imagePrompt.substring(0, 50)}...`);
    }
    
    if (quiz) {
      blockMessage.quiz = quiz;
      console.log(`[LearningBlock][${blockId}] Added quiz to message with question: ${quiz.question.substring(0, 50)}...`);
    }

    console.log(`[LearningBlock][${blockId}] Adding block message to chat: ${blockMessage.id}`);
    console.log(`[LearningBlock][${blockId}] Block message details:`, { 
      id: blockMessage.id,
      blockType: blockMessage.blockType,
      text: blockMessage.text.substring(0, 50) + "...",
      hasImagePrompt: !!blockMessage.imagePrompt,
      hasQuiz: !!blockMessage.quiz
    });
    
    // Add the message to the chat
    setMessages(prev => [...prev, blockMessage]);
  } catch (error) {
    console.error(`[LearningBlock][${blockId}] Critical error processing block:`, error);
    setShowTypingIndicator(false);
    
    // More detailed error handling
    let errorMessage = "Sorry, I couldn't process that right now. Please try again.";
    if (error instanceof Error) {
      errorMessage = `Error: ${error.message}`;
      console.error(`[LearningBlock][${blockId}] Error details:`, error.stack);
    }
    
    toast.error(errorMessage);
  } finally {
    console.log(`[LearningBlock][${blockId}][END] Finished processing ${type} block`);
    setIsProcessing(false);
    
    // Clear the processing flag
    console.log(`[LearningBlock][${blockId}] Resetting isBlockProcessing flag to false`);
    
    // Use a longer timeout to ensure all operations are complete
    setTimeout(() => {
      isBlockProcessing = false;
    }, 1000);
  }
};

// Clean up global window property access
declare global {
  interface Window {
    _isBlockProcessing?: boolean;
  }
}

// Clear any hanging state on page load
if (typeof window !== 'undefined') {
  window._isBlockProcessing = false;
}
