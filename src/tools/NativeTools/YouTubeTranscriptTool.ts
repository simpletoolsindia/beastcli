/**
 * YouTube Transcript Tool
 * Free, no API key required - get video transcripts/subtitles
 *
 * Uses youtube-transcript-api (Python) as primary backend,
 * falls back to YTSage or direct caption extraction
 */

import { buildTool } from '../../Tool.js'
import { z } from 'zod'
import { exec } from '../../utils/Shell.js'
import type { ExecResult } from '../../utils/ShellCommand.js'

export const youTubeTranscriptTool = buildTool({
  shouldDefer: true,
  name: 'YouTubeTranscript',
  description: 'Get transcripts/subtitles from YouTube videos. No API key required - uses youtube-transcript-api or YTSage Python libraries.',
  input: z.object({
    videoUrl: z.string().describe('YouTube video URL or video ID (e.g., "https://youtube.com/watch?v=...", "dQw4w9WgXcQ")'),
    language: z.string().optional().describe('Language code for transcript (e.g., "en", "es", "de"). Default: "en"'),
    format: z.enum(['text', 'srt', 'vtt', 'json']).optional().describe('Output format: text (plain), srt (subtitles), vtt (webvtt), json. Default: text'),
  }),
  output: z.object({
    videoId: z.string(),
    title: z.string().optional(),
    language: z.string(),
    transcript: z.string(),
    duration: z.string().optional(),
    generatedAt: z.string(),
  }),
  aliases: ['youtube-transcript', 'yt-transcript', 'youtube-captions', 'transcript', 'captions'],
  rateLimit: {
    windowMs: 10000,
    maxUses: 50,
  },
  async call({ videoUrl, language = 'en', format = 'text' }) {
    // Extract video ID from URL
    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      return {
        data: {
          videoId: videoUrl,
          language,
          transcript: 'Error: Invalid YouTube URL or video ID',
          generatedAt: new Date().toISOString(),
        },
      }
    }

    // Try different methods in order of preference
    let result = await tryYoutubeTranscriptApi(videoId, language, format)

    if (result.error) {
      // Fallback to YTSage
      result = await tryYTSage(videoId, language, format)
    }

    if (result.error) {
      // Fallback to direct extraction
      result = await tryDirectExtraction(videoId, language, format)
    }

    return {
      data: {
        videoId,
        title: result.title,
        language,
        transcript: result.transcript || 'Error: Could not fetch transcript',
        duration: result.duration,
        generatedAt: new Date().toISOString(),
      },
    }
  },
  mapToolResultToToolResultBlockParam(content, toolUseID) {
    const { videoId, title, language, transcript, duration, generatedAt } = content as any

    let text = `📺 YouTube Transcript\n${'━'.repeat(40)}\n`
    text += `Video: ${videoId}`
    if (title) text += `\nTitle: ${title}`
    text += `\nLanguage: ${language}`
    if (duration) text += `\nDuration: ${duration}`
    text += `\n${'─'.repeat(40)}\n\n`
    text += transcript.slice(0, 2000)
    if (transcript.length > 2000) {
      text += `\n\n... (truncated, full transcript available)`
    }

    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content: [{ type: 'text', text }],
    }
  },
})

function extractVideoId(url: string): string | null {
  // Already a video ID (11 characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url
  }

  try {
    const urlObj = new URL(url)
    // Standard YouTube URL
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v')
    }
    // YouTube Shorts
    if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.slice(1)
    }
    // YouTube shorts alternative
    if (urlObj.pathname.startsWith('/shorts/')) {
      return urlObj.pathname.split('/')[2]
    }
  } catch {
    // Invalid URL
  }

  return null
}

