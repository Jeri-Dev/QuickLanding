import { COLOR_PALETTES } from "@/interfaces/color"

export const buildUserPrompt = (text: string, style: string, palette: string) =>
	`
DESIGN BRIEF:
Create a premium landing page that would make a YC-backed startup jealous.
This is not a template — it's a crafted experience.

BRAND DIRECTION: "${style}"

COLOR SYSTEM (Use as CSS variables):
--color-primary: ${COLOR_PALETTES[palette].primary};
--color-primary-hover: [10% darker];
--color-secondary: ${COLOR_PALETTES[palette].secondary};
--color-accent: ${COLOR_PALETTES[palette].accent};
--color-background: #FAFAFA;
--color-surface: #FFFFFF;
--color-text-primary: #0A0A0B;
--color-text-secondary: #52525B;
--color-text-tertiary: #A1A1AA;
--color-border: rgba(0, 0, 0, 0.08);

REQUIRED CSS SETUP (Include in <style>):
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;
  
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
  
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
  --shadow-xl: 0 16px 48px rgba(0,0,0,0.16);
  
  --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

MANDATORY SECTIONS (Each must feel intentional):

1. NAVIGATION (Sticky, 72-80px height)
   - Clean logo/wordmark (left)
   - Minimal nav links with hover underlines (center or right)
   - Single primary CTA button (right)
   - Subtle bottom border or backdrop-blur on scroll
   - Max-width container: 1280px, centered

2. HERO SECTION (Above the fold impact)
   - Padding: 120px+ vertical
   - Two approaches (choose based on style):
     a) Centered: Large headline, subtext, CTA group, visual below
     b) Split: Text left (60%), visual right (40%)
   - Headline: 56-72px, max-width 800px
   - Subheadline: 18-20px, max-width 600px, color-text-secondary
   - CTA group: Primary button + Ghost/text button
   - Optional: Subtle background gradient or mesh
   - Optional: Small trust badges below CTA ("Trusted by 10,000+ teams")

3. SOCIAL PROOF BAR (Build trust immediately)
   - Logos of recognizable companies (grayscale, hover to color)
   - Or: Key metrics ("50K+ users", "$2B processed", "99.9% uptime")
   - Subtle top/bottom borders
   - Padding: 48-64px vertical

4. FEATURES SECTION (The meat)
   - Section title: Centered, max-width 600px
   - Choose ONE layout pattern:
     a) Bento grid (mixed 1x1, 1x2, 2x1 cards)
     b) Alternating rows (image left/right with text)
     c) Icon grid (3-4 columns, minimal cards)
   - Each feature: Icon/visual, headline, 2-line description
   - Cards: Surface background, subtle border, radius-lg
   - Minimum 6 features, no more than 9

5. PRODUCT SHOWCASE / HOW IT WORKS
   - Large visual (screenshot, illustration, or video placeholder)
   - Step indicators if process-based (1-2-3 with connecting lines)
   - Tabs or interactive segments if showing multiple views
   - High contrast background option (dark section)

6. TESTIMONIALS (Social proof that converts)
   - Card-based layout (3 columns on desktop)
   - Each card: Quote, avatar, name, title, company
   - Optional: Star rating, company logo
   - Consider: One large featured testimonial + smaller grid

7. PRICING OR VALUE PROPOSITION (If applicable)
   - Clean comparison cards (2-3 tiers)
   - Highlight recommended tier with border/badge
   - Feature checkmarks with subtle icons
   - Or: Value-focused content block with key differentiators

8. FINAL CTA SECTION (Conversion moment)
   - High contrast (primary color background or dark)
   - Centered content, max-width 600px
   - Strong headline, supporting text
   - Large prominent button
   - Optional: Input field for email capture
   - Padding: 96-128px vertical

9. FOOTER (Professional, not an afterthought)
   - Multi-column layout (4-5 columns)
   - Column 1: Logo + tagline + social icons
   - Columns 2-4: Navigation groups
   - Column 5: Newsletter signup or contact
   - Bottom bar: Copyright + legal links
   - Subtle top border

RESPONSIVE REQUIREMENTS:
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Mobile: Stack everything, 16-24px horizontal padding
- Tablet: 2-column grids, adjust spacing
- Desktop: Full layouts, generous spacing
- Touch targets: minimum 44px on mobile

CONTENT CONTEXT (Use this to generate relevant copy):
${text}

FINAL CHECKLIST (All must be true):
☐ No spacing less than 8px anywhere
☐ All interactive elements have hover states
☐ Typography hierarchy is clear and consistent
☐ Color contrast meets accessibility standards
☐ Layout feels balanced and intentional
☐ Copy is specific, not generic
☐ Would a design-focused founder be proud to launch this?

OUTPUT: Raw HTML only. No explanations. No markdown. Make it exceptional.
`.trim()

export const cleanHtmlResponse = (content: string): string => {
	// Eliminar los marcadores de código markdown ```html y ```
	let cleaned = content.trim()

	// Si comienza con ```html, eliminar
	if (cleaned.startsWith("```html")) {
		cleaned = cleaned.substring(7)
	} else if (cleaned.startsWith("```")) {
		cleaned = cleaned.substring(3)
	}

	// Si termina con ```, eliminar
	if (cleaned.endsWith("```")) {
		cleaned = cleaned.substring(0, cleaned.length - 3)
	}

	return cleaned.trim()
}
