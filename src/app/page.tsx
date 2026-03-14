"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession } from "@/lib/storage";
import { Sparkles, Palette, MessageSquare, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Sparkles,
    title: "Describe tu negocio",
    description: "Tipo de negocio, estilo visual y contenido clave",
  },
  {
    icon: MessageSquare,
    title: "Chatea con la IA",
    description: "Refina tu landing page con hasta 5 iteraciones",
  },
  {
    icon: Download,
    title: "Descarga tu landing",
    description: "HTML + Tailwind CSS listo para desplegar",
  },
];

export default function HomePage() {
  const [hasSession, setHasSession] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const session = getSession();
    if (session && session.generatedHtml) {
      setHasSession(true);
    }
  }, []);

  return (
    <div className="min-h-screen grid-paper">
      {/* Hero */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium border border-border">
            <Palette className="w-4 h-4" />
            Impulsado por IA
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
            Tu landing page en{" "}
            <span className="text-primary">minutos</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Describe tu negocio, elige un estilo, y deja que la inteligencia
            artificial genere una landing page profesional lista para usar.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/create">
              <Button
                size="lg"
                className="text-base px-8 py-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Crear mi Landing Page
              </Button>
            </Link>

            {mounted && hasSession && (
              <Link href="/create/chat">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base px-8 py-6 rounded-xl cursor-pointer"
                >
                  Continuar editando
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Steps */}
        <div className="max-w-3xl mx-auto mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 px-4">
          {steps.map((step, i) => (
            <div key={i} className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-card border border-border shadow-sm">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-display text-lg font-semibold text-foreground">
                  {step.title}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer line */}
        <p className="mt-20 text-sm text-muted-foreground/60">
          HTML + Tailwind CSS &middot; Responsive &middot; Sin registro
        </p>
      </div>
    </div>
  );
}
