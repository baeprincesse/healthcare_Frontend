import { Link } from 'react-router-dom'
import logo from '../assets/logo.jpg'

export default function Footer(){
  return (
    <footer className="bg-white border-t border-gray-100 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-6 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-green-600 rounded p-2"
               > <img
                               src={logo}
                               alt="MediCare logo"
                               className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             /></div>
            <div className="font-semibold">MediConnect</div>
          </div>
          <p className="mt-3 text-sm text-slate-600">Connecting people with better healthcare.</p>
        </div>

        <div>
          <h4 className="font-semibold">Platform</h4>
          <ul className="mt-3 text-sm space-y-2 text-slate-600">
            <li><Link to="/hospitals">Hospitals</Link></li>
            <li><Link to="/doctors">Doctors</Link></li>
            <li><Link to="/appointments">Appointments</Link></li>
            <li><a href="#how">How It Works</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Company</h4>
          <ul className="mt-3 text-sm space-y-2 text-slate-600">
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-slate-600">© 2026 MediConnect. All rights reserved.</div>
      </div>
    </footer>
  )
}
