import { Link } from 'react-router-dom'
import logo from '../../assets/logo.jpg'

export default function Footer(){
  return (
    <footer className="bg-white border-t border-gray-100 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-6 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <div className="overflow-hidden rounded-xl bg-emerald-600 p-1.5">
              <img
                src={logo}
                alt="MediCare logo"
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <div className="text-lg font-extrabold tracking-tight text-[#152420]">MediCare</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Healthcare Platform</div>
            </div>
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
        <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-slate-600">© 2026 MediCare. All rights reserved.</div>
      </div>
    </footer>
  )
}
