// Type definitions for Contract Companion

export interface AnalysisResult {
  summary: string;
  concerns: Concern[];
  keyTerms: KeyTerm[];
}

export interface Concern {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export interface KeyTerm {
  term: string;
  explanation: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GatewayApiRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

export interface GatewayApiResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
