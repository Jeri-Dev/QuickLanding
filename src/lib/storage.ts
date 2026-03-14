import { z } from "zod/v4";

// --- Enum constants (single source of truth) ---

export const BUSINESS_TYPES = [
  "saas",
  "ecommerce",
  "restaurant",
  "portfolio",
  "startup",
  "consulting",
  "other",
] as const;
export type BusinessType = (typeof BUSINESS_TYPES)[number];

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  saas: "SaaS / Software",
  ecommerce: "E-commerce / Tienda",
  restaurant: "Restaurante / Comida",
  portfolio: "Portafolio / Personal",
  startup: "Startup / Tecnología",
  consulting: "Consultoría / Servicios",
  other: "Otro",
};

export const LANDING_STYLES = [
  "modern",
  "minimal",
  "bold",
  "corporate",
  "creative",
  "dark",
] as const;
export type LandingStyle = (typeof LANDING_STYLES)[number];

export const LANDING_STYLE_LABELS: Record<LandingStyle, string> = {
  modern: "Moderno",
  minimal: "Minimalista",
  bold: "Bold / Vibrante",
  corporate: "Corporativo",
  creative: "Creativo",
  dark: "Oscuro / Dark",
};

// --- Wizard data ---

export interface WizardData {
  businessType: BusinessType;
  businessDescription: string;
  style: LandingStyle;
  productName: string;
  slogan: string;
  cta: string;
  additionalContent: string;
}

// --- Discriminated union session types ---

interface BaseSession {
  id: string;
  createdAt: string;
  wizard: WizardData;
}

interface WizardSession extends BaseSession {
  status: "wizard";
  generatedHtml: null;
  iterationCount: 0;
}

interface GeneratingSession extends BaseSession {
  status: "generating";
  generatedHtml: null;
  iterationCount: 0;
}

interface EditingSession extends BaseSession {
  status: "editing";
  generatedHtml: string;
  iterationCount: number;
}

interface CompletedSession extends BaseSession {
  status: "completed";
  generatedHtml: string;
  iterationCount: number;
}

export type LandingSession =
  | WizardSession
  | GeneratingSession
  | EditingSession
  | CompletedSession;

// --- Zod schema for localStorage validation ---

const wizardDataSchema = z.object({
  businessType: z.enum(BUSINESS_TYPES),
  businessDescription: z.string(),
  style: z.enum(LANDING_STYLES),
  productName: z.string(),
  slogan: z.string(),
  cta: z.string(),
  additionalContent: z.string(),
});

const sessionSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  status: z.enum(["wizard", "generating", "editing", "completed"]),
  wizard: wizardDataSchema,
  generatedHtml: z.string().nullable(),
  iterationCount: z.number().int().min(0).max(5),
});

// --- localStorage helpers ---

const SESSION_KEY = "quicklanding_session";

export function getSession(): LandingSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const result = sessionSchema.safeParse(parsed);

    if (!result.success) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return result.data as LandingSession;
  } catch {
    return null;
  }
}

export function setSession(session: LandingSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    console.warn("Failed to save session to localStorage");
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

export function createWizardSession(wizard: WizardData): LandingSession {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "generating",
    wizard,
    generatedHtml: null,
    iterationCount: 0,
  };
}
