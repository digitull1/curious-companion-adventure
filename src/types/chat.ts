export type BlockType =
  | "did-you-know"
  | "mind-blowing"
  | "amazing-stories"
  | "see-it"
  | "quiz";

export type MessageProcessingStatus = "processing" | "completed" | "error";

export interface MessageProcessingResult {
  status: MessageProcessingStatus;
  messageId?: string;
  error?: {
    message: string;
    details?: string;
  };
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  blocks?: BlockType[];
  showBlocks?: boolean;
  tableOfContents?: string[];
  error?: {
    message: string;
    details?: string;
  };
  imagePrompt?: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    funFact?: string;
  };
  code?: {
    snippet: string;
    language: string;
  };
  isIntroduction?: boolean;
  blockType?: BlockType; // Add this to track which block generated this message
}
