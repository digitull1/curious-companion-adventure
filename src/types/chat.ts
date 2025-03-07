
export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  blocks?: BlockType[];
  showBlocks?: boolean;
  imagePrompt?: string;
  quiz?: Quiz;
  code?: CodeSnippet;
  tableOfContents?: string[];
  isIntroduction?: boolean;
}

export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
  funFact?: string;
}

export interface CodeSnippet {
  snippet: string;
  language: string;
}

export type BlockType = "did-you-know" | "mind-blowing" | "amazing-stories" | "see-it" | "quiz";
