
import { Message, MessageProcessingStatus, MessageProcessingResult } from "@/types/chat";
import { toast } from "sonner";

// Use module-level variables for more reliable tracking
let isMessageBeingProcessed = false;
let processingStartTime = 0;
let processingId = '';
let canceledOperations = new Set<string>();
let messageProcessCounter = 0;

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
    // Generate a unique ID for this processing operation
    const currentProcessingId = `msg-${Date.now()}`;
    processingId = currentProcessingId;
    messageProcessCounter++;
    const currentCounter = messageProcessCounter;
    
    console.log(`[MessageHandler][START:${currentProcessingId}] Processing message: "${prompt.substring(0, 30)}..."`, 
      `isUserMessage: ${isUserMessage}`, `skipUserMessage: ${skipUserMessage}`, `counter: ${currentCounter}`);
    
    // Log current state
    console.log(`[MessageHandler][${currentProcessingId}] Current isMessageBeingProcessed flag: ${isMessageBeingProcessed}`, 
      isMessageBeingProcessed ? `Set ${Date.now() - processingStartTime}ms ago` : '');
    
    // Prevent multiple concurrent message processing
    if (isMessageBeingProcessed) {
      console.log(`[MessageHandler][${currentProcessingId}][BLOCKED] Already processing another message, ignoring this request`);
      toast.info("Please wait for the current message to be processed");
      return { status: "error", error: { message: "Another message is already being processed" } };
    }
    
    // Set processing flags
    isMessageBeingProcessed = true;
    processingStartTime = Date.now();
    console.log(`[MessageHandler][${currentProcessingId}][FLAG] Set isMessageBeingProcessed = true at ${new Date().toISOString()}`);
    
    setIsProcessing(true);
    setShowTypingIndicator(true);

    // Generate unique IDs for messages
    const userMessageId = `user-${Date.now()}`;
    const aiMessageId = `ai-${Date.now() + 1}`;
    
    // Add user message if needed
    if (isUserMessage && !skipUserMessage) {
      const userMessage: Message = {
        id: userMessageId,
        text: prompt,
        isUser: true
      };
      console.log(`[MessageHandler][${currentProcessingId}] Adding user message to chat: ${userMessage.id}`);
      
      // Use a function to set messages to avoid race conditions
      setMessages(prev => {
        console.log(`[MessageHandler][${currentProcessingId}] setMessages called with prev.length=${prev.length}`);
        return [...prev, userMessage];
      });
    }

    try {
      // Check if this operation was canceled before generating response
      if (canceledOperations.has(currentProcessingId)) {
        console.log(`[MessageHandler][${currentProcessingId}][CANCELED] Operation was canceled before response generation`);
        return { status: "error", error: { message: "Operation was canceled" } };
      }
      
      // Generate response
      console.log(`[MessageHandler][${currentProcessingId}] Generating response for age: ${ageRange}, language: ${language}`);
      const response = await generateResponse(prompt, ageRange, language);
      console.log(`[MessageHandler][${currentProcessingId}] Response generated successfully: ${response.length} chars`);
      
      // Small delay for typing effect
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if this operation was canceled after generating response
      if (canceledOperations.has(currentProcessingId) || processingId !== currentProcessingId) {
        console.log(`[MessageHandler][${currentProcessingId}][CANCELED] Operation was canceled or superseded after response generation`);
        return { status: "error", error: { message: "Operation was superseded by another request" } };
      }
      
      // Log before changing typing indicator
      console.log(`[MessageHandler][${currentProcessingId}] About to set showTypingIndicator to false`);
      setShowTypingIndicator(false);
      
      const aiMessage: Message = {
        id: aiMessageId,
        text: response,
        isUser: false,
        blocks: ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"],
        showBlocks: false // Only show blocks in content box, not in regular messages
      };
      
      console.log(`[MessageHandler][${currentProcessingId}] Adding AI message to chat: ${aiMessage.id}`);
      
      // Use a function to set messages to avoid race conditions
      setMessages(prev => {
        console.log(`[MessageHandler][${currentProcessingId}] setMessages (AI) called with prev.length=${prev.length}`);
        // Check if the most recent message is a user message that matches our expected ID
        const lastMessage = prev[prev.length - 1];
        const expectedUserMessageExists = lastMessage && 
                                          lastMessage.isUser && 
                                          (!isUserMessage || skipUserMessage || lastMessage.id === userMessageId);
        
        if (!expectedUserMessageExists && isUserMessage && !skipUserMessage) {
          console.warn(`[MessageHandler][${currentProcessingId}] Expected user message not found, might cause UI refresh issues`);
        }
        
        return [...prev, aiMessage];
      });
      
      // Award points
      setPoints(prev => {
        console.log(`[MessageHandler][${currentProcessingId}] Awarding points: +10 (current: ${prev})`);
        return prev + 10;
      });
      
      console.log(`[MessageHandler][${currentProcessingId}][END] Message processing completed successfully`);
      return { status: "completed", messageId: aiMessage.id };
    } catch (error) {
      console.error(`[MessageHandler][${currentProcessingId}] Error processing message:`, error);
      
      // Log before changing typing indicator
      console.log(`[MessageHandler][${currentProcessingId}] About to set showTypingIndicator to false due to error`);
      setShowTypingIndicator(false);
      
      // Handle errors
      let errorMessageText = "Sorry, there was an error processing your request. Please try again.";
      let errorDetails = "";
      
      if (error instanceof Error) {
        console.error(`[MessageHandler][${currentProcessingId}] Error details:`, error.stack);
        errorMessageText = `Error: ${error.message}`;
        errorDetails = error.stack || "";
      }
      
      toast.error(errorMessageText);
      
      // Add error message
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
      
      console.log(`[MessageHandler][${currentProcessingId}][END] Message processing failed`);
      return { 
        status: "error", 
        error: { 
          message: errorMessageText, 
          details: errorDetails 
        }
      };
    } finally {
      console.log(`[MessageHandler][${currentProcessingId}][CLEANUP] Resetting state after processing`);
      setIsProcessing(false);
      setInputValue("");
      
      // Release the processing lock after a delay
      setTimeout(() => {
        // Only reset if this is still the active processing operation
        if (processingId === currentProcessingId) {
          isMessageBeingProcessed = false;
          console.log(`[MessageHandler][${currentProcessingId}][FLAG] Reset isMessageBeingProcessed = false after ${Date.now() - processingStartTime}ms`);
        } else {
          console.log(`[MessageHandler][${currentProcessingId}][SKIP] Not resetting flag as this is no longer the active operation`);
        }
      }, 700); // Slightly longer delay to ensure smooth transitions
    }
  };

  // Add a function to cancel current operation
  const cancelCurrentOperation = () => {
    if (processingId) {
      canceledOperations.add(processingId);
      console.log(`[MessageHandler] Canceling current operation: ${processingId}`);
      
      // Clean up old canceled operations (keep set small)
      if (canceledOperations.size > 10) {
        const oldestOperations = Array.from(canceledOperations).slice(0, 5);
        oldestOperations.forEach(opId => canceledOperations.delete(opId));
      }
    }
  };

  return { processMessage, cancelCurrentOperation };
};
