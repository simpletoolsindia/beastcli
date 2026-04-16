/**
 * Weather Tool
 * Free, no API key required - get weather info using wttr.in
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'

export const weatherTool = buildTool({
  name: 'Weather',
  description: 'Get current weather, forecasts, and weather information for any location. Uses wttr.in - no API key required.',
  input: z.object({
    location: z.string().describe('City name, airport code, or IP address (e.g., "London", "JFK", "auto")'),
    format: z.enum(['current', 'forecast', 'both']).optional().describe('Format: current (today only), forecast (3-day), both. Default: current'),
    units: z.enum(['celsius', 'fahrenheit']).optional().describe('Temperature units: celsius or fahrenheit. Default: celsius'),
  }),
  output: z.object({
    location: z.string(),
    temperature: z.string(),
    feelsLike: z.string(),
    humidity: z.string(),
    wind: z.string(),
    description: z.string(),
    forecast: z.array(z.object({
      date: z.string(),
      high: z.string(),
      low: z.string(),
      description: z.string(),
    })).optional(),
  }),
  aliases: ['weather', 'forecast', 'temp', 'climate'],
  rateLimit: {
    windowMs: 5000,
    maxUses: 20,
  },
  async call({ location, format = 'current', units = 'celsius' }) {
    try {
      const unit = units === 'fahrenheit' ? 'F' : 'C'
      const formatParam = format === 'forecast' ? '3' : format === 'both' ? '2' : '1'

      const url = `https://wttr.in/${encodeURIComponent(location)}?format=j1&m=${formatParam}`

      const response = await fetch(url, {
        signal: AbortSignal.timeout,
      })

      if (!response.ok) {
        return {
          data: {
            location,
            temperature: 'Error',
            feelsLike: 'Error',
            humidity: 'Error',
            wind: 'Error',
            description: `Failed to fetch weather: ${response.status}`,
          },
        }
      }

      const data = await response.json()
      const current = data.current_condition?.[0] || {}

      // Build forecast array
      let forecast: Array<{ date: string; high: string; low: string; description: string }> | undefined
      if (format !== 'current' && data.weather) {
        forecast = data.weather.map((day: any) => ({
          date: day.date,
          high: `${day.maxtempC || day.maxtempF}${unit}`,
          low: `${day.mintempC || day.mintempF}${unit}`,
          description: day.hourly?.[4]?.weatherDesc?.[0]?.value || 'N/A',
        }))
      }

      return {
        data: {
          location: data.nearest_area?.[0]?.areaName?.[0]?.value || location,
          temperature: `${current[`temp_${unit}`] || 'N/A'}°${unit}`,
          feelsLike: `${current[`FeelsLike${unit}`] || 'N/A'}°${unit}`,
          humidity: `${current.humidity || 'N/A'}%`,
          wind: `${current.windspeed || 'N/A'} km/h ${current.winddir16point || ''}`,
          description: current.weatherDesc?.[0]?.value || 'N/A',
          forecast,
        },
      }
    } catch {
      return {
        data: {
          location,
          temperature: 'Error',
          feelsLike: 'Error',
          humidity: 'Error',
          wind: 'Error',
          description: 'Failed to fetch weather. Check location or try again.',
        },
      }
    }
  },
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    const { location, temperature, feelsLike, humidity, wind, description, forecast } = content as any

    let text = `Weather for ${location}\n━━━━━━━━━━━━━━━━━━\n`
    text += `🌡️  Temp:     ${temperature}\n`
    text += `🤔 Feels:    ${feelsLike}\n`
    text += `💧 Humidity: ${humidity}\n`
    text += `💨 Wind:     ${wind}\n`
    text += `☁️  ${description}\n`

    if (forecast && forecast.length > 0) {
      text += `\n📅 3-Day Forecast:\n`
      forecast.forEach((day: any) => {
        text += `   ${day.date}: ${day.low} → ${day.high} | ${day.description}\n`
      })
    }

    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content: [{ type: 'text', text }],
    }
  },
})

export default weatherTool
