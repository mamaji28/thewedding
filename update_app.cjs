const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Add Firebase imports at the top
const firebaseImports = `import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';\nimport { db } from './firebase';\n`;
content = content.replace(`import { useState, useEffect, useRef } from 'react'`, `import { useState, useEffect, useRef } from 'react'\n${firebaseImports}`);

// 2. Define the new RsvpAndWishesSection
const newSection = `
// 8. RSVP & Wishes (Youtube-style Comments)
function RsvpAndWishesSection() {
  const [form, setForm] = useState({ name: '', attend: 'hadir', message: '' })
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch comments in real-time
  useEffect(() => {
    const q = query(collection(db, 'ucapan'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setComments(data)
    })
    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) return
    
    setLoading(true)
    try {
      await addDoc(collection(db, 'ucapan'), {
        nama: form.name,
        kehadiran: form.attend,
        pesan: form.message,
        createdAt: serverTimestamp()
      })
      // Clear form after successful submit
      setForm({ name: '', attend: 'hadir', message: '' })
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
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date).toUpperCase()
  }

  const getBadgeColor = (status: string) => {
    if (status === 'hadir') return { bg: 'rgba(22, 163, 74, 0.1)', border: '#16a34a', text: '#16a34a', label: 'HADIR' }
    if (status === 'tidak hadir') return { bg: 'rgba(220, 38, 38, 0.1)', border: '#dc2626', text: '#dc2626', label: 'TIDAK HADIR' }
    return { bg: 'rgba(202, 138, 4, 0.1)', border: '#ca8a04', text: '#ca8a04', label: 'MASIH RAGU' }
  }

  const scrollbarCSS = ".custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }";

  return (
    <section className="py-20 px-6 relative overflow-hidden" style={{ background: '#111111' }}>
      <div className="max-w-xl mx-auto">
        <Reveal>
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl" style={{ color: '#faf7f2' }}>{comments.length} Comments</h2>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="flex flex-col items-center justify-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(22, 163, 74, 0.3)' }}>
              <span className="font-display text-2xl" style={{ color: '#faf7f2' }}>{hadirCount}</span>
              <span className="font-accent text-[10px] tracking-widest mt-1" style={{ color: '#16a34a' }}>HADIR</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
              <span className="font-display text-2xl" style={{ color: '#faf7f2' }}>{tidakHadirCount}</span>
              <span className="font-accent text-[10px] tracking-widest mt-1" style={{ color: '#dc2626' }}>TIDAK HADIR</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(202, 138, 4, 0.3)' }}>
              <span className="font-display text-2xl" style={{ color: '#faf7f2' }}>{raguCount}</span>
              <span className="font-accent text-[10px] tracking-widest mt-1" style={{ color: '#ca8a04' }}>MASIH RAGU</span>
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
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Masukkan nama Anda"
                className="w-full px-4 py-3 rounded-lg font-body text-sm outline-none transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#faf7f2' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            <div>
              <label className="block font-accent text-[10px] tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>KONFIRMASI KEHADIRAN</label>
              <select
                value={form.attend}
                onChange={e => setForm({ ...form, attend: e.target.value })}
                className="w-full px-4 py-3 rounded-lg font-body text-sm outline-none transition-all duration-200 appearance-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#faf7f2' }}
              >
                <option value="hadir" style={{ background: '#111' }}>Hadir</option>
                <option value="tidak hadir" style={{ background: '#111' }}>Tidak Hadir</option>
                <option value="ragu" style={{ background: '#111' }}>Masih Ragu</option>
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
                className="w-full px-4 py-3 rounded-lg font-body text-sm outline-none resize-none transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#faf7f2' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-full font-body text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
              style={{ background: '#fff', color: '#111', opacity: loading ? 0.7 : 1 }}
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
          {comments.map((comment, i) => {
            const badge = getBadgeColor(comment.kehadiran)
            return (
              <Reveal key={comment.id} delay={Math.min(i * 50, 500)}>
                <div className="p-5 rounded-xl flex gap-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-display text-sm tracking-widest uppercase" style={{ color: '#faf7f2' }}>{comment.nama}</h4>
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
          
          {comments.length === 0 && (
            <div className="text-center py-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <p className="font-body text-sm">Belum ada komentar. Jadilah yang pertama!</p>
            </div>
          )}
        </div>
      </div>
      
      <style>{scrollbarCSS}</style>
    </section>
  )
}
`;

// Extract parts of content to replace correctly
const regexReplace = /\/\/ 8\. RSVP\nfunction RsvpSection\(\) \{[\s\S]*?\/\/ 10\. Gift \/ Hadiah/m;
content = content.replace(regexReplace, newSection + '\n\n// 10. Gift / Hadiah');

// Also update the main App render
content = content.replace(/<RsvpSection \/>\s*<WishesSection \/>/, '<RsvpAndWishesSection />');

fs.writeFileSync(appPath, content, 'utf8');
console.log('App.tsx updated successfully.');
