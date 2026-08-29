// import Navbar from '../../components/Navbar.jsx'
// import { useAuth } from '../../context/AuthContext.jsx'

// export default function Profile(){
//   const { user } = useAuth()
//   return (
//     <div>
//       <Navbar />
//       <main className="max-w-3xl mx-auto px-6 py-10">
//         <h1 className="text-2xl font-semibold">Profile</h1>
//         <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
//           <div className="grid gap-3">
//             <div><span className="font-semibold">Full Name: </span>{user?.name}</div>
//             <div><span className="font-semibold">Email: </span>{user?.email}</div>
//             <div><span className="font-semibold">Phone: </span>{user?.phone || '—'}</div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }
import { useEffect, useState } from 'react'
import Navbar from '../../components/dashboard/Navbar.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../services/api.js'

export default function Profile() {
  const { user } = useAuth()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const getUser = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const response = await api.get(`/users/${user.id}`)

        setProfile(response.data.user)
      } catch (error) {
        console.error('Error getting user:', error)

        setError(
          error.response?.data?.message ||
          'Unable to load profile'
        )
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [user])

  if (loading) {
    return (
      <div>
        <Navbar />

        <main className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-gray-500">
            Loading profile...
          </p>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        {/* <Navbar /> */}

        <main className="max-w-3xl mx-auto px-6 py-10">
          <div className="rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div>
      {/* <Navbar /> */}

      <main className="max-w-3xl mx-auto px-6 py-10">

        <h1 className="text-2xl font-semibold">
          Profile
        </h1>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <div className="grid gap-4">

            <div>
              <span className="font-semibold">
                Full Name:
              </span>{' '}
              {profile?.name || '—'}
            </div>

            <div>
              <span className="font-semibold">
                Email:
              </span>{' '}
              {profile?.email || '—'}
            </div>

            <div>
              <span className="font-semibold">
                Phone:
              </span>{' '}
              {profile?.phone || '—'}
            </div>

            <div>
              <span className="font-semibold">
                Role:
              </span>{' '}
              {profile?.role ? (profile.role === 'system_admin' ? 'System Administrator' : profile.role === 'hospital_admin' ? 'Hospital Administrator' : profile.role === 'doctor' ? 'Doctor' : profile.role === 'secretary' ? 'Secretary' : profile.role === 'patient' ? 'Patient' : profile.role) : '—'}
            </div>

            {/* <div>
              <span className="font-semibold">
                User ID:
              </span>{' '}
              {profile?.id}
            </div> */}

          </div>

        </div>

      </main>
    </div>
  )
}