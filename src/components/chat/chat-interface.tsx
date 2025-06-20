"use client";

import { useState, useRef, useEffect } from 'react';
import type { ChatMessageContent } from '@/lib/types';
import { ChatMessage } from './chat-message';
import { ChatInputForm } from './chat-input-form';
import { askQuestionAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { ThemeToggleButton } from '@/components/theme-toggle-button';

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    setMessages([
      {
        id: crypto.randomUUID(),
        text: "Hello! I'm KGPT. How can I assist you today?",
        sender: 'llm',
        timestamp: new Date(),
      }
    ]);
  }, []);

  const handleSendMessage = async (question: string) => {
    const userMessage: ChatMessageContent = {
      id: crypto.randomUUID(),
      text: question,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const result = await askQuestionAction(question);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else if (result.answer) {
        const llmMessage: ChatMessageContent = {
          id: crypto.randomUUID(),
          text: result.answer,
          sender: 'llm',
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, llmMessage]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background">
      <header className="p-4 border-b border-border bg-primary text-primary-foreground shadow-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center gap-2">
          <Bot className="h-7 w-7" />
          <h1 className="text-xl font-semibold font-headline">KGPT Chat</h1>
          <div className="ml-auto">
            <ThemeToggleButton />
          </div>
        </div>
      </header>
      
      <main className="flex-grow overflow-hidden container mx-auto p-0 md:p-4 flex justify-center">
        <Card className="w-full max-w-3xl h-full flex flex-col shadow-xl rounded-none md:rounded-lg">
          <CardContent className="flex-grow p-0 overflow-hidden">
             <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>
          <ChatInputForm onSubmit={handleSendMessage} isLoading={isLoading} />
        </Card>
      </main>
    </div>
  );
}
