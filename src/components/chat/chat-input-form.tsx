
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { SendHorizonal, Loader2 } from 'lucide-react';

const formSchema = z.object({
  question: z.string().min(1, { message: "Question cannot be empty." }).max(2000, { message: "Question is too long." }),
});

type FormValues = z.infer<typeof formSchema>;

interface ChatInputFormProps {
  onSubmit: (question: string) => Promise<void>;
  isLoading: boolean;
}

export function ChatInputForm({ onSubmit, isLoading }: ChatInputFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
    },
  });

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    await onSubmit(data.question);
    if (!isLoading) { 
       form.reset();
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading && form.formState.isValid) {
        form.handleSubmit(handleFormSubmit)();
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="p-4 border-t border-border bg-[hsl(var(--input))] sticky bottom-0">
        <div className="container mx-auto max-w-3xl">
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem className="flex-grow relative">
                <FormControl>
                  <Textarea
                    placeholder="Ask KGPT anything..."
                    className="min-h-[52px] resize-none focus-visible:ring-ring pr-14 bg-background rounded-lg border-border focus-visible:border-primary"
                    {...field}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    aria-label="Type your question here"
                  />
                </FormControl>
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="default" 
                  className="bg-[hsl(var(--send-button-background))] hover:bg-[hsl(var(--send-button-background))]/90 text-[hsl(var(--send-button-foreground))] rounded-full absolute right-3 top-1/2 transform -translate-y-1/2" 
                  disabled={isLoading} 
                  aria-label={isLoading ? "Sending question" : "Send question"}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <SendHorizonal className="h-4 w-4" />
                  )}
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
