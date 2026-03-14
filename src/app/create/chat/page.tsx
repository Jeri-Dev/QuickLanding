"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSession, setSession, clearSession, type LandingSession } from "@/lib/storage";
import { ChatPanel } from "@/components/chat-panel";
import { PreviewPanel } from "@/components/preview-panel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Eye,
  Plus,
  Home,
} from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  const router = useRouter();
  const [session, setSessionState] = useState<LandingSession | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [streamingHtml, setStreamingHtml] = useState("");

  // SSR hydration guard — load session from localStorage only after mount
  useEffect(() => {
    setMounted(true);
    const stored = getSession();
    if (!stored || stored.status === "wizard") {
      router.replace("/create");
      return;
    }
    setSessionState(stored);
  }, [router]);

  // beforeunload warning
  useEffect(() => {
    if (!session?.generatedHtml) return;

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [session?.generatedHtml]);

  const handleHtmlUpdate = useCallback(
    (html: string) => {
      if (!session) return;

      const updated: LandingSession = {
        ...session,
        status: "editing",
        generatedHtml: html,
        iterationCount: session.iterationCount,
      };

      setSessionState(updated);
      setSession(updated);
      setStreamingHtml("");
    },
    [session]
  );

  const handleIterationIncrement = useCallback(() => {
    if (!session) return;

    const newCount = Math.min(session.iterationCount + 1, 5);
    const updated: LandingSession = {
      ...session,
      status: session.generatedHtml ? "editing" : session.status,
      iterationCount: newCount,
    } as LandingSession;

    setSessionState(updated);
    setSession(updated);
  }, [session]);

  function handleNewLanding() {
    if (session?.generatedHtml) {
      const confirmed = confirm(
        "¿Estás seguro? Perderás la landing page actual."
      );
      if (!confirmed) return;
    }
    clearSession();
    router.push("/create");
  }

  if (!mounted || !session) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="cursor-pointer">
              <Home className="w-4 h-4 mr-1" />
              Inicio
            </Button>
          </Link>
          <span className="text-sm text-muted-foreground">
            {session.wizard.productName}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNewLanding}
          className="cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1" />
          Nueva landing
        </Button>
      </div>

      {/* Mobile toggle */}
      <div className="flex md:hidden border-b border-border bg-card">
        <button
          onClick={() => setShowPreview(false)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors cursor-pointer",
            !showPreview
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          )}
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </button>
        <button
          onClick={() => setShowPreview(true)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors cursor-pointer",
            showPreview
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          )}
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
      </div>

      {/* Split view */}
      <div className="flex-1 flex overflow-hidden">
        <div
          className={cn(
            "flex-1 md:flex-none md:w-1/2 overflow-hidden",
            showPreview ? "hidden md:block" : "block"
          )}
        >
          <ChatPanel
            wizardData={session.wizard}
            currentHtml={session.generatedHtml}
            iterationCount={session.iterationCount}
            onHtmlUpdate={handleHtmlUpdate}
            onIterationIncrement={handleIterationIncrement}
          />
        </div>
        <div
          className={cn(
            "flex-1 md:flex-none md:w-1/2 overflow-hidden",
            !showPreview ? "hidden md:block" : "block"
          )}
        >
          <PreviewPanel
            html={session.generatedHtml}
            isStreaming={false}
            streamingHtml={streamingHtml}
          />
        </div>
      </div>
    </div>
  );
}
