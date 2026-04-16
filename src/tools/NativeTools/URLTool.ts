/**
 * URL Tool
 * Free, no API key required - encode/decode URLs, parse URLs
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'

export const urlTool = buildTool({
  shouldDefer: true,
  name: 'URL',
  description: 'Encode, decode, parse, and manipulate URLs. Useful for URL cleaning, API work, and web development. No API key required.',
  input: z.object({
    text: z.string().describe('URL or text to encode/decode'),
    action: z.enum(['encode', 'decode', 'parse', 'build']).describe('Action: encode (URL encode), decode (URL decode), parse (break into components), build (create from components)'),
    // For parse action
    parseQuery: z.boolean().optional().describe('When parsing, also parse query string parameters'),
    // For build action
    protocol: z.string().optional().describe('Protocol for build (e.g., "https")'),
    host: z.string().optional().describe('Host for build (e.g., "example.com")'),
    pathname: z.string().optional().describe('Path for build (e.g., "/api/v1/users")'),
    queryParams: z.record(z.string()).optional().describe('Query parameters for build'),
  }),
  output: z.object({
    result: z.string().describe('The processed URL'),
    original: z.string().describe('Original input'),
    action: z.string().describe('Action performed'),
    components: z.record(z.string()).optional().describe('URL components (for parse action)'),
  }),
  aliases: ['url', 'url-encode', 'url-decode', 'urlparse', 'urldecode'],
  rateLimit: {
    windowMs: 1000,
    maxUses: 100,
  },
  async call({ text, action, parseQuery = false, protocol, host, pathname, queryParams }) {
    try {
      switch (action) {
        case 'encode': {
          const encoded = encodeURIComponent(text)
          return {
            data: {
              result: encoded,
              original: text,
              action: 'encode',
            },
          }
        }
        case 'decode': {
          const decoded = decodeURIComponent(text)
          return {
            data: {
              result: decoded,
              original: text,
              action: 'decode',
            },
          }
        }
        case 'parse': {
          // Try to parse as URL
          let url: URL
          try {
            url = new URL(text)
          } catch {
            // If not a valid URL, try adding protocol
            try {
              url = new URL('http://' + text)
            } catch {
              return {
                data: {
                  result: 'Invalid URL',
                  original: text,
                  action: 'parse',
                },
              }
            }
          }

          const components: Record<string, string> = {
            protocol: url.protocol,
            host: url.host,
            hostname: url.hostname,
            port: url.port,
            pathname: url.pathname,
            search: url.search,
            hash: url.hash,
          }

          let result = `URL Components\n━━━━━━━━━━━━━━━━━━━━\n`
          result += `Protocol:  ${components.protocol}\n`
          result += `Host:      ${components.host}\n`
          result += `Hostname:  ${components.hostname}\n`
          result += `Port:      ${components.port}\n`
          result += `Pathname:  ${components.pathname}\n`
          result += `Search:    ${components.search}\n`
          result += `Hash:      ${components.hash}\n`

          if (parseQuery) {
            const params = new URLSearchParams(url.search)
            if (params.toString()) {
              result += `\nQuery Parameters:\n`
              params.forEach((value, key) => {
                result += `  ${key}: ${value}\n`
              })
            }
          }

          return {
            data: {
              result,
              original: text,
              action: 'parse',
              components,
            },
          }
        }
        case 'build': {
          if (!host) {
            return {
              data: {
                result: 'Error: host is required for build action',
                original: text,
                action: 'build',
              },
            }
          }
          const builtUrl = new URL(pathname || '/', `${protocol || 'https'}://${host}`)
          if (queryParams) {
            Object.entries(queryParams).forEach(([key, value]) => {
              builtUrl.searchParams.set(key, value)
            })
          }
          return {
            data: {
              result: builtUrl.toString(),
              original: text,
              action: 'build',
            },
          }
        }
      }
    } catch {
      return {
        data: {
          result: `Error: Failed to ${action} URL`,
          original: text,
          action,
        },
      }
    }
  },
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    const { result, action } = content as { result: string; original: string; action: string }
    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content: [
        {
          type: 'text',
          text: result,
        },
      ],
    }
  },
})

export default urlTool
