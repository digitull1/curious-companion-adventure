
import { Message, MessageProcessingStatus, MessageProcessingResult } from "@/types/chat";
import { toast } from "sonner";

// Default block types to include in messages
const DEFAULT_BLOCKS = ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"];

export const useMessageHandling = (
  generateResponse: (prompt: string, ageRange: string, language: string) => Promise<string>,
  ageRange: string,
  language: string,
  setMessages: (messageSetter: (prev: Message[]) => Message[]) => void,
  setIsProcessing: (isProcessing: boolean) => void,
  setShowTypingIndicator: (show: boolean) => void,
  setInputValue: (value: string) => void,
  setPoints: (pointsSetter: (prev: number) => number) => void
) => {
  // Use this flag to prevent multiple messages from being processed simultaneously
  let isMessageBeingProcessed = false;
  
  const processMessage = async (
    prompt: string, 
    isUserMessage: boolean = true, 
    skipUserMessage: boolean = false
  ): Promise<MessageProcessingResult> => {
    console.log(`[MessageHandler][START] Processing message: "${prompt.substring(0, 30)}..."`, 
      `isUserMessage: ${isUserMessage}`, `skipUserMessage: ${skipUserMessage}`);
    
    // Prevent multiple concurrent message processing
    if (isMessageBeingProcessed) {
      console.log(`[MessageHandler] Already processing another message, ignoring this request`);
      return { status: "error", error: { message: "Another message is already being processed" } };
    }
    
    isMessageBeingProcessed = true;
    
    // Generate unique IDs for user and AI messages to prevent collisions
    const userMessageId = `user-${Date.now()}`;
    const aiMessageId = `ai-${Date.now() + 1}`;
    
    setIsProcessing(true);
    setShowTypingIndicator(true);

    // If it's a user message and we're not skipping user message display
    if (isUserMessage && !skipUserMessage) {
      const userMessage: Message = {
        id: userMessageId,
        text: prompt,
        isUser: true
      };
      console.log(`[MessageHandler] Adding user message to chat: ${userMessage.id}`);
      setMessages(prev => [...prev, userMessage]);
    }

    try {
      // Generate response based on the prompt
      console.log(`[MessageHandler] Generating response for age: ${ageRange}, language: ${language}`);
      const response = await generateResponse(prompt, ageRange, language);
      console.log(`[MessageHandler] Response generated successfully: ${response.length} chars`);
      
      // Simulate a delay for typing effect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowTypingIndicator(false);
      
      const aiMessage: Message = {
        id: aiMessageId,
        text: response,
        isUser: false,
        blocks: DEFAULT_BLOCKS, // Always include the default blocks
        showBlocks: true
      };
      
      console.log(`[MessageHandler] Adding AI message to chat with blocks:`, aiMessage.blocks);
      setMessages(prev => [...prev, aiMessage]);
      
      // Increment points for each interaction
      setPoints(prev => {
        console.log(`[MessageHandler] Awarding points: +10 (current: ${prev})`);
        return prev + 10;
      });
      
      console.log(`[MessageHandler][END] Message processing completed successfully`);
      return { status: "completed", messageId: aiMessage.id };
    } catch (error) {
      console.error(`[MessageHandler] Error processing message:`, error);
      setShowTypingIndicator(false);
      
      // Improved error handling with proper types
      let errorMessage = "Sorry, there was an error processing your request. Please try again.";
      let errorDetails = "";
      
      if (error instanceof Error) {
        console.error(`[MessageHandler] Error details:`, error.stack);
        errorMessage = `Error: ${error.message}`;
        errorDetails = error.stack || "";
      }
      
      toast.error(errorMessage);
      
      // Add error message to the chat
      const errorMessageObj: Message = {
        id: Date.now().toString(),
        text: "I encountered a problem processing your request. Let's try something else!",
        isUser: false,
        error: {
          message: errorMessage,
          details: errorDetails
        }
      };
      
      setMessages(prev => [...prev, errorMessageObj]);
      
      console.log(`[MessageHandler][END] Message processing failed`);
      return { 
        status: "error", 
        error: { 
          message: errorMessage, 
          details: errorDetails 
        }
      };
    } finally {
      console.log(`[MessageHandler] Cleaning up after processing message`);
      setIsProcessing(false);
      setInputValue("");
      // Release the processing lock after a short delay to prevent immediate re-submissions
      setTimeout(() => {
        isMessageBeingProcessed = false;
      }, 300);
    }
  };

  return { processMessage };
};
