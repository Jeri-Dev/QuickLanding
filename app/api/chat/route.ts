import { SYSTEM_PROMPT } from "@/config/constants"
import { buildUserPrompt, cleanHtmlResponse } from "@/lib/buildUserPrompt"
import { Groq } from "groq-sdk"
import { NextRequest, NextResponse } from "next/server"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const groqChatPrompt = (
	text: string,
	style: string,
	palette: string,
	context?: string,
) => {
	return groq.chat.completions.create({
		model: "openai/gpt-oss-20b",
		messages: [
			{
				role: "system",
				content: SYSTEM_PROMPT,
			},
			{
				role: "assistant",
				content: context ? `Here the context : ${context}` : "",
			},
			{
				role: "user",
				content: buildUserPrompt(text, style, palette),
			},
		],
	})
}

export async function POST(request: NextRequest) {
	try {
		const { message, palette, style, context } = await request.json()

		if (context && context.length > 0) {
			console.log("Context received:", context)
		}

		await new Promise((resolve) => setTimeout(resolve, 1000))

		const responseMessage = `¡Perfecto! He creado tu landing page con estilo ${style} y la paleta de colores seleccionada. Puedes ver el resultado en el panel de la derecha. ✨`

		const result = await groqChatPrompt(message, style, palette, context)
		const rawHtml = result.choices[0].message.content || ""
		const cleanedHtml = cleanHtmlResponse(rawHtml)

		console.log("Cleaned HTML:", cleanedHtml)

		return NextResponse.json({
			success: true,
			message: responseMessage,
			htmlContent: cleanedHtml,
		})
	} catch {
		return NextResponse.json(
			{ success: false, error: "Error al procesar el mensaje" },
			{ status: 500 },
		)
	}
}
