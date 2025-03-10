
export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  blocks?: BlockType[];
  showBlocks?: boolean;
  imagePrompt?: string;
  imageUrl?: string;
  quiz?: Quiz;
  code?: CodeSnippet;
  tableOfContents?: string[];
  isIntroduction?: boolean;
  error?: ErrorInfo;
}

export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
  funFact?: string;
  answered?: boolean;
  selectedAnswer?: number;
}

export interface CodeSnippet {
  snippet: string;
  language: string;
}

export interface ErrorInfo {
  message: string;
  details?: string;
  code?: string;
}

export type BlockType = "did-you-know" | "mind-blowing" | "amazing-stories" | "see-it" | "quiz";

export type MessageProcessingStatus = "idle" | "processing" | "completed" | "error";

export interface MessageProcessingResult {
  status: MessageProcessingStatus;
  messageId?: string;
  error?: Message;
}
