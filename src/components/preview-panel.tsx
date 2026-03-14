"use client";

import { useEffect, useRef, useState } from "react";
import { sanitizeLandingHtml } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Code2,
  Copy,
  Download,
  Check,
  Monitor,
} from "lucide-react";
import { toast } from "sonner";

interface PreviewPanelProps {
  html: string | null;
  isStreaming: boolean;
  streamingHtml: string;
}

export function PreviewPanel({
  html,
  isStreaming,
  streamingHtml,
}: PreviewPanelProps) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [displayHtml, setDisplayHtml] = useState("");
  const debounceRef = useRef<NodeJS.Timeout>(undefined);

  // Streaming debounce — update preview every 150ms during streaming
  useEffect(() => {
    const rawHtml = isStreaming ? streamingHtml : html;
    if (!rawHtml) {
      setDisplayHtml("");
      return;
    }

    if (isStreaming) {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setDisplayHtml(sanitizeLandingHtml(rawHtml));
      }, 150);
      return () => clearTimeout(debounceRef.current);
    } else {
      setDisplayHtml(sanitizeLandingHtml(rawHtml));
    }
  }, [html, isStreaming, streamingHtml]);

  async function handleCopy() {
    const content = html || streamingHtml;
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Código copiado al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar al portapapeles");
    }
  }

  function handleDownload() {
    const content = html || streamingHtml;
    if (!content) return;

    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `landing-page-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Archivo descargado");
  }

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex gap-1">
          <button
            onClick={() => setTab("preview")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
              tab === "preview"
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => setTab("code")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
              tab === "code"
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code2 className="w-4 h-4" />
            Código
          </button>
        </div>

        {(html || streamingHtml) && (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="cursor-pointer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 mr-1" />
              ) : (
                <Copy className="w-3.5 h-3.5 mr-1" />
              )}
              {copied ? "Copiado" : "Copiar"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Descargar
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {tab === "preview" ? (
          displayHtml ? (
            <iframe
              sandbox=""
              srcDoc={displayHtml}
              className="w-full h-full border-0"
              title="Landing page preview"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
              <Monitor className="w-12 h-12 opacity-40" />
              <p className="text-sm">Tu landing page aparecerá aquí</p>
            </div>
          )
        ) : (
          <div className="h-full overflow-auto p-4 bg-muted/30">
            {displayHtml ? (
              <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap break-words text-foreground">
                <code>{html || streamingHtml}</code>
              </pre>
            ) : (
              <p className="text-sm text-muted-foreground">
                El código HTML aparecerá aquí después de generar tu landing page.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
