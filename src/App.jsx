import { useState, useEffect, useRef } from 'react'
import './App.css'

const GENRES = [
  'Pop', 'Hip-Hop', 'R&B', 'Afrobeats', 'Trap', 'Lo-Fi',
  'Electronic', 'House', 'Drill', 'Indie', 'Alternative',
  'Soul', 'Jazz', 'Country', 'Latin', 'Gospel', 'Rock',
]

const MONTHLY_LISTENER_RANGES = [
  'Under 1K', '1K–10K', '10K–50K', '50K–100K',
  '100K–500K', '500K–1M', '1M+',
]

const VIBES = [
  'Emotional', 'Chill', 'Hype', 'Romantic', 'Dark',
  'Uplifting', 'Late Night', 'Summer', 'Workout',
  'Study/Focus', 'Heartbreak', 'Confident', 'Spiritual', 'Party',
]

const LOADING_MESSAGES = [
  'Scanning trending playlists...',
  'Researching active curators...',
  'Writing your pitches...',
]

const GOALS = [
  'Get on playlists', 'Get press', 'Book shows', 'Find collabs',
  'Get sync deals', 'Grow social', 'Get signed',
]

const RELEASE_DURATIONS = [
  'Just starting', '1-2 years', '3-5 years', '5+ years',
]

const RELEASE_FREQUENCIES = [
  'Every few months', 'Monthly', 'Every 2-3 weeks', 'Weekly',
]

const MAIN_PLATFORMS = [
  'Spotify', 'Apple Music', 'SoundCloud', 'YouTube', 'TikTok',
]

const INTAKE_STEPS = [
  { num: 1, label: 'Who are you?' },
  { num: 2, label: 'Where are you at?' },
  { num: 3, label: 'Your goals' },
]

// ─── Platform icons & submission steps ───────────────────────────────────────
const PlatformIcon = ({ platform, size = 18 }) => {
  const cls = `flex-shrink-0`
  const s = size
  switch (platform) {
    case 'SubmitHub':
      return <svg className={cls} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    case 'Groover':
      return <svg className={cls} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
    case 'Musosoup':
      return <svg className={cls} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
    case 'Soundplate':
      return <svg className={cls} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
    case 'Playlist Push':
      return <svg className={cls} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
    case 'Instagram':
      return <svg className={cls} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
    case 'Direct Email':
      return <svg className={cls} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
    case 'YouTube':
      return <svg className={cls} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
    case 'TikTok':
      return <svg className={cls} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
    case 'Music Blog':
      return <svg className={cls} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
    case 'SoundCloud':
      return <svg className={cls} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 17H5a3 3 0 0 1 0-6h.09A5 5 0 1 1 17 17z"/></svg>
    case 'Bandcamp':
      return <svg className={cls} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="4 16.5 12 6 20 16.5"/></svg>
    default:
      return <svg className={cls} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  }
}

const PLATFORM_STEPS = {
  'SubmitHub': [
    'Copy your pitch using the button below.',
    'Click "Open Submission Page" — log in or create a free SubmitHub account.',
    'Locate this curator and click their Submit button.',
    'Paste your pitch in the message field and add your Spotify track link.',
    'Submit — most curators respond within 7 days.',
  ],
  'Groover': [
    'Copy your pitch using the button below.',
    'Click "Open Submission Page" — log in or sign up for Groover.',
    'Purchase credits if needed (starting from €2 per curator).',
    'Find this curator, paste your pitch, and add your streaming link.',
    'Submit — guaranteed feedback within 7 days or credits are refunded.',
  ],
  'Musosoup': [
    'Copy your pitch using the button below.',
    'Click "Open Submission Page" and create a Musosoup artist account.',
    'Submit your track and paste your pitch in the artist bio / notes field.',
    'Curators browse and select — no upfront cost, revenue share on placements.',
  ],
  'Soundplate': [
    'Copy your pitch using the button below.',
    'Click "Open Submission Page" to reach the Soundplate curator form.',
    'Fill in your artist name, track link, and paste your pitch in the message field.',
    'Submit the form — follow up if you hear nothing within 2 weeks.',
  ],
  'Playlist Push': [
    'Copy your pitch using the button below.',
    'Click "Open Submission Page" — create a Playlist Push artist account.',
    'Set up a campaign for your track (credit-based system).',
    'Paste your pitch as your campaign artist bio/note to curators.',
    'Launch your campaign — curators receive it automatically.',
  ],
  'Instagram': [
    'Copy your pitch using the button below.',
    'Click "Open Submission Page" to visit this curator\'s Instagram profile.',
    'Tap "Message" and paste your pitch.',
    'Add your Spotify or streaming link at the end of the message.',
    'Send — follow up once if no reply after 5–7 days.',
  ],
  'Direct Email': [
    'Copy your pitch using the button below.',
    'Click "Open Submission Page" to visit the curator\'s contact page.',
    'Open your email client and compose a new message to the address listed.',
    'Paste your pitch as the email body and use the subject line provided.',
    'Send — follow up once if no reply after 7–10 days.',
  ],
  'YouTube': [
    'Copy your pitch using the button below.',
    'Click "Open Submission Page" to visit this curator\'s YouTube channel.',
    'Find their About/Contact section for their submission email or form link.',
    'Compose a message using your pitch and include your YouTube/Spotify link.',
    'Send — many YouTube curators also accept pitches via Instagram DM.',
  ],
  'TikTok': [
    'Copy your pitch using the button below.',
    'Click "Open Submission Page" to visit this curator\'s TikTok profile.',
    'Check their bio for a submission email or link in bio.',
    'Send a concise DM or email using a shortened version of your pitch.',
    'Include a 15–30 second highlight clip link for quick review.',
  ],
  'Music Blog': [
    'Copy your pitch using the button below.',
    'Click "Open Submission Page" to go to the blog\'s submission form.',
    'Fill in your artist details, paste your pitch in the message field.',
    'Add your streaming link and any press photos if requested.',
    'Submit — blog reviews typically take 1–3 weeks.',
  ],
  'SoundCloud': [
    'Copy your pitch using the button below.',
    'Click "Open Submission Page" to go to the SoundCloud group or curator profile.',
    'If it\'s a group: click "Add Track" and paste your pitch in the track description.',
    'If it\'s a direct curator: send a comment or message with your pitch.',
    'Follow the curator for reciprocal engagement.',
  ],
  'Bandcamp': [
    'Copy your pitch using the button below.',
    'Click "Open Submission Page" to visit the curator\'s Bandcamp page.',
    'Find their contact info in their bio or "About" section.',
    'Send an email or message using your pitch and include your Bandcamp track link.',
    'Bandcamp curators often feature independent artists — follow up after 10 days.',
  ],
}

function getPlatformSteps(platform) {
  return PLATFORM_STEPS[platform] || PLATFORM_STEPS['Direct Email']
}

const PLATFORM_ACCENT = {
  'SubmitHub':    '#FF6B35',
  'Groover':      '#00C9A7',
  'Musosoup':     '#6C63FF',
  'Soundplate':   '#F7B731',
  'Playlist Push':'#20BF6B',
  'Instagram':    '#E1306C',
  'Direct Email': '#4A90D9',
  'YouTube':      '#FF0000',
  'TikTok':       '#69C9D0',
  'Music Blog':   '#A3CB38',
  'SoundCloud':   '#FF5500',
  'Bandcamp':     '#1DA0C3',
}

function getPlatformAccent(platform) {
  return PLATFORM_ACCENT[platform] || '#8B8FA8'
}

const PLATFORM_URLS = {
  'SubmitHub':          'https://www.submithub.com/for-artists',
  'Groover':            'https://groover.co/en/',
  'Musosoup':           'https://www.musosoup.com/artists',
  'Playlist Push':      'https://playlistpush.com/artist',
  'SubmitLink':         'https://www.submitlink.io/',
  'Soundplate':         'https://soundplate.com/submit-music/',
  'Daily Playlists':    'https://www.dailyplaylists.com/submit',
  'Spotify for Artists':'https://artists.spotify.com/pitch',
  'Two Story Melody':   'https://twostorymelody.com/submit',
  'Indiemono':          'https://indieshuffle.com/submit',
}

function getPlatformUrl(platform) {
  return PLATFORM_URLS[platform] || 'https://www.google.com'
}

