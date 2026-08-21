import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Hospital,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react'

export default function CreateHospital() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    registrationNumber: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Cameroon',
    website: '',
    description: '',
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    try {
      // Backend connection will be added here later
      console.log('Hospital data:', form)

      // Simulate submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert('Hospital created successfully!')

      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      alert('Something went wrong while creating the hospital.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">

      {/* ================= HEADER ================= */}
      <div className="mb-6 flex items-center justify-between">

        <div>
          <button
            onClick={() => navigate(-1)}
            className="mb-3 flex items-center gap-2 text-sm text-gray-500 transition hover:text-emerald-600"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <Hospital size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#152420]">
                Create Hospital
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Register a hospital on the MediCare platform.
              </p>
            </div>

          </div>
        </div>

      </div>


      {/* ================= INFORMATION CARD ================= */}

      <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">

        <div className="flex gap-3">

          <CheckCircle
            size={20}
            className="mt-0.5 flex-shrink-0 text-emerald-600"
          />

          <div>
            <h3 className="text-sm font-semibold text-emerald-800">
              Hospital registration
            </h3>

            <p className="mt-1 text-xs leading-5 text-emerald-700">
              Provide accurate information about the hospital. After
              registration, the hospital administrator can manage doctors,
              secretaries, appointments and other hospital activities.
            </p>
          </div>

        </div>

      </div>


      {/* ================= FORM ================= */}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#E7ECE9] bg-white p-6 shadow-sm sm:p-8"
      >

        {/* ================= BASIC INFORMATION ================= */}

        <div className="mb-8">

          <h2 className="text-lg font-semibold text-[#152420]">
            Hospital Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter the basic information of the hospital.
          </p>

        </div>


        <div className="grid gap-5 md:grid-cols-2">

          {/* Hospital Name */}
          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Hospital Name
            </label>

            <div className="relative">

              <Hospital
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                required
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter hospital name"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />

            </div>

          </div>


          {/* Registration Number */}
          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Registration Number
            </label>

            <input
              required
              type="text"
              name="registrationNumber"
              value={form.registrationNumber}
              onChange={handleChange}
              placeholder="Hospital registration number"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />

          </div>


          {/* Email */}
          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Hospital Email
            </label>

            <div className="relative">

              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="hospital@example.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />

            </div>

          </div>


          {/* Phone */}
          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Phone Number
            </label>

            <div className="relative">

              <Phone
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                required
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+237 6XX XXX XXX"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />

            </div>

          </div>


          {/* Website */}
          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Website
              <span className="ml-1 text-xs text-gray-400">
                (optional)
              </span>
            </label>

            <div className="relative">

              <Globe
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="url"
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />

            </div>

          </div>

        </div>


        {/* ================= LOCATION ================= */}

        <div className="my-8 border-t border-gray-100 pt-8">

          <h2 className="text-lg font-semibold text-[#152420]">
            Hospital Location
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Provide the location where patients can find the hospital.
          </p>

        </div>


        <div className="grid gap-5 md:grid-cols-2">

          {/* Address */}
          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Address
            </label>

            <div className="relative">

              <MapPin
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                required
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Street, neighborhood, quarter..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />

            </div>

          </div>


          {/* City */}
          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              City
            </label>

            <input
              required
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Yaoundé"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />

          </div>


          {/* Country */}
          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Country
            </label>

            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            >
              <option value="Cameroon">Cameroon</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Gabon">Gabon</option>
              <option value="Chad">Chad</option>
              <option value="Other">Other</option>
            </select>

          </div>

        </div>


        {/* ================= DESCRIPTION ================= */}

        <div className="my-8 border-t border-gray-100 pt-8">

          <h2 className="text-lg font-semibold text-[#152420]">
            Additional Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Give patients some information about the hospital.
          </p>

        </div>


        <div>

          <label className="mb-2 block text-sm font-medium text-gray-700">
            Description
          </label>

          <div className="relative">

            <FileText
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe the hospital, its services, specialties, etc."
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />

          </div>

        </div>


        {/* ================= BUTTONS ================= */}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating Hospital...' : 'Create Hospital'}
          </button>

        </div>

      </form>

    </div>
  )
}