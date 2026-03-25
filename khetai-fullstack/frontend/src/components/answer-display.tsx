import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface AnswerDisplayProps {
  content: string;
  className?: string;
}

export function AnswerDisplay({ content, className }: AnswerDisplayProps) {
  return (
    <div
      className={cn(
        'prose prose-sm md:prose-base dark:prose-invert max-w-none',
        'prose-p:leading-relaxed prose-pre:bg-muted prose-pre:text-muted-foreground',
        'prose-headings:font-headline prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        className
      )}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
