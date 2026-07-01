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
    <div className="min-h-screen bg-bg font-inter">
      {loading && <LoadingOverlay msgIndex={msgIndex} />}

      <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-inter text-accent tracking-wider uppercase">AI Powered</span>
          </div>
          <h1 className="font-syne font-black text-4xl md:text-6xl text-text leading-none tracking-tight mb-3">
            Campaign Cartel
          </h1>
          <p className="font-syne text-lg md:text-xl text-muted font-medium">Your AI Promotion Team</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
  )
}
