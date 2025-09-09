
"use client";

import { chat, ChatInput } from "@/ai/flows/chat";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Bot, Loader2, Send, User } from "lucide-react";
import { FormEvent, useRef, useState, useTransition, KeyboardEvent } from "react";

type Message = {
  role: "user" | "model";
  content: { text: string }[];
};

export function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!input.trim() || isPending) return;

    const newMessages: Message[] = [
        ...messages,
        {
            role: "user",
            content: [{ text: input }],
        }
    ];

    setMessages(newMessages);

    const chatInput: ChatInput = {
      history: messages,
      prompt: input,
    };

    setInput("");

    startTransition(async () => {
        try {
            const responseText = await chat(chatInput);
            const modelMessage: Message = {
                role: 'model',
                content: [{ text: responseText }],
            };
            setMessages((prev) => [...prev, modelMessage]);
        } catch (error) {
            console.error("Chat failed:", error);
            const errorMessage: Message = {
                role: 'model',
                content: [{ text: "Sorry, I encountered an error. Please try again." }],
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setTimeout(() => {
                if (scrollAreaRef.current) {
                    const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
                    if (viewport) {
                        viewport.scrollTop = viewport.scrollHeight;
                    }
                }
            }, 100);
        }
    });
  };


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage();
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
  }

  return (
    <Card className="h-full flex flex-col max-h-[85vh]">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>AI Chat Assistant</CardTitle>
            <CardDescription>
              Ask me anything about farming, crops, and weather.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-4 pr-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "model" && (
                  <div className="p-2 bg-primary/10 text-primary rounded-full">
                    <Bot className="w-5 h-5" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-xs md:max-w-md lg:max-w-2xl rounded-lg px-4 py-2 text-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {msg.content[0].text}
                </div>
                 {msg.role === "user" && (
                  <div className="p-2 bg-muted/80 text-foreground rounded-full">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
            {isPending && (
                <div className="flex items-start gap-3 justify-start">
                    <div className="p-2 bg-primary/10 text-primary rounded-full">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div className="bg-muted text-foreground rounded-lg px-4 py-2 text-sm flex items-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                        Thinking...
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-6">
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
          <Input
            type="text"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
            className="flex-grow"
          />
          <Button type="submit" disabled={isPending || !input.trim()}>
            {isPending ? <Loader2 className="animate-spin"/> : <Send/>}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
