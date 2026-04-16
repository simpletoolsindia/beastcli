/**
 * Lorem Ipsum Generator Tool
 * Free, no API key required - generate placeholder text
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'

export const loremTool = buildTool({
  name: 'Lorem',
  description: 'Generate lorem ipsum placeholder text, random words, sentences, or paragraphs. Useful for templates, mockups, and testing. No API key required.',
  input: z.object({
    count: z.number().min(1).max(100).optional().describe('Number of items to generate. Default: 1'),
    type: z.enum(['words', 'sentences', 'paragraphs', 'lists', 'names', 'emails', 'urls', 'addresses', 'phone']).optional().describe('Type: words, sentences, paragraphs, lists, names, emails, urls, addresses, phone. Default: paragraphs'),
    format: z.enum(['text', 'json', 'html']).optional().describe('Output format: text, json, or html. Default: text'),
  }),
  output: z.object({
    content: z.string(),
    type: z.string(),
    count: z.number(),
  }),
  aliases: ['lorem', 'lorem-ipsum', 'placeholder', 'dummy-text', 'faker'],
  rateLimit: {
    windowMs: 1000,
    maxUses: 100,
  },
  async call({ count = 1, type = 'paragraphs', format = 'text' }) {
    let content: string

    switch (type) {
      case 'words':
        content = generateWords(count)
        break
      case 'sentences':
        content = generateSentences(count)
        break
      case 'paragraphs':
        content = generateParagraphs(count)
        break
      case 'lists':
        content = generateList(count)
        break
      case 'names':
        content = generateNames(count)
        break
      case 'emails':
        content = generateEmails(count)
        break
      case 'urls':
        content = generateUrls(count)
        break
      case 'addresses':
        content = generateAddresses(count)
        break
      case 'phone':
        content = generatePhoneNumbers(count)
        break
      default:
        content = generateParagraphs(count)
    }

    if (format === 'json') {
      return {
        data: {
          content: JSON.stringify({ type, count, items: content.split('\n').filter(Boolean) }, null, 2),
          type,
          count,
        },
      }
    }

    if (format === 'html') {
      const items = content.split('\n').filter(Boolean)
      const html = items.map(item => `<p>${item}</p>`).join('\n')
      content = html
    }

    return {
      data: {
        content,
        type,
        count,
      },
    }
  },
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    const { content: text, type, count } = content as any

    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content: [{ type: 'text', text: `${type.toUpperCase()} (${count})\n${'━'.repeat(40)}\n\n${text}` }],
    }
  },
})

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'technology', 'innovation',
  'digital', 'future', 'system', 'process', 'data', 'network', 'cloud', 'security',
  'software', 'hardware', 'developer', 'engineer', 'designer', 'manager', 'analyst',
]

const FIRST_NAMES = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen']
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White']
const CITIES = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte']
const STATES = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA', 'TX', 'FL', 'TX', 'OH', 'NC']

function generateWords(count: number): string {
  return Array.from({ length: count }, () => WORDS[Math.floor(Math.random() * WORDS.length)]).join(' ')
}

function generateSentences(count: number): string {
  return Array.from({ length: count }, () => {
    const sentenceLength = 8 + Math.floor(Math.random() * 8)
    const sentence = Array.from({ length: sentenceLength }, () => WORDS[Math.floor(Math.random() * WORDS.length)])
    sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1)
    return sentence.join(' ') + '.'
  }).join(' ')
}

function generateParagraphs(count: number): string {
  return Array.from({ length: count }, () => {
    const paraLength = 3 + Math.floor(Math.random() * 4)
    const sentences = Array.from({ length: paraLength }, () => {
      const sentenceLength = 8 + Math.floor(Math.random() * 8)
      const sentence = Array.from({ length: sentenceLength }, () => WORDS[Math.floor(Math.random() * WORDS.length)])
      sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1)
      return sentence.join(' ') + '.'
    })
    return sentences.join(' ')
  }).join('\n\n')
}

function generateList(count: number): string {
  return Array.from({ length: count }, (_, i) => {
    const itemLength = 3 + Math.floor(Math.random() * 4)
    const words = Array.from({ length: itemLength }, () => WORDS[Math.floor(Math.random() * WORDS.length)])
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
    return `${i + 1}. ${words.join(' ')}`
  }).join('\n')
}

function generateNames(count: number): string {
  return Array.from({ length: count }, () => {
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
    return `${first} ${last}`
  }).join('\n')
}

function generateEmails(count: number): string {
  return Array.from({ length: count }, () => {
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)].toLowerCase()
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)].toLowerCase()
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'proton.me', 'icloud.com']
    const domain = domains[Math.floor(Math.random() * domains.length)]
    const num = Math.floor(Math.random() * 100)
    return `${first}.${last}${num}@${domain}`
  }).join('\n')
}

function generateUrls(count: number): string {
  return Array.from({ length: count }, () => {
    const words = Array.from({ length: 2 }, () => WORDS[Math.floor(Math.random() * WORDS.length)])
    const domains = ['example.com', 'demo.org', 'test.io', 'sample.net', 'app.dev']
    const domain = domains[Math.floor(Math.random() * domains.length)]
    return `https://www.${domain}/${words.join('-')}`
  }).join('\n')
}

function generateAddresses(count: number): string {
  return Array.from({ length: count }, () => {
    const streetNum = Math.floor(Math.random() * 9999) + 1
    const streetNames = ['Main', 'Oak', 'Maple', 'Cedar', 'Pine', 'Elm', 'Park', 'Lake']
    const streetTypes = ['St', 'Ave', 'Blvd', 'Dr', 'Ln', 'Rd']
    const cityIdx = Math.floor(Math.random() * CITIES.length)
    const street = `${streetNum} ${streetNames[Math.floor(Math.random() * streetNames.length)]} ${streetTypes[Math.floor(Math.random() * streetTypes.length)]}`
    return `${street}\n${CITIES[cityIdx]}, ${STATES[cityIdx]} ${Math.floor(Math.random() * 90000) + 10000}`
  }).join('\n\n')
}

function generatePhoneNumbers(count: number): string {
  return Array.from({ length: count }, () => {
    const area = Math.floor(Math.random() * 800) + 200
    const prefix = Math.floor(Math.random() * 900) + 100
    const line = Math.floor(Math.random() * 9000) + 1000
    return `(${area}) ${prefix}-${line}`
  }).join('\n')
}

export default loremTool
