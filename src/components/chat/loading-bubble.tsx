
"use client"

import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export function LoadingBubble() {
  return (
    <div className="flex items-start gap-3 my-4 justify-start animate-fadeIn">
      <Avatar className="h-8 w-8 border border-border">
        <AvatarFallback className="bg-transparent">
          <Bot className="h-5 w-5 text-foreground/80" />
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'relative max-w-min rounded-2xl p-3 shadow-lg break-words backdrop-blur-md border overflow-hidden',
          'bg-secondary/70 dark:bg-card/70 border-border text-card-foreground rounded-bl-none'
        )}
      >
        <div className="flex items-end justify-center space-x-1 h-5 px-1">
          <span className="h-1.5 w-1.5 bg-muted-foreground/80 rounded-full animate-bubble-bounce [animation-delay:-0.2s]"></span>
          <span className="h-1.5 w-1.5 bg-muted-foreground/80 rounded-full animate-bubble-bounce [animation-delay:-0.1s]"></span>
          <span className="h-1.5 w-1.5 bg-muted-foreground/80 rounded-full animate-bubble-bounce"></span>
        </div>
      </div>
    </div>
  );
}
