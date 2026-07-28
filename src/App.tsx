import { useState, useEffect, useRef } from 'react'

// ── Countdown hook ──────────────────────────────────────────────────────────
function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

// ── Scroll-reveal hook ──────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

// ── Reveal wrapper ──────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ── Ornament line ───────────────────────────────────────────────────────────
function Ornament({ color = '#c4a35a' }: { color?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 my-4">
      <div style={{ width: 40, height: 1, background: color, opacity: 0.5 }} />
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5Z" fill={color} opacity="0.7" />
      </svg>
      <div style={{ width: 40, height: 1, background: color, opacity: 0.5 }} />
    </div>
  )
}

// ── Photo placeholder ───────────────────────────────────────────────────────
function PhotoBox({ className = '', label = '', style }: { className?: string; label?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: 'linear-gradient(135deg, #f0e8dc 0%, #e8ddd0 100%)', ...style }}
    >
      <div className="flex flex-col items-center gap-2 opacity-40">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b4f3a" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        {label && <span className="font-body text-xs" style={{ color: '#6b4f3a' }}>{label}</span>}
      </div>
    </div>
  )
}

// ── Section heading ─────────────────────────────────────────────────────────
function SectionHeading({ sub, title, light = false }: { sub: string; title: string; light?: boolean }) {
  const text = light ? '#faf7f2' : '#2d2420'
  const gold = light ? '#e8d5a3' : '#c4a35a'
  return (
    <div className="text-center mb-10">
      <p className="font-accent text-sm tracking-[0.25em] uppercase mb-2" style={{ color: gold }}>{sub}</p>
      <h2 className="font-display text-3xl md:text-4xl italic" style={{ color: text }}>{title}</h2>
      <Ornament color={gold} />
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTIONS
// ══════════════════════════════════════════════════════════════════════════════

// 1. Cover / Hero
function CoverSection({ onOpen }: { onOpen: () => void }) {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(170deg, #fdf9f4 0%, #f5ede0 60%, #ede0d0 100%)' }}
    >
      {/* Decorative corner florals (SVG placeholder shapes) */}
      <div className="absolute top-0 left-0 w-40 h-40 opacity-20" style={{ pointerEvents: 'none' }}>
        <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
          <circle cx="20" cy="20" r="60" stroke="#c4a35a" strokeWidth="0.8" />
          <circle cx="20" cy="20" r="40" stroke="#c9a0a0" strokeWidth="0.6" />
          <circle cx="20" cy="20" r="20" stroke="#c4a35a" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-40 h-40 opacity-20" style={{ pointerEvents: 'none' }}>
        <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
          <circle cx="140" cy="140" r="60" stroke="#c4a35a" strokeWidth="0.8" />
          <circle cx="140" cy="140" r="40" stroke="#c9a0a0" strokeWidth="0.6" />
          <circle cx="140" cy="140" r="20" stroke="#c4a35a" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 text-center px-6 max-w-sm mx-auto">
        {/* Badge */}
        <div className="animate-fade-up delay-100">
          <p className="font-accent text-xs tracking-[0.3em] uppercase mb-8" style={{ color: '#c4a35a' }}>
            Undangan Pernikahan
          </p>
        </div>

        {/* Couple names */}
        <div className="animate-fade-up delay-200">
          <h1 className="font-display text-5xl md:text-6xl italic leading-tight mb-1" style={{ color: '#2d2420' }}>
            Arif
          </h1>
          <p className="font-accent text-2xl tracking-widest" style={{ color: '#c4a35a' }}>&amp;</p>
          <h1 className="font-display text-5xl md:text-6xl italic leading-tight mt-1" style={{ color: '#2d2420' }}>
            Indri
          </h1>
        </div>

        <Ornament />

        {/* Date */}
        <div className="animate-fade-up delay-300">
          <p className="font-body text-sm tracking-widest uppercase" style={{ color: '#6b4f3a' }}>
            Sabtu, 14 Desember 2024
          </p>
        </div>

        {/* Photo frame */}
        <div className="animate-fade-up delay-400 my-8">
          <div className="relative mx-auto" style={{ width: 180, height: 220 }}>
            <div
              className="absolute inset-0 rounded-full"
              style={{ border: '1px solid #c4a35a', opacity: 0.4, transform: 'translate(8px,8px)' }}
            />
            <PhotoBox
              className="w-full h-full rounded-full"
              label="Foto Bersama"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="animate-fade-up delay-500">
          <button
            onClick={onOpen}
            className="inline-flex items-center gap-3 px-8 py-3 rounded-full font-body text-sm tracking-widest uppercase transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #c4a35a, #a88442)',
              color: '#faf7f2',
              boxShadow: '0 4px 20px #c4a35a44',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            Buka Undangan
          </button>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse-soft">
          <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
            <rect x="1" y="1" width="18" height="28" rx="9" stroke="#c4a35a" strokeWidth="1.5" opacity="0.5" />
            <circle cx="10" cy="8" r="2.5" fill="#c4a35a" opacity="0.7" />
          </svg>
        </div>
      </div>
    </section>
  )
}

// 2. Bismillah / Opening Quote
function BismillahSection() {
  return (
    <section className="py-16 px-6 text-center" style={{ background: '#faf7f2' }}>
      <Reveal className="max-w-lg mx-auto">
        <p className="font-display text-2xl italic mb-6" style={{ color: '#c4a35a' }}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
        <p className="font-body text-sm leading-relaxed" style={{ color: '#6b4f3a' }}>
          "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tentram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."
        </p>
        <p className="font-accent text-xs tracking-widest uppercase mt-4" style={{ color: '#c4a35a' }}>
          QS. Ar-Rum: 21
        </p>
      </Reveal>
    </section>
  )
}

// 3. Couple Section
function CoupleSection() {
  return (
    <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg, #faf7f2 0%, #f5ede0 100%)' }}>
      <div className="max-w-2xl mx-auto">
        <Reveal>
          <SectionHeading sub="Mempelai" title="Yang Berbahagia" />
        </Reveal>

        <div className="flex flex-col gap-12">
          {/* Groom */}
          <Reveal delay={100}>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ border: '1px solid #c4a35a', transform: 'translate(6px,6px)', opacity: 0.5 }}
                />
                <PhotoBox className="w-36 h-36 rounded-full relative z-10" label="Foto Pria" />
              </div>
              <p className="font-accent text-xs tracking-[0.25em] uppercase mb-1" style={{ color: '#c4a35a' }}>Mempelai Pria</p>
              <h3 className="font-display text-2xl italic mb-1" style={{ color: '#2d2420' }}>Arif Budi Suryono, S.T.</h3>
              <p className="font-body text-sm" style={{ color: '#6b4f3a' }}>Putra dari Bapak .......... &amp; Ibu ..........</p>
            </div>
          </Reveal>

          {/* Divider */}
          <Reveal delay={150} className="flex flex-col items-center">
            <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, #c4a35a, transparent)' }} />
            <p className="font-display text-3xl italic my-2" style={{ color: '#c4a35a' }}>&amp;</p>
            <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, #c4a35a, transparent)' }} />
          </Reveal>

          {/* Bride */}
          <Reveal delay={200}>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ border: '1px solid #c9a0a0', transform: 'translate(-6px,6px)', opacity: 0.5 }}
                />
                <PhotoBox className="w-36 h-36 rounded-full relative z-10" label="Foto Wanita" />
              </div>
              <p className="font-accent text-xs tracking-[0.25em] uppercase mb-1" style={{ color: '#c9a0a0' }}>Mempelai Wanita</p>
              <h3 className="font-display text-2xl italic mb-1" style={{ color: '#2d2420' }}>Indri ............, S.Pd.</h3>
              <p className="font-body text-sm" style={{ color: '#6b4f3a' }}>Putri dari Bapak .......... &amp; Ibu ..........</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// 4. Event Details
