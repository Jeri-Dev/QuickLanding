"use client"

import {
  Zap,
  Check,
  Github,
  Twitter,
  Linkedin,
  MessageCircle,
  ArrowRight,
  Code,
  Clock,
  Send,
  Loader2,
  ExternalLink,
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { useState, useRef, useEffect } from "react"

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  type?: 'text' | 'palette-selector' | 'style-selector'
  metadata?: {
    originalMessage?: string
    selectedPalette?: string
  }
}

const COLOR_PALETTES = [
  { id: 'blue', name: 'Azul Profesional', primary: '#3B82F6', secondary: '#60A5FA' },
  { id: 'purple', name: 'Púrpura Elegante', primary: '#8B5CF6', secondary: '#A78BFA' },
  { id: 'green', name: 'Verde Natural', primary: '#10B981', secondary: '#34D399' },
  { id: 'orange', name: 'Naranja Energético', primary: '#F97316', secondary: '#FB923C' },
  { id: 'pink', name: 'Rosa Creativo', primary: '#EC4899', secondary: '#F472B6' },
  { id: 'cyan', name: 'Cyan Moderno', primary: '#06B6D4', secondary: '#22D3EE' },
  { id: 'red', name: 'Rojo Impactante', primary: '#EF4444', secondary: '#F87171' },
  { id: 'indigo', name: 'Índigo Corporativo', primary: '#6366F1', secondary: '#818CF8' },
  { id: 'teal', name: 'Teal Fresco', primary: '#14B8A6', secondary: '#2DD4BF' },
  { id: 'amber', name: 'Ámbar Cálido', primary: '#F59E0B', secondary: '#FBBF24' },
]

const STYLES = [
  { id: 'modern', name: 'Moderno', description: 'Diseño contemporáneo con gradientes' },
  { id: 'minimal', name: 'Minimalista', description: 'Limpio y espaciado, menos es más' },
  { id: 'simple', name: 'Sencillo', description: 'Directo y fácil de navegar' },
  { id: 'bold', name: 'Audaz', description: 'Tipografía grande y elementos llamativos' },
  { id: 'elegant', name: 'Elegante', description: 'Sofisticado con detalles refinados' },
]

const features = [
  { text: "Generación con IA en tiempo real" },
  { text: "Plantillas optimizadas para conversión" },
  { text: "Publica en un clic" },
  { text: "Análisis de rendimiento integrado" },
  { text: "Diseño responsive automático" },
  { text: "Integración con tus herramientas" },
]

const socialLinks = [
  { icon: Github, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Linkedin, href: "#" },
  { icon: MessageCircle, href: "#" },
]

const trustItems = [
  { icon: Code, text: "Sin código" },
  { icon: Check, text: "Gratis para empezar" },
  { icon: Clock, text: "Listo en minutos" },
]

