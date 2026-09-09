import { useEffect, useMemo, useRef, useState } from 'react'
import { push, ref as dbRef, serverTimestamp, set, update } from 'firebase/database'
import { cameraDb } from './cameraFirebase'
import { supabase } from './supabase'

const MAX_SHOTS = 18
const MAX_IMAGE_SIDE = 1280
const JPEG_QUALITY = 0.72
const UPLOAD_TIMEOUT_MS = 20000

const LS_GUEST_ID = 'wedding_camera_guest_id'
const LS_GUEST_NAME = 'wedding_camera_guest_name'
const LS_SHOTS_USED = 'wedding_camera_shots_used'

type FacingMode = 'user' | 'environment'
type CameraStatus =
  | 'intro'
  | 'opening'
  | 'ready'
  | 'processing'
  | 'uploading'
  | 'error'
  | 'done'

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
  return Number.isFinite(value)
    ? Math.min(Math.max(value, 0), MAX_SHOTS)
    : 0
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality = JPEG_QUALITY
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (!blob) {
          reject(new Error('Gagal memproses foto'))
          return
        }
        resolve(blob)
      },
      'image/jpeg',
      quality
    )
  })
}

function getResizedDimensions(width: number, height: number) {
  const largest = Math.max(width, height)

  if (largest <= MAX_IMAGE_SIDE) {
    return { width, height }
  }

  const scale = MAX_IMAGE_SIDE / largest

  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => {
        reject(new Error('Upload terlalu lama. Silakan coba lagi.'))
      }, timeoutMs)
    }),
  ])
}

