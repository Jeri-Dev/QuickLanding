import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod/v4";
import {
  BUSINESS_TYPES,
  LANDING_STYLES,
  type WizardData,
} from "@/lib/storage";

export const maxDuration = 60;

const requestSchema = z.object({
  messages: z.array(z.unknown()),
  wizardData: z
    .object({
      businessType: z.enum(BUSINESS_TYPES),
      businessDescription: z.string(),
      style: z.enum(LANDING_STYLES),
      productName: z.string(),
      slogan: z.string(),
      cta: z.string(),
      additionalContent: z.string(),
    })
    .optional(),
  currentHtml: z.string().optional(),
});

function getInitialPrompt(wizard: WizardData): string {
  return `Eres un experto en diseño web y landing pages. Genera una landing page completa en HTML con Tailwind CSS.

Requisitos OBLIGATORIOS:
- Incluir en el <head>: <script src="https://cdn.tailwindcss.com"></script>
- NO incluir ningun otro tag <script> aparte del de Tailwind CDN
- Usar clases de Tailwind para todo el styling
- Usar clases responsive (sm:, md:, lg:)
- Estructura minima: Hero con titulo y CTA, seccion de Features/Benefits, seccion CTA final, Footer
- Devolver UNICAMENTE el HTML completo (<!DOCTYPE html>...</html>), sin explicaciones, sin markdown, sin backticks
- Usar imagenes placeholder de https://images.unsplash.com con parametros ?w=800&h=600 para dimensiones
- El diseño debe ser visualmente atractivo y profesional
- Usar colores y tipografia que coincidan con el estilo visual seleccionado

Datos del negocio:
- Tipo: ${wizard.businessType}
- Descripcion: ${wizard.businessDescription}
- Estilo visual: ${wizard.style}
- Nombre: ${wizard.productName}
${wizard.slogan ? `- Slogan: ${wizard.slogan}` : ""}
- Texto del CTA: ${wizard.cta}
${wizard.additionalContent ? `- Contenido adicional: ${wizard.additionalContent}` : ""}`;
}

function getIterationPrompt(currentHtml: string): string {
  return `Eres un experto en diseño web. El HTML actual de la landing page del usuario es:

\`\`\`html
${currentHtml}
\`\`\`

Modifica la landing page segun la peticion del usuario.
Reglas OBLIGATORIAS:
- Devolver UNICAMENTE el HTML completo modificado (<!DOCTYPE html>...</html>)
- Sin explicaciones, sin markdown, sin backticks
- Mantener <script src="https://cdn.tailwindcss.com"></script> en el head
- NO incluir otros tags <script> aparte del de Tailwind CDN
- Mantener el diseño responsive con clases Tailwind (sm:, md:, lg:)`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Datos de solicitud inválidos" },
        { status: 422 }
      );
    }

    const { messages, wizardData, currentHtml } = parsed.data;

    const systemPrompt = currentHtml
      ? getIterationPrompt(currentHtml)
      : wizardData
        ? getInitialPrompt(wizardData)
        : "Eres un experto en diseño web. Ayuda al usuario con su landing page.";

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      messages: await convertToModelMessages(messages as unknown as UIMessage[]),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";

    if (message.includes("401") || message.includes("Invalid API Key")) {
      return Response.json(
        {
          error:
            "API key no configurada. Agrega tu GROQ_API_KEY en .env.local",
        },
        { status: 401 }
      );
    }

    if (message.includes("429") || message.includes("rate")) {
      return Response.json(
        {
          error:
            "Demasiadas solicitudes. Espera un momento e intenta de nuevo.",
        },
        { status: 429 }
      );
    }

    return Response.json(
      { error: "Error al generar la landing page. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