export default function Home() {
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [waitingFor, setWaitingFor] = useState<'palette' | 'style' | null>(null)
  const [currentContext, setCurrentContext] = useState<{
    originalMessage: string
    selectedPalette?: string
  } | null>(null)
  const [htmlPreview, setHtmlPreview] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const hasMessages = messages.length > 0


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (iframeRef.current && htmlPreview) {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
      if (iframeDoc) {
        iframeDoc.open()
        iframeDoc.write(htmlPreview)
        iframeDoc.close()
      }
    }
  }, [htmlPreview])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      const paletteMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '¡Perfecto! Ahora elige una paleta de colores para tu landing page:',
        type: 'palette-selector',
        metadata: { originalMessage: userMessage.content }
      }
      setMessages(prev => [...prev, paletteMessage])
      setCurrentContext({ originalMessage: userMessage.content })
      setWaitingFor('palette')
      setIsLoading(false)
    }, 500)
  }

  const handlePaletteSelect = (paletteId: string) => {
    if (waitingFor !== 'palette') return

    const palette = COLOR_PALETTES.find(p => p.id === paletteId)
    if (!palette) return

    const userSelection: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `✓ ${palette.name}`,
      type: 'text'
    }

    setMessages(prev => [...prev, userSelection])
    setIsLoading(true)

    setTimeout(() => {
      const styleMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '¡Excelente elección! Ahora selecciona el estilo:',
        type: 'style-selector',
        metadata: {
          originalMessage: currentContext?.originalMessage || '',
          selectedPalette: paletteId
        }
      }
      setMessages(prev => [...prev, styleMessage])
      setCurrentContext(prev => ({ ...prev!, selectedPalette: paletteId }))
      setWaitingFor('style')
      setIsLoading(false)
    }, 500)
  }

  const handleStyleSelect = async (styleId: string) => {
    if (waitingFor !== 'style') return

    const style = STYLES.find(s => s.id === styleId)
    if (!style) return

    const userSelection: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `✓ ${style.name}`,
      type: 'text'
    }

    setMessages(prev => [...prev, userSelection])
    setWaitingFor(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentContext?.originalMessage || '',
          palette: currentContext?.selectedPalette,
          style: styleId,
        })
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          type: 'text'
        }
        setMessages(prev => [...prev, assistantMessage])
        // Mostrar el HTML en el panel lateral
        if (data.htmlContent) {
          setHtmlPreview(data.htmlContent)
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
      setCurrentContext(null)
    }
  }

  const openInNewTab = () => {
    if (!htmlPreview) return
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(htmlPreview)
      newWindow.document.close()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0F1C] font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        {!showChat ? (
          <motion.main
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="flex w-full max-w-300 rounded-3xl overflow-hidden bg-[#0A0F1C]"
          >
            <div className="flex flex-col justify-between w-120 p-12 shrink-0">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <h1 className="text-[38px] font-bold leading-tight text-white">
                    Crea landing pages
                    <br />
                    en segundos con IA
                  </h1>
                  <p className="text-[#94A3B8] text-base leading-relaxed max-w-[384px]">
                    Nuestro asistente de IA te ayuda a diseñar y lanzar páginas de alta
                    conversión sin necesidad de código.
                  </p>
                </div>

                <div className="flex flex-col gap-5">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#22D3EE]">
                        <Check className="w-4 h-4 text-[#0A0F1C]" strokeWidth={3} />
                      </div>
                      <span className="text-white text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="flex items-center justify-center w-11 h-11 rounded-full bg-[#1E293B] hover:bg-[#2d3a4d] transition-colors"
                    >
                      <social.icon className="w-5 h-5 text-white" />
                    </a>
                  ))}
                </div>

                <p className="text-[#64748B] text-[13px]">
                  © 2025 QuickLanding. Todos los derechos reservados.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center flex-1 bg-[#1E293B] p-12">
              <div className="flex items-center gap-3 justify-center w-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#22D3EE]">
                  <Zap className="w-6 h-6 text-[#0A0F1C]" fill="#0A0F1C" />
                </div>
                <span className="text-white text-2xl font-bold">QuickLanding</span>
              </div>

              <div className="flex flex-col items-center gap-10 pt-20 w-full">
                <div className="w-130 rounded-4xl bg-[#0F172A] border border-[#1E293B] p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                      <div className="w-3 h-3 rounded-full bg-[#EAB308]" />
                      <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <span className="text-[#64748B] text-xs">
                        QuickLanding Preview
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-px bg-[#1E293B]" />

                  <div className="flex flex-col gap-4 flex-1">
                    <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#1E293B]">
                      <Zap className="w-4 h-4 text-[#22D3EE]" />
                      <span className="text-white text-sm">TuMarca</span>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="h-3 w-full rounded bg-[#1E293B]" />
                      <div className="h-3 w-4/5 rounded bg-[#1E293B]" />
                      <div className="h-3 w-3/5 rounded bg-[#1E293B]" />
                    </div>

                    <div className="flex gap-4 mt-4">
                      <div className="flex-1 h-20 rounded-lg bg-[#1E293B]" />
                      <div className="flex-1 h-20 rounded-lg bg-[#1E293B]" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-5">
                  <button
                    onClick={() => setShowChat(true)}
                    className="cursor-pointer flex items-center gap-3 px-8 py-4 rounded-xl bg-[#22D3EE] hover:bg-[#06B6D4] transition-colors"
                  >
                    <span className="text-[#0A0F1C] font-semibold">
                      Comenzar a crear
                    </span>
                    <ArrowRight className="w-5 h-5 text-[#0A0F1C]" />
                  </button>

                  <div className="flex items-center gap-6">
                    {trustItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-[#22D3EE]" />
                        <span className="text-[#94A3B8] text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.main>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col w-full h-screen bg-[#0A0F1C]"
          >
            {/* Header con logo - pequeño en esquina cuando hay mensajes */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`flex items-center py-4 px-6 ${hasMessages ? 'justify-start' : 'justify-center'}`}
            >
              <div className={`flex items-center gap-2 ${hasMessages ? '' : 'gap-3'}`}>
                <div className={`flex items-center justify-center rounded-xl bg-[#22D3EE] ${hasMessages ? 'w-8 h-8' : 'w-12 h-12'}`}>
                  <Zap className={`text-[#0A0F1C] ${hasMessages ? 'w-4 h-4' : 'w-6 h-6'}`} fill="#0A0F1C" />
                </div>
                <span className={`text-white font-bold ${hasMessages ? 'text-lg' : 'text-2xl'}`}>QuickLanding</span>
              </div>
            </motion.div>

            {/* Área de mensajes o welcome */}
            <div className="flex-1 flex overflow-hidden">
              {/* Panel de chat */}
              <div className={`flex flex-col overflow-hidden transition-all duration-500 ${htmlPreview ? 'w-1/2' : 'w-full'}`}>
                {!hasMessages ? (
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="flex-1 flex flex-col items-center justify-center p-8"
                  >
                    <div className="w-full max-w-3xl flex flex-col gap-8">
                      <div className="flex flex-col items-center gap-4 text-center">
                        <h2 className="text-3xl font-bold text-white">
                          ¿Qué landing page quieres crear hoy?
                        </h2>
                        <p className="text-[#94A3B8] text-lg max-w-2xl">
                          Describe tu idea y nuestro asistente de IA te ayudará a crear una landing page profesional en minutos.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar-dark">
                    <div className="max-w-3xl mx-auto space-y-6">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.type === 'palette-selector' ? (
                            <div className="w-full max-w-full">
                              <div className="bg-[#0F172A] text-white border border-[#1E293B] rounded-2xl px-4 py-3 mb-4">
                                <p className="text-sm leading-relaxed">{message.content}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {COLOR_PALETTES.map((palette) => (
                                  <button
                                    key={palette.id}
                                    onClick={() => handlePaletteSelect(palette.id)}
                                    disabled={waitingFor !== 'palette'}
                                    className="group p-3 rounded-xl bg-[#0F172A] border border-[#1E293B] hover:border-[#22D3EE] transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="flex gap-1">
                                        <div
                                          className="w-6 h-6 rounded-lg"
                                          style={{ backgroundColor: palette.primary }}
                                        />
                                        <div
                                          className="w-6 h-6 rounded-lg"
                                          style={{ backgroundColor: palette.secondary }}
                                        />
                                      </div>
                                      <span className="text-white text-sm font-medium group-hover:text-[#22D3EE] transition-colors">
                                        {palette.name}
                                      </span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : message.type === 'style-selector' ? (
                            <div className="w-full max-w-full">
                              <div className="bg-[#0F172A] text-white border border-[#1E293B] rounded-2xl px-4 py-3 mb-4">
                                <p className="text-sm leading-relaxed">{message.content}</p>
                              </div>
                              <div className="flex flex-col gap-2">
                                {STYLES.map((style) => (
                                  <button
                                    key={style.id}
                                    onClick={() => handleStyleSelect(style.id)}
                                    disabled={waitingFor !== 'style'}
                                    className="group p-3 rounded-xl bg-[#0F172A] border border-[#1E293B] hover:border-[#22D3EE] transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <h3 className="text-white text-sm font-medium group-hover:text-[#22D3EE] transition-colors">
                                          {style.name}
                                        </h3>
                                        <p className="text-[#64748B] text-xs mt-0.5">{style.description}</p>
                                      </div>
                                      <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-[#22D3EE] transition-colors shrink-0 mt-0.5" />
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                ? 'bg-[#22D3EE] text-[#0A0F1C]'
                                : 'bg-[#0F172A] text-white border border-[#1E293B]'
                                }`}
                            >
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl px-4 py-3">
                            <Loader2 className="w-5 h-5 text-[#22D3EE] animate-spin" />
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                )}

                {/* Input de chat - dentro del panel de chat */}
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: hasMessages ? 0 : 0.7, duration: 0.5 }}
                  className="border-t border-[#0F172A] p-6"
                >
                  <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleSubmit}>
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0F172A] border border-[#1E293B] focus-within:border-[#22D3EE] transition-colors shadow-lg">
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Describe tu landing page..."
                          disabled={isLoading}
                          className="flex-1 bg-transparent text-white placeholder-[#64748B] outline-none text-base disabled:opacity-50"
                        />
                        <button
                          type="submit"
                          disabled={isLoading || !input.trim()}
                          className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#22D3EE] hover:bg-[#06B6D4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <Loader2 className="w-5 h-5 text-[#0A0F1C] animate-spin" />
                          ) : (
                            <Send className="w-5 h-5 text-[#0A0F1C]" />
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </div>

              {/* Panel de preview HTML - lado derecho */}
              <AnimatePresence >
                {htmlPreview && (
                  <motion.div
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="w-1/2 flex flex-col overflow-hidden bg-white"
                  >
                    {/* Header del panel con botón */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-[#1E293B]">
                      <h3 className="text-sm font-semibold text-white">Vista previa</h3>
                      <button
                        onClick={openInNewTab}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#22D3EE] hover:bg-[#06B6D4] transition-colors text-white text-sm font-medium cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Abrir en nueva pestaña</span>
                      </button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <iframe
                        ref={iframeRef}
                        className="w-full h-full border-0"
                        title="HTML Preview"
                        sandbox="allow-scripts allow-same-origin"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}