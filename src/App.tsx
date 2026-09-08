
// ══════════════════════════════════════════════════════════════════════════════
// ORNAMENTS & EFFECTS
// ══════════════════════════════════════════════════════════════════════════════


function AbstractLines() {
  if (!weddingData.fitur.tampilkanGarisAbstrak) return null;
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" style={{ opacity: 0.7, transform: 'translateZ(0)' }}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="optimizeSpeed">
        
        {/* Path 1 */}
        <path d="M-10,20 C 30,50 70,0 110,40" stroke="#D2B450" strokeWidth="0.3" fill="none" opacity="0.3" />
        {/* <path d="M-10,20 C 30,50 70,0 110,40" stroke="#D2B450" strokeWidth="0.3" fill="none" pathLength="100" strokeLinecap="round" opacity="0.1" className="animate-light-flow flow-delay-1" />
        <path d="M-10,20 C 30,50 70,0 110,40" stroke="#fff" strokeWidth="0.2" fill="none" pathLength="100" strokeLinecap="round" opacity="0.1" className="animate-light-flow flow-delay-1" /> */}
        
        {/* Path 3 */}
        <path d="M-10,30 C 40,30 60,30 110,60" stroke="#D2B450" strokeWidth="0.5" fill="none" opacity="0.3" />
        {/* <path d="M-10,30 C 40,30 60,30 110,60" stroke="#D2B450" strokeWidth="0.3" fill="none" pathLength="100" strokeLinecap="round" opacity="0.1" className="animate-light-flow flow-delay-3" />
        <path d="M-10,30 C 40,30 60,30 110,60" stroke="#fff" strokeWidth="0.2" fill="none" pathLength="100" strokeLinecap="round" opacity="0.1" className="animate-light-flow flow-delay-3" /> */}
        
        {/* Path 7 (Vertical-ish) */}
        <path d="M80,-10 C 90,30 40,70 70,110" stroke="#D2B450" strokeWidth="0.2" fill="none" opacity="0.3" />
        {/* <path d="M80,-10 C 90,30 40,70 70,110" stroke="#D2B450" strokeWidth="0.3" fill="none" pathLength="100" strokeLinecap="round" opacity="0.1" className="animate-light-flow flow-delay-2" />
        <path d="M80,-10 C 90,30 40,70 70,110" stroke="#fff" strokeWidth="0.4" fill="none" pathLength="100" strokeLinecap="round" opacity="0.1" className="animate-light-flow flow-delay-2" /> */}
        
      </svg>
    </div>
  )
}

const cachedParticles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100 + '%',
    animationDuration: 6 + Math.random() * 8 + 's',
    animationDelay: Math.random() * 4 + 's',
    size: Math.random() * 2 + 2 + 'px'
}));

function Sparkles() {
  if (!weddingData.fitur.tampilkanEfekSparkle) return null;
  const particles = cachedParticles;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map(p => (
        <div 
          key={p.id}
          className="absolute rounded-full animate-sparkle"
          style={{
            left: p.left,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            backgroundColor: '#D2B450',
            willChange: 'transform, opacity',
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay
          }}
        />
      ))}
    </div>
  )
}

function CornerOrnament({
  position = 'top-left'
}: {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}) {
  if (!weddingData.fitur.tampilkanOrnamenDaun) return null;

  let posStyle = {};
  let transform = '';

  if (position === 'top-left') {
    posStyle = { top: 0, left: 0 };
    transform = 'scale(1)';
  }

  if (position === 'top-right') {
    posStyle = { top: 0, right: 0 };
    transform = 'scaleX(-1)';
  }

  if (position === 'bottom-left') {
    posStyle = { bottom: 0, left: 0 };
    transform = 'scaleY(-1)';
  }

  if (position === 'bottom-right') {
    posStyle = { bottom: 0, right: 0 };
    transform = 'scale(-1, -1)';
  }

  return (
    <div
      className="absolute opacity-40 pointer-events-none z-10 w-28 sm:w-32 md:w-44"
      style={{
        ...posStyle,
        transform
      }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0 L 150 0 C 150 0 140 30 110 50 C 80 70 50 40 40 80 C 30 120 40 160 0 200 Z"
          fill="url(#goldGradient)"
        />

        <path
          d="M 0 0 C 40 0 80 30 100 80 C 120 130 110 180 130 200"
          stroke="#D2B450"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
        />

        <circle cx="90" cy="50" r="4" fill="#D2B450" />
        <circle cx="60" cy="90" r="3" fill="#D2B450" />
        <circle cx="120" cy="120" r="2" fill="#808000" />
        <circle cx="30" cy="150" r="3" fill="#808000" />

        <defs>
          <linearGradient
            id="goldGradient"
            x1="0"
            y1="0"
            x2="200"
            y2="200"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#654321" stopOpacity="0.75" />
            <stop offset="0.5" stopColor="#808000" stopOpacity="0.45" />
            <stop offset="1" stopColor="#D2B450" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}


import { useState, useEffect, useRef } from 'react'
import { ref, push, onValue, serverTimestamp } from 'firebase/database';
import { db } from './firebase';
import { weddingData } from './config';


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
function Ornament({ color = '#D2B450' }: { color?: string }) {
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
      style={{ background: 'linear-gradient(135deg, #050505 0%, #24170f 55%, #654321 100%)', ...style }}
    >
      <div className="flex flex-col items-center gap-2 opacity-40">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D2B450" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        {label && <span className="font-body text-xs" style={{ color: '#D2B450' }}>{label}</span>}
      </div>
    </div>
  )
}

// ── Section heading ─────────────────────────────────────────────────────────
function SectionHeading({ sub, title, light = false }: { sub: string; title: string; light?: boolean }) {
  const text = '#F4EFE6'
  const gold = light ? '#D2B450' : '#D2B450'
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
  const searchParams = new URLSearchParams(window.location.search);
  const guestName = searchParams.get('to') || 'Tamu Undangan';

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-between overflow-hidden">

      {/* Bagian Atas */}
      <div className="relative z-20 text-center pt-16 px-6">
        <div className="animate-fade-up delay-100">
          <p
            className="font-accent text-xs tracking-[0.4em] uppercase"
            style={{ color: '#F4EFE6' }}
          >
            Undangan Pernikahan
          </p>
        </div>
      </div>

      {/* Bagian Bawah */}
      <div className="relative z-20 text-center pb-32 px-6 mt-auto">

        <div className="animate-fade-up delay-200 mb-6">
          <p
            className="font-accent text-sm tracking-[0.3em] uppercase mb-2"
            style={{ color: '#D2B450' }}
          >
            The Wedding
          </p>

          <h1
            className="font-display text-4xl md:text-5xl italic leading-tight"
            style={{ color: '#F4EFE6' }}
          >
            {weddingData.pria.namaPanggilan}
            {' '}&amp;{' '}
            {weddingData.wanita.namaPanggilan}
          </h1>
        </div>

        <div className="animate-fade-up delay-300 mb-8">
          <p
            className="font-body text-xs tracking-widest uppercase mb-1"
            style={{ color: 'rgba(244,239,230,0.65)' }}
          >
            Kepada Yth,
          </p>

          <p
            className="font-display text-xl"
            style={{ color: '#F4EFE6' }}
          >
            {guestName}
          </p>
        </div>

        <div className="animate-fade-up delay-400">
          <button
            onClick={onOpen}
            className="inline-flex items-center gap-3 px-8 py-3 rounded-full font-body text-sm tracking-widest uppercase transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #D2B450, #9F8430)',
              color: '#000000',
              boxShadow: '0 4px 25px rgba(210,180,80,0.3)',
              border: '1px solid rgba(210,180,80,0.6)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Buka Undangan
          </button>
        </div>

      </div>
    </section>
  );
}

