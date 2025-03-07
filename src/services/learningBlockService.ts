
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
  try {
    console.log("Block clicked:", type, "for message:", messageId, "text:", messageText.substring(0, 30) + "...");
    setIsProcessing(true);
    setShowTypingIndicator(true);
    let blockResponse = "";
    let imagePrompt = "";
    let quiz = undefined;
    
    // Award points for exploring content
    setPoints(prev => prev + 15);
    
    switch (type) {
      case "did-you-know":
        blockResponse = await generateResponse(`Give me an interesting fact related to: ${messageText} that would amaze a ${ageRange} year old. Be fun and educational.`, ageRange, language);
        break;
      case "mind-blowing":
        blockResponse = await generateResponse(`Tell me something mind-blowing about the science related to: ${messageText} that would fascinate a ${ageRange} year old. Use an enthusiastic tone.`, ageRange, language);
        break;
      case "amazing-stories":
        blockResponse = await generateResponse(`Share an amazing story or legend related to: ${messageText} appropriate for a ${ageRange} year old. Keep it engaging and educational.`, ageRange, language);
        break;
      case "see-it":
        try {
          blockResponse = "Here's a visual representation I created for you:";
          imagePrompt = `${messageText} in a style that appeals to ${ageRange} year old children, educational, detailed, colorful, Pixar style illustration`;
          console.log("Generating image with prompt:", imagePrompt);
        } catch (error) {
          console.error("Error generating image:", error);
          blockResponse = "I'm sorry, I couldn't create an image right now. Let me tell you about it instead!";
          const fallbackResponse = await generateResponse(`Describe ${messageText} visually for a ${ageRange} year old in vivid, colorful terms.`, ageRange, language);
          blockResponse += "\n\n" + fallbackResponse;
        }
        break;
      case "quiz":
        blockResponse = "Let's test your knowledge with a quick quiz! Get all answers right to earn bonus points! 🎯";
        try {
          console.log("Generating quiz for topic:", messageText, "in", language, "language");
          quiz = await generateQuiz(messageText, language);
          console.log("Quiz generated successfully:", quiz);
        } catch (error) {
          console.error("Error generating quiz:", error);
          quiz = {
            question: "Which of these is a fact about this topic?",
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswer: 0
          };
        }
        break;
    }

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setShowTypingIndicator(false);

    const blockMessage: Message = {
      id: Date.now().toString(),
      text: blockResponse,
      isUser: false,
      imagePrompt: imagePrompt || undefined,
      quiz: quiz || undefined
    };

    console.log("Adding block message:", blockMessage);
    setMessages(prev => [...prev, blockMessage]);
  } catch (error) {
    console.error("Error processing learning block:", error);
    setShowTypingIndicator(false);
    toast.error("Sorry, I couldn't process that right now. Please try again.");
  } finally {
    setIsProcessing(false);
  }
};