function buildPrompt(form) {
  return `You are a world-class music industry coach. You have seen artists blow up and you know exactly what separates the ones who make it. You are speaking directly to ${form.artistName} about their song "${form.songTitle}". Your voice is firm, bold, urgent — but deeply believing in them. Every sentence costs something. No filler, no generic advice. Speak as "you" always — never third person. Create urgency without fear: the window is open, here's how they walk through it.

Artist: ${form.artistName}
Song: ${form.songTitle}
Genre: ${form.genre}
Monthly Listeners: ${form.monthlyListeners}
Song Description: ${form.songDescription}
Vibes: ${form.vibes.join(', ')}

Return ONLY valid JSON (no markdown, no fences) matching this exact shape:
{
  "trendReport": {
    "trendingStyles": ["one direct sentence spoken to the artist about a real trend they can use right now", "one direct sentence", "one direct sentence"],
    "curatorBehaviors": ["one direct sentence on a real curator behavior the artist needs to know right now", "one direct sentence"]
  },
  "artistIntelligence": [
    {
      "id": "algorithm",
      "title": "Algorithm Tips",
      "summary": "One punchy sentence — urgent, direct, speaking to ${form.artistName} about the single most important algorithm move right now.",
      "hook": "The coach's opening line — urgent, direct, max 20 words. Make ${form.artistName} feel the weight of this moment.",
      "sections": [
        {
          "label": "WHY THIS MATTERS",
          "content": "2-3 sentences spoken directly to the artist. Use **bold** for key terms like **save rate**, **playlist add velocity**. Include a real stat (like 72 hours or 18%). Use __underline__ for the exact actions they need to take. Write like you're telling them something most artists never hear."
        },
        {
          "label": "THE OPPORTUNITY",
          "content": "2-3 sentences on the specific window available to an artist at ${form.monthlyListeners} monthly listeners right now. Speak directly to them. Bold key terms, underline the actions. Make them feel the opportunity is real and closeable."
        }
      ],
      "pullQuote": "A line that will make ${form.artistName} screenshot this page. Quotable, urgent, max 20 words.",
      "actionSteps": [
        { "title": "3-5 word directive title", "explanation": "2-3 sentences. Tell them exactly what to do, when to do it, and why it works — like a coach who has seen this play out before. Speak as 'you'. No hedging." },
        { "title": "3-5 word directive title", "explanation": "2-3 sentences. Same voice — direct, urgent, specific. What, when, why." },
        { "title": "3-5 word directive title", "explanation": "2-3 sentences. Same voice — direct, urgent, specific. What, when, why." }
      ],
      "closingStatement": "One powerful send-off sentence — like a coach putting a hand on their shoulder before they walk out. Make ${form.artistName} close the laptop and go take action."
    },
    {
      "id": "genre",
      "title": "For Your Genre",
      "summary": "One urgent sentence — direct to ${form.artistName} — on the single most important ${form.genre} trend they need to move on right now.",
      "hook": "Coach's opening on the ${form.genre} landscape right now — urgent and direct. Max 20 words.",
      "sections": [
        {
          "label": "WHAT'S SHIFTING",
          "content": "2-3 sentences on the ${form.genre} playlist landscape right now, spoken directly to the artist. Include a real number. Bold key terms. Make them feel informed and ready."
        },
        {
          "label": "CURATOR MINDSET",
          "content": "2-3 sentences on what ${form.genre} curators are actively selecting for right now. Speak directly to the artist — 'you'. Bold what matters, underline what to do. Make it feel like insider access."
        }
      ],
      "pullQuote": "A line about the ${form.genre} moment right now that makes the artist feel like they're in exactly the right place at exactly the right time. Max 20 words.",
      "actionSteps": [
        { "title": "3-5 word directive title", "explanation": "2-3 sentences — direct, specific, urgent. What to do in ${form.genre} right now, when, and why it works at this moment." },
        { "title": "3-5 word directive title", "explanation": "2-3 sentences of real, specific, actionable coaching." },
        { "title": "3-5 word directive title", "explanation": "2-3 sentences of real, specific, actionable coaching." }
      ],
      "closingStatement": "One powerful line that makes ${form.artistName} feel like their ${form.genre} moment is now and they're the one to take it."
    },
    {
      "id": "song",
      "title": "For Your Song",
      "summary": "One urgent sentence about what makes '${form.songTitle}' promotable right now — speak directly to ${form.artistName}.",
      "hook": "The coach's opening on this exact song — reference its vibe, what makes it ready. Urgent. Max 20 words.",
      "sections": [
        {
          "label": "YOUR ANGLE",
          "content": "2-3 sentences on the best pitch angle for '${form.songTitle}' right now. Speak directly. Bold the key terms, underline the actions. Tell them exactly how to frame this song to curators."
        },
        {
          "label": "PLAYLIST FIT",
          "content": "2-3 sentences on the specific playlist types that will add this song right now — and why. Bold key terms. Make the artist see clearly where their song belongs."
        }
      ],
      "pullQuote": "A line about '${form.songTitle}' that makes ${form.artistName} remember exactly why they made it. Max 20 words.",
      "actionSteps": [
        { "title": "3-5 word directive title", "explanation": "2-3 sentences. Tell them exactly what to do with this song, when, and why. Reference the song's specific vibe or sound where relevant." },
        { "title": "3-5 word directive title", "explanation": "2-3 sentences of real, specific, actionable coaching for this song." },
        { "title": "3-5 word directive title", "explanation": "2-3 sentences of real, specific, actionable coaching for this song." }
      ],
      "closingStatement": "One line that makes ${form.artistName} feel like '${form.songTitle}' is exactly what the moment needs — and they just need to go put it in front of the right people."
    }
  ],
  "pitches": [
    {
      "curatorName": "string",
      "playlistName": "string",
      "followers": "string",
      "platform": "string — one of: SubmitHub, Groover, Musosoup, Playlist Push, SubmitLink, Soundplate, Daily Playlists, Spotify for Artists, Two Story Melody, Indiemono. Vary across all 4 pitches so the artist hits different platforms.",
      "submissionMethod": "string — one sentence: what the artist should search for or do when they land on the platform page (e.g. 'Search for Hip-Hop curators, find one matching this playlist style, paste your pitch', 'Search for @curatorname on Instagram and DM your pitch')",
      "matchReason": "string",
      "matchScore": number between 70 and 99,
      "trendingStatus": "string (max 5 words — e.g. 'Active curator lane' or 'High submission window')",
      "subject": "string",
      "pitch": "string — a concise, professional pitch email in formal industry standard format. Structure it exactly as follows:\n\nDear [Curator Name],\n\nI am writing to submit \"[Song]\" by [Artist] for consideration on [Playlist].\n\n[One sentence on the track's sonic and emotional identity — reference one or two genuine artist comparisons if appropriate. Factual, not promotional.]\n\n[One sentence on the song's thematic or lyrical focus — specific and concrete, not abstract.]\n\n[One sentence on what distinguishes this artist or this release.]\n\n[One sentence connecting the track to this curator's playlist audience and why it belongs there.]\n\nThank you for your time and consideration.\n\nBest regards,\n[Artist]\n\nRules: 4 body paragraphs, each one sentence. Formal tone throughout — no slang, no exclamation marks, no hyperbole. No words like 'amazing', 'incredible', 'unique', 'game-changing'. No first-person enthusiasm ('I love', 'I believe'). Confident and direct. Every sentence earns its place."
    }
  ]
}

Generate exactly 4 pitches across 4 different platforms. Every word in the artistIntelligence tips must earn its place — this is a coach talking, not a newsletter.\n`
}

async function runCampaign(form) {
  const prompt = buildPrompt(form)
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!response.ok) {
    const err = await response.text()
    throw new Error(`API error ${response.status}: ${err}`)
  }
  const data = await response.json()
  const raw = data.content.map((b) => b.text).join('')
  const stripped = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()

  try {
    return JSON.parse(stripped)
  } catch {
    // Response may be truncated — find the outermost balanced {...} block
    const match = stripped.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        return JSON.parse(match[0])
      } catch {}
    }
    throw new Error('The AI response was incomplete or malformed. Please try again.')
  }
}

// ─── Rich text parsing ────────────────────────────────────────────────────────
// Supports: **bold term**, __underline action__, and auto-highlighted numbers/stats

function parseRichText(text) {
  const segments = []
  // Split on **bold** and __underline__ markers
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g)

  const statPattern = /(\b\d+(?:\.\d+)?(?:\s*%|\s*x\b|\+|\s*K\b|\s*M\b|\s*B\b|\s*hrs?\b|\s*hours?\b|\s*days?\b|\s*weeks?\b|\s*months?\b|\s*mins?\b|\s*minutes?\b|\s*secs?\b|\s*seconds?\b))/g

  for (const part of parts) {
    if (part.startsWith('**') && part.endsWith('**')) {
      segments.push({ type: 'bold', content: part.slice(2, -2) })
    } else if (part.startsWith('__') && part.endsWith('__')) {
      segments.push({ type: 'underline', content: part.slice(2, -2) })
    } else {
      // Auto-highlight stat patterns
      let lastIndex = 0
      let match
      statPattern.lastIndex = 0
      while ((match = statPattern.exec(part)) !== null) {
        if (match.index > lastIndex) {
          segments.push({ type: 'text', content: part.slice(lastIndex, match.index) })
        }
        segments.push({ type: 'stat', content: match[1].trim() })
        lastIndex = match.index + match[1].length
      }
      if (lastIndex < part.length) {
        segments.push({ type: 'text', content: part.slice(lastIndex) })
      }
    }
  }
  return segments
}

function RichText({ text, className = '' }) {
  if (!text) return null
  const segments = parseRichText(text)
  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (seg.type === 'bold') {
          return (
            <strong key={i} className="font-semibold text-white">
              {seg.content}
            </strong>
          )
        }
        if (seg.type === 'underline') {
          return (
            <span key={i} className="underline decoration-accent decoration-[1.5px] underline-offset-[3px]">
              {seg.content}
            </span>
          )
        }
        if (seg.type === 'stat') {
          return (
            <span key={i} className="font-mono font-semibold text-accent">
              {seg.content}
            </span>
          )
        }
        return <span key={i}>{seg.content}</span>
      })}
    </span>
  )
}

// ─── Scroll progress bar ──────────────────────────────────────────────────────
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handle = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? (el.scrollTop / total) * 100 : 0)
    }
    window.addEventListener('scroll', handle, { passive: true })
    handle()
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[70] h-[3px] bg-border/40">
      <div
        className="h-full bg-accent transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

// ─── Reading time ─────────────────────────────────────────────────────────────
function getReadingTime(tip) {
  const text = [
    tip.hook || '',
    ...(tip.sections || []).map((s) => s.content || ''),
    tip.pullQuote || '',
    ...(tip.actionSteps || []).map((s) =>
      typeof s === 'string' ? s : `${s.title || ''} ${s.explanation || ''}`
    ),
  ].join(' ')
  const words = text.split(/\s+/).filter(Boolean).length
  return `${Math.max(2, Math.ceil(words / 180))} min read`
}

// ─── Tip detail view ──────────────────────────────────────────────────────────
const TIP_ICONS = {
  algorithm: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  genre: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  song: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
}

