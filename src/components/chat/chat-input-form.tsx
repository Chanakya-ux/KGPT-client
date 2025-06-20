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
    if (!isLoading) { // Only reset if not still loading (e.g. error occurred before loading state change)
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
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex items-start gap-2 p-4 border-t border-border bg-background sticky bottom-0">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <Textarea
                  placeholder="Ask KGPT something..."
                  className="min-h-[52px] resize-none focus-visible:ring-accent"
                  {...field}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  aria-label="Type your question here"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground h-[52px]" disabled={isLoading} aria-label={isLoading ? "Sending question" : "Send question"}>
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <SendHorizonal className="h-5 w-5" />
          )}
        </Button>
      </form>
    </Form>
  );
}
