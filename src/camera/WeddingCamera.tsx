import { useEffect, useMemo, useRef, useState } from 'react'
import { push, ref as dbRef, serverTimestamp, set, update } from 'firebase/database'
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage'
import { cameraDb, cameraStorage } from './cameraFirebase'

const MAX_SHOTS = 18
const LS_GUEST_ID = 'wedding_camera_guest_id'
const LS_GUEST_NAME = 'wedding_camera_guest_name'
const LS_SHOTS_USED = 'wedding_camera_shots_used'

type FacingMode = 'user' | 'environment'
type CameraStatus = 'intro' | 'opening' | 'ready' | 'uploading' | 'error' | 'done'

function makeGuestId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function getOrCreateGuestId() {
  const stored = localStorage.getItem(LS_GUEST_ID)
  if (stored) return stored
  const created = makeGuestId()
  localStorage.setItem(LS_GUEST_ID, created)
  return created
}

function getShotsUsed() {
  const value = Number(localStorage.getItem(LS_SHOTS_USED) || '0')
  return Number.isFinite(value) ? Math.min(Math.max(value, 0), MAX_SHOTS) : 0
}

function dataUrlToBlob(dataUrl: string) {
  const [header, encoded] = dataUrl.split(',')
  const mime = header.match(/data:(.*?);/)?.[1] || 'image/jpeg'
  const binary = atob(encoded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

export default function WeddingCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [status, setStatus] = useState<CameraStatus>('intro')
  const [facingMode, setFacingMode] = useState<FacingMode>('environment')
  const [guestName, setGuestName] = useState(() => {
    const invitedName = new URLSearchParams(window.location.search).get('to') || ''
    return localStorage.getItem(LS_GUEST_NAME) || invitedName
  })
  const [shotsUsed, setShotsUsed] = useState(getShotsUsed)
  const [message, setMessage] = useState('')
  const [flash, setFlash] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const shotsLeft = MAX_SHOTS - shotsUsed
  const guestId = useMemo(() => getOrCreateGuestId(), [])

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null
  }

  const openCamera = async (mode: FacingMode = facingMode) => {
    if (shotsLeft <= 0) {
      setStatus('done')
      return
    }

    setStatus('opening')
    setMessage('')

    try {
      stopCamera()

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setStatus('ready')
    } catch (error) {
      console.error(error)
      setMessage(
        'Kamera tidak dapat dibuka. Pastikan izin kamera di browser sudah diaktifkan, lalu coba lagi.'
      )
      setStatus('error')
    }
  }

  useEffect(() => {
    return () => stopCamera()
  }, [])

  const start = async () => {
    const cleanName = guestName.trim()
    if (cleanName) localStorage.setItem(LS_GUEST_NAME, cleanName)

    await set(dbRef(cameraDb, `weddingCameraGuests/${guestId}`), {
      guestId,
      name: cleanName || null,
      firstOpenedAt: serverTimestamp(),
      shotsUsed,
      shotsRemaining: MAX_SHOTS - shotsUsed,
    }).catch(console.error)

    await openCamera()
  }

  const switchCamera = async () => {
    const next: FacingMode = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(next)
    await openCamera(next)
  }

  const capture = async () => {
    if (status !== 'ready' || shotsLeft <= 0) return

    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas || !video.videoWidth || !video.videoHeight) {
      setMessage('Kamera belum siap. Coba beberapa detik lagi.')
      return
    }

    setFlash(true)
    window.setTimeout(() => setFlash(false), 130)

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Mirror only the selfie camera so the saved image matches the preview.
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const dataUrl = canvas.toDataURL('image/jpeg', 0.84)
    setPreview(dataUrl)
    setStatus('uploading')
    setMessage('Menyimpan foto…')

    try {
      const blob = dataUrlToBlob(dataUrl)
      const photoKey = push(dbRef(cameraDb, 'weddingCameraPhotos')).key
      if (!photoKey) throw new Error('Tidak bisa membuat ID foto')

      const filePath = `wedding-camera/${guestId}/${photoKey}.jpg`
      const fileRef = storageRef(cameraStorage, filePath)

      await uploadBytes(fileRef, blob, {
        contentType: 'image/jpeg',
        customMetadata: {
          guestId,
          guestName: guestName.trim(),
        },
      })

      const imageUrl = await getDownloadURL(fileRef)
      const nextShotsUsed = shotsUsed + 1

      await set(dbRef(cameraDb, `weddingCameraPhotos/${photoKey}`), {
        id: photoKey,
        guestId,
        guestName: guestName.trim() || null,
        imageUrl,
        storagePath: filePath,
        capturedAt: serverTimestamp(),
        hidden: false,
        favorite: false,
      })

      await update(dbRef(cameraDb, `weddingCameraGuests/${guestId}`), {
        name: guestName.trim() || null,
        lastCapturedAt: serverTimestamp(),
        shotsUsed: nextShotsUsed,
        shotsRemaining: MAX_SHOTS - nextShotsUsed,
      })

      localStorage.setItem(LS_SHOTS_USED, String(nextShotsUsed))
      setShotsUsed(nextShotsUsed)
      setMessage('Foto tersimpan ♡')

      if (nextShotsUsed >= MAX_SHOTS) {
        setStatus('done')
        stopCamera()
      } else {
        window.setTimeout(() => {
          setPreview(null)
          setMessage('')
          setStatus('ready')
        }, 1100)
      }
    } catch (error) {
      console.error(error)
      setMessage('Foto belum tersimpan. Periksa koneksi internet lalu tekan “Coba Simpan Lagi”.')
      setStatus('error')
    }
  }

  const retryUpload = async () => {
    if (!preview) {
      await openCamera()
      return
    }

    // Re-capture is safer than silently losing the photo.
    setPreview(null)
    setMessage('Silakan ambil ulang foto.')
    await openCamera()
  }

  if (status === 'intro') {
    return (
      <main className="wc-intro">
        <div className="wc-grain" />
        <div className="wc-intro-card">
          <p className="wc-kicker">THE WEDDING CAMERA</p>
          <div className="wc-line" />
          <h1>Capture<br />Our Day</h1>
          <p className="wc-copy">
            Bantu kami mengabadikan hari ini dari sudut pandangmu.
            Setiap perangkat mendapat hingga <strong>{MAX_SHOTS} foto</strong>.
          </p>

          <label className="wc-name-label" htmlFor="guest-name">
            Nama <span>(opsional)</span>
          </label>
          <input
            id="guest-name"
            className="wc-name-input"
            value={guestName}
            onChange={e => setGuestName(e.target.value)}
            placeholder="Tulis nama kamu"
            maxLength={60}
            autoComplete="name"
          />

          <button className="wc-primary" onClick={start}>
            Buka Kamera
          </button>
          <p className="wc-small">Tidak perlu download aplikasi.</p>
        </div>
      </main>
    )
  }

  if (status === 'done') {
    return (
      <main className="wc-intro">
        <div className="wc-grain" />
        <div className="wc-intro-card">
          <p className="wc-kicker">FILM ROLL COMPLETE</p>
          <div className="wc-line" />
          <h1>Thank You</h1>
          <p className="wc-copy">
            Kamu sudah menggunakan seluruh {MAX_SHOTS} frame. Terima kasih sudah
            ikut mengabadikan hari kami ♡
          </p>
          <button className="wc-secondary" onClick={() => window.location.href = '/'}>
            Kembali ke Undangan
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="wc-camera-page">
      <div className={`wc-flash ${flash ? 'is-on' : ''}`} />

      <header className="wc-camera-header">
        <div>
          <p className="wc-camera-label">OUR WEDDING</p>
          <p className="wc-camera-sub">Disposable Camera</p>
        </div>
        <div className="wc-counter">
          <strong>{shotsLeft}</strong>
          <span>foto tersisa</span>
        </div>
      </header>

      <section className="wc-viewfinder">
        <video
          ref={videoRef}
          className={`wc-video ${facingMode === 'user' ? 'is-selfie' : ''}`}
          autoPlay
          playsInline
          muted
        />

        {preview && (
          <img className="wc-preview" src={preview} alt="Foto yang baru diambil" />
        )}

        {(status === 'opening' || status === 'uploading') && (
          <div className="wc-status">
            <div className="wc-spinner" />
            <span>{status === 'opening' ? 'Membuka kamera…' : message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="wc-status wc-status-error">
            <p>{message}</p>
            <button onClick={retryUpload}>Coba Lagi</button>
          </div>
        )}

        <div className="wc-frame-corner wc-tl" />
        <div className="wc-frame-corner wc-tr" />
        <div className="wc-frame-corner wc-bl" />
        <div className="wc-frame-corner wc-br" />
      </section>

      <footer className="wc-controls">
        <button
          className="wc-icon-button"
          onClick={switchCamera}
          disabled={status !== 'ready'}
          aria-label="Ganti kamera depan atau belakang"
        >
          ↻
        </button>

        <button
          className="wc-shutter"
          onClick={capture}
          disabled={status !== 'ready' || shotsLeft <= 0}
          aria-label="Ambil foto"
        >
          <span />
        </button>

        <div className="wc-control-placeholder">
          <span>{status === 'ready' ? 'READY' : '...'}</span>
        </div>
      </footer>

      <canvas ref={canvasRef} className="wc-hidden-canvas" />
    </main>
  )
}
