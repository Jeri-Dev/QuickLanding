"use client";

import type { UIMessage } from "ai";
import { cn } from "@/lib/utils";
import { Bot, User, CheckCircle2 } from "lucide-react";

interface MessageProps {
  message: UIMessage;
  hasHtml: boolean;
}

export function Message({ message, hasHtml }: MessageProps) {
  const isUser = message.role === "user";

  // Get text content from parts
  const text = message.parts
    ?.filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
    .map((p) => p.text)
    .join("") ?? "";

  return (
    <div
      className={cn(
        "flex gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-card border border-border rounded-tl-sm"
        )}
      >
        {isUser ? (
          <p>{text}</p>
        ) : hasHtml ? (
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-medium">Landing page actualizada</span>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{text}</p>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
