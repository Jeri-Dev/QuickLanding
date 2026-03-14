"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BUSINESS_TYPES,
  BUSINESS_TYPE_LABELS,
  LANDING_STYLES,
  LANDING_STYLE_LABELS,
  type BusinessType,
  type LandingStyle,
  type WizardData,
  createWizardSession,
  setSession,
} from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Sparkles, Check } from "lucide-react";

const STYLE_PREVIEWS: Record<LandingStyle, { colors: string; vibe: string }> = {
  modern: { colors: "from-blue-500 to-purple-600", vibe: "Limpio, actual y sofisticado" },
  minimal: { colors: "from-gray-200 to-gray-400", vibe: "Simple, espacioso y elegante" },
  bold: { colors: "from-orange-500 to-pink-600", vibe: "Vibrante, energico y llamativo" },
  corporate: { colors: "from-slate-600 to-slate-800", vibe: "Profesional, confiable y serio" },
  creative: { colors: "from-emerald-400 to-cyan-500", vibe: "Unico, artistico y fresco" },
  dark: { colors: "from-gray-800 to-black", vibe: "Elegante, moderno y misterioso" },
};

export default function WizardPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form state
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);
  const [businessDescription, setBusinessDescription] = useState("");
  const [style, setStyle] = useState<LandingStyle | null>(null);
  const [productName, setProductName] = useState("");
  const [slogan, setSlogan] = useState("");
  const [cta, setCta] = useState("Comenzar ahora");
  const [additionalContent, setAdditionalContent] = useState("");

  const canProceedStep1 = businessType !== null && businessDescription.trim().length >= 10;
  const canProceedStep2 = style !== null;
  const canProceedStep3 = productName.trim().length >= 2 && cta.trim().length > 0;

  function handleGenerate() {
    if (!businessType || !style) return;

    const wizardData: WizardData = {
      businessType,
      businessDescription: businessDescription.trim(),
      style,
      productName: productName.trim(),
      slogan: slogan.trim(),
      cta: cta.trim(),
      additionalContent: additionalContent.trim(),
    };

    const session = createWizardSession(wizardData);
    setSession(session);
    router.push(`/create/chat?session=${session.id}`);
  }

  return (
    <div className="min-h-screen grid-paper flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {([1, 2, 3] as const).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border transition-colors",
                  s < step && "bg-primary text-primary-foreground border-primary",
                  s === step && "bg-card text-primary border-primary shadow-sm",
                  s > step && "bg-muted text-muted-foreground border-border"
                )}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={cn(
                    "w-12 h-0.5 rounded-full",
                    s < step ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-8 sm:p-10">
          {/* Step 1: Business */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Cuéntanos sobre tu negocio
                </h2>
                <p className="text-muted-foreground">
                  Esta información ayudará a la IA a generar contenido relevante.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Tipo de negocio
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {BUSINESS_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setBusinessType(type)}
                      className={cn(
                        "px-4 py-3 rounded-lg border text-sm font-medium text-left transition-colors cursor-pointer",
                        businessType === type
                          ? "border-primary bg-secondary text-primary ring-2 ring-primary/20"
                          : "border-border bg-card text-foreground hover:bg-muted"
                      )}
                    >
                      {BUSINESS_TYPE_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Descripción del negocio
                </label>
                <Textarea
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="Ej: Somos una startup que ofrece software de gestión de inventario para pequeñas tiendas..."
                  rows={3}
                  maxLength={500}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {businessDescription.length < 10
                    ? `Mínimo 10 caracteres (${businessDescription.length}/10)`
                    : `${businessDescription.length}/500`}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="cursor-pointer"
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Style */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Elige un estilo visual
                </h2>
                <p className="text-muted-foreground">
                  Define la personalidad visual de tu landing page.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {LANDING_STYLES.map((s) => {
                  const preview = STYLE_PREVIEWS[s];
                  return (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={cn(
                        "group rounded-xl border overflow-hidden text-left transition-all cursor-pointer",
                        style === s
                          ? "border-primary ring-2 ring-primary/20 shadow-md"
                          : "border-border hover:border-primary/40 hover:shadow-sm"
                      )}
                    >
                      <div
                        className={cn(
                          "h-16 bg-gradient-to-br",
                          preview.colors
                        )}
                      />
                      <div className="p-3 bg-card">
                        <p className="font-medium text-sm text-foreground">
                          {LANDING_STYLE_LABELS[s]}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {preview.vibe}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                  className="cursor-pointer"
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Content */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Contenido de tu landing
                </h2>
                <p className="text-muted-foreground">
                  Agrega el contenido clave que aparecerá en tu landing page.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Nombre del producto / empresa *
                  </label>
                  <Input
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Ej: InventoryPro"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Slogan / Tagline
                  </label>
                  <Input
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                    placeholder="Ej: Simplifica tu inventario"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Texto del botón CTA *
                  </label>
                  <Input
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    placeholder="Comenzar ahora"
                    maxLength={50}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Contenido adicional
                  </label>
                  <Textarea
                    value={additionalContent}
                    onChange={(e) => setAdditionalContent(e.target.value)}
                    placeholder="Features, beneficios, precios, testimonios... lo que quieras incluir"
                    rows={3}
                    maxLength={500}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    {additionalContent.length}/500
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={!canProceedStep3}
                  className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generar Landing Page
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
