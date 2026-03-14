"use client";

import { useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import type { WizardData } from "@/lib/storage";
import { extractHtmlFromResponse } from "@/lib/utils";
import { Message } from "./message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Loader2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

function getMessageText(message: UIMessage): string {
  return (
    message.parts
      ?.filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
      .map((p) => p.text)
      .join("") ?? ""
  );
}

interface ChatPanelProps {
  wizardData: WizardData;
  currentHtml: string | null;
  iterationCount: number;
  onHtmlUpdate: (html: string) => void;
  onIterationIncrement: () => void;
}

export function ChatPanel({
  wizardData,
  currentHtml,
  iterationCount,
  onHtmlUpdate,
  onIterationIncrement,
}: ChatPanelProps) {
  const hasSentInitial = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");

  const { messages, sendMessage, status, error, regenerate, clearError } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onFinish({ message }) {
      const text = getMessageText(message);
      const html = extractHtmlFromResponse(text);
      if (html) {
        onHtmlUpdate(html);
      }
    },
  });

  const isBusy = status === "streaming" || status === "submitted";

  // Auto-send initial generation
  useEffect(() => {
    if (hasSentInitial.current) return;
    if (!currentHtml) {
      hasSentInitial.current = true;
      sendMessage(
        {
          text: `Genera una landing page para mi negocio: ${wizardData.productName}. ${wizardData.businessDescription}`,
        },
        { body: { wizardData } }
      );
    } else {
      hasSentInitial.current = true;
    }
  }, [currentHtml, wizardData, sendMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!inputValue.trim() || isBusy || iterationCount >= 5) return;

    onIterationIncrement();
    sendMessage(
      { text: inputValue.trim() },
      { body: { currentHtml } }
    );
    setInputValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleRetry() {
    clearError();
    regenerate();
  }

  const isMaxIterations = iterationCount >= 5;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <h2 className="font-display text-lg font-semibold">Chat</h2>
        <Badge
          variant="outline"
          className={
            isMaxIterations
              ? "border-highlight text-highlight"
              : "border-primary text-primary"
          }
        >
          {isMaxIterations
            ? "Limite alcanzado"
            : `Edicion ${iterationCount}/5`}
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const text = getMessageText(msg);
          const msgHasHtml =
            msg.role === "assistant" && extractHtmlFromResponse(text) !== null;

          return <Message key={msg.id} message={msg} hasHtml={msgHasHtml} />;
        })}

        {isBusy && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Generando...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">
              Error al generar. Intenta de nuevo.
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="flex-shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reintentar
            </Button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-card">
        {isMaxIterations ? (
          <p className="text-sm text-center text-muted-foreground py-2">
            Has alcanzado el limite de 5 ediciones. Descarga tu landing page o
            crea una nueva.
          </p>
        ) : (
          <div className="flex gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ej: Cambia el hero, agrega testimonios, hazlo mas oscuro..."
              rows={1}
              disabled={isBusy}
              className="resize-none min-h-[40px] max-h-[120px]"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isBusy}
              size="icon"
              className="flex-shrink-0 self-end cursor-pointer"
            >
              {isBusy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