export default function WeddingCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [status, setStatus] = useState<CameraStatus>('intro')
  const [facingMode, setFacingMode] = useState<FacingMode>('environment')

  const [guestName, setGuestName] = useState(
    () => localStorage.getItem(LS_GUEST_NAME) || ''
  )

  const [shotsUsed, setShotsUsed] = useState(getShotsUsed)
  const [message, setMessage] = useState('')
  const [flash, setFlash] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

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
    setPreview(null)

    try {
      stopCamera()

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          'Browser ini tidak mendukung kamera. Gunakan Chrome/Safari terbaru melalui HTTPS.'
        )
      }

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
        error instanceof Error
          ? error.message
          : 'Kamera tidak dapat dibuka. Pastikan izin kamera sudah diaktifkan.'
      )
      setStatus('error')
    }
  }

  useEffect(() => {
    return () => stopCamera()
  }, [])

  const start = async () => {
    const cleanName = guestName.trim()

    if (cleanName) {
      localStorage.setItem(LS_GUEST_NAME, cleanName)
    }

    try {
      await set(dbRef(cameraDb, `weddingCameraGuests/${guestId}`), {
        guestId,
        name: cleanName || null,
        firstOpenedAt: serverTimestamp(),
        shotsUsed,
        shotsRemaining: MAX_SHOTS - shotsUsed,
      })
    } catch (error) {
      console.error('Gagal menyimpan guest metadata:', error)
      // Kamera tetap boleh dibuka walaupun metadata guest sementara gagal.
    }

    await openCamera()
  }

  const switchCamera = async () => {
    if (status !== 'ready') return

    const next: FacingMode =
      facingMode === 'environment' ? 'user' : 'environment'

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

    try {
      setStatus('processing')
      setMessage('Memproses foto…')
      setUploadProgress(15)

      const sourceWidth = video.videoWidth
      const sourceHeight = video.videoHeight
      const resized = getResizedDimensions(sourceWidth, sourceHeight)

      canvas.width = resized.width
      canvas.height = resized.height

      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('Tidak dapat memproses foto')
      }

      ctx.save()

      // Preview selfie dibuat mirror; hasil file juga dibuat sama dengan preview.
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
      }

      ctx.drawImage(
        video,
        0,
        0,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvas.width,
        canvas.height
      )

      ctx.restore()

      const previewUrl = canvas.toDataURL('image/jpeg', 0.55)
      setPreview(previewUrl)

      const blob = await canvasToBlob(canvas)

      setStatus('uploading')
      setMessage('Menyimpan foto…')
      setUploadProgress(40)

      const firebasePhotoKey = push(
        dbRef(cameraDb, 'weddingCameraPhotos')
      ).key

      if (!firebasePhotoKey) {
        throw new Error('Tidak dapat membuat ID foto')
      }

      const fileName = `${firebasePhotoKey}.jpg`
      const storagePath = `${guestId}/${fileName}`

      const uploadPromise = supabase.storage
        .from('wedding-camera')
        .upload(storagePath, blob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false,
        })

      const uploadResult = await withTimeout(
        uploadPromise,
        UPLOAD_TIMEOUT_MS
      )

      if (uploadResult.error) {
        throw uploadResult.error
      }

      setUploadProgress(75)

      const { data: publicUrlData } = supabase.storage
        .from('wedding-camera')
        .getPublicUrl(storagePath)

      const imageUrl = publicUrlData.publicUrl

      if (!imageUrl) {
        throw new Error('URL foto tidak tersedia')
      }

      const nextShotsUsed = shotsUsed + 1

      await set(
        dbRef(cameraDb, `weddingCameraPhotos/${firebasePhotoKey}`),
        {
          id: firebasePhotoKey,
          guestId,
          guestName: guestName.trim() || null,
          imageUrl,
          storageProvider: 'supabase',
          storageBucket: 'wedding-camera',
          storagePath,
          fileName,
          capturedAt: serverTimestamp(),
          hidden: false,
          favorite: false,
        }
      )

      setUploadProgress(90)

      await update(
        dbRef(cameraDb, `weddingCameraGuests/${guestId}`),
        {
          name: guestName.trim() || null,
          lastCapturedAt: serverTimestamp(),
          shotsUsed: nextShotsUsed,
          shotsRemaining: MAX_SHOTS - nextShotsUsed,
        }
      )

      localStorage.setItem(LS_SHOTS_USED, String(nextShotsUsed))
      setShotsUsed(nextShotsUsed)

      setUploadProgress(100)
      setMessage('Foto tersimpan ♡')

      if (nextShotsUsed >= MAX_SHOTS) {
        window.setTimeout(() => {
          setStatus('done')
          stopCamera()
        }, 700)
      } else {
        window.setTimeout(() => {
          setPreview(null)
          setMessage('')
          setUploadProgress(0)
          setStatus('ready')
        }, 900)
      }
    } catch (error) {
      console.error('Wedding Camera upload error:', error)

      setUploadProgress(0)

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Foto belum tersimpan. Periksa koneksi internet lalu coba lagi.'

      setMessage(errorMessage)
      setStatus('error')
    }
  }

  const retry = async () => {
    setPreview(null)
    setUploadProgress(0)
    setMessage('')
    await openCamera()
  }

  if (status === 'intro') {
    return (
      <main className="wc-intro">
        <div className="wc-grain" />

        <div className="wc-intro-card">
          <p className="wc-kicker">THE WEDDING CAMERA</p>
          <div className="wc-line" />

          <h1>
            Capture
            <br />
            Our Day
          </h1>

          <p className="wc-copy">
            Bantu kami mengabadikan hari ini dari sudut pandangmu.
            Setiap perangkat mendapat hingga{' '}
            <strong>{MAX_SHOTS} foto</strong>.
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
            Kamu sudah menggunakan seluruh {MAX_SHOTS} frame.
            Terima kasih sudah ikut mengabadikan hari kami ♡
          </p>

          <button
            className="wc-secondary"
            onClick={() => {
              window.location.href = '/'
            }}
          >
            Kembali ke Undangan
          </button>
        </div>
      </main>
    )
  }

  const isBusy =
    status === 'opening' ||
    status === 'processing' ||
    status === 'uploading'

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
          className={`wc-video ${
            facingMode === 'user' ? 'is-selfie' : ''
          }`}
          autoPlay
          playsInline
          muted
        />

        {preview && (
          <img
            className="wc-preview"
            src={preview}
            alt="Foto yang baru diambil"
          />
        )}

        {isBusy && (
          <div className="wc-status">
            <div className="wc-spinner" />

            <span>
              {status === 'opening'
                ? 'Membuka kamera…'
                : message}
            </span>

            {status === 'uploading' && (
              <div
                style={{
                  width: 'min(240px, 75vw)',
                  marginTop: 4,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: 4,
                    background: 'rgba(255,255,255,.14)',
                    overflow: 'hidden',
                    borderRadius: 999,
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${uploadProgress}%`,
                      background: '#c4a35a',
                      transition: 'width .25s ease',
                    }}
                  />
                </div>

                <div
                  style={{
                    marginTop: 7,
                    fontSize: 10,
                    letterSpacing: '.12em',
                    opacity: .65,
                  }}
                >
                  {uploadProgress}%
                </div>
              </div>
            )}
          </div>
        )}

        {status === 'error' && (
          <div className="wc-status wc-status-error">
            <p>{message}</p>
            <button onClick={retry}>Coba Lagi</button>
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
