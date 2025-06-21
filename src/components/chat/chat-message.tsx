
import type { ChatMessageContent } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: ChatMessageContent;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const isLLM = message.sender === 'llm';
  const isSystem = message.sender === 'system';

  return (
    <div
      className={cn(
        'flex items-start gap-3 my-4 animate-fadeIn',
        isUser ? 'justify-end' : 'justify-start',
        isSystem && 'justify-center'
      )}
      aria-live="polite"
    >
      {isLLM && (
        <Avatar className="h-8 w-8 border border-border">
          <AvatarFallback className="bg-transparent">
            <Bot className="h-5 w-5 text-foreground/80" />
          </AvatarFallback>
        </Avatar>
      )}

      {isSystem && (
         <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
      )}

      <div
        className={cn(
          'max-w-[70%] rounded-2xl p-3 shadow-lg break-words backdrop-blur-md border',
          isUser && 'bg-primary/40 border-primary/30 text-primary-foreground rounded-br-none',
          isLLM && 'bg-card/70 border-card-foreground/10 text-card-foreground rounded-bl-none',
          isSystem && 'bg-destructive/10 border-destructive/20 text-destructive text-sm italic'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        {!isSystem && (
           <p className={cn(
             'text-xs mt-1.5',
             isUser ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'
           )}>
             {format(message.timestamp, 'HH:mm')}
           </p>
        )}
      </div>
      {/* User avatar removed as per screenshot */}
    </div>
  );
}