// 2. Bismillah / Opening Quote
function BismillahSection() {
  return (
    <section className="py-16 px-6 text-center" style={{ background: '#000000' }}>
      <Reveal className="max-w-lg mx-auto">
        <p className="font-display text-2xl italic mb-6" style={{ color: '#D2B450' }}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
        <p className="font-body text-sm leading-relaxed" style={{ color: '#D8CEC0' }}>
          "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tentram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."
        </p>
        <p className="font-accent text-xs tracking-widest uppercase mt-4" style={{ color: '#D2B450' }}>
          QS. Ar-Rum: 21
        </p>
      </Reveal>
    </section>
  )
}

// 3. Couple Section
// 2. Couple Section
function CoupleSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #000000 0%, #1a110b 55%, #000000 100%)' }}>
      
      {/* Decorative background accents */}
      <div className="absolute top-20 right-0 w-64 h-64 opacity-5" style={{ pointerEvents: 'none' }}>
        <svg viewBox="0 0 200 200" fill="none">
          <circle cx="200" cy="100" r="100" stroke="#D2B450" strokeWidth="2" />
          <circle cx="200" cy="100" r="70" stroke="#D2B450" strokeWidth="1" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Reveal>
          <SectionHeading sub="Kedua Mempelai" title="Yang Berbahagia" />
        </Reveal>

        <div className="flex flex-col md:flex-row gap-16 md:gap-8 justify-center items-center mt-12">
          
          {/* Groom */}
          <Reveal delay={100} className="w-full max-w-sm flex flex-col items-center text-center">
            
            {/* Elegant Abstract Frame */}
            <div className="relative mb-10 w-64 md:w-72" style={{ aspectRatio: '4/5' }}>
              {/* Offset Gold Border */}
              <div 
                className="absolute inset-0"
                style={{ 
                  border: '2px solid rgba(210,180,80,0.5)', 
                  borderRadius: '100px 0 100px 0',
                  transform: 'translate(-12px, 12px)'
                }}
              />
              {/* Photo Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center shadow-2xl"
                style={{ 
                  backgroundImage: `url('${weddingData.galeri.fotoPria}')`,
                  borderRadius: '0 100px 0 100px',
                  border: '4px solid #000000'
                }}
              />
              
              {/* Floating Leaf / Ornament */}
              <div className="absolute -bottom-4 -right-4">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 0C20 11.0457 11.0457 20 0 20C11.0457 20 20 28.9543 20 40C20 28.9543 28.9543 20 40 20C28.9543 20 20 11.0457 20 0Z" fill="#D2B450" opacity="0.2" />
                </svg>
              </div>
            </div>

            <p className="font-accent text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#D2B450' }}>
              Mempelai Pria
            </p>
            <h3 className="font-display text-2xl italic mb-4" style={{ color: '#D2B450' }}>
              {weddingData.pria.namaLengkap}
            </h3>
            
            <div className="space-y-1">
              <p className="font-body text-sm font-semibold" style={{ color: '#F4EFE6' }}>
                {weddingData.pria.urutanAnak} dari
              </p>
              <p className="font-body text-sm" style={{ color: '#D8CEC0' }}>
                {weddingData.pria.namaBapak}
              </p>
              <p className="font-body text-sm" style={{ color: '#D8CEC0' }}>
                  &amp; {weddingData.pria.namaIbu}
              </p>
              <p className="font-body text-xs italic mt-2 opacity-70" style={{ color: '#D8CEC0', maxWidth: '280px' }}>
                ({weddingData.pria.alamat})
              </p>
            </div>
          </Reveal>

          {/* Divider (Hidden on Mobile, Vertical on Desktop, Horizontal on Mobile) */}
          <Reveal delay={150} className="hidden md:flex flex-col items-center h-64">
            <div style={{ width: 1, height: '100%', background: 'linear-gradient(to bottom, transparent, #D2B450, transparent)' }} />
          </Reveal>
          
          <Reveal delay={150} className="md:hidden flex items-center w-full max-w-xs">
            <div style={{ height: 1, width: '100%', background: 'linear-gradient(to right, transparent, #D2B450, transparent)' }} />
            <p className="font-display text-4xl italic mx-4" style={{ color: '#D2B450' }}>&amp;</p>
            <div style={{ height: 1, width: '100%', background: 'linear-gradient(to right, transparent, #D2B450, transparent)' }} />
          </Reveal>

          {/* Bride */}
          <Reveal delay={200} className="w-full max-w-sm flex flex-col items-center text-center">
            
            {/* Elegant Abstract Frame */}
            <div className="relative mb-10 w-64 md:w-72" style={{ aspectRatio: '4/5' }}>
              {/* Offset Gold Border */}
              <div 
                className="absolute inset-0"
                style={{ 
                  border: '2px solid rgba(210,180,80,0.5)', 
                  borderRadius: '0 100px 0 100px',
                  transform: 'translate(12px, -12px)'
                }}
              />
              {/* Photo Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center shadow-2xl"
                style={{ 
                  backgroundImage: `url('${weddingData.galeri.fotoWanita}')`,
                  borderRadius: '100px 0 100px 0',
                  border: '4px solid #000000'
                }}
              />
              
              {/* Floating Leaf / Ornament */}
              <div className="absolute -top-4 -left-4">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 0C20 11.0457 11.0457 20 0 20C11.0457 20 20 28.9543 20 40C20 28.9543 28.9543 20 40 20C28.9543 20 20 11.0457 20 0Z" fill="#D2B450" opacity="0.4" />
                </svg>
              </div>
            </div>

            <p className="font-accent text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#808000' }}>
              Mempelai Wanita
            </p>
            <h3 className="font-display text-2xl italic mb-4" style={{ color: '#D2B450' }}>
              {weddingData.wanita.namaLengkap}
            </h3>
            
            <div className="space-y-1">
              <p className="font-body text-sm font-semibold" style={{ color: '#F4EFE6' }}>
                {weddingData.wanita.urutanAnak} dari
              </p>
              <p className="font-body text-sm" style={{ color: '#D8CEC0' }}>
                {weddingData.wanita.namaBapak} 
              </p>
              <p className="font-body text-sm" style={{ color: '#D8CEC0' }}>
                &amp; {weddingData.wanita.namaIbu}
              </p>
              <p className="font-body text-xs italic mt-2 opacity-70" style={{ color: '#D8CEC0', maxWidth: '280px' }}>
                ({weddingData.wanita.alamat})
              </p>
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
      style={{ background: 'linear-gradient(160deg, #000000 0%, #1a110b 62%, #654321 140%)' }}
    >
      {/* Background texture circles */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5" style={{ pointerEvents: 'none' }}>
        <svg viewBox="0 0 256 256" fill="none" className="w-full h-full">
          <circle cx="256" cy="0" r="120" stroke="#D2B450" strokeWidth="1" />
          <circle cx="256" cy="0" r="80" stroke="#D2B450" strokeWidth="0.8" />
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
              style={{ background: 'rgba(210,180,80,0.08)', border: '1px solid rgba(210,180,80,0.25)' }}
            >
              <div className="mb-4">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mx-auto mb-3">
                  <circle cx="16" cy="16" r="15" stroke="#D2B450" strokeWidth="1" opacity="0.6" />
                  <path d="M16 8v8l5 3" stroke="#D2B450" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="font-accent text-xs tracking-[0.3em] uppercase mb-1" style={{ color: '#D2B450' }}>Akad Nikah</p>
                <h3 className="font-display text-xl italic" style={{ color: '#F4EFE6' }}>Ijab &amp; Qabul</h3>
              </div>
              <Ornament color="#D2B450" />
              <div className="space-y-2">
                <p className="font-body text-sm" style={{ color: '#D2B450' }}>{weddingData.acara.teksTanggal}</p>
                <p className="font-body text-sm" style={{ color: '#D2B450' }}>{weddingData.acara.akad.waktu}</p>
                <p className="font-body text-sm mt-3" style={{ color: '#D2B450' }}>{weddingData.acara.akad.tempat}</p>
                <p className="font-body text-xs" style={{ color: 'rgba(244,239,230,0.62)' }}>{weddingData.acara.akad.alamat}</p>
              </div>
              <button
                onClick={() => window.open(weddingData.acara.akad.linkMap, '_blank')}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-full font-body text-xs tracking-widest uppercase transition-all duration-300"
                style={{ border: '1px solid rgba(210,180,80,0.5)', color: '#D2B450' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(210,180,80,0.15)')}
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
              style={{ background: 'rgba(128,128,0,0.08)', border: '1px solid rgba(128,128,0,0.25)' }}
            >
              <div className="mb-4">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mx-auto mb-3">
                  <rect x="4" y="8" width="24" height="20" rx="2" stroke="#808000" strokeWidth="1" opacity="0.6" />
                  <path d="M4 13h24" stroke="#808000" strokeWidth="1" opacity="0.6" />
                  <path d="M10 4v4M22 4v4" stroke="#808000" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="font-accent text-xs tracking-[0.3em] uppercase mb-1" style={{ color: '#808000' }}>Resepsi</p>
                <h3 className="font-display text-xl italic" style={{ color: '#F4EFE6' }}>Pesta Pernikahan</h3>
              </div>
              <Ornament color="#808000" />
              <div className="space-y-2">
                <p className="font-body text-sm" style={{ color: '#D2B450' }}>{weddingData.acara.teksTanggal}</p>
                <p className="font-body text-sm" style={{ color: '#D2B450' }}>{weddingData.acara.resepsi.waktu}</p>
                <p className="font-body text-sm mt-3" style={{ color: '#808000' }}>{weddingData.acara.resepsi.tempat}</p>
                <p className="font-body text-xs" style={{ color: 'rgba(244,239,230,0.62)' }}>{weddingData.acara.resepsi.alamat}</p>
              </div>
              <button
                onClick={() => window.open(weddingData.acara.resepsi.linkMap, '_blank')}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-full font-body text-xs tracking-widest uppercase transition-all duration-300"
                style={{ border: '1px solid rgba(128,128,0,0.5)', color: '#D2B450' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(128,128,0,0.15)')}
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

// ══════════════════════════════════════════════════════════════════════════════
// IMPORTANT NOTE
// ══════════════════════════════════════════════════════════════════════════════

function ImportantNoteSection() {
  return (
    <section
      className="relative py-20 px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #120E0B 100%)'
      }}
    >
      <div className="max-w-xl mx-auto">

        <Reveal>
          <div className="text-center mb-10">
            <p
              className="font-accent text-xs tracking-[0.3em] uppercase mb-2"
              style={{ color: '#D2B450' }}
            >
              Kindly Note
            </p>

            <h2
              className="font-display text-3xl md:text-4xl italic"
              style={{ color: '#F4EFE6' }}
            >
              A Little Note
            </h2>

            <Ornament color="#D2B450" />
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div
            className="rounded-3xl px-6 py-8 md:px-10 md:py-10 text-center"
            style={{
              background:
                'linear-gradient(145deg, rgba(101,67,33,0.32), rgba(0,0,0,0.65))',
              border: '1px solid rgba(210,180,80,0.28)',
              boxShadow: '0 15px 50px rgba(0,0,0,0.25)'
            }}
          >
            <div className="mb-6 flex justify-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  border: '1px solid rgba(210,180,80,0.5)',
                  background: 'rgba(210,180,80,0.08)'
                }}
              >
                <span
                  className="font-display italic text-xl"
                  style={{ color: '#D2B450' }}
                >
                  i
                </span>
              </div>
            </div>

            <p
              className="font-body text-sm md:text-base leading-7 mb-5"
              style={{ color: '#D8CEC0' }}
            >
              Dengan segala hormat, mengingat keterbatasan kapasitas venue,
              kami memohon pengertian Bapak/Ibu/Saudara/i untuk menyesuaikan
              kehadiran dengan undangan yang diterima.
            </p>

            <div
              className="w-16 h-px mx-auto my-5"
              style={{ background: 'rgba(210,180,80,0.35)' }}
            />

            <p
              className="font-body text-sm md:text-base leading-7"
              style={{ color: '#D8CEC0' }}
            >
              Perlu kami informasikan bahwa tiket masuk menuju area venue
              ditanggung secara pribadi oleh masing-masing tamu.
            </p>

            <p
              className="font-display italic text-base mt-7"
              style={{ color: '#D2B450' }}
            >
              Terima kasih atas pengertian dan perhatiannya.
            </p>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
// ══════════════════════════════════════════════════════════════════════════════
// GUEST GUIDE
// Dress Code + Do & Don't
// ══════════════════════════════════════════════════════════════════════════════

function GuestGuideSection() {

  const dressColors = [
    {
      name: 'Espresso',
      hex: '#3B2A22'
    },
    {
      name: 'Mocha',
      hex: '#6F4E37'
    },
    {
      name: 'Cocoa',
      hex: '#7B5E4A'
    },
    {
      name: 'Camel',
      hex: '#B08968'
    },
    {
      name: 'Taupe',
      hex: '#9A8F83'
    },
    {
      name: 'Sand',
      hex: '#C2AF8B'
    },
    {
      name: 'Terracotta',
      hex: '#A85F45'
    },
    {
      name: 'Khaki',
      hex: '#A79B72'
    }
  ];

  const dos = [
    'Wear our selected Earth Tone palette',
    'Arrive on time and enjoy the celebration',
    'Menyesuaikan jumlah kehadiran dengan undangan',
    'Capture and enjoy your favorite moments'
  ];

  const donts = [
    'Avoid Broken White, Mahogany, dan Golden Olive',
    'Avoid bright or neon colors',
    'Mohon tidak membawa tamu tambahan di luar undangan',
    'Mohon tidak menghalangi prosesi maupun fotografer'
  ];

  return (
    <section
      className="relative py-24 px-6 overflow-hidden"
      style={{ background: '#000000' }}
    >
      <div className="max-w-3xl mx-auto">

        {/* TITLE */}
        <Reveal>
          <SectionHeading
            sub="For Our Lovely Guests"
            title="Guest Guide"
            light
          />
        </Reveal>


        {/* ══════════════════════════════════════
            DRESS CODE
        ══════════════════════════════════════ */}

        <Reveal delay={100}>
          <div className="text-center mb-12">

            <p
              className="font-accent text-xs tracking-[0.3em] uppercase mb-2"
              style={{ color: '#D2B450' }}
            >
              Dress Code
            </p>

            <h3
              className="font-display text-2xl md:text-3xl italic mb-4"
              style={{ color: '#F4EFE6' }}
            >
              Earth Tone Attire
            </h3>

            <p
              className="font-body text-sm leading-relaxed max-w-lg mx-auto"
              style={{ color: '#BEB2A5' }}
            >
              We’d love to see you in our selected earth tone palette.
            </p>
          </div>
        </Reveal>


        {/* COLOR PALETTE */}

        <Reveal delay={150}>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-x-3 gap-y-8 max-w-2xl mx-auto">

            {dressColors.map((color, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >

                <div
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full mb-3 transition-transform duration-300 hover:scale-110"
                  style={{
                    background: color.hex,
                    border: '2px solid rgba(210,180,80,0.28)',
                    boxShadow: '0 5px 20px rgba(0,0,0,0.35)'
                  }}
                />

                <p
                  className="font-accent text-xs tracking-wide"
                  style={{ color: '#D8CEC0' }}
                >
                  {color.name}
                </p>

              </div>
            ))}

          </div>
        </Reveal>


        {/* RESERVED COLORS NOTE */}

        <Reveal delay={200}>
          <div
            className="max-w-xl mx-auto mt-12 rounded-2xl px-6 py-5 text-center"
            style={{
              background: 'rgba(101,67,33,0.18)',
              border: '1px solid rgba(210,180,80,0.20)'
            }}
          >

            <p
              className="font-accent text-[10px] tracking-[0.25em] uppercase mb-2"
              style={{ color: '#D2B450' }}
            >
              Kindly Avoid
            </p>

            <p
              className="font-body text-xs md:text-sm leading-relaxed"
              style={{ color: '#BEB2A5' }}
            >
              Broken White, Mahogany, dan Golden Olive merupakan warna
              khusus untuk mempelai dan keluarga.
            </p>

          </div>
        </Reveal>


        {/* DIVIDER */}

        <div className="my-20">
          <Ornament color="#D2B450" />
        </div>


        {/* ══════════════════════════════════════
            DO & DON'T
        ══════════════════════════════════════ */}

        <Reveal>
          <div className="text-center mb-10">

            <p
              className="font-accent text-xs tracking-[0.3em] uppercase mb-2"
              style={{ color: '#D2B450' }}
            >
              Little Reminder
            </p>

            <h3
              className="font-display text-2xl md:text-3xl italic"
              style={{ color: '#F4EFE6' }}
            >
              Do &amp; Don&apos;t
            </h3>

          </div>
        </Reveal>


        <div className="grid md:grid-cols-2 gap-5">

          {/* DO */}

          <Reveal delay={100}>
            <div
              className="rounded-3xl p-7 h-full"
              style={{
                background:
                  'linear-gradient(145deg, rgba(128,128,0,0.16), rgba(0,0,0,0.7))',
                border: '1px solid rgba(128,128,0,0.35)'
              }}
            >

              <div className="flex items-center gap-3 mb-6">

                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(128,128,0,0.18)',
                    border: '1px solid rgba(128,128,0,0.55)',
                    color: '#C5B94B'
                  }}
                >
                  ✓
                </div>

                <h4
                  className="font-display text-xl italic"
                  style={{ color: '#F4EFE6' }}
                >
                  Do
                </h4>

              </div>


              <div className="space-y-4">

                {dos.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-3 items-start"
                  >

                    <span
                      className="mt-1 text-xs"
                      style={{ color: '#A6A62B' }}
                    >
                      ✦
                    </span>

                    <p
                      className="font-body text-sm leading-relaxed"
                      style={{ color: '#CFC5B9' }}
                    >
                      {item}
                    </p>

                  </div>
                ))}

              </div>

            </div>
          </Reveal>


          {/* DON'T */}

          <Reveal delay={200}>
            <div
              className="rounded-3xl p-7 h-full"
              style={{
                background:
                  'linear-gradient(145deg, rgba(101,67,33,0.28), rgba(0,0,0,0.72))',
                border: '1px solid rgba(210,180,80,0.25)'
              }}
            >

              <div className="flex items-center gap-3 mb-6">

                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(101,67,33,0.3)',
                    border: '1px solid rgba(210,180,80,0.35)',
                    color: '#D2B450'
                  }}
                >
                  ×
                </div>

                <h4
                  className="font-display text-xl italic"
                  style={{ color: '#F4EFE6' }}
                >
                  Don&apos;t
                </h4>

              </div>


              <div className="space-y-4">

                {donts.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-3 items-start"
                  >

                    <span
                      className="mt-1 text-xs"
                      style={{ color: '#D2B450' }}
                    >
                      ✦
                    </span>

                    <p
                      className="font-body text-sm leading-relaxed"
                      style={{ color: '#CFC5B9' }}
                    >
                      {item}
                    </p>

                  </div>
                ))}

              </div>

            </div>
          </Reveal>

        </div>

      </div>
    </section>
  );
}
// 5. Hero Section (Welcome)
function HeroSection() {
  const weddingDate = new Date(weddingData.acara.tanggalISO);
  const { days, hours, minutes, seconds } = useCountdown(weddingDate);

  const Unit = ({
    value,
    label
  }: {
    value: number;
    label: string;
  }) => (
    <div className="flex flex-col items-center">
      <div
        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-2 backdrop-blur-sm"
        style={{
          background: 'rgba(0,0,0,0.55)',
          border: '1px solid rgba(210,180,80,0.45)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
        }}
      >
        <span
          className="font-display text-2xl md:text-3xl"
          style={{ color: '#F4EFE6' }}
        >
          {String(value).padStart(2, '0')}
        </span>
      </div>

      <span
        className="font-accent text-xs tracking-widest uppercase"
        style={{ color: '#D2B450' }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <section className="relative min-h-[100dvh] py-10 px-4 flex flex-col items-center justify-center text-center overflow-hidden">

      {/* Ornamen harus langsung relatif terhadap section */}
      <CornerOrnament position="top-left" />
      <CornerOrnament position="top-right" />

      {/* Seluruh isi Hero */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center">

        <Reveal>
          <p
            className="font-accent text-xs md:text-sm tracking-[0.2em] uppercase mb-2 md:mb-4 mt-8"
            style={{ color: '#D2B450' }}
          >
            The Wedding Of
          </p>
        </Reveal>

        {/* Photo Frame */}
        <Reveal
          delay={100}
          className="w-[180px] md:w-64 mx-auto mb-4 md:mb-6"
        >
          <div
            className="w-full relative overflow-hidden"
            style={{
              aspectRatio: '3/4',
              borderRadius: '150px 150px 16px 16px',
              border: '2px solid #D2B450',
              padding: '4px',
              background: '#000000',
              boxShadow: '0 15px 40px rgba(0,0,0,0.45)'
            }}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                borderRadius: '144px 144px 10px 10px',
                backgroundImage: `url('${weddingData.galeri.heroImage}')`
              }}
            />

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"
                  fill="#D2B450"
                  opacity="0.8"
                />
              </svg>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <h1
            className="font-display text-4xl md:text-6xl italic leading-tight mb-1"
            style={{ color: '#F4EFE6' }}
          >
            {weddingData.pria.namaPanggilan}
            <span
              className="text-2xl md:text-3xl"
              style={{ color: '#D2B450' }}
            >
              {' '}&amp;{' '}
            </span>
            {weddingData.wanita.namaPanggilan}
          </h1>

          <p
            className="font-body text-xs md:text-sm tracking-widest uppercase mt-2 mb-6"
            style={{ color: '#D8CEC0' }}
          >
            {weddingData.acara.teksTanggal}
          </p>
        </Reveal>

        <Reveal delay={300} className="w-full max-w-lg z-20">
          <div className="flex justify-center gap-3 md:gap-4 flex-wrap">
            <Unit value={days} label="Hari" />
            <Unit value={hours} label="Jam" />
            <Unit value={minutes} label="Menit" />
            <Unit value={seconds} label="Detik" />
          </div>
        </Reveal>

        <Reveal delay={400} className="mt-8 mb-4 animate-bounce">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D2B450"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </Reveal>

      </div>
    </section>
  );
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
    <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg, #000000 0%, #1a110b 48%, #000000 100%)' }}>
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





// 8. RSVP & Wishes (Youtube-style Comments)
function RsvpAndWishesSection() {
  const searchParams = new URLSearchParams(window.location.search);
  const guestName = searchParams.get('to');
  const isNameLocked = !!guestName;

  const [form, setForm] = useState({ name: guestName || '', attend: 'hadir', message: '' })
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [visibleCount, setVisibleCount] = useState(10) // Pagination state

  // Fetch comments in real-time from Realtime Database
  useEffect(() => {
    const commentsRef = ref(db, 'ucapan')
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data: any[] = []
      snapshot.forEach((childSnapshot) => {
        data.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        })
      })
      // Sort newest first locally
      data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      setComments(data)
    })
    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) return
    
    setLoading(true)
    try {
      await push(ref(db, 'ucapan'), {
        nama: form.name,
        kehadiran: form.attend,
        pesan: form.message,
        createdAt: serverTimestamp()
      })
      // Clear form after successful submit (preserve name if locked)
      setForm({ name: isNameLocked ? guestName! : '', attend: 'hadir', message: '' })
    } catch (error) {
      console.error("Error adding document: ", error)
      alert("Gagal mengirim pesan, silakan coba lagi.")
    }
    setLoading(false)
  }

  // Calculate stats
  const hadirCount = comments.filter(c => c.kehadiran === 'hadir').length
  const tidakHadirCount = comments.filter(c => c.kehadiran === 'tidak hadir').length
  const raguCount = comments.filter(c => c.kehadiran === 'ragu').length

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Baru saja'
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date).toUpperCase()
  }

  const getBadgeColor = (status: string) => {
    if (status === 'hadir') return { bg: 'rgba(128, 128, 0, 0.16)', border: '#808000', text: '#D2B450', label: 'HADIR' }
    if (status === 'tidak hadir') return { bg: 'rgba(101, 67, 33, 0.28)', border: '#654321', text: '#D8CEC0', label: 'TIDAK HADIR' }
    return { bg: 'rgba(210, 180, 80, 0.12)', border: '#D2B450', text: '#D2B450', label: 'MASIH RAGU' }
  }

  const scrollbarCSS = ".custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }";

  const visibleComments = comments.slice(0, visibleCount);

  return (
    <section className="py-20 px-6 relative overflow-hidden" style={{ background: '#000000' }}>
      <style>{scrollbarCSS}</style>
      <div className="max-w-xl mx-auto">
        <Reveal>
          <SectionHeading sub="Kehadiran & Doa" title="RSVP & Wishes" light />
          
          <div className="text-center mb-8 p-4 rounded-xl inline-block w-full" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 className="font-display text-xl" style={{ color: '#D2B450' }}>{comments.length} Comments</h2>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="flex flex-col items-center justify-center p-4 rounded-xl" style={{ background: 'rgba(128,128,0,0.08)', border: '1px solid rgba(128,128,0,0.35)' }}>
              <span className="font-display text-2xl" style={{ color: '#F4EFE6' }}>{hadirCount}</span>
              <span className="font-accent text-[10px] tracking-widest mt-1 text-center" style={{ color: '#808000' }}>HADIR</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-xl" style={{ background: 'rgba(101,67,33,0.18)', border: '1px solid rgba(101,67,33,0.55)' }}>
              <span className="font-display text-2xl" style={{ color: '#F4EFE6' }}>{tidakHadirCount}</span>
              <span className="font-accent text-[10px] tracking-widest mt-1 text-center" style={{ color: '#654321' }}>TIDAK HADIR</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-xl" style={{ background: 'rgba(210,180,80,0.06)', border: '1px solid rgba(210,180,80,0.35)' }}>
              <span className="font-display text-2xl" style={{ color: '#F4EFE6' }}>{raguCount}</span>
              <span className="font-accent text-[10px] tracking-widest mt-1 text-center" style={{ color: '#D2B450' }}>MASIH RAGU</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-12 border-b pb-12" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div>
              <label className="block font-accent text-[10px] tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>NAMA ANDA</label>
              <input
                type="text"
                required
                value={form.name}
                readOnly={isNameLocked}
                onChange={e => !isNameLocked && setForm({ ...form, name: e.target.value })}
                placeholder="Masukkan nama Anda"
                className={`w-full px-4 py-3 rounded-lg font-body text-sm outline-none transition-all duration-200 ${isNameLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#F4EFE6' }}
                onFocus={e => { if(!isNameLocked) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
                onBlur={e => { if(!isNameLocked) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              />
            </div>

            <div>
              <label className="block font-accent text-[10px] tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>KONFIRMASI KEHADIRAN</label>
              <select
                value={form.attend}
                onChange={e => setForm({ ...form, attend: e.target.value })}
                className="w-full px-4 py-3 rounded-lg font-body text-sm outline-none transition-all duration-200 appearance-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#F4EFE6' }}
              >
                <option value="hadir" style={{ background: '#000' }}>Hadir</option>
                <option value="tidak hadir" style={{ background: '#000' }}>Tidak Hadir</option>
                <option value="ragu" style={{ background: '#000' }}>Masih Ragu</option>
              </select>
            </div>

            <div>
              <label className="block font-accent text-[10px] tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>PESAN & DOA</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Tuliskan ucapan atau doa untuk kedua mempelai..."
                className="w-full px-4 py-3 rounded-lg font-body text-sm outline-none resize-none transition-all duration-200 custom-scrollbar"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#F4EFE6' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-full font-body text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              style={{ background: '#D2B450', color: '#000000', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'MENGIRIM...' : 'KIRIM UCAPAN'}
              {!loading && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              )}
            </button>
          </form>
        </Reveal>

        {/* Comments List */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {visibleComments.map((comment, i) => {
            const badge = getBadgeColor(comment.kehadiran)
            return (
              <Reveal key={comment.id} delay={Math.min(i * 50, 500)}>
                <div className="p-5 rounded-xl flex gap-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-display text-sm tracking-widest uppercase" style={{ color: '#F4EFE6' }}>{comment.nama}</h4>
                        <p className="font-accent text-[10px]" style={{ color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                      <div className="px-3 py-1 rounded-full border text-[9px] font-accent tracking-widest" style={{ background: badge.bg, borderColor: badge.border, color: badge.text }}>
                        {badge.label}
                      </div>
                    </div>
                    <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>"{comment.pesan}"</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
        
        {/* Load More Button */}
        {visibleCount < comments.length && (
          <Reveal className="mt-8 text-center">
            <button
              onClick={() => setVisibleCount(prev => prev + 10)}
              className="px-6 py-3 rounded-full font-accent text-xs tracking-widest uppercase transition-all duration-300 hover:bg-white/5"
              style={{ border: '1px solid rgba(210,180,80,0.35)', color: '#D2B450' }}
            >
              Tampilkan Lebih Banyak
            </button>
          </Reveal>
        )}
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
    <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg, #000000 0%, #1a110b 48%, #000000 100%)' }}>
      <div className="max-w-lg mx-auto">
        <Reveal>
          <SectionHeading sub="Amplop Digital" title="Hadiah Pernikahan" />
          <p className="text-center font-body text-sm mb-8" style={{ color: '#D8CEC0' }}>
            Tanpa mengurangi rasa hormat, bagi kerabat yang ingin memberikan hadiah pernikahan dapat melalui:
          </p>
        </Reveal>

        <div className="space-y-4">
          {weddingData.rekening.map((item, i) => (
            <Reveal key={i} delay={i * 100}>
              <div
                className="p-6 rounded-2xl"
                style={{ background: 'rgba(101,67,33,0.30)', border: '1px solid rgba(210,180,80,0.35)', boxShadow: '0 4px 20px rgba(210,180,80,0.08)' }}
              >
                <p className="font-accent text-xs tracking-widest uppercase mb-1" style={{ color: '#D2B450' }}>{item.bank}</p>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <p className="font-display text-lg tracking-widest" style={{ color: '#F4EFE6' }}>{item.noRekening}</p>
                    <p className="font-body text-xs mt-0.5" style={{ color: '#D8CEC0' }}>a.n. {item.atasNama}</p>
                  </div>
                  <button
                    onClick={() => copy(item.noRekening, item.bank)}
                    className="px-4 py-2 rounded-lg font-body text-xs tracking-widest uppercase transition-all duration-200"
                    style={{
                      background: copied === item.bank ? 'rgba(210,180,80,0.2)' : 'rgba(210,180,80,0.1)',
                      color: '#D2B450',
                      border: '1px solid rgba(210,180,80,0.3)',
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
      style={{ background: 'linear-gradient(170deg, #000000 0%, #120c08 70%, #654321 145%)' }}
    >
      <div className="absolute inset-0 opacity-5" style={{ pointerEvents: 'none' }}>
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <circle cx="200" cy="200" r="180" stroke="#D2B450" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="140" stroke="#D2B450" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="100" stroke="#D2B450" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 max-w-sm mx-auto">
        <Reveal>
          <p className="font-accent text-xs tracking-[0.3em] uppercase mb-6" style={{ color: '#D2B450' }}>
            Terima Kasih
          </p>

          <Ornament color="#D2B450" />
          <p className="font-body text-sm leading-relaxed mt-6" style={{ color: 'rgba(244,239,230,0.68)' }}>
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.
          </p>
          <p className="font-body text-sm mt-6 italic" style={{ color: 'rgba(210,180,80,0.8)' }}>
            Wassalamualaikum Warahmatullahi Wabarakatuh
          </p>
        </Reveal>
      </div>

      <Reveal delay={200} className="mt-16">
        <p className="font-accent text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Made with ♥ — The Wedding of {weddingData.pria.namaPanggilan} & {weddingData.wanita.namaPanggilan}
        </p>
      </Reveal>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════════════════
// AUDIO PLAYER
// ══════════════════════════════════════════════════════════════════════════════
function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Start playing automatically when component mounts (after Cover is opened)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Auto-play prevented by browser", e))
    }
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  if (!weddingData.musik) return null

  return (
    <>
      <audio ref={audioRef} src={weddingData.musik} loop />
      <button
        onClick={togglePlay}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center z-50 shadow-xl transition-transform hover:scale-110"
        style={{ background: '#000000', border: '2px solid #D2B450' }}
        aria-label="Toggle Music"
      >
        {/* Piringan Hitam Icon */}
        <div className={`w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} style={{ background: '#000' }}>
          {/* Inner circle */}
          <div className="w-3 h-3 rounded-full" style={{ background: '#D2B450' }}>
            <div className="w-1 h-1 rounded-full bg-black mx-auto mt-1" />
          </div>
          {/* Grooves */}
          <div className="absolute inset-1 rounded-full border border-gray-700 opacity-50" />
          <div className="absolute inset-2 rounded-full border border-gray-600 opacity-50" />
        </div>
        
        {/* Pause/Play indicator (optional visual feedback) */}
        {!isPlaying && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#808000] rounded-full flex items-center justify-center border-2 border-white">
            <div className="w-1.5 h-1.5 bg-white" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)' }} />
          </div>
        )}
      </button>
    </>
  )
}

