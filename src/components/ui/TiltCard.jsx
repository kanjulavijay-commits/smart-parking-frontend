import { useRef, useState } from 'react'

export default function TiltCard({ children, className = '', intensity = 12, glare = true }) {
  const ref = useRef(null)
  const [style, setStyle] = useState({})
  const [glarePos, setGlarePos] = useState({ x: 50, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMove = (e) => {
    const card = ref.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotY =  ((x - cx) / cx) * intensity
    const rotX = -((y - cy) / cy) * intensity
    const gx = (x / rect.width) * 100
    const gy = (y / rect.height) * 100
    setStyle({
      transform: `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`,
    })
    setGlarePos({ x: gx, y: gy })
  }

  const handleLeave = () => {
    setHovered(false)
    setStyle({ transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)', transition: 'transform 0.5s cubic-bezier(0.23,1,0.32,1)' })
  }

  const handleEnter = () => {
    setHovered(true)
    setStyle((prev) => ({ ...prev, transition: 'transform 0.1s ease-out' }))
  }

  return (
    <div
      ref={ref}
      className={`tilt-card relative ${className}`}
      style={style}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
      {glare && hovered && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-10 overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
            }}
          />
        </div>
      )}
    </div>
  )
}
