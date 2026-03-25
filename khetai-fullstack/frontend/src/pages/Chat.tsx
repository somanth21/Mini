import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { sendChatMessage } from '@/services/api.js';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your Annagrah Assistant. How can I help you with your farming needs today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
       const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/20 p-3 rounded-2xl">
          <MessageSquare className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-headline tracking-tight">AI Chat Assistant</h1>
          <p className="text-sm text-muted-foreground">Get instant answers to all your agriculture queries.</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col border-none shadow-xl overflow-hidden bg-card/50 backdrop-blur">
        <CardContent className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4" ref={scrollRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-full animate-in slide-in-from-bottom-2 duration-300",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "flex gap-3 max-w-[80%] items-end",
                message.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                  message.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
                  message.role === 'user' 
                    ? "bg-primary text-primary-foreground rounded-br-none" 
                    : "bg-background border rounded-bl-none"
                )}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="bg-muted/40 p-3 rounded-2xl rounded-bl-none border flex gap-1">
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              placeholder="Ask about crops, weather, mandi prices..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="h-12 rounded-xl focus:ring-primary/20 bg-background"
            />
            <Button type="submit" disabled={loading || !input.trim()} size="icon" className="h-12 w-12 rounded-xl shrink-0">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
