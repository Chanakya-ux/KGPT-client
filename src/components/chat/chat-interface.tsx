
"use client";

import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessageContent } from '@/lib/types';
import { ChatMessage } from './chat-message';
import { ChatInputForm } from './chat-input-form';
import { askQuestionAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { LoadingBubble } from './loading-bubble';
import { BlinkingBotIcon } from '../icons/blinking-bot-icon';

const suggestedQuestionsList = [
  "When is Spring Fest?",
  "When is Summer Break?",
  "When are Summer Quarter classes?",
];

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSuggestedQuestions, setShowSuggestedQuestions] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);
  
  useEffect(() => {
    setMessages([
      {
        id: crypto.randomUUID(),
        text: "Hello! I'm KGPT. How can I assist you today?",
        sender: 'llm',
        timestamp: new Date(),
      }
    ]);
    setShowSuggestedQuestions(true);
  }, []);

  const handleSendMessage = async (question: string) => {
    setShowSuggestedQuestions(false);
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
    <div className="flex flex-col h-screen max-h-screen bg-background text-foreground">
      <header className="p-4 border-b border-border bg-[hsl(var(--header-background))] text-[hsl(var(--header-foreground))] shadow-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BlinkingBotIcon className="h-7 w-7" />
            <h1 className="kgpt-heading text-xl font-semibold font-headline">
              {'KGPT'.split('').map((char, index) => (
                <span key={index} className="kgpt-letter inline-block">
                  {char}
                </span>
              ))}
            </h1>
          </div>
          <ThemeToggleButton />
        </div>
      </header>
      
      <main className="flex-grow overflow-hidden w-full flex flex-col">
        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
          <div className="container mx-auto max-w-3xl">
            {messages.map((msg, index) => (
              <React.Fragment key={msg.id}>
                <ChatMessage message={msg} />
                {showSuggestedQuestions && msg.sender === 'llm' && index === 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 justify-start pl-11">
                    {suggestedQuestionsList.map((q, i) => (
                      <Button
                        key={i}
                        variant="secondary"
                        size="sm"
                        className="rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        onClick={() => handleSendMessage(q)}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
            {isLoading && <LoadingBubble />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <ChatInputForm onSubmit={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
}
