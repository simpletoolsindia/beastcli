/**
 * Password Generator Tool
 * Free, no API key required - generate secure passwords
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'

export const passwordTool = buildTool({
  name: 'Password',
  description: 'Generate secure passwords, passphrases, and random strings. Useful for creating credentials, API keys, and secure tokens. No API key required.',
  input: z.object({
    length: z.number().min(4).max(128).optional().describe('Password length (4-128). Default: 16'),
    type: z.enum(['random', 'alphanumeric', 'pin', 'passphrase', 'hex']).optional().describe('Type: random (all chars), alphanumeric (letters+numbers), pin (digits only), passphrase (words), hex. Default: random'),
    count: z.number().min(1).max(100).optional().describe('Number of passwords to generate. Default: 1'),
    includeSymbols: z.boolean().optional().describe('Include special characters. Default: true'),
    includeUppercase: z.boolean().optional().describe('Include uppercase letters. Default: true'),
    includeLowercase: z.boolean().optional().describe('Include lowercase letters. Default: true'),
    includeNumbers: z.boolean().optional().describe('Include numbers. Default: true'),
  }),
  output: z.object({
    passwords: z.array(z.string()),
    strength: z.string(),
    entropy: z.number(),
  }),
  aliases: ['password', 'generate-password', 'passphrase', 'random-string', 'secure'],
  rateLimit: {
    windowMs: 1000,
    maxUses: 50,
  },
  async call({
    length = 16,
    type = 'random',
    count = 1,
    includeSymbols = true,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
  }) {
    const passwords: string[] = []

    for (let i = 0; i < count; i++) {
      switch (type) {
        case 'pin':
          passwords.push(generatePIN(length))
          break
        case 'passphrase':
          passwords.push(generatePassphrase(Math.ceil(length / 5)))
          break
        case 'hex':
          passwords.push(generateHex(length))
          break
        case 'alphanumeric':
          passwords.push(generateAlphanumeric(length, includeSymbols))
          break
        default:
          passwords.push(
            generatePassword(length, includeSymbols, includeUppercase, includeLowercase, includeNumbers)
          )
      }
    }

    // Calculate strength and entropy
    const entropy = calculateEntropy(length, type, includeSymbols, includeUppercase, includeNumbers)
    const strength = getStrength(entropy)

    return {
      data: {
        passwords,
        strength,
        entropy,
      },
    }
  },
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    const { passwords, strength, entropy } = content as any

    let text = `🔐 Password Generator\n━━━━━━━━━━━━━━━━━━\n`
    text += `Strength: ${strength} (${entropy.toFixed(1)} bits entropy)\n`
    text += `━━━━━━━━━━━━━━━━━━\n\n`

    passwords.forEach((pwd, i) => {
      text += `${i + 1}. ${pwd}\n`
    })

    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content: [{ type: 'text', text }],
    }
  },
})

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

function generatePassword(
  length: number,
  includeSymbols: boolean,
  includeUppercase: boolean,
  includeLowercase: boolean,
  includeNumbers: boolean
): string {
  let chars = ''
  if (includeLowercase) chars += LOWERCASE
  if (includeUppercase) chars += UPPERCASE
  if (includeNumbers) chars += NUMBERS
  if (includeSymbols) chars += SYMBOLS
  if (!chars) chars = LOWERCASE + NUMBERS

  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(byte => chars[byte % chars.length])
    .join('')
}

function generatePIN(length: number): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(byte => NUMBERS[byte % 10])
    .join('')
}

function generateHex(length: number): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(Math.ceil(length / 2))))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length)
}

const WORDS = [
  'apple', 'banana', 'cherry', 'dragon', 'eagle', 'forest', 'galaxy', 'harbor',
  'island', 'jungle', 'kernel', 'lemon', 'mountain', 'nectar', 'ocean', 'pepper',
  'quartz', 'river', 'sunset', 'thunder', 'umbrella', 'violet', 'whisper', 'xenon',
  'yellow', 'zebra', 'anchor', 'bridge', 'castle', 'diamond', 'ember', 'falcon',
  'glacier', 'horizon', 'ivory', 'jasmine', 'kindle', 'lantern', 'marble', 'nebula',
  'orchid', 'phoenix', 'quantum', 'rainbow', 'silver', 'tornado', 'universe', 'velvet',
  'winter', 'crystal', 'garden', 'harmony', 'imagine', 'journey', 'kingdom', 'liberty',
]

function generatePassphrase(wordCount: number): string {
  const shuffled = [...WORDS].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, wordCount).join('-')
}

function generateAlphanumeric(length: number, includeSymbols: boolean): string {
  let chars = LOWERCASE + UPPERCASE + NUMBERS
  if (includeSymbols) chars += SYMBOLS
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(byte => chars[byte % chars.length])
    .join('')
}

function calculateEntropy(
  length: number,
  type: string,
  includeSymbols: boolean,
  includeUppercase: boolean,
  includeNumbers: boolean
): number {
  if (type === 'pin') return length * Math.log2(10)
  if (type === 'hex') return length * 4
  if (type === 'passphrase') return length * Math.log2(WORDS.length)

  let poolSize = 0
  if (includeLowercase) poolSize += 26
  if (includeUppercase) poolSize += 26
  if (includeNumbers) poolSize += 10
  if (includeSymbols) poolSize += 32

  return length * Math.log2(poolSize || 26)
}

function getStrength(entropy: number): string {
  if (entropy < 28) return '⚠️ Very Weak'
  if (entropy < 36) return '🔓 Weak'
  if (entropy < 60) return '🔒 Fair'
  if (entropy < 80) return '🛡️ Strong'
  return '💪 Very Strong'
}

export default passwordTool
