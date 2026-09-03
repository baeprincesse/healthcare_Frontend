import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev || '' }
  }, [])

  return (
    <div className="h-screen flex items-center justify-center bg-slate-100 px-4 text-slate-900 overflow-hidden">
      <div className="mx-auto w-full max-w-md space-y-4">
        <header className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Password reset</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Forgot password?</h1>
          <p className="mt-2 text-sm text-slate-600">Enter your email and we&apos;ll send a reset link.</p>
        </header>

        <div className="rounded-md bg-white p-4 shadow-sm">
          <label className="block text-sm font-medium text-slate-700">
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              placeholder="you@example.com"
              required
            />
          </label>
          <button type="button" className="mt-3 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">Send reset link</button>
          <div className="text-center mt-3 text-sm text-slate-600"><p>Remembered your password? <Link to="/" className="font-semibold text-sky-600 hover:text-sky-700">Go back</Link>.</p></div>
        </div>
      </div>
    </div>
  )
}
