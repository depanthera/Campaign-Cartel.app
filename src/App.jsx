import { useState, useEffect, useRef } from 'react'
import './App.css'

if (typeof window !== 'undefined' && window.emailjs) {
  window.emailjs.init('E_3six6jiHP7vsvUS')
}

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
      "curatorEmail": "string (required — provide the best available contact: for SubmitHub use 'submit@submithub.com', for Groover use 'contact@groover.co', for Spotify editorial use 'pitchtool@spotify.com', for independent curators provide their known public email or best-guess domain email — never return an empty string)",
      "playlistName": "string",
      "followers": "string",
      "submitVia": "string",
      "matchReason": "string",
      "matchScore": number between 70 and 99,
      "trendingStatus": "string (max 5 words — e.g. 'Active curator lane' or 'High submission window')",
      "subject": "string",
      "pitch": "string — a short, sharp pitch email. Format exactly like this example (use the artist/song/playlist names from this context):\n\nHey,\n\nI wanted to bring \\"[Song]\" by [Artist] to your attention for [Playlist].\n\n[One sentence on the sonic/emotional world of the track — name one or two real artist comparisons if they fit. No hype, just placement.]\n\n[One sentence on what the song is actually about — the emotional or thematic core. Make it specific, not abstract.]\n\n[One sentence on what separates this artist or this record right now.]\n\n[One closing sentence that ties the track to this curator's audience. Confident, not desperate.]\n\nThank you for your time.\n— [Artist]\n\nRules: 4 short paragraphs max. No long blocks. No adjective stacking. No words like 'genuinely', 'sincerely', 'I am confident'. Every sentence earns its place."
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

function SendPitchModal({ pitch, onClose }) {
  const [subject, setSubject]         = useState(pitch.subject)
  const [body, setBody]               = useState(pitch.pitch)
  const [artistName, setArtistName]   = useState('')
  const [artistEmail, setArtistEmail] = useState('')
  const [curatorEmail, setCuratorEmail] = useState(pitch.curatorEmail ?? '')
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const canSend = artistName.trim() && artistEmail.trim() && curatorEmail.trim() && subject.trim() && body.trim() && status === 'idle'

  const handleSend = async () => {
    setStatus('sending')
    setErrorMsg('')
    try {
      const ejs = window.emailjs
      if (!ejs) throw new Error('EmailJS not loaded')
      ejs.init('E_3six6jiHP7vsvUS')
      await ejs.send('service_9jggzz7', 'template_cv5q15h', {
        to_email:   curatorEmail.trim(),
        from_name:  artistName.trim(),
        reply_to:   artistEmail.trim(),
        subject:    subject.trim(),
        message:    body.trim(),
      })
      setStatus('success')
    } catch (err) {
      setErrorMsg(err?.text || 'Failed to send. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5,5,5,0.88)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-border bg-surface overflow-hidden"
        style={{ maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div>
            <p className="font-syne font-bold text-sm text-text">{pitch.curatorName}</p>
            <p className="text-xs font-inter text-muted truncate max-w-[320px]">{pitch.playlistName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-text transition-colors text-lg leading-none ml-4"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {/* Editable email content */}
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-inter font-medium text-muted uppercase tracking-wider mb-1">
                Subject Line <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm font-inter text-text placeholder-muted focus:outline-none focus:border-accent/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-inter font-medium text-muted uppercase tracking-wider mb-1">
                Pitch Body <span className="text-accent">*</span>
              </label>
              <textarea
                rows={8}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-xs font-inter text-text placeholder-muted focus:outline-none focus:border-accent/60 transition-colors resize-y leading-relaxed"
              />
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-3 pt-1 border-t border-border/40">
            <div>
              <label className="block text-[10px] font-inter font-medium text-muted uppercase tracking-wider mb-1 mt-3">
                Your Name <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Milo James"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm font-inter text-text placeholder-muted focus:outline-none focus:border-accent/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-inter font-medium text-muted uppercase tracking-wider mb-1">
                Your Email <span className="text-accent">*</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={artistEmail}
                onChange={(e) => setArtistEmail(e.target.value)}
                className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm font-inter text-text placeholder-muted focus:outline-none focus:border-accent/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-inter font-medium text-muted uppercase tracking-wider mb-1">
                Curator Email <span className="text-accent">*</span>
              </label>
              <input
                type="email"
                placeholder="curator@example.com"
                value={curatorEmail}
                onChange={(e) => setCuratorEmail(e.target.value)}
                className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm font-inter text-text placeholder-muted focus:outline-none focus:border-accent/60 transition-colors"
              />
            </div>
          </div>

          {/* Error */}
          {status === 'error' && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <p className="text-xs font-inter text-red-400">{errorMsg}</p>
            </div>
          )}

          {/* Success */}
          {status === 'success' && (
            <div className="bg-accent/10 border border-accent/30 rounded-xl px-4 py-3 text-center">
              <p className="text-sm font-syne font-bold text-accent">Pitch sent successfully!</p>
              <p className="text-xs font-inter text-muted mt-0.5">Check your email for confirmation.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border flex gap-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-inter font-medium text-muted hover:border-accent/40 hover:text-text transition-all duration-150"
          >
            {status === 'success' ? 'Close' : 'Cancel'}
          </button>
          {status !== 'success' && (
            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className={`flex-1 py-2.5 rounded-xl text-sm font-syne font-bold transition-all duration-150 ${
                canSend
                  ? 'bg-accent text-bg hover:bg-accent/90 cursor-pointer'
                  : 'bg-accent/20 text-accent/40 cursor-not-allowed'
              }`}
            >
              {status === 'sending' ? 'Sending…' : 'Confirm & Send'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function PitchCard({ pitch }) {
  const [open, setOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [sent, setSent] = useState(false)
  const score = pitch.matchScore ?? 85
  const scoreColor =
    score >= 90 ? 'text-accent' : score >= 80 ? 'text-yellow-400' : 'text-orange-400'

  return (
    <>
      {showModal && (
        <SendPitchModal
          pitch={pitch}
          onClose={() => {
            setShowModal(false)
          }}
          onSent={() => {
            setSent(true)
            setShowModal(false)
          }}
        />
      )}
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
              <span className="text-[10px] font-inter px-1.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 whitespace-nowrap overflow-hidden max-w-[160px] truncate inline-block align-middle">
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
            <div className="flex gap-1.5 flex-wrap justify-end">
              <CopyButton text={pitch.subject} label="Copy Subject" />
              <CopyButton text={pitch.pitch} label="Copy Body" />
              <CopyButton text={`Subject: ${pitch.subject}\n\n${pitch.pitch}`} label="Copy Full" />
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className={`px-3 py-1.5 text-xs font-inter font-medium rounded border transition-all duration-150 ${
                  sent
                    ? 'border-accent text-accent bg-accent/10 cursor-default'
                    : 'border-accent/60 text-accent bg-accent/10 hover:bg-accent/20 cursor-pointer'
                }`}
              >
                {sent ? 'Sent ✓' : 'Send Pitch'}
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
    <div className="film-grain min-h-screen font-inter" style={{ background: '#050505' }}>
      {loading && <LoadingOverlay msgIndex={msgIndex} />}
      <CityScene />

      {/* Content sits in the upper portion, above the skyline */}
      <div className="relative z-10 flex flex-col justify-start px-4 pt-10 md:pt-14"
           style={{ minHeight: '100vh', paddingBottom: '50vh' }}>
        <div className="max-w-xl mx-auto w-full">

          {/* Logo / hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 mb-6">
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
