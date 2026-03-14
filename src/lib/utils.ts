import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import sanitizeHtml from "sanitize-html";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ALLOWED_TAGS = [
  "html",
  "head",
  "body",
  "div",
  "span",
  "p",
  "a",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "nav",
  "header",
  "footer",
  "main",
  "section",
  "article",
  "aside",
  "img",
  "figure",
  "figcaption",
  "strong",
  "em",
  "br",
  "hr",
  "blockquote",
  "pre",
  "code",
  "link",
  "meta",
  "title",
  "style",
  "form",
  "input",
  "button",
  "label",
  "select",
  "option",
  "textarea",
  "small",
  "sub",
  "sup",
  "svg",
  "path",
  "circle",
  "rect",
  "line",
  "polyline",
  "polygon",
  "g",
  "defs",
  "clipPath",
  "use",
  "symbol",
  "text",
  "tspan",
];

const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions["allowedAttributes"] = {
  "*": ["class", "id", "style", "role"],
  a: ["href", "target", "rel"],
  img: ["src", "alt", "width", "height", "loading"],
  link: ["rel", "href", "crossorigin"],
  meta: ["charset", "name", "content"],
  input: ["type", "placeholder", "value", "name"],
  button: ["type"],
  svg: ["viewBox", "xmlns", "fill", "stroke", "width", "height"],
  path: ["d", "fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"],
  circle: ["cx", "cy", "r", "fill", "stroke"],
  rect: ["x", "y", "width", "height", "rx", "ry", "fill", "stroke"],
  line: ["x1", "y1", "x2", "y2", "stroke"],
  polyline: ["points", "fill", "stroke"],
  polygon: ["points", "fill", "stroke"],
  g: ["transform", "fill", "stroke"],
  clipPath: ["id"],
  use: ["href"],
  symbol: ["id", "viewBox"],
  text: ["x", "y", "dx", "dy", "text-anchor", "font-size", "fill"],
  tspan: ["x", "y", "dx", "dy"],
};

export function sanitizeLandingHtml(html: string): string {
  // Strip markdown fences if the AI wrapped the HTML in ```html...```
  let cleaned = html;
  const fenceMatch = cleaned.match(/```html\s*\n([\s\S]*?)\n\s*```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1];
  }

  return sanitizeHtml(cleaned, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ["https", "http", "mailto", "tel", "data"],
    allowVulnerableTags: true, // needed for <style> and <html>/<head>/<body>
  });
}

export function extractHtmlFromResponse(content: string): string | null {
  // Try to extract HTML from markdown fences first
  const fenceMatch = content.match(/```html\s*\n([\s\S]*?)\n\s*```/);
  if (fenceMatch) return fenceMatch[1];

  // Check if the content itself looks like HTML
  if (content.includes("<!DOCTYPE") || content.includes("<html")) {
    return content;
  }

  return null;
}
