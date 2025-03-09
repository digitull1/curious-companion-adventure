
import { Message, MessageProcessingStatus, MessageProcessingResult } from "@/types/chat";
import { toast } from "sonner";

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
  const processMessage = async (
    prompt: string, 
    isUserMessage: boolean = true, 
    skipUserMessage: boolean = false
  ): Promise<MessageProcessingResult> => {
    console.log(`[MessageHandler] Processing message: "${prompt.substring(0, 30)}..."`, 
      `isUserMessage: ${isUserMessage}`, `skipUserMessage: ${skipUserMessage}`);
    
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
        blocks: ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"],
        showBlocks: true
      };
      
      console.log(`[MessageHandler] Adding AI message to chat: ${aiMessage.id}`);
      setMessages(prev => [...prev, aiMessage]);
      
      // Increment points for each interaction
      setPoints(prev => {
        console.log(`[MessageHandler] Awarding points: +10 (current: ${prev})`);
        return prev + 10;
      });
      
      return { status: "completed", messageId: aiMessage.id };
    } catch (error) {
      console.error(`[MessageHandler] Error processing message:`, error);
      setShowTypingIndicator(false);
      
      // Improved error handling
      let errorMessageText = "Sorry, there was an error processing your request. Please try again.";
      let errorDetails = "";
      
      if (error instanceof Error) {
        console.error(`[MessageHandler] Error details:`, error.stack);
        errorMessageText = `Error: ${error.message}`;
        errorDetails = error.stack || "";
      }
      
      toast.error(errorMessageText);
      
      // Add error message to the chat
      const errorMessageObj: Message = {
        id: Date.now().toString(),
        text: "I encountered a problem processing your request. Let's try something else!",
        isUser: false,
        error: {
          message: errorMessageText,
          details: errorDetails
        }
      };
      
      setMessages(prev => [...prev, errorMessageObj]);
      
      return { 
        status: "error", 
        error: errorMessageObj
      };
    } finally {
      console.log(`[MessageHandler] Message processing completed`);
      setIsProcessing(false);
      setInputValue("");
    }
  };

  return { processMessage };
};
