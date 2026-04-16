/**
 * IP Lookup Tool
 * Free, no API key required - lookup IP addresses and geolocation
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'

export const ipLookupTool = buildTool({
  shouldDefer: true,
  name: 'IPLookup',
  description: 'Look up IP address information including geolocation, ISP, hostname, and network details. No API key required.',
  input: z.object({
    ip: z.string().optional().describe('IP address to lookup. Defaults to your current IP if empty'),
  }),
  output: z.object({
    ip: z.string(),
    city: z.string().optional(),
    region: z.string().optional(),
    country: z.string().optional(),
    countryCode: z.string().optional(),
    ISP: z.string().optional(),
    organization: z.string().optional(),
    asn: z.string().optional(),
    timezone: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    hostname: z.string().optional(),
  }),
  aliases: ['ip', 'ip-lookup', 'geoip', 'myip', 'ipinfo', 'whois'],
  rateLimit: {
    windowMs: 5000,
    maxUses: 50,
  },
  async call({ ip }) {
    try {
      // Use ip-api.com (150 requests/minute free, no key)
      const lookupIp = ip || ''
      const url = `http://ip-api.com/json/${lookupIp}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query,hosting`

      const response = await fetch(url, {
        signal: AbortSignal.timeout,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.status === 'fail') {
        return {
          data: {
            ip: ip || 'Unknown',
            city: 'Error',
            region: data.message || 'Lookup failed',
            country: '',
            countryCode: '',
            ISP: '',
            organization: '',
            asn: '',
            timezone: '',
            latitude: 0,
            longitude: 0,
            hostname: '',
          },
        }
      }

      return {
        data: {
          ip: data.query || ip,
          city: data.city,
          region: data.regionName,
          country: data.country,
          countryCode: data.countryCode,
          ISP: data.isp,
          organization: data.org,
          asn: data.as,
          timezone: data.timezone,
          latitude: data.lat,
          longitude: data.lon,
          hostname: data.query || '',
        },
      }
    } catch {
      return {
        data: {
          ip: ip || 'Unknown',
          city: 'Error',
          region: 'Failed to lookup IP',
          country: '',
          countryCode: '',
          ISP: '',
          organization: '',
          asn: '',
          timezone: '',
          latitude: 0,
          longitude: 0,
          hostname: '',
        },
      }
    }
  },
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    const { ip, city, region, country, countryCode, ISP, organization, asn, timezone, latitude, longitude } = content as any

    let text = `🌐 IP Lookup: ${ip}\n${'━'.repeat(40)}\n`
    text += `📍 Location\n`
    text += `   ${city || 'Unknown'}, ${region || ''}\n`
    text += `   ${country} (${countryCode})\n`
    text += `   📌 ${latitude}, ${longitude}\n\n`
    text += `🏢 Network\n`
    text += `   ISP: ${ISP || 'Unknown'}\n`
    text += `   Org: ${organization || 'Unknown'}\n`
    text += `   ASN: ${asn || 'Unknown'}\n`
    if (timezone) {
      text += `\n🕐 Timezone: ${timezone}`
    }

    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content: [{ type: 'text', text }],
    }
  },
})

export default ipLookupTool