async function tryYoutubeTranscriptApi(
  videoId: string,
  language: string,
  format: string
): Promise<{ transcript?: string; title?: string; duration?: string; error?: string }> {
  try {
    // Check if python3 is available
    const pythonCheck = await exec('which python3 || which python')
    if (!pythonCheck.stdout.trim()) {
      return { error: 'Python not found' }
    }

    // Create a temporary Python script
    const pythonScript = `
import sys
import json
import subprocess

try:
    from youtube_transcript_api import YouTubeTranscriptApi
    from youtube_transcript_api._errors import (
        TranscriptsDisabled,
        NoTranscriptFound,
        VideoUnavailable
    )
except ImportError:
    print("ERROR:youtube-transcript-api not installed")
    print("Install with: pip install youtube-transcript-api")
    sys.exit(1)

video_id = sys.argv[1]
lang = sys.argv[2] if len(sys.argv) > 2 else 'en'
output_format = sys.argv[3] if len(sys.argv) > 3 else 'text'

try:
    transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

    # Try to find transcript in requested language
    transcript = None
    try:
        transcript = transcript_list.find_transcript([lang])
    except:
        # Try to find any available transcript
        try:
            transcript = transcript_list.find_transcript(['en'])
        except:
            available = list(transcript_list)
            if available:
                transcript = available[0]

    if not transcript:
        print("ERROR: No transcript available")
        sys.exit(1)

    # Get transcript data
    data = transcript.fetch()
    video_title = video_id  # We don't get title from API

    if output_format == 'json':
        print(json.dumps({
            'transcript': data,
            'video_id': video_id,
            'language': transcript.language_code
        }))
    elif output_format == 'srt':
        for i, segment in enumerate(data, 1):
            start = segment['start']
            duration = segment['duration']
            text = segment['text']
            # SRT format
            hours = int(start // 3600)
            minutes = int((start % 3600) // 60)
            seconds = int(start % 60)
            ms = int((start % 1) * 1000)
            print(f"{i}\\n{hours:02d}:{minutes:02d}:{seconds:02d},{ms:03d} --> {hours:02d}:{minutes:02d}:{int((start+duration) % 60):02d},{int(((start+duration) % 1) * 1000):03d}\\n{text}\\n")
    elif output_format == 'vtt':
        print("WEBVTT\\n")
        for segment in data:
            start = segment['start']
            duration = segment['duration']
            text = segment['text']
            hours = int(start // 3600)
            minutes = int((start % 3600) // 60)
            seconds = int(start % 60)
            ms = int((start % 1) * 1000)
            end_hours = int((start + duration) // 3600)
            end_minutes = int(((start + duration) % 3600) // 60)
            end_seconds = int((start + duration) % 60)
            end_ms = int(((start + duration) % 1) * 1000)
            print(f"{hours:02d}:{minutes:02d}:{seconds:02d}.{ms:03d} --> {end_hours:02d}:{end_minutes:02d}:{end_seconds:02d}.{end_ms:03d}\\n{text}\\n")
    else:  # text
        text_parts = []
        for segment in data:
            text_parts.append(segment['text'])
        print(' '.join(text_parts))

except (TranscriptsDisabled, NoTranscriptFound, VideoUnavailable) as e:
    print(f"ERROR:{str(e)}")
    sys.exit(1)
except Exception as e:
    print(f"ERROR:{str(e)}")
    sys.exit(1)
`

    const result = await exec(
      `python3 -c "${pythonScript.replace(/"/g, '\\"').replace(/\n/g, '; ')}" "${videoId}" "${language}" "${format}"`,
      { timeoutMs: 30000 }
    )

    if (result.stdout.includes('ERROR:')) {
      return { error: result.stdout }
    }

    // Parse SRT/VTT to get plain text if needed
    let transcript = result.stdout
    if (format === 'srt' || format === 'vtt') {
      // Keep the formatted output
      transcript = result.stdout
    }

    return { transcript: transcript.trim() }
  } catch {
    return { error: 'Failed to execute youtube-transcript-api' }
  }
}

async function tryYTSage(
  videoId: string,
  language: string,
  format: string
): Promise<{ transcript?: string; title?: string; duration?: string; error?: string }> {
  try {
    // YTSage is an alternative - try it as fallback
    const pythonScript = `
import sys
import json

try:
    from YTSage import YTSage
except ImportError:
    print("ERROR:YTSage not installed")
    print("Install with: pip install YTSage")
    sys.exit(1)

video_id = sys.argv[1]
lang = sys.argv[2] if len(sys.argv) > 2 else 'en'

try:
    ytsage = YTSage()
    transcript = ytsage.get_transcript(video_id, lang)
    print(transcript)
except Exception as e:
    print(f"ERROR:{str(e)}")
    sys.exit(1)
`

    const result = await exec(
      `python3 -c "${pythonScript.replace(/"/g, '\\"').replace(/\n/g, '; ')}" "${videoId}" "${language}"`,
      { timeoutMs: 30000 }
    )

    if (result.stdout.includes('ERROR:')) {
      return { error: result.stdout }
    }

    return { transcript: result.stdout.trim() }
  } catch {
    return { error: 'Failed to execute YTSage' }
  }
}

async function tryDirectExtraction(
  videoId: string,
  language: string,
  format: string
): Promise<{ transcript?: string; title?: string; duration?: string; error?: string }> {
  // Fallback: Try to get captions directly from YouTube
  try {
    // This is a simplified approach - in production you'd use yt-dlp or similar
    const pythonScript = `
import sys
import urllib.request
import re
import json

def get_captions(video_id, lang='en'):
    # YouTube caption extraction via pytube or similar
    try:
        from pytube import YouTube
        from pytube.captions import Caption

        yt = YouTube(f'https://youtube.com/watch?v={video_id}')
        caption = yt.captions.get_by_language_code(lang)
        if not caption:
            # Try auto-generated
            caption = yt.captions['en']
        return caption.generate_srt_captions()
    except ImportError:
        return "ERROR:pytube not installed. Install with: pip install pytube"
    except Exception as e:
        return f"ERROR:{str(e)}"

video_id = sys.argv[1]
lang = sys.argv[2] if len(sys.argv) > 2 else 'en'
result = get_captions(video_id, lang)
print(result)
`

    const result = await exec(
      `python3 -c "${pythonScript.replace(/"/g, '\\"').replace(/\n/g, '; ')}" "${videoId}" "${language}"`,
      { timeoutMs: 30000 }
    )

    if (result.stdout.includes('ERROR:')) {
      return { error: result.stdout }
    }

    // Convert SRT to plain text if needed
    if (format === 'text') {
      const text = result.stdout
        .replace(/\\d+:\\d+:\\d+\\.\\d+ --> \\d+:\\d+:\\d+\\.\\d+/g, '')  // Remove timestamps
        .replace(/\\d+\\n/g, '')  // Remove line numbers
        .replace(/\\n{3,}/g, '\\n\\n')  // Clean up
        .trim()
      return { transcript: text }
    }

    return { transcript: result.stdout.trim() }
  } catch {
    return { error: 'All transcript methods failed' }
  }
}

export default youTubeTranscriptTool
