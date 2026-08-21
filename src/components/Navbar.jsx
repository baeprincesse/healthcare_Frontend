import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.jpg'

export default function Navbar(){
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 rounded p-2">
                 <img
                                src={logo}
                                alt="MediCare"
                                className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                              />
              {/* <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16M4 12h16" /></svg> */}
            </div>
            <Link to="/" className="font-semibold text-lg text-slate-900">MediConnect</Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-slate-700">
            <Link to="/" className="hover:text-slate-900">Home</Link>
            <Link to="/hospitals" className="hover:text-slate-900">Hospitals</Link>
            <Link to="/doctors" className="hover:text-slate-900">Doctors</Link>
            <a href="#how" className="hover:text-slate-900">How It Works</a>
            <a href="#about" className="hover:text-slate-900">About</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Login</Link>
            <Link to="/register" className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">Get Started</Link>

            <button aria-label="menu" onClick={()=>setOpen(!open)} className="md:hidden ml-2 p-2 rounded-md bg-slate-50">
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={open?"M6 18L18 6M6 6l12 12":"M4 6h16M4 12h16M4 18h16"} /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-2">
            <Link to="/hospitals" className="block">Hospitals</Link>
            <Link to="/doctors" className="block">Doctors</Link>
            <Link to="/login" className="block">Login</Link>
            <Link to="/register" className="block">Get Started</Link>
          </div>
        </div>
      )} */}
    </header>
  )
}
