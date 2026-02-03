# QuickLanding

Una aplicación Next.js que utiliza IA para generar landing pages personalizadas
en tiempo real mediante chat conversacional.

## 🚀 Características

- **Generación de Landing Pages con IA**: Crea páginas web completas mediante
  descripciones en lenguaje natural
- **Chat Interactivo**: Interfaz conversacional para especificar requisitos
- **Múltiples Paletas de Colores**: 10 esquemas de colores predefinidos
- **Estilos Variados**: 5 estilos de diseño diferentes (Moderno, Minimalista,
  Sencillo, Audaz, Elegante)
- **Vista Previa en Tiempo Real**: Visualiza el resultado instantáneamente
- **Diseño Responsive**: Optimizado para todos los dispositivos
- **Animaciones Fluidas**: Usando Motion (Framer Motion)
- **Componentes UI Modernos**: Construido con Radix UI y Tailwind CSS

## 📋 Requisitos Previos

- Node.js 18.x o superior
- npm, yarn, pnpm o bun
- Una cuenta y API Key de GROQ

## 🔑 Configuración de la API Key

Este proyecto utiliza la API de GROQ para la generación de contenido con IA.
**Debes obtener y configurar tu propia API Key:**

1. **Obtén tu API Key de GROQ:**
   - Visita [https://console.groq.com](https://console.groq.com)
   - Crea una cuenta o inicia sesión
   - Genera una nueva API Key en la sección de configuración

2. **Configura las Variables de Entorno:**
   - Crea un archivo `.env` en la raíz del proyecto
   - Añade tu API Key:
   ```env
   GROQ_API_KEY=tu_api_key_aqui
   ```

   - **Importante**: Nunca compartas ni subas tu `.env` a repositorios públicos

## 🛠️ Instalación

1. **Clona el repositorio:**

```bash
git clone <url-del-repositorio>
cd my-app
```

2. **Instala las dependencias:**

```bash
npm install
# o
yarn install
# o
pnpm install
# o
bun install
```

3. **Configura las variables de entorno:**

```bash
# Crea el archivo .env y añade tu GROQ_API_KEY
echo "GROQ_API_KEY=tu_api_key_aqui" > .env
```

4. **Ejecuta el servidor de desarrollo:**

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

5. **Abre tu navegador:**
   - Navega a [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
my-app/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts        # Endpoint de la API que usa GROQ
│   ├── globals.css             # Estilos globales
│   ├── layout.tsx              # Layout principal
│   └── page.tsx                # Página principal con chat
├── config/
│   └── constants.ts            # Constantes y prompts del sistema
├── interfaces/
│   └── color.ts                # Tipos TypeScript
├── lib/
│   ├── buildUserPrompt.ts      # Construcción de prompts
│   └── utils.ts                # Utilidades
├── public/                     # Archivos estáticos
├── .env                        # Variables de entorno (NO subir a Git)
└── package.json
```

## 🎨 Uso

1. **Inicia una conversación**: Describe qué tipo de landing page necesitas
2. **Selecciona una paleta de colores**: Elige entre 10 opciones disponibles
3. **Elige un estilo de diseño**: Selecciona el estilo que prefieras
4. **Visualiza el resultado**: La landing page se genera automáticamente
5. **Itera y mejora**: Pide modificaciones para ajustar el diseño

### Ejemplo de Uso:

```
Usuario: "Necesito una landing page para mi startup de tecnología"
Asistente: [Muestra paletas de colores]
Usuario: [Selecciona "Azul Profesional"]
Asistente: [Muestra estilos disponibles]
Usuario: [Selecciona "Moderno"]
Asistente: [Genera la landing page]
```

## 🔧 Tecnologías Utilizadas

- **Framework**: Next.js 16.1.6
- **React**: 19.2.3
- **IA/ML**: Groq SDK, Vercel AI SDK
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **Animaciones**: Motion (Framer Motion)
- **Iconos**: Lucide React
- **Markdown/Formatting**: Streamdown
- **TypeScript**: Para type safety

## 📝 Scripts Disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Construye la aplicación para producción
npm run start    # Inicia el servidor de producción
npm run lint     # Ejecuta el linter
```

## ⚠️ Notas Importantes

- **Seguridad**: Nunca expongas tu `GROQ_API_KEY` en el código del cliente
- **Límites de API**: Ten en cuenta los límites de uso de tu plan de GROQ
- **Costos**: Revisa la estructura de precios de GROQ antes de un uso intensivo
- **.gitignore**: Asegúrate de que `.env` esté incluido en tu `.gitignore`

## 🚀 Deploy

### Vercel (Recomendado)

1. Sube tu proyecto a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com/new)
3. **Configura las variables de entorno** en la sección de configuración de
   Vercel:
   - Añade `GROQ_API_KEY` con tu API key
4. Despliega

### Otras Plataformas

Asegúrate de configurar la variable de entorno `GROQ_API_KEY` en la plataforma
que elijas.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 📧 Soporte

Si tienes problemas o preguntas:

- Abre un issue en GitHub
- Revisa la documentación de [GROQ](https://console.groq.com/docs)
- Consulta la documentación de [Next.js](https://nextjs.org/docs)
