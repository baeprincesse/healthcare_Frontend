import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Profile(){
  const { user } = useAuth()
  return (
    <div>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid gap-3">
            <div><span className="font-semibold">Full Name: </span>{user?.name}</div>
            <div><span className="font-semibold">Email: </span>{user?.email}</div>
            <div><span className="font-semibold">Phone: </span>{user?.phone || '—'}</div>
          </div>
        </div>
      </main>
    </div>
  )
}