function EventSection() {
  return (
    <section
      className="py-20 px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #2d2420 0%, #3d322a 100%)' }}
    >
      {/* Background texture circles */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5" style={{ pointerEvents: 'none' }}>
        <svg viewBox="0 0 256 256" fill="none" className="w-full h-full">
          <circle cx="256" cy="0" r="120" stroke="#c4a35a" strokeWidth="1" />
          <circle cx="256" cy="0" r="80" stroke="#c4a35a" strokeWidth="0.8" />
        </svg>
      </div>

      <div className="max-w-2xl mx-auto">
        <Reveal>
          <SectionHeading sub="Rangkaian Acara" title="Hari Istimewa" light />
        </Reveal>

        <div className="flex flex-col gap-8">
          {/* Akad Nikah */}
          <Reveal delay={100}>
            <div
              className="rounded-2xl p-8 text-center"
              style={{ background: 'rgba(196,163,90,0.08)', border: '1px solid rgba(196,163,90,0.25)' }}
            >
              <div className="mb-4">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mx-auto mb-3">
                  <circle cx="16" cy="16" r="15" stroke="#c4a35a" strokeWidth="1" opacity="0.6" />
                  <path d="M16 8v8l5 3" stroke="#c4a35a" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="font-accent text-xs tracking-[0.3em] uppercase mb-1" style={{ color: '#e8d5a3' }}>Akad Nikah</p>
                <h3 className="font-display text-xl italic" style={{ color: '#faf7f2' }}>Ijab &amp; Qabul</h3>
              </div>
              <Ornament color="#c4a35a" />
              <div className="space-y-2">
                <p className="font-body text-sm" style={{ color: '#e8d5a3' }}>Sabtu, 14 Desember 2024</p>
                <p className="font-body text-sm" style={{ color: '#e8d5a3' }}>08.00 WIB – Selesai</p>
                <p className="font-body text-sm mt-3" style={{ color: '#c4a35a' }}>Masjid .....................</p>
                <p className="font-body text-xs" style={{ color: 'rgba(232,213,163,0.6)' }}>Jl. ............, Kota ..........</p>
              </div>
              <button
                className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-full font-body text-xs tracking-widest uppercase transition-all duration-300"
                style={{ border: '1px solid rgba(196,163,90,0.5)', color: '#e8d5a3' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(196,163,90,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                Lihat Lokasi
              </button>
            </div>
          </Reveal>

          {/* Resepsi */}
          <Reveal delay={200}>
            <div
              className="rounded-2xl p-8 text-center"
              style={{ background: 'rgba(201,160,160,0.08)', border: '1px solid rgba(201,160,160,0.25)' }}
            >
              <div className="mb-4">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mx-auto mb-3">
                  <rect x="4" y="8" width="24" height="20" rx="2" stroke="#c9a0a0" strokeWidth="1" opacity="0.6" />
                  <path d="M4 13h24" stroke="#c9a0a0" strokeWidth="1" opacity="0.6" />
                  <path d="M10 4v4M22 4v4" stroke="#c9a0a0" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="font-accent text-xs tracking-[0.3em] uppercase mb-1" style={{ color: '#e8c8c8' }}>Resepsi</p>
                <h3 className="font-display text-xl italic" style={{ color: '#faf7f2' }}>Pesta Pernikahan</h3>
              </div>
              <Ornament color="#c9a0a0" />
              <div className="space-y-2">
                <p className="font-body text-sm" style={{ color: '#e8c8c8' }}>Sabtu, 14 Desember 2024</p>
                <p className="font-body text-sm" style={{ color: '#e8c8c8' }}>11.00 WIB – 14.00 WIB</p>
                <p className="font-body text-sm mt-3" style={{ color: '#c9a0a0' }}>Gedung .....................</p>
                <p className="font-body text-xs" style={{ color: 'rgba(232,200,200,0.6)' }}>Jl. ............, Kota ..........</p>
              </div>
              <button
                className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-full font-body text-xs tracking-widest uppercase transition-all duration-300"
                style={{ border: '1px solid rgba(201,160,160,0.5)', color: '#e8c8c8' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,160,160,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                Lihat Lokasi
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// 5. Countdown
function CountdownSection() {
  const weddingDate = new Date('2024-12-14T08:00:00')
  const { days, hours, minutes, seconds } = useCountdown(weddingDate)

  const Unit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div
        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-2"
        style={{ background: 'linear-gradient(135deg, #c4a35a22, #c4a35a11)', border: '1px solid rgba(196,163,90,0.3)' }}
      >
        <span className="font-display text-2xl md:text-3xl" style={{ color: '#2d2420' }}>
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="font-accent text-xs tracking-widest uppercase" style={{ color: '#c4a35a' }}>{label}</span>
    </div>
  )

  return (
    <section className="py-20 px-6 text-center" style={{ background: '#faf7f2' }}>
      <Reveal>
        <SectionHeading sub="Menuju Hari Bahagia" title="Hitung Mundur" />
      </Reveal>
      <Reveal delay={100}>
        <div className="flex justify-center gap-4 flex-wrap">
          <Unit value={days} label="Hari" />
          <Unit value={hours} label="Jam" />
          <Unit value={minutes} label="Menit" />
          <Unit value={seconds} label="Detik" />
        </div>
      </Reveal>
      <Reveal delay={200} className="mt-6">
        <p className="font-body text-sm italic" style={{ color: '#6b4f3a', opacity: 0.7 }}>
          Sabtu, 14 Desember 2024
        </p>
      </Reveal>
    </section>
  )
}

// 6. Gallery
function GallerySection() {
  const photos = [
    { aspect: 'square' },
    { aspect: 'tall' },
    { aspect: 'square' },
    { aspect: 'tall' },
    { aspect: 'wide' },
    { aspect: 'square' },
  ]

  return (
    <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg, #f5ede0 0%, #faf7f2 100%)' }}>
      <div className="max-w-2xl mx-auto">
        <Reveal>
          <SectionHeading sub="Momen Kami" title="Galeri Foto" />
        </Reveal>
        <Reveal delay={100}>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((p, i) => (
              <PhotoBox
                key={i}
                className={`rounded-xl overflow-hidden ${
                  p.aspect === 'tall' ? 'row-span-2' : p.aspect === 'wide' ? 'col-span-2' : ''
                }`}
                style={{
                  aspectRatio: p.aspect === 'tall' ? undefined : '1',
                  height: p.aspect === 'tall' ? '100%' : undefined,
                  minHeight: p.aspect === 'tall' ? 200 : 100,
                }}
                label="Foto"
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// 7. Love Story
function LoveStorySection() {
  const events = [
    { year: '2018', title: 'Pertama Bertemu', desc: 'Kisah cinta kami dimulai dari sebuah pertemuan sederhana yang tak terlupakan.' },
    { year: '2020', title: 'Menjalin Kasih', desc: 'Langkah demi langkah, hari demi hari, cinta ini semakin tumbuh dan bertumbuh.' },
    { year: '2023', title: 'Lamaran', desc: 'Di momen yang penuh haru, sebuah janji suci diucapkan dari hati yang terdalam.' },
    { year: '2024', title: 'Pernikahan', desc: 'Menyempurnakan separuh agama dan membangun mahligai rumah tangga yang sakinah.' },
  ]

  return (
    <section className="py-20 px-6" style={{ background: '#faf7f2' }}>
      <div className="max-w-lg mx-auto">
        <Reveal>
          <SectionHeading sub="Perjalanan Kami" title="Cerita Cinta" />
        </Reveal>

        <div className="relative">
          {/* vertical line */}
          <div
            className="absolute left-5 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, #c4a35a88, transparent)' }}
          />

          <div className="space-y-10 pl-14">
            {events.map((e, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="relative">
                  {/* dot */}
                  <div
                    className="absolute -left-9 top-1 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: '#faf7f2', border: '2px solid #c4a35a' }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ background: '#c4a35a' }} />
                  </div>
                  <p className="font-accent text-xs tracking-widest uppercase mb-1" style={{ color: '#c4a35a' }}>{e.year}</p>
                  <h4 className="font-display text-lg italic mb-1" style={{ color: '#2d2420' }}>{e.title}</h4>
                  <p className="font-body text-sm leading-relaxed" style={{ color: '#6b4f3a' }}>{e.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// 8. RSVP
function RsvpSection() {
  const [form, setForm] = useState({ name: '', attend: 'hadir', guests: '1', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section
      className="py-20 px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #3d322a 0%, #2d2420 100%)' }}
    >
      <div className="max-w-lg mx-auto">
        <Reveal>
          <SectionHeading sub="Konfirmasi Kehadiran" title="RSVP" light />
        </Reveal>

        {sent ? (
          <Reveal>
            <div className="text-center py-10">
              <div className="text-4xl mb-4">🎉</div>
              <p className="font-display text-xl italic" style={{ color: '#e8d5a3' }}>Terima kasih!</p>
              <p className="font-body text-sm mt-2" style={{ color: 'rgba(232,213,163,0.7)' }}>Konfirmasi kehadiran Anda telah kami terima.</p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={100}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-accent text-xs tracking-widest uppercase mb-2" style={{ color: '#e8d5a3' }}>
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Masukkan nama Anda"
                  className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(196,163,90,0.3)',
                    color: '#faf7f2',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(196,163,90,0.7)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(196,163,90,0.3)')}
                />
              </div>

              <div>
                <label className="block font-accent text-xs tracking-widest uppercase mb-2" style={{ color: '#e8d5a3' }}>
                  Kehadiran
                </label>
                <div className="flex gap-3">
                  {['hadir', 'tidak hadir'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({ ...form, attend: opt })}
                      className="flex-1 py-2.5 rounded-xl font-body text-sm capitalize transition-all duration-200"
                      style={{
                        background: form.attend === opt ? 'rgba(196,163,90,0.2)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${form.attend === opt ? 'rgba(196,163,90,0.7)' : 'rgba(196,163,90,0.2)'}`,
                        color: form.attend === opt ? '#e8d5a3' : 'rgba(232,213,163,0.5)',
                      }}
                    >
                      {opt === 'hadir' ? '✓ Hadir' : '✗ Tidak Hadir'}
                    </button>
                  ))}
                </div>
              </div>

              {form.attend === 'hadir' && (
                <div>
                  <label className="block font-accent text-xs tracking-widest uppercase mb-2" style={{ color: '#e8d5a3' }}>
                    Jumlah Tamu
                  </label>
                  <select
                    value={form.guests}
                    onChange={e => setForm({ ...form, guests: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(196,163,90,0.3)',
                      color: '#faf7f2',
                    }}
                  >
                    {[1, 2, 3, 4].map(n => (
                      <option key={n} value={n} style={{ background: '#2d2420' }}>{n} orang</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-accent text-xs tracking-widest uppercase mb-2" style={{ color: '#e8d5a3' }}>
                  Ucapan &amp; Doa
                </label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tuliskan ucapan dan doa terbaik Anda..."
                  className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none resize-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(196,163,90,0.3)',
                    color: '#faf7f2',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(196,163,90,0.7)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(196,163,90,0.3)')}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-body text-sm tracking-widest uppercase transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #c4a35a, #a88442)',
                  color: '#faf7f2',
                  boxShadow: '0 4px 20px #c4a35a33',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                Kirim Konfirmasi
              </button>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  )
}

// 9. Wishes / Ucapan
function WishesSection() {
  const wishes = [
    { name: 'Ahmad Fauzi', msg: 'Semoga menjadi pasangan yang sakinah, mawaddah, warahmah. Barakallah.' },
    { name: 'Siti Rahayu', msg: 'Selamat menempuh hidup baru! Semoga selalu dalam berkah dan kebahagiaan.' },
    { name: 'Budi Santoso', msg: 'Masha Allah, semoga pernikahan ini menjadi awal dari kebahagiaan tanpa akhir.' },
  ]

  return (
    <section className="py-20 px-6" style={{ background: '#faf7f2' }}>
      <div className="max-w-lg mx-auto">
        <Reveal>
          <SectionHeading sub="Doa &amp; Harapan" title="Ucapan Tamu" />
        </Reveal>
        <div className="space-y-4">
          {wishes.map((w, i) => (
            <Reveal key={i} delay={i * 100}>
              <div
                className="p-5 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #f5ede0, #ede0d0)', border: '1px solid rgba(196,163,90,0.15)' }}
              >
                <p className="font-body text-sm leading-relaxed mb-3 italic" style={{ color: '#4a3728' }}>"{w.msg}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-display text-xs" style={{ background: '#c4a35a22', color: '#c4a35a' }}>
                    {w.name[0]}
                  </div>
                  <p className="font-accent text-xs tracking-wider" style={{ color: '#c4a35a' }}>{w.name}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// 10. Gift / Hadiah
function GiftSection() {
  const [copied, setCopied] = useState<string | null>(null)
  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg, #f5ede0 0%, #faf7f2 100%)' }}>
      <div className="max-w-lg mx-auto">
        <Reveal>
          <SectionHeading sub="Amplop Digital" title="Hadiah Pernikahan" />
          <p className="text-center font-body text-sm mb-8" style={{ color: '#6b4f3a' }}>
            Tanpa mengurangi rasa hormat, bagi kerabat yang ingin memberikan hadiah pernikahan dapat melalui:
          </p>
        </Reveal>

        <div className="space-y-4">
          {[
            { bank: 'Bank BCA', account: '1234567890', name: 'Arif Budi Suryono' },
            { bank: 'Bank BRI', account: '0987654321', name: 'Indri ..........' },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 100}>
              <div
                className="p-6 rounded-2xl"
                style={{ background: '#fff', border: '1px solid rgba(196,163,90,0.2)', boxShadow: '0 4px 20px rgba(196,163,90,0.08)' }}
              >
                <p className="font-accent text-xs tracking-widest uppercase mb-1" style={{ color: '#c4a35a' }}>{item.bank}</p>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <p className="font-display text-lg tracking-widest" style={{ color: '#2d2420' }}>{item.account}</p>
                    <p className="font-body text-xs mt-0.5" style={{ color: '#6b4f3a' }}>a.n. {item.name}</p>
                  </div>
                  <button
                    onClick={() => copy(item.account, item.bank)}
                    className="px-4 py-2 rounded-lg font-body text-xs tracking-widest uppercase transition-all duration-200"
                    style={{
                      background: copied === item.bank ? 'rgba(196,163,90,0.2)' : 'rgba(196,163,90,0.1)',
                      color: '#c4a35a',
                      border: '1px solid rgba(196,163,90,0.3)',
                    }}
                  >
                    {copied === item.bank ? 'Disalin!' : 'Salin'}
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// 11. Closing
function ClosingSection() {
  return (
    <section
      className="py-20 px-6 text-center relative overflow-hidden"
      style={{ background: 'linear-gradient(170deg, #2d2420 0%, #1a140f 100%)' }}
    >
      <div className="absolute inset-0 opacity-5" style={{ pointerEvents: 'none' }}>
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <circle cx="200" cy="200" r="180" stroke="#c4a35a" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="140" stroke="#c4a35a" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="100" stroke="#c4a35a" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 max-w-sm mx-auto">
        <Reveal>
          <p className="font-accent text-xs tracking-[0.3em] uppercase mb-6" style={{ color: '#c4a35a' }}>
            Terima Kasih
          </p>
          <h2 className="font-display text-4xl italic leading-tight mb-2" style={{ color: '#faf7f2' }}>Arif</h2>
          <p className="font-accent text-2xl tracking-widest mb-2" style={{ color: '#c4a35a' }}>&amp;</p>
          <h2 className="font-display text-4xl italic leading-tight mb-6" style={{ color: '#faf7f2' }}>Indri</h2>
          <Ornament color="#c4a35a" />
          <p className="font-body text-sm leading-relaxed mt-6" style={{ color: 'rgba(250,247,242,0.6)' }}>
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.
          </p>
          <p className="font-body text-sm mt-6 italic" style={{ color: 'rgba(196,163,90,0.8)' }}>
            Wassalamualaikum Warahmatullahi Wabarakatuh
          </p>
        </Reveal>
      </div>

      <Reveal delay={200} className="mt-16">
        <p className="font-accent text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Made with ♥ — The Wedding of Arif &amp; Indri
        </p>
      </Reveal>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [opened, setOpened] = useState(false)

  if (!opened) {
    return <CoverSection onOpen={() => setOpened(true)} />
  }

  return (
    <main className="overflow-x-hidden">
      <BismillahSection />
      <CoupleSection />
      <EventSection />
      <CountdownSection />
      <GallerySection />
      <LoveStorySection />
      <RsvpSection />
      <WishesSection />
      <GiftSection />
      <ClosingSection />
    </main>
  )
}
