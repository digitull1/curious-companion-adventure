
import { BlockType, Message } from "@/types/chat";
import { toast } from "sonner";

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
  console.log(`[LearningBlock][START] Processing ${type} block for message: ${messageId.substring(0, 8)}...`);
  console.log(`[LearningBlock] Message text: "${messageText.substring(0, 50)}..."`);
  
  try {
    // Prevent multiple concurrent processing
    if (window._isBlockProcessing) {
      console.log(`[LearningBlock] Already processing another block, ignoring this request`);
      return;
    }
    
    // Set a global flag to prevent concurrent processing
    window._isBlockProcessing = true;
    
    setIsProcessing(true);
    setShowTypingIndicator(true);
    let blockResponse = "";
    let imagePrompt = "";
    let quiz = undefined;
    
    // Award points for exploring content
    setPoints(prev => {
      console.log(`[LearningBlock] Awarding points: +15 (current: ${prev})`);
      return prev + 15;
    });
    
    switch (type) {
      case "did-you-know":
        console.log(`[LearningBlock] Generating 'did-you-know' content for age: ${ageRange}, language: ${language}`);
        blockResponse = await generateResponse(`Give me an interesting fact related to: ${messageText} that would amaze a ${ageRange} year old. Be fun and educational.`, ageRange, language);
        break;
      case "mind-blowing":
        console.log(`[LearningBlock] Generating 'mind-blowing' content for age: ${ageRange}, language: ${language}`);
        blockResponse = await generateResponse(`Tell me something mind-blowing about the science related to: ${messageText} that would fascinate a ${ageRange} year old. Use an enthusiastic tone.`, ageRange, language);
        break;
      case "amazing-stories":
        console.log(`[LearningBlock] Generating 'amazing-stories' content for age: ${ageRange}, language: ${language}`);
        blockResponse = await generateResponse(`Share an amazing story or legend related to: ${messageText} appropriate for a ${ageRange} year old. Keep it engaging and educational.`, ageRange, language);
        break;
      case "see-it":
        try {
          console.log(`[LearningBlock] Generating 'see-it' visual content`);
          blockResponse = "Here's a visual representation I created for you:";
          // Explicitly set the imagePrompt string
          imagePrompt = `${messageText} in a style that appeals to ${ageRange} year old children, educational, detailed, colorful, Pixar style illustration`;
          console.log(`[LearningBlock] Image prompt created: ${imagePrompt.substring(0, 50)}...`);
        } catch (error) {
          console.error(`[LearningBlock] Error generating image:`, error);
          blockResponse = "I'm sorry, I couldn't create an image right now. Let me tell you about it instead!";
          console.log(`[LearningBlock] Falling back to text description`);
          const fallbackResponse = await generateResponse(`Describe ${messageText} visually for a ${ageRange} year old in vivid, colorful terms.`, ageRange, language);
          blockResponse += "\n\n" + fallbackResponse;
        }
        break;
      case "quiz":
        console.log(`[LearningBlock] Generating quiz for topic: ${messageText.substring(0, 30)}...`);
        blockResponse = "Let's test your knowledge with a quick quiz! Get all answers right to earn bonus points! 🎯";
        try {
          quiz = await generateQuiz(messageText, language);
          console.log(`[LearningBlock] Quiz generated successfully with ${quiz?.options?.length || 0} options`);
        } catch (error) {
          console.error(`[LearningBlock] Error generating quiz:`, error);
          toast.error("There was an issue creating your quiz. Using a simple one instead!");
          quiz = {
            question: "Which of these is a fact about this topic?",
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswer: 0
          };
        }
        break;
      default:
        console.warn(`[LearningBlock] Unknown block type: ${type}`);
        blockResponse = "I'm not sure how to process this block type. Let's try something else!";
    }

    // Simulate typing delay
    console.log(`[LearningBlock] Simulating typing delay before showing response`);
    await new Promise(resolve => setTimeout(resolve, 800));
    setShowTypingIndicator(false);

    // Create the block message with the correct image prompt
    const blockMessage: Message = {
      id: `block-${Date.now()}-${type}`,
      text: blockResponse,
      isUser: false,
      imagePrompt: imagePrompt || undefined,
      quiz: quiz || undefined,
      blockType: type
    };

    console.log(`[LearningBlock] Adding block message to chat: ${blockMessage.id}`);
    console.log(`[LearningBlock] Block message details:`, { 
      id: blockMessage.id,
      blockType: blockMessage.blockType,
      text: blockMessage.text.substring(0, 50) + "...",
      hasImagePrompt: !!blockMessage.imagePrompt,
      imagePrompt: blockMessage.imagePrompt?.substring(0, 50) + "...",
      hasQuiz: !!blockMessage.quiz
    });
    
    setMessages(prev => [...prev, blockMessage]);
  } catch (error) {
    console.error(`[LearningBlock] Critical error processing block:`, error);
    setShowTypingIndicator(false);
    
    // More detailed error handling
    let errorMessage = "Sorry, I couldn't process that right now. Please try again.";
    if (error instanceof Error) {
      errorMessage = `Error: ${error.message}`;
      console.error(`[LearningBlock] Error details:`, error.stack);
    }
    
    toast.error(errorMessage);
  } finally {
    console.log(`[LearningBlock][END] Finished processing ${type} block`);
    setIsProcessing(false);
    // Clear the processing flag after a short delay to prevent immediate re-clicks
    setTimeout(() => {
      window._isBlockProcessing = false;
    }, 300);
  }
};

// Declare global flag for TypeScript
declare global {
  interface Window {
    _isBlockProcessing?: boolean;
  }
}
