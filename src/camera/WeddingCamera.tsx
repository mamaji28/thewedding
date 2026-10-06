import { useEffect, useMemo, useRef, useState } from 'react'

import { push, ref as dbRef, serverTimestamp, set, update } from 'firebase/database'

import { cameraDb } from './cameraFirebase'

import { supabase } from './supabase'



const MAX_SHOTS = 10

const MAX_IMAGE_SIDE = 1280

const JPEG_QUALITY = 0.72

const UPLOAD_TIMEOUT_MS = 20000

const MIN_ZOOM = 1
const MAX_ZOOM = 2
const ZOOM_STEP = 0.5


const LS_GUEST_ID = 'wedding_camera_guest_id'

const LS_GUEST_NAME = 'wedding_camera_guest_name'

const LS_SHOTS_USED = 'wedding_camera_shots_used'



type FacingMode = 'user' | 'environment'

type FocusPoint = {
  x: number
  y: number
}

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

  const focusTimerRef = useRef<number | null>(null)

  const pinchStartRef = useRef<{ distance: number; zoom: number } | null>(null)

  const lastTapRef = useRef(0)



  const [status, setStatus] = useState<CameraStatus>('intro')

  const [facingMode, setFacingMode] = useState<FacingMode>('environment')

  const [zoom, setZoom] = useState(MIN_ZOOM)

  const [focusPoint, setFocusPoint] = useState<FocusPoint | null>(null)

  const [cameraNow, setCameraNow] = useState(() => new Date())



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

    pinchStartRef.current = null

  }



  const applyZoom = (nextZoom: number) => {

    const targetZoom = Math.min(Math.max(nextZoom, MIN_ZOOM), MAX_ZOOM)

    setZoom(targetZoom)

  }



  const showFocus = (point: FocusPoint) => {

    setFocusPoint(point)



    if (focusTimerRef.current) {

      window.clearTimeout(focusTimerRef.current)

    }



    focusTimerRef.current = window.setTimeout(() => {

      setFocusPoint(null)

    }, 900)

  }



  const focusCamera = async () => {

    const track = streamRef.current?.getVideoTracks()[0]

    if (!track) return



    try {

      const capabilities = track.getCapabilities?.() as any

      if (

        Array.isArray(capabilities?.focusMode) &&

        capabilities.focusMode.includes('single-shot')

      ) {

        await track.applyConstraints({

          advanced: [{ focusMode: 'single-shot' }],

        } as any)

      }

    } catch {

      // Tidak semua kamera/browser menyediakan kontrol fokus manual.

    }

  }



  type CameraTouchList = React.TouchEvent<HTMLElement>['touches']

