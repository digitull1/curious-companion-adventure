
export type BlockType =
  | "did-you-know"
  | "mind-blowing"
  | "amazing-stories"
  | "see-it"
  | "quiz";

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  blocks?: BlockType[];
  showBlocks?: boolean;
  tableOfContents?: string[];
  isIntroduction?: boolean;
  error?: {
    message: string;
    details: string;
  };
  image?: {
    url: string;
    alt: string;
    isUserUploaded?: boolean;
  };
  imagePrompt?: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    funFact?: string;
  };
}

export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
  funFact: string;
}

export type MessageProcessingStatus = "processing" | "completed" | "error";

export interface MessageProcessingResult {
  status: MessageProcessingStatus;
  messageId?: string;
  error?: Message;
}
