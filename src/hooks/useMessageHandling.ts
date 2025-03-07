
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
    console.log("Processing message:", prompt, "isUserMessage:", isUserMessage, "skipUserMessage:", skipUserMessage);
    setIsProcessing(true);
    setShowTypingIndicator(true);

    // If it's a user message and we're not skipping user message display
    if (isUserMessage && !skipUserMessage) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: prompt,
        isUser: true
      };
      console.log("Adding user message to chat:", userMessage);
      setMessages(prev => [...prev, userMessage]);
    }

    try {
      // Generate response based on the prompt
      const response = await generateResponse(prompt, ageRange, language);
      console.log("Generated response:", response);
      
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
      
      console.log("Adding AI message to chat:", aiMessage);
      setMessages(prev => [...prev, aiMessage]);
      
      // Increment points for each interaction
      setPoints(prev => prev + 10);
    } catch (error) {
      console.error("Error processing message:", error);
      setShowTypingIndicator(false);
      toast.error("Sorry, there was an error processing your request. Please try again.");
    } finally {
      setIsProcessing(false);
      setInputValue("");
    }
  };

  return { processMessage };
};
