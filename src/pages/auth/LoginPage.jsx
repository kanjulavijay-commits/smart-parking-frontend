import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth'
import useAuthStore from '../../store/authStore'
import { LoginForm, VideoBackground } from '../../components/ui/gaming-login'
import { SmokeBackground } from '../../components/ui/spooky-smoke-animation'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_114316_1c7889ad-2885-410e-b493-98119fee0ddb.mp4'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (email, password) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await authApi.login({ email, password })
      setTokens(data.access, data.refresh)
      const profile = await authApi.getProfile()
      setUser(profile.data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'INVALID CREDENTIALS.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Video background */}
      <VideoBackground videoUrl={VIDEO_URL} />

      {/* Smoke overlay */}
      <div className="absolute inset-0 z-[15] opacity-20 mix-blend-overlay pointer-events-none">
        <SmokeBackground smokeColor="#C9A0B8" />
      </div>

      {/* Login card */}
      <div className="relative z-20 w-full max-w-md">
        <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
      </div>

      <footer className="absolute bottom-4 left-0 right-0 text-center text-white/30 text-[10px] z-20 font-mono uppercase tracking-widest">
        © 2025 PARKSMART · AI-POWERED PARKING INTELLIGENCE
      </footer>
    </div>
  )
}