export default function App() {
  const [opened, setOpened] = useState(false);

  return (
    <div className="relative bg-black">

      {/* 
        VIDEO HANYA DIBUAT SEKALI.
        Karena berada di luar kondisi opened,
        video tidak restart saat tombol Buka Undangan ditekan.
      */}
      <div className="fixed inset-0 z-0 bg-black pointer-events-none">

        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={weddingData.galeri.coverImage}
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source
            src={weddingData.galeri.coverVideo}
            type="video/mp4"
          />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

      </div>

      {/* BEFORE OPEN */}
      {!opened ? (
        <div className="relative z-10">
          <CoverSection
            onOpen={() => setOpened(true)}
          />
        </div>
      ) : (
        <>
          {/* AFTER OPEN */}
          <main className="relative z-10 overflow-x-hidden">

  <AbstractLines />
  <Sparkles />

  {/* 1. Hero + Countdown */}
  <HeroSection />

  {/* 2. Doa */}
  {weddingData.fitur.tampilkanBismillah && (
    <BismillahSection />
  )}

  {/* 3. Mempelai */}
  {weddingData.fitur.tampilkanMempelai && (
    <CoupleSection />
  )}

  {/* 4. Rangkaian Acara */}
  {weddingData.fitur.tampilkanAcara && (
    <EventSection />
  )}

  {/* 5. Important Note */}
  <ImportantNoteSection />

  {/* 6. Guest Guide:
         Dress Code + Do & Don't
  */}
  <GuestGuideSection />

  {/* 7. Galeri */}
  {weddingData.fitur.tampilkanGaleri && (
    <GallerySection />
  )}

  {/* LOVE STORY DIHAPUS */}

  {/* 8. RSVP & Wishes */}
  {weddingData.fitur.tampilkanRSVP && (
    <RsvpAndWishesSection />
  )}

  {/* 9. Amplop Digital */}
  {weddingData.fitur.tampilkanHadiah && (
    <GiftSection />
  )}

  {/* 10. Terima Kasih */}
  <ClosingSection />

</main>

          <AudioPlayer />
        </>
      )}

    </div>
  );
}