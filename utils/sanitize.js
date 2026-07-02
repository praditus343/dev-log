const REMOVE_TAGS = /<\s*\b(script|iframe|embed|object|frame|frameset|applet|meta|link|style|form|input|button|textarea|select|option)\b[^>]*>[^<]*<\s*\/\s*\1\s*>|<\s*\b(script|iframe|embed|object)\b[^>]*\/?\s*>/gi
const REMOVE_ATTRS = /\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi
const REMOVE_JS_URI = /(href|src|action|formaction)\s*=\s*['"]?\s*javascript\s*:/gi

export const sanitizeHtml = (html) => {
  if (!html) return ''
  return html
    .replace(REMOVE_TAGS, '')
    .replace(REMOVE_ATTRS, '')
    .replace(REMOVE_JS_URI, (_, attr) => `${attr}="#"`)
}
