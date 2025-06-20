export interface ChatMessageContent {
  id: string;
  text: string;
  sender: 'user' | 'llm' | 'system';
  timestamp: Date;
}
