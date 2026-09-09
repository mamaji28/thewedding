export default function WeddingCameraButton() {
  const query = window.location.search

  return (
    <a
      href={`/camera${query}`}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs tracking-[0.18em] uppercase transition-transform hover:scale-[1.02]"
      style={{
        background: '#D2B450',
        color: '#000000',
        textDecoration: 'none',
        borderRadius: '999px',
        boxShadow: '0 4px 25px rgba(210,180,80,0.22)',
      }}
    >
      <span aria-hidden>📷</span>
      Wedding Camera
    </a>
  )
}
