import { useState } from 'react'
import { Link } from 'react-router-dom'
import hero from '../assets/hero.png'

export default function AdminLoginPage(){
  const [form, setForm] = useState({ email:'', password:'' })
  const handle = (k)=>(e)=>setForm(s=>({ ...s, [k]: e.target.value }))
  const submit = (e)=>{ e.preventDefault(); alert('Admin login simulated') }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3">
          <img src={hero} alt="logo" className="h-10 w-10 rounded-md" />
          <div className="font-semibold text-lg">Medicare - Facility Admin</div>
        </div>
        <p className="mt-3 text-sm text-slate-600">Healthcare administrators register facilities and manage users. Facility admins are created through platform processes.</p>

        <form onSubmit={submit} className="mt-4 space-y-3">
          <input required type="email" placeholder="Email" value={form.email} onChange={handle('email')} className="w-full rounded-md border px-3 py-2" />
          <div className="relative">
            <input required type="password" placeholder="Password" value={form.password} onChange={handle('password')} className="w-full rounded-md border px-3 py-2" />
            <button type="button" className="absolute right-2 top-2 text-sm text-purple-600">Show</button>
          </div>
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" /> Remember me</label>
            <Link to="/forgot-password" className="text-sm text-purple-600">Forgot password?</Link>
          </div>
          <button className="w-full bg-purple-600 text-white py-2 rounded-md">Login</button>
        </form>

        <p className="mt-4 text-sm text-slate-600">Facility registration uses the specialized registration wizard.</p>
      </div>
    </div>
  )
}
