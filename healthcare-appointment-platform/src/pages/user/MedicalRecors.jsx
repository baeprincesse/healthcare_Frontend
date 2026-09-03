import { Download, FileText, Pill, UploadCloud, Eye, CalendarDays, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../../services/api.js'

export default function MedicalRecords() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await api.get('/medical-records/patient')
        setRecords(res.data?.records || res.data?.data || [])
      } catch {
        setError('Unable to load medical records.')
        setRecords([])
      } finally {
        setLoading(false)
      }
    }
    fetchRecords()
  }, [])

  const prescriptions = records.filter((r) => r.prescription)
  const visits = records.filter((r) => r.diagnosis || r.treatment)

  return (
    <div className="mx-auto max-w-[1250px]">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold">My Medical Records</h1>
          <p className="mt-1 text-sm text-[#6E7B76]">Access and manage your health information securely.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
        <div className="overflow-hidden rounded-2xl border border-[#E7ECE9] bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-sm text-[#6E7B76]">Loading medical records...</div>
          ) : records.length === 0 ? (
            <div className="p-10 text-center text-sm text-[#6E7B76]">No medical records yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-[#F5F7F6] text-xs uppercase tracking-wide text-[#6E7B76]">
                  <tr>
                    <th className="px-5 py-4">Record</th>
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Doctor</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id} className="border-t border-[#E7ECE9]">
                      <td className="px-5 py-4 font-semibold">
                        <FileText size={16} className="mr-2 inline text-emerald-600" />
                        {r.diagnosis || `Record #${r.id}`}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          {r.prescription ? 'Prescription' : 'Visit'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#6E7B76]">
                        {r.appointment?.appointmentDate || new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <p>{r.doctor?.name || 'Doctor'}</p>
                        <p className="text-xs text-[#98A29D]">{r.doctor?.specialty || ''}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button className="rounded-lg border border-[#E7ECE9] p-2 hover:bg-emerald-50" title="View"><Eye size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm">
            <h2 className="font-bold">Record Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <Summary label="Total Records" value={records.length} />
              <Summary label="Visits" value={visits.length} />
              <Summary label="Prescriptions" value={prescriptions.length} />
            </div>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-5">
            <p className="font-bold text-emerald-800">Your data is secure</p>
            <p className="mt-2 text-xs leading-5 text-emerald-700">Your electronic medical records are kept organized so you can access them when needed.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Summary({ label, value }) {
  return <div className="flex items-center justify-between"><span className="text-[#6E7B76]">{label}</span><strong>{value}</strong></div>
}
