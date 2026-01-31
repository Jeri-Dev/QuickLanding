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
} from "lucide-react"

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
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0F1C] font-sans p-4">
      <main className="flex w-full max-w-300 rounded-3xl overflow-hidden bg-[#0A0F1C]">
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
              <button className="cursor-pointer flex items-center gap-3 px-8 py-4 rounded-xl bg-[#22D3EE] hover:bg-[#06B6D4] transition-colors">
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
      </main>
    </div>
  )
}