function TipDetailView({ tip, onBack }) {
  const readingTime = getReadingTime(tip)

  return (
    <div className="min-h-screen bg-bg font-inter">
      <ScrollProgressBar />

      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-bg/95 backdrop-blur-md border-b border-border/60">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-inter text-muted hover:text-text transition-colors duration-150 group"
          >
            <span className="transition-transform duration-150 group-hover:-translate-x-0.5">←</span>
            <span>Back</span>
          </button>
          <span className="text-xs font-inter text-muted/60 tracking-widest uppercase">Artist Intelligence</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        {/* Category label */}
        <p className="text-[11px] font-inter text-accent uppercase tracking-[0.18em] font-medium mb-5">
          {tip.title} · {readingTime}
        </p>

        {/* Hook — editorial lede */}
        {tip.hook && (
          <p className="font-syne font-bold text-2xl sm:text-3xl text-white leading-[1.25] tracking-tight mb-14">
            <RichText text={tip.hook} />
          </p>
        )}

        {/* Sections */}
        {(tip.sections || []).map((section, i) => (
          <div key={i} className="mb-12">
            <p className="text-[10px] font-inter font-semibold text-white/30 uppercase tracking-[0.22em] mb-4">
              {section.label}
            </p>
            <p className="text-[15px] font-inter text-white/70 leading-[1.75]">
              <RichText text={section.content} />
            </p>
          </div>
        ))}

        {/* Pull quote */}
        {tip.pullQuote && (
          <div className="my-14 border-l-2 border-accent pl-5">
            <p className="font-inter text-base text-white/80 italic leading-relaxed">
              "{tip.pullQuote}"
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-border/40 my-14" />

        {/* Action steps */}
        {(tip.actionSteps || []).length > 0 && (
          <div>
            <p className="text-[10px] font-inter font-semibold text-white/30 uppercase tracking-[0.22em] mb-10">
              Action Steps
            </p>
            <div className="space-y-10">
              {tip.actionSteps.map((step, i) => {
                const title = typeof step === 'string' ? step : step.title
                const explanation = typeof step === 'string' ? null : step.explanation
                return (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mt-0.5">
                      <span className="font-syne font-bold text-xs text-accent">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-syne font-bold text-base text-white mb-3">
                        <RichText text={title} />
                      </p>
                      {explanation && (
                        <p className="text-[14px] font-inter text-white/60 leading-[1.8]">
                          <RichText text={explanation} />
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Footer nav */}
        <div className="mt-20 pt-8 border-t border-border/40">
          {tip.closingStatement && (
            <p className="font-syne font-bold text-lg text-white leading-snug mb-8">
              {tip.closingStatement}
            </p>
          )}
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-inter text-muted hover:text-text transition-colors duration-150 group"
          >
            <span className="transition-transform duration-150 group-hover:-translate-x-0.5">←</span>
            <span>Back to My Campaign</span>
          </button>
        </div>
      </main>
    </div>
  )
}

// ─── Tip card ─────────────────────────────────────────────────────────────────
function TipCard({ tip, onLearnMore }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-3 hover:border-accent/30 transition-colors duration-200">
      <div className="flex items-center gap-2">
        <span className="text-accent">{TIP_ICONS[tip.id]}</span>
        <span className="font-syne font-bold text-sm text-text">{tip.title}</span>
      </div>
      <p className="text-xs font-inter text-text/70 leading-relaxed flex-1">
        {tip.summary}
      </p>
      <button
        type="button"
        onClick={() => onLearnMore(tip)}
        className="self-start flex items-center gap-1.5 text-xs font-inter font-semibold text-accent hover:text-accent/80 transition-colors duration-150 group"
      >
        <span>Learn More</span>
        <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
      </button>
    </div>
  )
}

// ─── Artist intelligence panel ────────────────────────────────────────────────
function ArtistIntelligence({ tips, onLearnMore }) {
  if (!tips || tips.length === 0) return null
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <h2 className="font-syne font-bold text-base text-text">Artist Intelligence</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tips.map((tip) => (
          <TipCard key={tip.id} tip={tip} onLearnMore={onLearnMore} />
        ))}
      </div>
    </div>
  )
}

// ─── Trend report ─────────────────────────────────────────────────────────────
function TrendReport({ report }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="mb-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-inter text-muted hover:text-accent transition-colors duration-150 mb-3"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
        <span>{open ? 'Hide Trend Report' : 'View Trend Report'}</span>
        <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-inter text-muted uppercase tracking-wider mb-2">Trending Styles</p>
              <ul className="space-y-1.5">
                {report.trendingStyles.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-inter text-text/80">
                    <span className="font-syne font-bold text-accent mt-0.5">0{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-inter text-muted uppercase tracking-wider mb-2">Curator Behaviors</p>
              <ul className="space-y-1.5">
                {report.curatorBehaviors.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-inter text-text/80">
                    <span className="text-accent mt-0.5">—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Pitch card ───────────────────────────────────────────────────────────────
function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false)
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }
  return (
    <button
      type="button"
      onClick={handle}
      className={`px-3 py-1.5 text-xs font-inter font-medium rounded border transition-all duration-150 ${
        copied
          ? 'border-accent text-accent bg-accent/10'
          : 'border-border text-muted hover:border-accent/60 hover:text-text'
      }`}
    >
      {copied ? 'Copied!' : label}
    </button>
  )
}

function SubmitNowModal({ pitch, onClose, onMarkSubmitted }) {
  const [phase, setPhase] = useState('ready') // 'ready' | 'opened'
  const [checks, setChecks] = useState([false, false, false])
  const [copied, setCopied] = useState(false)

  const platform = pitch.platform || 'Direct Email'
  const steps = getPlatformSteps(platform)
  const accent = getPlatformAccent(platform)
  const allChecked = checks.every(Boolean)

  const fullPitch = `Subject: ${pitch.subject}\n\n${pitch.pitch}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullPitch)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  const handleOpen = () => {
    window.open(getPlatformUrl(platform), '_blank', 'noopener')
    setPhase('opened')
  }

  const toggleCheck = (i) =>
    setChecks((prev) => prev.map((v, idx) => (idx === i ? !v : v)))

  const CHECKLIST = ['Copied your pitch', 'Opened submission page', 'Pasted pitch and submitted']

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(5,5,5,0.90)', backdropFilter: 'blur(10px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-border bg-surface overflow-hidden"
        style={{ maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${accent}18`, color: accent }}
            >
              <PlatformIcon platform={platform} size={16} />
            </div>
            <div>
              <p className="font-syne font-bold text-sm text-text">{pitch.curatorName}</p>
              <p className="text-[11px] font-inter text-muted">{platform} · {pitch.playlistName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-text transition-colors text-lg leading-none ml-4 flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">
          {phase === 'ready' ? (
            <>
              {/* Match context */}
              <div
                className="rounded-xl px-4 py-3 border"
                style={{ background: `${accent}0d`, borderColor: `${accent}30` }}
              >
                <p className="text-xs font-inter text-text/80 leading-relaxed">
                  We matched you with a curator in this style on{' '}
                  <span className="font-semibold" style={{ color: accent }}>{platform}</span>.
                  Click below to open their submission page, create a free account if needed, find curators matching your genre, and paste your pre-written pitch.
                </p>
              </div>

              {/* Steps */}
              <div>
                <p className="text-[10px] font-inter font-semibold text-muted uppercase tracking-wider mb-3">
                  How to Submit
                </p>
                <ol className="space-y-2">
                  {steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-syne font-bold mt-0.5"
                        style={{ background: `${accent}20`, color: accent }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-xs font-inter text-text/70 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Pitch preview */}
              <div className="border border-border/60 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-border/40 bg-bg/40">
                  <span className="text-[10px] font-inter font-semibold text-muted uppercase tracking-wider">Your Pitch</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 text-[11px] font-inter font-semibold transition-colors duration-150 ${
                      copied ? 'text-accent' : 'text-muted hover:text-text'
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        Copy Pitch
                      </>
                    )}
                  </button>
                </div>
                <div className="px-3 py-3 max-h-36 overflow-y-auto">
                  <p className="text-[11px] font-inter text-text/60 leading-relaxed whitespace-pre-wrap">{fullPitch}</p>
                </div>
              </div>

              {/* Submission method note */}
            </>
          ) : (
            /* ── Opened phase: checklist ── */
            <>
              <div className="text-center py-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ background: `${accent}18`, color: accent }}
                >
                  <PlatformIcon platform={platform} size={22} />
                </div>
                <p className="font-syne font-bold text-base text-text">Submission Page Opened</p>
                <p className="text-xs font-inter text-muted mt-1">Check off each step as you complete it.</p>
              </div>

              <div className="space-y-2.5">
                {CHECKLIST.map((label, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleCheck(i)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150 text-left ${
                      checks[i]
                        ? 'border-accent/40 bg-accent/8'
                        : 'border-border bg-bg/40 hover:border-border/80'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-150 border ${
                        checks[i] ? 'border-accent bg-accent' : 'border-border/60 bg-transparent'
                      }`}
                    >
                      {checks[i] && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </div>
                    <span className={`text-sm font-inter transition-colors duration-150 ${checks[i] ? 'text-text line-through text-muted' : 'text-text/80'}`}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Re-copy shortcut */}
              <div className="border border-border/40 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
                <span className="text-[11px] font-inter text-muted">Need to re-copy your pitch?</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`text-[11px] font-inter font-semibold transition-colors ${copied ? 'text-accent' : 'text-muted hover:text-text'}`}
                >
                  {copied ? 'Copied!' : 'Copy Pitch'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border flex gap-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-border text-sm font-inter font-medium text-muted hover:border-accent/40 hover:text-text transition-all duration-150"
          >
            Close
          </button>
          {phase === 'ready' ? (
            <button
              type="button"
              onClick={handleOpen}
              className="flex-1 py-2.5 rounded-xl text-sm font-syne font-bold transition-all duration-150 flex items-center justify-center gap-2"
              style={{ background: accent, color: '#050505' }}
            >
              <PlatformIcon platform={platform} size={14} />
              Open {platform} →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { onMarkSubmitted(); onClose() }}
              disabled={!allChecked}
              className={`flex-1 py-2.5 rounded-xl text-sm font-syne font-bold transition-all duration-150 ${
                allChecked
                  ? 'bg-accent text-bg hover:bg-accent/90 cursor-pointer'
                  : 'bg-accent/20 text-accent/40 cursor-not-allowed'
              }`}
            >
              Mark as Submitted
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function PitchCard({ pitch, isSubmitted, onMarkSubmitted }) {
  const [open, setOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const score = pitch.matchScore ?? 85
  const scoreColor =
    score >= 90 ? 'text-accent' : score >= 80 ? 'text-yellow-400' : 'text-orange-400'
  const platform = pitch.platform || 'Direct Email'
  const accent = getPlatformAccent(platform)

  return (
    <>
      {showModal && (
        <SubmitNowModal
          pitch={pitch}
          onClose={() => setShowModal(false)}
          onMarkSubmitted={() => { onMarkSubmitted(); setShowModal(false) }}
        />
      )}
      <div className={`bg-surface border rounded-2xl overflow-hidden transition-colors duration-200 ${
        isSubmitted ? 'border-accent/40' : 'border-border hover:border-accent/30'
      }`}>
        {/* Submitted banner */}
        {isSubmitted && (
          <div className="px-4 py-1.5 bg-accent/8 border-b border-accent/20 flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-[11px] font-inter font-semibold text-accent">Submitted</span>
          </div>
        )}

        <div className="p-4 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {/* Platform badge */}
            <div className="flex items-center gap-1.5 mb-1.5">
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-inter font-semibold border"
                style={{ color: accent, borderColor: `${accent}40`, background: `${accent}12` }}
              >
                <PlatformIcon platform={platform} size={10} />
                <span>{platform}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="font-syne font-bold text-sm text-text">{pitch.curatorName}</span>
            </div>
            <p className="font-syne font-semibold text-base text-text leading-snug truncate">
              {pitch.playlistName}
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-xs font-inter text-muted">{pitch.followers} followers</span>
              {pitch.trendingStatus && (
                <span className="text-[10px] font-inter px-1.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 whitespace-nowrap overflow-hidden max-w-[160px] truncate inline-block align-middle">
                  {pitch.trendingStatus}
                </span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className={`font-syne font-bold text-xl ${scoreColor}`}>{score}</div>
            <div className="text-[10px] font-inter text-muted uppercase tracking-wide">match</div>
          </div>
        </div>

        <div className="px-4 pb-3 border-t border-border/50 pt-3 space-y-2.5">
          <p className="text-xs font-inter text-text/70 leading-snug bg-bg/40 rounded-lg px-3 py-2 border border-border/40">
            {pitch.subject}
          </p>
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="text-xs font-inter text-muted hover:text-accent transition-colors duration-150 flex items-center gap-1"
            >
              <span>{open ? 'Hide Pitch' : 'Show Pitch'}</span>
              <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
            </button>
            <div className="flex gap-1.5 flex-wrap justify-end">
              <CopyButton text={pitch.subject} label="Copy Subject" />
              <CopyButton text={pitch.pitch} label="Copy Body" />
              <button
                type="button"
                onClick={() => !isSubmitted && setShowModal(true)}
                className={`px-3 py-1.5 text-xs font-inter font-semibold rounded border transition-all duration-150 flex items-center gap-1.5 ${
                  isSubmitted
                    ? 'border-accent/40 text-accent bg-accent/8 cursor-default'
                    : 'border-accent/60 text-bg font-bold cursor-pointer'
                }`}
                style={isSubmitted ? {} : { background: accent, borderColor: accent }}
              >
                {isSubmitted ? (
                  <>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Submitted
                  </>
                ) : 'Submit Now →'}
              </button>
            </div>
          </div>
          {open && (
            <div className="bg-bg/40 rounded-lg px-3 py-3 border border-border/40 max-h-40 overflow-y-auto">
              <p className="text-xs font-inter text-text/70 leading-relaxed whitespace-pre-wrap">
                {pitch.pitch}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ─── Submission tracker ───────────────────────────────────────────────────────
function SubmissionTracker({ total, submitted }) {
  const pct = total > 0 ? Math.round((submitted / total) * 100) : 0
  const allDone = submitted === total && total > 0
  return (
    <div className="mb-6 bg-surface border border-border rounded-2xl px-5 py-4">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${allDone ? 'bg-accent' : 'bg-accent animate-pulse'}`} />
          <span className="font-syne font-bold text-sm text-text">Campaign Progress</span>
        </div>
        <span className="text-xs font-inter text-muted">
          <span className="font-semibold text-text">{submitted}</span> of {total} submitted
        </span>
      </div>
      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {allDone && (
        <p className="text-xs font-inter text-accent mt-2">
          Campaign complete — all curators submitted.
        </p>
      )}
    </div>
  )
}

// ─── Loading overlay ──────────────────────────────────────────────────────────
function LoadingOverlay({ msgIndex, messages = LOADING_MESSAGES }) {
  return (
    <div className="fixed inset-0 bg-bg/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-6">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-2 border-border" />
        <div className="absolute inset-0 rounded-full border-2 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full border border-accent/20 animate-ping" />
      </div>
      <div className="text-center space-y-2">
        <p className="font-syne font-semibold text-text text-lg transition-all duration-500">
          {messages[msgIndex % messages.length]}
        </p>
        <p className="font-inter text-muted text-sm">Building your personalized campaign...</p>
      </div>
    </div>
  )
}

// ─── Palm tree (SVG helper) ──────────────────────────────────────────────────
function Palm({ cx, baseY, height, lean = 0 }) {
  const tx = cx + lean
  const ty = baseY - height
  const trunk = `M ${cx - 7},${baseY} Q ${(cx - 3 + lean * 0.4).toFixed(1)},${(baseY - height * 0.5).toFixed(1)} ${tx - 4},${ty} L ${tx + 4},${ty} Q ${(cx + 3 + lean * 0.4).toFixed(1)},${(baseY - height * 0.5).toFixed(1)} ${cx + 7},${baseY} Z`
  const fl = height * 0.33
  const fw = fl * 0.17
  const angles = [-2.4, -1.7, -1.05, -0.38, 0.38, 1.05, 1.7, 2.4]
  const fronds = angles.map(a => {
    const ex = tx + Math.sin(a) * fl
    const ey = ty - Math.cos(a) * fl
    const p = a + Math.PI / 2
    const c1x = (tx + Math.sin(a) * fl * 0.45 + Math.sin(p) * fw).toFixed(1)
    const c1y = (ty - Math.cos(a) * fl * 0.45 - Math.cos(p) * fw).toFixed(1)
    const c2x = (tx + Math.sin(a) * fl * 0.45 - Math.sin(p) * fw).toFixed(1)
    const c2y = (ty - Math.cos(a) * fl * 0.45 + Math.cos(p) * fw).toFixed(1)
    return `M ${tx.toFixed(1)},${ty.toFixed(1)} Q ${c1x},${c1y} ${ex.toFixed(1)},${ey.toFixed(1)} Q ${c2x},${c2y} ${tx.toFixed(1)},${ty.toFixed(1)}`
  })
  return (
    <g fill="#050505">
      <path d={trunk} />
      {fronds.map((f, i) => <path key={i} d={f} />)}
    </g>
  )
}

// ─── City scene ──────────────────────────────────────────────────────────────
function CityScene() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{ background: '#050505' }} />

      {/* Light-pollution glow — dark purple/teal sitting just above skyline */}
      <div className="absolute" style={{
        bottom: 0, left: 0, right: 0, height: '52%',
        background: 'radial-gradient(ellipse 88% 48% at 50% 100%, rgba(38,14,72,0.22) 0%, rgba(12,28,36,0.10) 55%, transparent 100%)',
        filter: 'blur(28px)',
      }} />

      {/* Bottom-anchored SVG skyline */}
      <svg
        viewBox="0 0 1440 380"
        preserveAspectRatio="xMidYMax slice"
        className="absolute bottom-0 left-0 w-full"
        style={{ height: '44vh', minHeight: '180px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Mountain layer 1 — far back, lightest */}
        <path d="M -50,380 C 120,238 305,152 518,137 C 680,125 832,132 992,156 C 1175,182 1355,244 1490,294 L 1490,380 Z" fill="#1e1e1e" />
        {/* Mountain layer 2 */}
        <path d="M -50,380 C 88,290 202,222 328,200 C 454,176 568,168 680,168 C 806,168 926,180 1048,204 C 1204,234 1368,284 1490,326 L 1490,380 Z" fill="#131313" />
        {/* Mountain layer 3 — closest */}
        <path d="M -50,380 C 62,336 158,298 262,280 C 384,260 504,252 620,250 C 742,248 862,254 984,268 C 1126,286 1278,320 1490,366 L 1490,380 Z" fill="#090909" />

        {/* ── Main city silhouette ─────────────────────────────────────────── */}
        <path fill="#050505" d="
          M 0,380 L 0,366 L 14,366 L 14,373 L 28,373 L 28,358 L 42,358 L 42,366
          L 56,366 L 56,352 L 70,352 L 70,360 L 84,360 L 84,344
          L 98,344 L 98,353 L 112,353 L 112,337 L 126,337 L 126,346
          L 140,346 L 140,330 L 154,330 L 154,339 L 168,339 L 168,322
          L 182,322 L 182,330 L 196,330 L 196,314 L 210,314 L 210,323
          L 225,323 L 225,305 L 240,305 L 240,315 L 255,315 L 255,296
          L 270,296 L 270,307 L 285,307 L 285,287 L 300,287 L 300,299
          L 315,299 L 315,278 L 330,278 L 330,291 L 345,291 L 345,270
          L 360,270 L 360,283 L 375,283 L 375,260 L 390,260 L 390,275
          L 405,275 L 405,251 L 419,251 L 419,266 L 433,266 L 433,241
          L 447,241 L 447,257 L 461,257 L 461,230 L 475,230 L 475,248
          L 488,248 L 488,219 L 501,219 L 501,238 L 514,238 L 514,206
          L 526,206 L 526,226 L 538,226 L 538,193 L 549,193 L 549,214
          L 560,214 L 560,179 L 571,179 L 571,200 L 581,200 L 581,164
          L 591,164 L 591,186 L 600,186 L 600,150 L 608,150 L 608,169
          L 616,169 L 616,134 L 623,134 L 623,155 L 630,155 L 630,117
          L 637,117 L 637,138 L 643,138 L 643,101 L 648,101 L 648,120
          L 653,120 L 653,85  L 657,85  L 657,104 L 661,104 L 661,69
          L 664,69  L 664,88  L 667,88  L 667,53  L 669,53  L 669,68
          L 671,68  L 671,42  L 673,42  L 673,56  L 674,56  L 674,31
          L 675,27  L 676,19  L 677,13  L 678,8   L 679,4   L 680,2
          L 681,4   L 682,9   L 683,14  L 684,21  L 685,29  L 686,37
          L 684,37  L 684,45  L 688,45  L 688,37  L 690,37  L 690,49
          L 693,49  L 693,37  L 696,29  L 698,21  L 700,15  L 702,10
          L 703,6   L 704,4   L 705,6   L 706,11  L 707,17  L 708,25
          L 709,36  L 710,50  L 713,50  L 713,63  L 717,63  L 717,50
          L 721,50  L 721,68  L 726,68  L 726,55  L 730,55  L 730,76
          L 735,76  L 735,62  L 740,62  L 740,84  L 746,84  L 746,70
          L 752,70  L 752,94  L 758,94  L 758,79  L 764,79  L 764,104
          L 771,104 L 771,88  L 778,88  L 778,116 L 785,116 L 785,100
          L 793,100 L 793,130 L 801,130 L 801,113 L 810,113 L 810,144
          L 819,144 L 819,127 L 828,127 L 828,157 L 838,157 L 838,140
          L 848,140 L 848,170 L 858,170 L 858,153 L 869,153 L 869,184
          L 880,184 L 880,166 L 891,166 L 891,198 L 903,198 L 903,180
          L 915,180 L 915,212 L 927,212 L 927,194 L 940,194 L 940,226
          L 953,226 L 953,208 L 967,208 L 967,240 L 981,240 L 981,222
          L 996,222 L 996,254 L 1011,254 L 1011,237 L 1027,237 L 1027,268
          L 1043,268 L 1043,251 L 1060,251 L 1060,282 L 1077,282 L 1077,266
          L 1095,266 L 1095,296 L 1113,296 L 1113,280 L 1132,280 L 1132,310
          L 1152,310 L 1152,295 L 1173,295 L 1173,322 L 1196,322 L 1196,308
          L 1220,308 L 1220,334 L 1247,334 L 1247,322 L 1276,322 L 1276,342
          L 1308,342 L 1308,332 L 1344,332 L 1344,350 L 1384,350 L 1384,342
          L 1428,342 L 1428,358 L 1440,358 L 1440,380 L 0,380 Z
        " />

        {/* ── Palm trees LEFT ─────────────────────────────────────────────── */}
        <Palm cx={234} baseY={380} height={160} lean={7} />
        <Palm cx={300} baseY={380} height={170} lean={-4} />
        <Palm cx={364} baseY={380} height={150} lean={9} />

        {/* ── Palm trees RIGHT ────────────────────────────────────────────── */}
        <Palm cx={1078} baseY={380} height={156} lean={-7} />
        <Palm cx={1146} baseY={380} height={164} lean={5} />
        <Palm cx={1216} baseY={380} height={150} lean={-9} />
      </svg>
    </div>
  )
}

// ─── Form helpers ─────────────────────────────────────────────────────────────
function FormField({ label, children, required }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-inter font-medium text-muted uppercase tracking-wider">
        {label}{required && <span className="text-accent ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}



function VibeChip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-inter font-medium border transition-all duration-150 ${
        selected
          ? 'bg-accent text-bg border-accent'
          : 'bg-transparent text-muted border-border hover:border-accent/50 hover:text-text'
      }`}
    >
      {label}
    </button>
  )
}

function GoalChip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-inter font-medium border transition-all duration-150 ${
        selected
          ? 'bg-accent text-bg border-accent'
          : 'bg-transparent text-muted border-border hover:border-accent/50 hover:text-text'
      }`}
    >
      {label}
    </button>
  )
}

const inputClass =
  'w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm font-inter text-text placeholder-muted/50 focus:outline-none focus:border-accent/60 transition-colors duration-150'

// ─── Press & Blog — data & API ───────────────────────────────────────────────
const PRESS_LOADING_MESSAGES = [
  'Scanning active music blogs...',
  'Finding journalists for your sound...',
  'Writing your press pitches...',
]

const PRESS_GOALS = ['Blog Feature', 'Interview', 'Review', 'Premiere']

const PRESS_URLS = {
  'Two Story Melody':  'https://twostorymelody.com/submit',
  'Earmilk':           'https://earmilk.com/submit',
  'Ones To Watch':     'https://www.onestowatch.com/submit',
  'Pigeons & Planes':  'https://pigeonsandplanes.com/submit',
  'DJBooth':           'https://djbooth.net/submit',
  'Lyrical Lemonade':  'https://lyricallemondade.com/submit',
  'The FADER':         'https://thefader.com/submit',
  'Audiomack':         'https://audiomack.com/submit',
}

function buildPressPrompt(form, profile) {
  return `You are a music PR specialist. Generate 4 press pitches for this artist.

Artist: ${profile.artistName}
Genre: ${profile.genre}${profile.subgenre ? ` / ${profile.subgenre}` : ''}
Location: ${profile.location || ''}
Song: ${form.songTitle}
Description: ${form.songDescription}${form.storyAngle ? `\nStory: ${form.storyAngle}` : ''}${form.vibes.length ? `\nVibes: ${form.vibes.join(', ')}` : ''}${form.pressGoals.length ? `\nGoals: ${form.pressGoals.join(', ')}` : ''}

Return ONLY valid JSON (no markdown):
{
  "pitches": [
    {
      "publicationName": "string",
      "journalistName": "string",
      "beat": "string e.g. Hip-Hop & R&B",
      "reach": "string e.g. 2.1M monthly readers",
      "matchScore": number 70-99,
      "subject": "string — compelling subject line under 10 words",
      "pitch": "string — professional, story-driven, under 200 words. Lead with the song narrative not the artist bio."
    }
  ]
}

Target publications from: Two Story Melody, Earmilk, Ones To Watch, Pigeons & Planes, DJBooth, Lyrical Lemonade, The FADER, Audiomack. Match genre and vibe appropriately. Generate exactly 4 pitches.`
}

async function runPressSearch(form, profile) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      messages: [{ role: 'user', content: buildPressPrompt(form, profile) }],
    }),
  })
  if (!response.ok) {
    const err = await response.text()
    throw new Error(`API error ${response.status}: ${err}`)
  }
  const data = await response.json()
  const raw = data.content.map(b => b.text).join('')
  const stripped = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  try {
    return JSON.parse(stripped)
  } catch {
    const match = stripped.match(/\{[\s\S]*\}/)
    if (match) { try { return JSON.parse(match[0]) } catch {} }
    throw new Error('The AI response was incomplete. Please try again.')
  }
}

// ─── Press pitch card ─────────────────────────────────────────────────────────
function PressPitchCard({ pitch }) {
  const [open, setOpen] = useState(false)
  const url = PRESS_URLS[pitch.publicationName]
  const score = pitch.matchScore ?? 85
  const scoreColor = score >= 90 ? 'text-accent' : score >= 80 ? 'text-yellow-400' : 'text-orange-400'

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 transition-colors duration-200">
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-inter font-semibold border border-accent/30 bg-accent/10 text-accent">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span>Press</span>
            </div>
          </div>
          <p className="font-syne font-bold text-sm text-text">{pitch.journalistName}</p>
          <p className="font-syne font-semibold text-base text-text leading-snug truncate">{pitch.publicationName}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs font-inter text-muted">{pitch.beat}</span>
            {pitch.reach && (
              <span className="text-[10px] font-inter px-1.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 whitespace-nowrap">
                {pitch.reach}
              </span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className={`font-syne font-bold text-xl ${scoreColor}`}>{score}</div>
          <div className="text-[10px] font-inter text-muted uppercase tracking-wide">match</div>
        </div>
      </div>

      <div className="px-4 pb-3 border-t border-border/50 pt-3 space-y-2.5">
        <p className="text-xs font-inter text-text/70 leading-snug bg-bg/40 rounded-lg px-3 py-2 border border-border/40">
          {pitch.subject}
        </p>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <button type="button" onClick={() => setOpen(v => !v)}
            className="text-xs font-inter text-muted hover:text-accent transition-colors duration-150 flex items-center gap-1">
            <span>{open ? 'Hide Pitch' : 'Show Pitch'}</span>
            <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
          </button>
          <div className="flex gap-1.5 flex-wrap justify-end">
            <CopyButton text={pitch.subject} label="Copy Subject" />
            <CopyButton text={pitch.pitch} label="Copy Body" />
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-inter font-bold rounded border flex items-center gap-1"
                style={{ background: '#C8FF57', borderColor: '#C8FF57', color: '#050505' }}>
                Open Page →
              </a>
            ) : (
              <button type="button" disabled
                className="px-3 py-1.5 text-xs font-inter font-medium rounded border border-border text-muted/40 cursor-not-allowed">
                No URL
              </button>
            )}
          </div>
        </div>
        {open && (
          <div className="bg-bg/40 rounded-lg px-3 py-3 border border-border/40 max-h-40 overflow-y-auto">
            <p className="text-xs font-inter text-text/70 leading-relaxed whitespace-pre-wrap">{pitch.pitch}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Press & Blog view ────────────────────────────────────────────────────────
function PressBlogView({ profile, onBack }) {
  const [phase, setPhase] = useState('form')
  const [form, setForm] = useState({
    songTitle: '', songDescription: '', vibes: [], storyAngle: '', pressGoals: [],
  })
  const [loading, setLoading] = useState(false)
  const [msgIndex, setMsgIndex] = useState(0)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const intervalRef = useRef(null)

  useEffect(() => {
    if (loading) {
      setMsgIndex(0)
      intervalRef.current = setInterval(() => setMsgIndex(i => i + 1), 2000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [loading])

  const toggleVibe = vibe => setForm(f => ({
    ...f, vibes: f.vibes.includes(vibe) ? f.vibes.filter(v => v !== vibe) : [...f.vibes, vibe],
  }))

  const toggleGoal = goal => setForm(f => ({
    ...f, pressGoals: f.pressGoals.includes(goal) ? f.pressGoals.filter(g => g !== goal) : [...f.pressGoals, goal],
  }))

  const isValid = form.songTitle.trim() && form.songDescription.trim()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid) return
    setError('')
    setLoading(true)
    try {
      const data = await runPressSearch(form, profile)
      setResults(data)
      setPhase('results')
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  // Results
  if (phase === 'results' && results) {
    return (
      <div className="min-h-screen bg-bg font-inter">
        <header className="sticky top-0 z-10 bg-bg/80 backdrop-blur-md border-b border-border">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button type="button" onClick={onBack}
                className="flex items-center gap-1.5 text-sm font-inter text-muted hover:text-text transition-colors group">
                <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
                <span>Dashboard</span>
              </button>
              <div className="w-px h-4 bg-border" />
              <span className="font-syne font-black text-xl text-text tracking-tight">Press & Blog</span>
            </div>
            <span className="text-xs font-inter text-muted hidden sm:block">
              {profile.artistName} — "{form.songTitle}"
            </span>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne font-bold text-xl text-text">Your Press Pack</h2>
            <span className="text-xs font-inter text-muted">{results.pitches?.length ?? 0} publications targeted</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
            {(results.pitches ?? []).map((pitch, i) => (
              <PressPitchCard key={i} pitch={pitch} />
            ))}
          </div>
        </main>
      </div>
    )
  }

  // Form
  return (
    <div className="film-grain min-h-screen font-inter" style={{ background: '#050505' }}>
      {loading && <LoadingOverlay msgIndex={msgIndex} messages={PRESS_LOADING_MESSAGES} />}
      <CityScene />

      <div className="relative z-10 flex flex-col justify-start px-4 pt-10 md:pt-14"
           style={{ minHeight: '100vh', paddingBottom: '50vh' }}>
        <div className="max-w-xl mx-auto w-full">

          <button type="button" onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-inter text-white/40 hover:text-white/70 transition-colors mb-8 group">
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>Back to Dashboard</span>
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[11px] font-inter text-accent tracking-[0.18em] uppercase">Press & Blog</span>
            </div>
            <h1 className="neon-title font-syne font-black text-5xl md:text-7xl text-white leading-none tracking-tight mb-3">
              Campaign Cartel
            </h1>
            <p className="font-inter text-base md:text-lg text-white/50 font-normal tracking-wide">
              Your AI Promotion Team
            </p>
          </div>

          <div className="glass-card p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Artist info banner */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/5 border border-accent/15">
                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-syne font-bold text-[11px] text-accent uppercase">
                    {(profile.artistName || '?')[0]}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-inter font-semibold text-text truncate">{profile.artistName}</p>
                  <p className="text-[10px] font-inter text-muted">
                    {profile.genre}{profile.subgenre ? ` · ${profile.subgenre}` : ''}
                    {profile.location ? ` · ${profile.location}` : ''}
                  </p>
                </div>
              </div>

              <FormField label="Song Title" required>
                <input type="text" placeholder="e.g. Golden Hour" value={form.songTitle}
                  onChange={e => setForm(f => ({ ...f, songTitle: e.target.value }))}
                  className={inputClass} />
              </FormField>

              <FormField label="Song Description" required>
                <textarea rows={3} placeholder="Describe the sound, mood, and feel of your song..."
                  value={form.songDescription}
                  onChange={e => setForm(f => ({ ...f, songDescription: e.target.value }))}
                  className={`${inputClass} resize-none leading-relaxed`} />
              </FormField>

              <FormField label="Vibes (pick any)">
                <div className="flex flex-wrap gap-2 pt-1">
                  {VIBES.map(v => (
                    <VibeChip key={v} label={v} selected={form.vibes.includes(v)} onClick={() => toggleVibe(v)} />
                  ))}
                </div>
              </FormField>

              <FormField label="Story Angle">
                <textarea rows={2} placeholder="What's the story behind this song? Personal journey, social commentary, inspired by..."
                  value={form.storyAngle}
                  onChange={e => setForm(f => ({ ...f, storyAngle: e.target.value }))}
                  className={`${inputClass} resize-none leading-relaxed`} />
              </FormField>

              <FormField label="Press Goal (pick any)">
                <div className="flex flex-wrap gap-2 pt-1">
                  {PRESS_GOALS.map(g => (
                    <VibeChip key={g} label={g} selected={form.pressGoals.includes(g)} onClick={() => toggleGoal(g)} />
                  ))}
                </div>
              </FormField>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-inter text-red-400">{error}</p>
                </div>
              )}

              <button type="submit" disabled={!isValid || loading}
                className={`w-full py-4 rounded-xl font-syne font-bold text-base tracking-wide transition-all duration-150 active:scale-[0.99] ${
                  isValid && !loading ? 'bg-accent text-bg hover:bg-accent/90 cursor-pointer' : 'bg-accent/20 text-accent/40 cursor-not-allowed'
                }`}>
                Find My Press →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Nav bar ──────────────────────────────────────────────────────────────────
function NavBar({ profile, onDashboard }) {
  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <span className="font-syne font-black text-xl text-text tracking-tight">Campaign Cartel</span>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onDashboard}
            className="text-xs font-inter text-muted hover:text-text transition-colors uppercase tracking-widest">
            Dashboard
          </button>
          <button type="button" onClick={onDashboard}
            className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
            <span className="font-syne font-bold text-xs text-accent uppercase">
              {(profile?.artistName || '?')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

// ─── Tool card ────────────────────────────────────────────────────────────────
const TOOL_ICONS = {
  pitching: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
    </svg>
  ),
  press: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  booking: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 1 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 1 1 0-4V7a2 2 0 0 0-2-2H5z"/>
    </svg>
  ),
  social: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
}

function ToolCard({ id, title, description, available, isPro = false, onLaunch }) {
  return (
    <div className={`relative bg-surface border rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 ${
      available ? 'border-border hover:border-accent/40' : 'border-border/50'
    }`}>
      {!available && (
        <div className="absolute top-4 right-4">
          <span className="text-[10px] font-inter font-semibold px-2 py-1 rounded-full bg-border/80 text-muted/70 uppercase tracking-widest">
            Soon
          </span>
        </div>
      )}
      <div className={`flex items-start gap-4 ${!available ? 'opacity-50' : ''}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          available ? 'bg-accent/15 text-accent' : 'bg-surface border border-border/60 text-muted/40'
        }`}>
          {TOOL_ICONS[id]}
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-syne font-bold text-[15px] text-text">{title}</h3>
            {isPro && (
              <span className="text-[9px] font-inter font-bold px-1.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 uppercase tracking-widest">
                PRO
              </span>
            )}
          </div>
          <p className="text-xs font-inter text-muted leading-relaxed">{description}</p>
        </div>
      </div>
      {available && (
        <button type="button" onClick={onLaunch}
          className="w-full py-2.5 rounded-xl bg-accent text-bg font-syne font-bold text-sm hover:bg-accent/90 transition-all duration-150 active:scale-[0.99]">
          Launch →
        </button>
      )}
    </div>
  )
}

// ─── Campaign history item ────────────────────────────────────────────────────
function CampaignHistoryItem({ campaign }) {
  const d = new Date(campaign.date)
  const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return (
    <div className="bg-surface border border-border rounded-xl px-4 py-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="font-syne font-bold text-sm text-text truncate">"{campaign.songTitle}"</p>
        <p className="text-xs font-inter text-muted mt-0.5">
          {campaign.genre} · {campaign.pitchCount} pitch{campaign.pitchCount !== 1 ? 'es' : ''}
        </p>
      </div>
      <span className="text-xs font-inter text-muted/50 flex-shrink-0">{label}</span>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ profile, campaigns, onLaunchCampaign, onLaunchPress, onEditProfile }) {
  return (
    <div className="min-h-screen bg-bg font-inter">
      <NavBar profile={profile} onDashboard={() => {}} />

      <main className="max-w-5xl mx-auto px-4 py-10">

        {/* Welcome header */}
        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] font-inter text-muted uppercase tracking-[0.18em] mb-2">Welcome back</p>
            <h1 className="font-syne font-black text-4xl md:text-5xl text-white leading-tight mb-4">
              {profile.artistName}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-xs font-inter font-semibold bg-accent/10 text-accent border border-accent/20">
                {profile.genre}
              </span>
              {profile.subgenre && (
                <span className="px-2.5 py-1 rounded-full text-xs font-inter font-medium bg-surface text-muted border border-border">
                  {profile.subgenre}
                </span>
              )}
              {profile.location && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-inter font-medium bg-surface text-muted border border-border">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {profile.location}
                </span>
              )}
            </div>
          </div>
          <button type="button" onClick={onEditProfile}
            className="flex-shrink-0 text-xs font-inter font-medium text-muted hover:text-text border border-border hover:border-accent/40 px-3 py-2 rounded-lg transition-all duration-150">
            Edit Profile
          </button>
        </div>

        {/* Tools grid */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <h2 className="font-syne font-bold text-base text-text">Your Tools</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ToolCard id="pitching" title="Playlist Pitching"
              description="Find curators & generate personalized pitches for your latest release."
              available={true} onLaunch={onLaunchCampaign} />
            <ToolCard id="press" title="Press & Blog"
              description="Get featured in music blogs & magazines that reach your audience."
              available={true} isPro={true} onLaunch={onLaunchPress} />
            <ToolCard id="booking" title="Show Booking"
              description="Find venues & festivals to pitch yourself for live performance."
              available={false} />
            <ToolCard id="social" title="Social Strategy"
              description="Get a content plan built specifically for your sound and goals."
              available={false} />
          </div>
        </div>

        {/* Campaign history */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <h2 className="font-syne font-bold text-base text-text">Recent Campaigns</h2>
          </div>
          {campaigns.length === 0 ? (
            <div className="bg-surface border border-border rounded-2xl px-6 py-10 text-center">
              <p className="text-sm font-inter text-muted mb-3">You haven't run a campaign yet.</p>
              <button type="button" onClick={onLaunchCampaign}
                className="text-sm font-inter font-semibold text-accent hover:text-accent/80 transition-colors">
                Launch Playlist Pitching →
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {campaigns.slice(0, 8).map((c, i) => (
                <CampaignHistoryItem key={i} campaign={c} />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}

// ─── Artist intake ────────────────────────────────────────────────────────────
function ArtistIntakeFlow({ initialData = null, onComplete, onCancel = null }) {
  const isEdit = !!initialData
  const [step, setStep] = useState(1)
  const [data, setData] = useState(() => initialData ? { ...initialData } : {
    artistName: '', genre: '', subgenre: '', location: '',
    spotifyUrl: '', instagramHandle: '',
    monthlyListeners: '', releaseDuration: '', releaseFrequency: '', mainPlatform: '',
    goals: [], influences: '', extra: '',
  })

  const update = (key, val) => setData(d => ({ ...d, [key]: val }))
  const toggleGoal = (goal) => setData(d => ({
    ...d,
    goals: d.goals.includes(goal) ? d.goals.filter(g => g !== goal) : [...d.goals, goal],
  }))

  const step1Valid = data.artistName.trim() && data.genre && data.location.trim()
  const step2Valid = data.monthlyListeners && data.releaseDuration && data.releaseFrequency && data.mainPlatform
  const step3Valid = data.goals.length > 0

  const handleComplete = () => {
    const merged = { ...data }
    try { localStorage.setItem('cc_artist_profile', JSON.stringify(merged)) } catch {}
    onComplete(merged)
  }

  return (
    <div className="film-grain min-h-screen font-inter" style={{ background: '#050505' }}>
      <CityScene />
      <div className="relative z-10 flex flex-col items-center px-4 pt-10 md:pt-14"
           style={{ minHeight: '100vh', paddingBottom: '50vh' }}>
        <div className="max-w-xl w-full">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[11px] font-inter text-accent tracking-[0.18em] uppercase">
                  {isEdit ? 'Edit Profile' : 'Artist Profile'}
                </span>
            </div>
            <h1 className="neon-title font-syne font-black text-5xl md:text-7xl text-white leading-none tracking-tight mb-3">
              Campaign Cartel
            </h1>
            <p className="font-inter text-base text-white/50 font-normal tracking-wide">
              {isEdit ? 'Update your artist profile' : "Let's build your profile first"}
            </p>
          </div>

          {/* Cancel link (edit mode) */}
          {isEdit && onCancel && (
            <button type="button" onClick={onCancel}
              className="flex items-center gap-1.5 text-sm font-inter text-white/40 hover:text-white/70 transition-colors mb-5 group">
              <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
              <span>Back to Dashboard</span>
            </button>
          )}

          {/* Step progress */}
          <div className="mb-6 flex items-start justify-between">
            {INTAKE_STEPS.map((s, i) => (
              <div key={s.num} className="flex-1 flex items-start">
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-syne font-bold border transition-all duration-300 ${
                      step > s.num
                        ? 'bg-accent border-accent text-bg'
                        : step === s.num
                        ? 'border-accent text-accent bg-accent/10'
                        : 'border-border text-muted bg-transparent'
                    }`}
                  >
                    {step > s.num ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : s.num}
                  </div>
                  <span className={`text-[9px] font-inter uppercase tracking-wider text-center leading-tight max-w-[64px] ${step === s.num ? 'text-accent' : 'text-muted/40'}`}>
                    {s.label}
                  </span>
                </div>
                {i < INTAKE_STEPS.length - 1 && (
                  <div className={`flex-1 h-[1px] mt-3.5 mx-2 transition-all duration-300 ${step > s.num ? 'bg-accent/50' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="glass-card p-6 md:p-8">

            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-syne font-bold text-xl text-white mb-1">Who are you?</h2>
                  <p className="text-xs font-inter text-muted">Your profile powers every pitch we write.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Artist Name" required>
                    <input type="text" placeholder="e.g. Milo James" value={data.artistName}
                      onChange={e => update('artistName', e.target.value)} className={inputClass} />
                  </FormField>
                  <FormField label="Genre" required>
                    <select value={data.genre} onChange={e => update('genre', e.target.value)}
                      className={`${inputClass} cursor-pointer`}>
                      <option value="" disabled>Select genre...</option>
                      {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Subgenre">
                    <input type="text" placeholder="e.g. dark trap" value={data.subgenre}
                      onChange={e => update('subgenre', e.target.value)} className={inputClass} />
                  </FormField>
                  <FormField label="City, State" required>
                    <input type="text" placeholder="e.g. Los Angeles, CA" value={data.location}
                      onChange={e => update('location', e.target.value)} className={inputClass} />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Spotify URL">
                    <input type="url" placeholder="https://open.spotify.com/artist/..." value={data.spotifyUrl}
                      onChange={e => update('spotifyUrl', e.target.value)} className={inputClass} />
                  </FormField>
                  <FormField label="Instagram Handle">
                    <input type="text" placeholder="@yourtag" value={data.instagramHandle}
                      onChange={e => update('instagramHandle', e.target.value)} className={inputClass} />
                  </FormField>
                </div>

                <button type="button" disabled={!step1Valid} onClick={() => setStep(2)}
                  className={`w-full py-4 rounded-xl font-syne font-bold text-base tracking-wide transition-all duration-150 active:scale-[0.99] ${
                    step1Valid ? 'bg-accent text-bg hover:bg-accent/90 cursor-pointer' : 'bg-accent/20 text-accent/40 cursor-not-allowed'
                  }`}>
                  Next →
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-syne font-bold text-xl text-white mb-1">Where are you at?</h2>
                  <p className="text-xs font-inter text-muted">Help us understand your current momentum.</p>
                </div>

                <FormField label="Monthly Listeners" required>
                  <select value={data.monthlyListeners} onChange={e => update('monthlyListeners', e.target.value)}
                    className={`${inputClass} cursor-pointer`}>
                    <option value="" disabled>Select range...</option>
                    {MONTHLY_LISTENER_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </FormField>

                <FormField label="How long have you been releasing?" required>
                  <select value={data.releaseDuration} onChange={e => update('releaseDuration', e.target.value)}
                    className={`${inputClass} cursor-pointer`}>
                    <option value="" disabled>Select...</option>
                    {RELEASE_DURATIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </FormField>

                <FormField label="How often do you release?" required>
                  <select value={data.releaseFrequency} onChange={e => update('releaseFrequency', e.target.value)}
                    className={`${inputClass} cursor-pointer`}>
                    <option value="" disabled>Select...</option>
                    {RELEASE_FREQUENCIES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </FormField>

                <FormField label="Biggest platform right now" required>
                  <select value={data.mainPlatform || ''} onChange={e => update('mainPlatform', e.target.value)}
                    className={`${inputClass} cursor-pointer`}>
                    <option value="" disabled>Select...</option>
                    {MAIN_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </FormField>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="px-5 py-4 rounded-xl border border-border text-sm font-inter font-medium text-muted hover:border-accent/40 hover:text-text transition-all duration-150">
                    ← Back
                  </button>
                  <button type="button" disabled={!step2Valid} onClick={() => setStep(3)}
                    className={`flex-1 py-4 rounded-xl font-syne font-bold text-base tracking-wide transition-all duration-150 active:scale-[0.99] ${
                      step2Valid ? 'bg-accent text-bg hover:bg-accent/90 cursor-pointer' : 'bg-accent/20 text-accent/40 cursor-not-allowed'
                    }`}>
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-syne font-bold text-xl text-white mb-1">What are you going for?</h2>
                  <p className="text-xs font-inter text-muted">Your goals and influences shape every pitch we write.</p>
                </div>

                <FormField label="Goals — pick all that apply" required>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {GOALS.map(g => (
                      <GoalChip key={g} label={g} selected={data.goals.includes(g)} onClick={() => toggleGoal(g)} />
                    ))}
                  </div>
                </FormField>

                <FormField label="Sounds Like (influences)">
                  <input type="text" placeholder="e.g. Travis Scott, Playboi Carti, Ken Carson"
                    value={data.influences} onChange={e => update('influences', e.target.value)}
                    className={inputClass} />
                </FormField>

                <FormField label="Anything else?">
                  <textarea rows={3} placeholder="Upcoming shows, releases, collabs — anything we should know..."
                    value={data.extra} onChange={e => update('extra', e.target.value)}
                    className={`${inputClass} resize-none leading-relaxed`} />
                </FormField>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)}
                    className="px-5 py-4 rounded-xl border border-border text-sm font-inter font-medium text-muted hover:border-accent/40 hover:text-text transition-all duration-150">
                    ← Back
                  </button>
                  <button type="button" disabled={!step3Valid} onClick={handleComplete}
                    className={`flex-1 py-4 rounded-xl font-syne font-bold text-base tracking-wide transition-all duration-150 active:scale-[0.99] ${
                      step3Valid ? 'bg-accent text-bg hover:bg-accent/90 cursor-pointer' : 'bg-accent/20 text-accent/40 cursor-not-allowed'
                    }`}>
                    {isEdit ? 'Save Profile →' : 'Enter Campaign Cartel →'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [artistProfile, setArtistProfile] = useState(() => {
    try {
      const s = localStorage.getItem('cc_artist_profile')
      return s ? JSON.parse(s) : null
    } catch { return null }
  })

  const [view, setView] = useState(() =>
    localStorage.getItem('cc_artist_profile') ? 'dashboard' : 'intake'
  )
  const [editingProfile, setEditingProfile] = useState(false)

  const [campaigns, setCampaigns] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cc_campaigns') || '[]') }
    catch { return [] }
  })

  const [form, setForm] = useState({
    artistName: '', songTitle: '', genre: '',
    monthlyListeners: '', songDescription: '', vibes: [],
  })
  const [loading, setLoading] = useState(false)
  const [msgIndex, setMsgIndex] = useState(0)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [selectedTip, setSelectedTip] = useState(null)
  const [submittedSet, setSubmittedSet] = useState(new Set())
  const intervalRef = useRef(null)

  useEffect(() => {
    if (loading) {
      setMsgIndex(0)
      intervalRef.current = setInterval(() => setMsgIndex(i => i + 1), 2000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [loading])

  const handleIntakeComplete = (profile) => {
    setArtistProfile(profile)
    setEditingProfile(false)
    setView('dashboard')
  }

  const enterCampaign = () => {
    setForm({
      artistName: artistProfile?.artistName || '',
      monthlyListeners: artistProfile?.monthlyListeners || '',
      genre: artistProfile?.genre || '',
      songTitle: '',
      songDescription: '',
      vibes: [],
    })
    setResults(null)
    setError('')
    setView('campaign')
  }

  const toggleVibe = (vibe) =>
    setForm(f => ({
      ...f,
      vibes: f.vibes.includes(vibe) ? f.vibes.filter(v => v !== vibe) : [...f.vibes, vibe],
    }))

  const isValid = form.songTitle.trim() && form.genre && form.songDescription.trim()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid) return
    setError('')
    setLoading(true)
    try {
      const data = await runCampaign(form)
      const entry = {
        date: new Date().toISOString(),
        songTitle: form.songTitle,
        genre: form.genre,
        pitchCount: data.pitches?.length || 0,
      }
      const updated = [entry, ...campaigns]
      setCampaigns(updated)
      try { localStorage.setItem('cc_campaigns', JSON.stringify(updated)) } catch {}
      setResults(data)
      setView('results')
    } catch (err) {
      setError(err.message || 'Something went wrong. Check your API key and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToDashboard = () => {
    setSelectedTip(null)
    setSubmittedSet(new Set())
    setView('dashboard')
  }

  const handleNewCampaign = () => {
    setSelectedTip(null)
    setSubmittedSet(new Set())
    setError('')
    enterCampaign()
  }

  // ── Views ──────────────────────────────────────────────────────────────────

  if (view === 'intake' || editingProfile) {
    return (
      <ArtistIntakeFlow
        initialData={editingProfile ? artistProfile : null}
        onComplete={handleIntakeComplete}
        onCancel={editingProfile ? () => setEditingProfile(false) : null}
      />
    )
  }

  if (view === 'dashboard') {
    return (
      <Dashboard
        profile={artistProfile}
        campaigns={campaigns}
        onLaunchCampaign={enterCampaign}
        onLaunchPress={() => setView('press')}
        onEditProfile={() => setEditingProfile(true)}
      />
    )
  }

  if (view === 'press') {
    return (
      <PressBlogView
        profile={artistProfile}
        onBack={() => setView('dashboard')}
      />
    )
  }

  if (view === 'results' && selectedTip) {
    return <TipDetailView tip={selectedTip} onBack={() => setSelectedTip(null)} />
  }

  if (view === 'results') {
    return (
      <div className="min-h-screen bg-bg font-inter">
        <header className="sticky top-0 z-10 bg-bg/80 backdrop-blur-md border-b border-border">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button type="button" onClick={handleBackToDashboard}
                className="flex items-center gap-1.5 text-sm font-inter text-muted hover:text-text transition-colors group">
                <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
                <span>Dashboard</span>
              </button>
              <div className="w-px h-4 bg-border" />
              <span className="font-syne font-black text-xl text-text tracking-tight">Campaign Cartel</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-inter text-muted hidden sm:block">
                {form.artistName} — "{form.songTitle}"
              </span>
              <button type="button" onClick={handleNewCampaign}
                className="px-4 py-2 text-sm font-inter font-medium rounded-xl border border-border text-muted hover:border-accent/60 hover:text-text transition-all duration-150">
                New Campaign
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          {results.trendReport && <TrendReport report={results.trendReport} />}
          {results.artistIntelligence && (
            <ArtistIntelligence tips={results.artistIntelligence} onLearnMore={setSelectedTip} />
          )}
          <SubmissionTracker
            total={results.pitches?.length ?? 0}
            submitted={submittedSet.size}
          />
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne font-bold text-xl text-text">Your Pitch Pack</h2>
            <span className="text-xs font-inter text-muted">{results.pitches?.length ?? 0} curators targeted</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {(results.pitches ?? []).map((pitch, i) => (
              <PitchCard
                key={i}
                pitch={pitch}
                isSubmitted={submittedSet.has(i)}
                onMarkSubmitted={() => setSubmittedSet(s => new Set([...s, i]))}
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <button type="button" onClick={handleBackToDashboard}
              className="px-8 py-3.5 bg-accent text-bg font-syne font-bold text-sm rounded-xl hover:bg-accent/90 transition-all duration-150 active:scale-95">
              ← Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    )
  }

  // view === 'campaign'
  return (
    <div className="film-grain min-h-screen font-inter" style={{ background: '#050505' }}>
      {loading && <LoadingOverlay msgIndex={msgIndex} />}
      <CityScene />

      <div className="relative z-10 flex flex-col justify-start px-4 pt-10 md:pt-14"
           style={{ minHeight: '100vh', paddingBottom: '50vh' }}>
        <div className="max-w-xl mx-auto w-full">

          <button type="button" onClick={handleBackToDashboard}
            className="flex items-center gap-1.5 text-sm font-inter text-white/40 hover:text-white/70 transition-colors mb-8 group">
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>Back to Dashboard</span>
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[11px] font-inter text-accent tracking-[0.18em] uppercase">Playlist Pitching</span>
            </div>
            <h1 className="neon-title font-syne font-black text-5xl md:text-7xl text-white leading-none tracking-tight mb-3">
              Campaign Cartel
            </h1>
            <p className="font-inter text-base md:text-lg text-white/50 font-normal tracking-wide">
              Your AI Promotion Team
            </p>
          </div>

          <div className="glass-card p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Artist info banner */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/5 border border-accent/15">
                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-syne font-bold text-[11px] text-accent uppercase">
                    {(form.artistName || '?')[0]}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-inter font-semibold text-text truncate">{form.artistName}</p>
                  <p className="text-[10px] font-inter text-muted">
                    {artistProfile?.monthlyListeners} monthly listeners
                    {artistProfile?.location ? ` · ${artistProfile.location}` : ''}
                  </p>
                </div>
              </div>

              <FormField label="Song Title" required>
                <input type="text" placeholder="e.g. Golden Hour" value={form.songTitle}
                  onChange={e => setForm(f => ({ ...f, songTitle: e.target.value }))}
                  className={inputClass} />
              </FormField>

              <FormField label="Genre" required>
                <select value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))}
                  className={`${inputClass} cursor-pointer`}>
                  <option value="" disabled>Select genre...</option>
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </FormField>

              <FormField label="Song Description" required>
                <textarea rows={3} placeholder="Describe the sound, mood, and story of your song..."
                  value={form.songDescription}
                  onChange={e => setForm(f => ({ ...f, songDescription: e.target.value }))}
                  className={`${inputClass} resize-none leading-relaxed`} />
              </FormField>

              <FormField label="Vibes (pick any)">
                <div className="flex flex-wrap gap-2 pt-1">
                  {VIBES.map(v => (
                    <VibeChip key={v} label={v} selected={form.vibes.includes(v)} onClick={() => toggleVibe(v)} />
                  ))}
                </div>
              </FormField>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-inter text-red-400">{error}</p>
                </div>
              )}

              <button type="submit" disabled={!isValid || loading}
                className={`w-full py-4 rounded-xl font-syne font-bold text-base tracking-wide transition-all duration-150 active:scale-[0.99] ${
                  isValid && !loading
                    ? 'bg-accent text-bg hover:bg-accent/90 cursor-pointer'
                    : 'bg-accent/20 text-accent/40 cursor-not-allowed'
                }`}>
                Run My Campaign →
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}
