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
      "submitVia": "string",
      "matchReason": "string",
      "matchScore": number between 70 and 99,
      "trendingStatus": "string",
      "subject": "string",
      "pitch": "string (full professional pitch email body, 3-4 paragraphs)"
    }
  ]
}

Generate exactly 4 pitches. Every word in the artistIntelligence tips must earn its place — this is a coach talking, not a newsletter.\n`
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

function PitchCard({ pitch }) {
  const [open, setOpen] = useState(false)
  const score = pitch.matchScore ?? 85
  const scoreColor =
    score >= 90 ? 'text-accent' : score >= 80 ? 'text-yellow-400' : 'text-orange-400'

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 transition-colors duration-200">
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="font-syne font-bold text-sm text-text">{pitch.curatorName}</span>
            <span className="text-xs font-inter text-muted">via {pitch.submitVia}</span>
          </div>
          <p className="font-syne font-semibold text-base text-text leading-snug truncate">
            {pitch.playlistName}
          </p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs font-inter text-muted">{pitch.followers} followers</span>
            <span className="text-xs font-inter px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
              {pitch.trendingStatus}
            </span>
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
          <div className="flex gap-1.5">
            <CopyButton text={pitch.subject} label="Copy Subject" />
            <CopyButton text={pitch.pitch} label="Copy Body" />
            <CopyButton text={`Subject: ${pitch.subject}\n\n${pitch.pitch}`} label="Copy Full" />
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
  )
}

// ─── Loading overlay ──────────────────────────────────────────────────────────
function LoadingOverlay({ msgIndex }) {
  return (
    <div className="fixed inset-0 bg-bg/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-6">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-2 border-border" />
        <div className="absolute inset-0 rounded-full border-2 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full border border-accent/20 animate-ping" />
      </div>
      <div className="text-center space-y-2">
        <p className="font-syne font-semibold text-text text-lg transition-all duration-500">
          {LOADING_MESSAGES[msgIndex % LOADING_MESSAGES.length]}
        </p>
        <p className="font-inter text-muted text-sm">Building your personalized campaign...</p>
      </div>
    </div>
  )
}

// ─── City scene ──────────────────────────────────────────────────────────────
function CityScene() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>

      <div className="absolute inset-0" style={{ background: '#050505' }} />

      {/* Atmospheric glow centered behind skyline */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div style={{
          width: '75%', height: '55%',
          background: 'radial-gradient(ellipse at 50% 65%, rgba(55,18,95,0.32) 0%, rgba(25,8,48,0.14) 50%, transparent 80%)',
          filter: 'blur(45px)',
        }} />
      </div>

      {/* Centered LA skyline SVG outline */}
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8">
        <svg
          viewBox="0 0 900 260"
          className="w-full max-w-5xl"
          style={{ maxHeight: '55vh' }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Mountain layer 1 — San Gabriel range, farthest back */}
          <path
            d="M 0,210 C 60,175 130,130 210,105 C 290,80 360,68 430,62 C 490,57 545,62 600,72 C 670,85 750,110 830,145 C 875,165 920,190 960,210 L 960,260 L 0,260 Z"
            fill="rgba(255,255,255,0.022)"
            stroke="rgba(255,255,255,0.055)"
            strokeWidth="1"
          />
          {/* Mountain layer 2 — closer ridgeline */}
          <path
            d="M 0,230 C 50,205 110,178 175,162 C 230,148 278,140 325,138 C 370,136 405,142 445,150 C 490,160 540,172 600,185 C 660,198 730,215 800,228 C 850,238 900,248 960,255 L 960,260 L 0,260 Z"
            fill="rgba(255,255,255,0.018)"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />

          {/* ── Left palm trees ─────────────────────────────────────── */}
          {/* Palm 1 */}
          <path d="M 52,258 Q 50,232 47,208 Q 45,188 48,168" stroke="rgba(255,255,255,0.38)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 48,168 Q 30,150 12,154 M 48,168 Q 38,144 33,128 M 48,168 Q 52,140 62,132 M 48,168 Q 63,148 72,151 M 48,168 Q 42,155 26,158" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Palm 2 */}
          <path d="M 82,258 Q 80,234 77,212 Q 75,192 78,172" stroke="rgba(255,255,255,0.38)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 78,172 Q 60,154 42,158 M 78,172 Q 68,148 63,132 M 78,172 Q 82,144 92,136 M 78,172 Q 93,152 102,155 M 78,172 Q 72,159 56,162" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Palm 3 */}
          <path d="M 115,258 Q 112,236 108,215 Q 106,194 110,174" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 110,174 Q 92,156 74,160 M 110,174 Q 100,150 95,134 M 110,174 Q 114,146 124,138 M 110,174 Q 126,154 135,157 M 110,174 Q 103,161 88,164" stroke="rgba(255,255,255,0.28)" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* ── Main LA skyline outline ──────────────────────────────── */}
          {/*
            Tracing the outer top-edge profile of the LA skyline, left to right.
            Key landmarks: gradual low buildings → downtown rise →
            US Bank Tower (tallest, notched crown) → Wilshire Grand (pointed) →
            dense cluster → taper right
          */}
          <path
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            d="
              M 148,258
              L 148,246 L 155,246 L 155,251 L 162,251 L 162,240
              L 169,240 L 169,248 L 176,248 L 176,235
              L 183,235 L 183,242 L 190,242 L 190,228
              L 197,228 L 197,236 L 204,236 L 204,222
              L 211,222 L 211,230 L 218,230 L 218,215
              L 225,215 L 225,223 L 232,223 L 232,208
              L 238,208 L 238,216 L 245,216 L 245,200
              L 252,200 L 252,210 L 258,210 L 258,194
              L 265,194 L 265,204 L 272,204 L 272,188
              L 278,188 L 278,198 L 285,198 L 285,181
              L 292,181 L 292,192 L 298,192 L 298,175
              L 305,175 L 305,186 L 312,186 L 312,168
              L 318,168 L 318,180 L 325,180 L 325,162
              L 332,162 L 332,172 L 338,172 L 338,154
              L 345,154 L 345,165 L 352,165 L 352,146
              L 358,146 L 358,158 L 365,158 L 365,138
              L 372,138 L 372,150 L 378,150 L 378,128
              L 384,128 L 384,118 L 389,118 L 389,104
              L 393,104 L 393,90  L 397,90  L 397,75
              L 401,75  L 401,61  L 404,61  L 404,48
              L 407,48  L 407,36  L 409,36  L 409,26
              L 411,26  L 411,18  L 412,14  L 413,10
              L 414,7   L 415,4   L 416,3   L 417,4
              L 418,7   L 419,12  L 419,18
              L 417,18  L 417,24  L 421,24  L 421,18
              L 422,18  L 422,24  L 424,24
              L 424,36  L 426,36  L 426,50
              L 429,50  L 429,38  L 431,38  L 431,26
              L 433,24  L 435,22  L 437,20
              L 439,18  L 440,16  L 441,14  L 442,12
              L 443,10  L 444,8   L 445,7   L 446,8
              L 447,11  L 448,15  L 448,20  L 449,26
              L 449,35  L 451,35  L 451,48
              L 453,48  L 453,38  L 455,38  L 455,52
              L 458,52  L 458,40  L 460,40  L 460,30
              L 462,28  L 464,32  L 464,44  L 466,44
              L 466,56  L 469,56  L 469,44  L 471,44
              L 471,38  L 473,36  L 475,40  L 475,52
              L 478,52  L 478,64  L 481,64  L 481,52
              L 484,52  L 484,68  L 487,68  L 487,80
              L 490,80  L 490,70  L 493,70  L 493,84
              L 496,84  L 496,96  L 499,96  L 499,82
              L 502,82  L 502,96  L 505,96  L 505,108
              L 509,108 L 509,118 L 513,118 L 513,106
              L 517,106 L 517,120 L 521,120 L 521,132
              L 525,132 L 525,142 L 529,142 L 529,132
              L 533,132 L 533,148 L 537,148 L 537,158
              L 541,158 L 541,168 L 547,168 L 547,156
              L 552,156 L 552,170 L 558,170 L 558,180
              L 564,180 L 564,170 L 569,170 L 569,182
              L 575,182 L 575,192 L 581,192 L 581,202
              L 588,202 L 588,212 L 595,212 L 595,220
              L 603,220 L 603,228 L 611,228 L 611,236
              L 620,236 L 620,242 L 628,242 L 628,248
              L 638,248 L 638,240 L 646,240 L 646,248
              L 655,248 L 655,242 L 663,242 L 663,248
              L 674,248 L 674,238 L 682,238 L 682,248
              L 695,248 L 695,258
            "
          />

          {/* ── Right palm trees ────────────────────────────────────── */}
          {/* Palm 4 */}
          <path d="M 760,258 Q 757,236 754,214 Q 752,193 755,172" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 755,172 Q 737,154 719,158 M 755,172 Q 745,148 740,132 M 755,172 Q 759,144 769,136 M 755,172 Q 771,152 780,155 M 755,172 Q 748,159 733,162" stroke="rgba(255,255,255,0.28)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Palm 5 */}
          <path d="M 796,258 Q 793,234 790,210 Q 788,190 791,168" stroke="rgba(255,255,255,0.38)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 791,168 Q 773,150 755,154 M 791,168 Q 781,144 776,128 M 791,168 Q 795,140 805,132 M 791,168 Q 807,148 816,151 M 791,168 Q 784,155 769,158" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Palm 6 */}
          <path d="M 830,258 Q 828,232 825,208 Q 823,186 826,164" stroke="rgba(255,255,255,0.38)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 826,164 Q 808,146 790,150 M 826,164 Q 816,140 811,124 M 826,164 Q 830,136 840,128 M 826,164 Q 842,144 851,147 M 826,164 Q 819,151 804,154" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* ── Subtle interior building lines (depth) ──────────────── */}
          {/* US Bank Tower vertical lines */}
          <line x1="413" y1="18" x2="413" y2="50"  stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <line x1="419" y1="18" x2="419" y2="50"  stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          {/* A few window rows on downtown cluster */}
          <line x1="378" y1="140" x2="426" y2="140" stroke="rgba(255,255,255,0.06)" strokeWidth="0.75" />
          <line x1="378" y1="155" x2="426" y2="155" stroke="rgba(255,255,255,0.06)" strokeWidth="0.75" />
          <line x1="378" y1="170" x2="426" y2="170" stroke="rgba(255,255,255,0.06)" strokeWidth="0.75" />
          <line x1="440" y1="120" x2="520" y2="120" stroke="rgba(255,255,255,0.05)" strokeWidth="0.75" />
          <line x1="440" y1="138" x2="520" y2="138" stroke="rgba(255,255,255,0.05)" strokeWidth="0.75" />

          {/* ── Flickering windows ──────────────────────────────────── */}
          <rect className="win-f1" x="414" y="26"  width="4" height="3" fill="#C8FF57" opacity="0.6" />
          <rect className="win-f3" x="420" y="36"  width="4" height="3" fill="#ffe4a0" opacity="0.5" />
          <rect className="win-f2" x="383" y="142" width="4" height="3" fill="#C8FF57" opacity="0.55" />
          <rect className="win-f4" x="391" y="156" width="4" height="3" fill="#ffe4a0" opacity="0.45" />
          <rect className="win-f1" x="462" y="46"  width="4" height="3" fill="#a0c8ff" opacity="0.5" />
          <rect className="win-f2" x="470" y="58"  width="4" height="3" fill="#C8FF57" opacity="0.55" />
          <rect className="win-f3" x="493" y="86"  width="4" height="3" fill="#ffe4a0" opacity="0.45" />
          <rect className="win-f4" x="502" y="98"  width="4" height="3" fill="#C8FF57" opacity="0.5" />

          {/* Ground line */}
          <line x1="0" y1="258" x2="900" y2="258" stroke="rgba(255,255,255,0.06)" strokeWidth="0.75" />
        </svg>
      </div>
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

const inputClass =
  'w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm font-inter text-text placeholder-muted/50 focus:outline-none focus:border-accent/60 transition-colors duration-150'

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [form, setForm] = useState({
    artistName: '',
    songTitle: '',
    genre: '',
    monthlyListeners: '',
    songDescription: '',
    vibes: [],
  })
  const [loading, setLoading] = useState(false)
  const [msgIndex, setMsgIndex] = useState(0)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [selectedTip, setSelectedTip] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (loading) {
      setMsgIndex(0)
      intervalRef.current = setInterval(() => setMsgIndex((i) => i + 1), 2000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [loading])

  const toggleVibe = (vibe) => {
    setForm((f) => ({
      ...f,
      vibes: f.vibes.includes(vibe) ? f.vibes.filter((v) => v !== vibe) : [...f.vibes, vibe],
    }))
  }

  const isValid =
    form.artistName.trim() &&
    form.songTitle.trim() &&
    form.genre &&
    form.monthlyListeners &&
    form.songDescription.trim()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid) return
    setError('')
    setLoading(true)
    try {
      const data = await runCampaign(form)
      setResults(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Check your API key and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResults(null)
    setSelectedTip(null)
    setError('')
    setForm({ artistName: '', songTitle: '', genre: '', monthlyListeners: '', songDescription: '', vibes: [] })
  }

  if (results && selectedTip) {
    return <TipDetailView tip={selectedTip} onBack={() => setSelectedTip(null)} />
  }

  if (results) {
    return (
      <div className="min-h-screen bg-bg font-inter">
        <header className="sticky top-0 z-10 bg-bg/80 backdrop-blur-md border-b border-border">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <span className="font-syne font-black text-xl text-text tracking-tight">Campaign Cartel</span>
              <span className="ml-2 text-xs font-inter text-muted">
                for {form.artistName} — "{form.songTitle}"
              </span>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-inter font-medium rounded-xl border border-border text-muted hover:border-accent/60 hover:text-text transition-all duration-150"
            >
              Run New Campaign
            </button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          {results.trendReport && <TrendReport report={results.trendReport} />}

          {results.artistIntelligence && (
            <ArtistIntelligence tips={results.artistIntelligence} onLearnMore={setSelectedTip} />
          )}

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne font-bold text-xl text-text">Your Pitch Pack</h2>
            <span className="text-xs font-inter text-muted">{results.pitches?.length ?? 0} curators targeted</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {(results.pitches ?? []).map((pitch, i) => (
              <PitchCard key={i} pitch={pitch} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={handleReset}
              className="px-8 py-3.5 bg-accent text-bg font-syne font-bold text-sm rounded-xl hover:bg-accent/90 transition-all duration-150 active:scale-95"
            >
              Run New Campaign
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="film-grain min-h-screen font-inter relative" style={{ background: '#050505' }}>
      {loading && <LoadingOverlay msgIndex={msgIndex} />}
      <CityScene />

      {/* Content layer */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-4 py-16 md:py-24">
        <div className="max-w-xl mx-auto w-full">

          {/* Logo / hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[11px] font-inter text-accent tracking-[0.18em] uppercase">AI Powered</span>
            </div>
            <h1 className="neon-title font-syne font-black text-5xl md:text-7xl text-white leading-none tracking-tight mb-3">
              Campaign Cartel
            </h1>
            <p className="font-inter text-base md:text-lg text-white/50 font-normal tracking-wide">
              Your AI Promotion Team
            </p>
          </div>

          {/* Frosted glass form card */}
          <div className="glass-card p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Artist Name" required>
                  <input
                    type="text"
                    placeholder="e.g. Milo James"
                    value={form.artistName}
                    onChange={(e) => setForm((f) => ({ ...f, artistName: e.target.value }))}
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Song Title" required>
                  <input
                    type="text"
                    placeholder="e.g. Golden Hour"
                    value={form.songTitle}
                    onChange={(e) => setForm((f) => ({ ...f, songTitle: e.target.value }))}
                    className={inputClass}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Genre" required>
                  <select
                    value={form.genre}
                    onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="" disabled>Select genre...</option>
                    {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </FormField>
                <FormField label="Monthly Listeners" required>
                  <select
                    value={form.monthlyListeners}
                    onChange={(e) => setForm((f) => ({ ...f, monthlyListeners: e.target.value }))}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="" disabled>Select range...</option>
                    {MONTHLY_LISTENER_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </FormField>
              </div>

              <FormField label="Song Description" required>
                <textarea
                  rows={3}
                  placeholder="Describe the sound, mood, and story of your song..."
                  value={form.songDescription}
                  onChange={(e) => setForm((f) => ({ ...f, songDescription: e.target.value }))}
                  className={`${inputClass} resize-none leading-relaxed`}
                />
              </FormField>

              <FormField label="Vibes (pick any)">
                <div className="flex flex-wrap gap-2 pt-1">
                  {VIBES.map((v) => (
                    <VibeChip key={v} label={v} selected={form.vibes.includes(v)} onClick={() => toggleVibe(v)} />
                  ))}
                </div>
              </FormField>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-inter text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!isValid || loading}
                className={`w-full py-4 rounded-xl font-syne font-bold text-base tracking-wide transition-all duration-150 active:scale-[0.99] ${
                  isValid && !loading
                    ? 'bg-accent text-bg hover:bg-accent/90 cursor-pointer'
                    : 'bg-accent/20 text-accent/40 cursor-not-allowed'
                }`}
              >
                Run My Campaign →
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}