const getTouchDistance = (touches: CameraTouchList) => {

  if (touches.length < 2) return 0

  const first = touches.item(0)
  const second = touches.item(1)

  if (!first || !second) return 0

  const dx = first.clientX - second.clientX
  const dy = first.clientY - second.clientY

  return Math.sqrt(dx * dx + dy * dy)
}



  const handleViewfinderClick = (event: React.MouseEvent<HTMLElement>) => {

    if (status !== 'ready') return



    const rect = event.currentTarget.getBoundingClientRect()

    const point = {

      x: ((event.clientX - rect.left) / rect.width) * 100,

      y: ((event.clientY - rect.top) / rect.height) * 100,

    }



    showFocus(point)

    void focusCamera()



    const now = Date.now()

    if (now - lastTapRef.current < 320) {

      applyZoom(zoom >= MAX_ZOOM ? MIN_ZOOM : zoom + ZOOM_STEP)

    }

    lastTapRef.current = now

  }



  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {

    if (event.touches.length === 2) {

      pinchStartRef.current = {

        distance: getTouchDistance(event.touches),

        zoom,

      }

    }

  }



  const handleTouchMove = (event: React.TouchEvent<HTMLElement>) => {

    if (event.touches.length !== 2 || !pinchStartRef.current) return



    event.preventDefault()



    const start = pinchStartRef.current

    const distance = getTouchDistance(event.touches)

    if (!start.distance || !distance) return



    const nextZoom = start.zoom * (distance / start.distance)

    applyZoom(nextZoom)

  }



  const handleTouchEnd = () => {

    pinchStartRef.current = null

  }



  const openCamera = async (mode: FacingMode = facingMode) => {

    if (shotsLeft <= 0) {

      setStatus('done')

      return

    }



    setStatus('opening')

    setMessage('')

    setPreview(null)

    setZoom(MIN_ZOOM)

    setFocusPoint(null)



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



  useEffect(() => {

    const timer = window.setInterval(() => setCameraNow(new Date()), 1000)

    return () => window.clearInterval(timer)

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



      // Digital zoom: crop bagian tengah saat menyimpan foto agar

      // hasil file mengikuti zoom yang terlihat di layar.

      const cropWidth = sourceWidth / zoom

      const cropHeight = sourceHeight / zoom

      const cropX = (sourceWidth - cropWidth) / 2

      const cropY = (sourceHeight - cropHeight) / 2

      const resized = getResizedDimensions(cropWidth, cropHeight)



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

        cropX,

        cropY,

        cropWidth,

        cropHeight,

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



  const timestampDate = cameraNow

    .toLocaleDateString('en-US', {

      month: 'short',

      day: '2-digit',

      year: 'numeric',

    })

    .toUpperCase()



  const timestampTime = cameraNow.toLocaleTimeString('en-US', {

    hour: '2-digit',

    minute: '2-digit',

    hour12: true,

  })



  return (

    <main className="wc-camera-page wc-retro-camera">

      <style>{`
        .wc-retro-camera {
          --retro-gold: #c4a35a;
          --retro-paper: #f3eee5;
          width: 100%;
          min-height: 100svh;
          box-sizing: border-box;
          background: #090909;
          color: var(--retro-paper);
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
          padding: 0 14px max(14px, env(safe-area-inset-bottom));
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
        }

        .wc-retro-camera .wc-camera-header,
        .wc-retro-camera .wc-controls {
          width: min(100%, 540px);
          box-sizing: border-box;
        }

        .wc-retro-camera .wc-camera-header {
          flex: 0 0 auto;
          min-height: 76px;
          padding: 18px 2px 12px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          background: #090909;
        }

        .wc-retro-camera .wc-camera-label {
          margin: 0;
          color: var(--retro-gold);
          font-size: 12px;
          line-height: 1.1;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .wc-retro-camera .wc-camera-sub {
          margin: 5px 0 0;
          color: rgba(243,238,229,.58);
          font-size: 10px;
          letter-spacing: .04em;
        }

        .wc-retro-camera .wc-counter {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          line-height: 1;
        }

        .wc-retro-camera .wc-counter strong {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(30px, 8vw, 44px);
          font-weight: 400;
          letter-spacing: -.04em;
        }

        .wc-retro-camera .wc-counter span {
          margin-top: 6px;
          color: rgba(243,238,229,.48);
          font-size: 8px;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .wc-retro-camera .wc-viewfinder {
          position: relative;
          width: min(100%, 540px);
          aspect-ratio: 3 / 4;
          flex: 0 1 auto;
          overflow: hidden;
          background: #111;
          border-radius: 3px;
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
          isolation: isolate;
        }

        .wc-retro-camera .wc-video,
        .wc-retro-camera .wc-preview {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .18s ease-out;
          transform-origin: center center;
        }

        .wc-retro-camera .wc-video {
          background: #111;
        }

        .wc-retro-camera .wc-video.is-selfie {
          transform: scaleX(-1) scale(${zoom});
        }

        .wc-retro-camera .wc-video:not(.is-selfie) {
          transform: scale(${zoom});
        }

        .wc-retro-camera .wc-preview {
          z-index: 4;
        }

        .wc-retro-camera .wc-viewfinder::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 5;
          pointer-events: none;
          background:
            radial-gradient(circle at center, transparent 45%, rgba(0,0,0,.20) 100%),
            linear-gradient(rgba(255,255,255,.025) 50%, transparent 50%);
          background-size: auto, 100% 3px;
          mix-blend-mode: screen;
        }

        .wc-retro-camera .wc-frame-corner {
          z-index: 8;
          width: 29px;
          height: 29px;
          border-color: rgba(255,255,255,.86);
        }

        .wc-retro-camera .wc-tl { top: 14px; left: 14px; }
        .wc-retro-camera .wc-tr { top: 14px; right: 14px; }
        .wc-retro-camera .wc-bl { bottom: 14px; left: 14px; }
        .wc-retro-camera .wc-br { bottom: 14px; right: 14px; }

        .wc-retro-camera .wc-retro-overlay {
          position: absolute;
          inset: 0;
          z-index: 9;
          pointer-events: none;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          text-shadow: 0 1px 2px rgba(0,0,0,.8);
        }

        .wc-retro-camera .wc-rec {
          position: absolute;
          top: 22px;
          left: 25px;
          display: flex;
          align-items: center;
          gap: 7px;
          color: #f1eee6;
          font-size: 12px;
          letter-spacing: .05em;
        }

        .wc-retro-camera .wc-rec-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ff2d2d;
          box-shadow: 0 0 8px rgba(255,45,45,.65);
          animation: wc-rec-blink 1.2s steps(1,end) infinite;
        }

        @keyframes wc-rec-blink {
          0%, 55% { opacity: 1; }
          56%, 100% { opacity: .35; }
        }

        .wc-retro-camera .wc-battery {
          position: absolute;
          top: 21px;
          right: 24px;
          width: 25px;
          height: 12px;
          border: 1.5px solid rgba(255,255,255,.9);
          border-radius: 2px;
          box-sizing: border-box;
        }

        .wc-retro-camera .wc-battery::before {
          content: "";
          position: absolute;
          top: 3px;
          right: -4px;
          width: 3px;
          height: 5px;
          background: rgba(255,255,255,.9);
          border-radius: 0 1px 1px 0;
        }

        .wc-retro-camera .wc-battery::after {
          content: "";
          position: absolute;
          inset: 2px;
          width: 65%;
          background: rgba(255,255,255,.9);
        }

        .wc-retro-camera .wc-timestamp {
          position: absolute;
          right: 23px;
          bottom: 22px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          color: #ff8b25;
          font-size: clamp(13px, 3vw, 18px);
          line-height: 1.05;
          letter-spacing: .02em;
          font-weight: 700;
        }

        .wc-retro-camera .wc-focus {
          position: absolute;
          z-index: 10;
          width: 64px;
          height: 64px;
          transform: translate(-50%, -50%);
          border: 1.5px solid rgba(255,255,255,.9);
          box-sizing: border-box;
          pointer-events: none;
          animation: wc-focus .9s ease-out forwards;
        }

        .wc-retro-camera .wc-focus::before,
        .wc-retro-camera .wc-focus::after {
          content: "";
          position: absolute;
          background: rgba(255,255,255,.9);
        }

        .wc-retro-camera .wc-focus::before {
          width: 14px;
          height: 1px;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
        }

        .wc-retro-camera .wc-focus::after {
          width: 1px;
          height: 14px;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
        }

        @keyframes wc-focus {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(1.3); }
          15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }

        .wc-retro-camera .wc-zoom-readout {
          position: absolute;
          z-index: 10;
          left: 22px;
          bottom: 22px;
          color: rgba(255,255,255,.78);
          font-size: 10px;
          letter-spacing: .1em;
          opacity: ${zoom > 1 ? 1 : 0};
          transition: opacity .2s ease;
        }

        .wc-retro-camera .wc-controls {
          min-height: 106px;
          padding: 14px 2px 4px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          background: #090909;
        }

        .wc-retro-camera .wc-icon-button {
          justify-self: start;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #151515;
          border: 1px solid rgba(255,255,255,.20);
          color: #f3eee5;
          font-size: 27px;
          line-height: 1;
        }

        .wc-retro-camera .wc-shutter {
          width: 82px;
          height: 82px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,.86);
          background: #0b0b0b;
          display: grid;
          place-items: center;
          box-shadow: 0 0 0 7px rgba(255,255,255,.08);
        }

        .wc-retro-camera .wc-shutter span {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #f3eee5;
          display: block;
        }

        .wc-retro-camera .wc-control-placeholder {
          justify-self: end;
          color: rgba(255,255,255,.45);
          font-size: 9px;
          letter-spacing: .15em;
        }

        .wc-retro-camera .wc-shutter:disabled,
        .wc-retro-camera .wc-icon-button:disabled {
          opacity: .5;
        }

        @media (min-width: 700px) {
          .wc-retro-camera {
            max-width: 600px;
            min-height: 100vh;
            padding-top: 12px;
          }
        }

        @media (max-height: 700px) and (max-width: 699px) {
          .wc-retro-camera .wc-camera-header { min-height: 66px; padding-top: 10px; }
          .wc-retro-camera .wc-viewfinder { max-height: calc(100svh - 172px); }
          .wc-retro-camera .wc-controls { min-height: 92px; }
          .wc-retro-camera .wc-shutter { width: 68px; height: 68px; }
          .wc-retro-camera .wc-shutter span { width: 52px; height: 52px; }
        }
      `}</style>

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



      <section
        className="wc-viewfinder"
        onClick={handleViewfinderClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >

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



        <div className="wc-retro-overlay" aria-hidden="true">

          <div className="wc-rec">

            <span className="wc-rec-dot" />

            <span>REC</span>

          </div>



          <div className="wc-battery" />



          <div className="wc-timestamp">

            <span>{timestampDate}</span>

            <span>{timestampTime}</span>

          </div>



          {focusPoint && (

            <div

              key={`${focusPoint.x}-${focusPoint.y}-${cameraNow.getTime()}`}

              className="wc-focus"

              style={{

                left: `${focusPoint.x}%`,

                top: `${focusPoint.y}%`,

              }}

            />

          )}



          <span className="wc-zoom-readout">

            {zoom.toFixed(1)}×

          </span>

        </div>



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
