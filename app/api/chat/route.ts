import { SYSTEM_PROMPT } from "@/config/constants"
import { buildUserPrompt, cleanHtmlResponse } from "@/lib/buildUserPrompt"
import { Groq } from "groq-sdk"
import { NextRequest, NextResponse } from "next/server"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const groqChatPrompt = (text: string, style: string, palette: string) => {
	return groq.chat.completions.create({
		model: "openai/gpt-oss-20b",
		messages: [
			{
				role: "system",
				content: SYSTEM_PROMPT,
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
		const { message, palette, style } = await request.json()

		await new Promise((resolve) => setTimeout(resolve, 1000))

		const responseMessage = `¡Perfecto! He creado tu landing page con estilo ${style} y la paleta de colores seleccionada. Puedes ver el resultado en el panel de la derecha. ✨`

		const result = await groqChatPrompt(message, style, palette)
		const rawHtml = result.choices[0].message.content || ""
		const cleanedHtml = cleanHtmlResponse(rawHtml)

		console.log("GROQ Response:", rawHtml)
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
