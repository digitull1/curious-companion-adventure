
import { Message } from "@/types/chat";
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
  const processMessage = async (prompt: string, isUserMessage: boolean = true, skipUserMessage: boolean = false) => {
    console.log(`[MessageHandler] Processing message: "${prompt.substring(0, 30)}..."`, 
      `isUserMessage: ${isUserMessage}`, `skipUserMessage: ${skipUserMessage}`);
    
    setIsProcessing(true);
    setShowTypingIndicator(true);

    // If it's a user message and we're not skipping user message display
    if (isUserMessage && !skipUserMessage) {
      const userMessage: Message = {
        id: Date.now().toString(),
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
        id: (Date.now() + 1).toString(),
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
    } catch (error) {
      console.error(`[MessageHandler] Error processing message:`, error);
      setShowTypingIndicator(false);
      
      // Improved error handling
      let errorMessage = "Sorry, there was an error processing your request. Please try again.";
      if (error instanceof Error) {
        console.error(`[MessageHandler] Error details:`, error.stack);
        errorMessage = `Error: ${error.message}`;
      }
      
      toast.error(errorMessage);
    } finally {
      console.log(`[MessageHandler] Message processing completed`);
      setIsProcessing(false);
      setInputValue("");
    }
  };

  return { processMessage };
};
