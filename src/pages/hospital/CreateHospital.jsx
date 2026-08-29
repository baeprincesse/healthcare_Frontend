
import { useEffect, useState } from "react";
import {
  Hospital,
  MapPin,
  Phone,
  Plus,
  Trash2,
  Building2,
  FileText,
  CheckCircle2,
  Clock3,
  ArrowLeft,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api.js";

export default function CreateHospital() {
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [loading, setLoading] = useState(false);
  const [checkingHospital, setCheckingHospital] = useState(true);
  const [error, setError] = useState("");

  const [hospital, setHospital] = useState(null);

  const [form, setForm] = useState({
    name: "",
    type: "",
    description: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    region: "",
    registrationNumber: "",
  });

  const [departments, setDepartments] = useState([
    {
      name: "",
      description: "",
    },
  ]);

  // ==========================================
  // CHECK IF USER ALREADY HAS A HOSPITAL
  // ==========================================

  useEffect(() => {
    checkMyHospital();
  }, []);

  const checkMyHospital = async () => {
    try {
      setCheckingHospital(true);
      setError("");

      const response = await api.get(
        "/hospitals/my-hospital"
      );

      console.log(
        "My hospital:",
        response.data
      );

      if (response.data.exists) {
        setHospital(response.data.hospital);
      } else {
        setHospital(null);
      }

    } catch (error) {
      console.error(
        "Error checking hospital:",
        error
      );

      // If the token is invalid/expired
      if (error.response?.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to check your hospital status."
        );
      }

    } finally {
      setCheckingHospital(false);
    }
  };

  // ==========================================
  // HANDLE FORM INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // DEPARTMENT FUNCTIONS
  // ==========================================

  const addDepartment = () => {
    setDepartments((prev) => [
      ...prev,
      {
        name: "",
        description: "",
      },
    ]);
  };

  const removeDepartment = (index) => {
    if (departments.length === 1) {
      return;
    }

    setDepartments((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleDepartmentChange = (
    index,
    field,
    value
  ) => {
    setDepartments((prev) =>
      prev.map((department, i) =>
        i === index
          ? {
              ...department,
              [field]: value,
            }
          : department
      )
    );
  };

  // ==========================================
  // CREATE HOSPITAL
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // --------------------------------------
      // Validate department
      // --------------------------------------

      const validDepartments =
        departments.filter(
          (department) =>
            department.name.trim() !== ""
        );

      if (validDepartments.length === 0) {
        setError(
          "Please add at least one hospital department."
        );

        setLoading(false);
        return;
      }

      // --------------------------------------
      // Data sent to backend
      // --------------------------------------
      //
      // IMPORTANT:
      // We DO NOT send createdBy.
      //
      // The backend gets the user ID from:
      //
      // req.user.id
      //
      // --------------------------------------

      const hospitalData = {
        name: form.name,
        address: form.address,
        phone: form.phone,
        email: form.email,
        description: form.description,

        // These are currently not in your
        // Hospital model, so they are not sent
        // until we add columns for them.
      };

      console.log(
        "Creating hospital:",
        hospitalData
      );

      const response = await api.post(
        "/hospitals/create",
        hospitalData
      );

      console.log(
        "Hospital created:",
        response.data
      );

      // --------------------------------------
      // Save returned hospital
      // --------------------------------------

      if (response.data.hospital) {
        setHospital(
          response.data.hospital
        );
      }

    } catch (error) {
      console.error(
        "Hospital creation error:",
        error
      );

      if (error.response?.status === 401) {
        setError(
          "You are not logged in. Please login again."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to create hospital."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (checkingHospital) {
    return (
      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-5">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />

          <p className="mt-4 text-sm font-medium text-[#6E7B76]">
            Checking your hospital status...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // ERROR SCREEN
  // ==========================================

  if (
    error &&
    !hospital
  ) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-3xl items-center justify-center px-5">

        <div className="w-full rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm sm:p-12">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">

            <XCircle
              size={40}
              className="text-red-500"
            />

          </div>

          <h1 className="mt-6 text-2xl font-extrabold text-[#152420]">
            Something went wrong
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#6E7B76]">
            {error}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <button
              type="button"
              onClick={checkMyHospital}
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              Try Again
            </button>

            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E0E7E3] px-6 py-3 text-sm font-semibold text-[#152420] transition hover:bg-[#F5F7F6]"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // PENDING HOSPITAL
  // ==========================================

  if (
    hospital &&
    hospital.status === "pending"
  ) {
    return (
      <PendingHospital
        hospital={hospital}
      />
    );
  }

  // ==========================================
  // APPROVED HOSPITAL
  // ==========================================

  if (
    hospital &&
    hospital.status === "approved"
  ) {
    return (
      <ApprovedHospital
        hospital={hospital}
        navigate={navigate}
      />
    );
  }

  // ==========================================
  // REJECTED HOSPITAL
  // ==========================================

  if (
    hospital &&
    hospital.status === "rejected"
  ) {
    return (
      <RejectedHospital
        hospital={hospital}
      />
    );
  }

  // ==========================================
  // CREATE HOSPITAL FORM
  // ==========================================

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-8">

        <Link
          to="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#6E7B76] transition hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="flex items-start gap-4">

          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <Hospital size={28} />
          </div>

          <div>

            <h1 className="text-2xl font-extrabold tracking-tight text-[#152420] sm:text-3xl">
              Create a Hospital
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#6E7B76]">
              Register your hospital on MediCare.
              Your request will be reviewed by the
              platform administrator before the hospital
              becomes active.
            </p>

          </div>

        </div>

      </div>

      {/* ======================================
          ERROR MESSAGE
      ====================================== */}

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">

          <XCircle
            size={21}
            className="mt-0.5 flex-shrink-0 text-red-500"
          />

          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

        </div>
      )}

      {/* ======================================
          INFORMATION
      ====================================== */}

      <div className="mb-6 flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">

        <ShieldCheck
          size={22}
          className="mt-0.5 flex-shrink-0 text-emerald-600"
        />

        <div>

          <p className="text-sm font-bold text-emerald-800">
            Verification required
          </p>

          <p className="mt-1 text-xs leading-5 text-emerald-700">
            After submission, your hospital will be
            reviewed by the platform administrator.
            You will not need to submit the form again
            while your request is being reviewed.
          </p>

        </div>

      </div>

      {/* ======================================
          FORM
      ====================================== */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* ====================================
            HOSPITAL INFORMATION
        ==================================== */}

        <section className="rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm sm:p-7">

          <SectionHeader
            icon={Building2}
            title="Hospital Information"
            description="Provide the basic information about your hospital."
          />

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <Input
              label="Hospital Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. MediCare General Hospital"
              required
            />

            <div>

              <label className="text-sm font-semibold text-[#152420]">
                Hospital Type
              </label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border border-[#E0E7E3] bg-[#F8FAF9] px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              >

                <option value="">
                  Select hospital type
                </option>

                <option value="general">
                  General Hospital
                </option>

                <option value="private">
                  Private Hospital
                </option>

                <option value="clinic">
                  Clinic
                </option>

                <option value="specialized">
                  Specialized Hospital
                </option>

                <option value="medical_center">
                  Medical Center
                </option>

              </select>

            </div>

            <div className="md:col-span-2">

              <label className="text-sm font-semibold text-[#152420]">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your hospital and the healthcare services it provides..."
                className="mt-2 w-full resize-none rounded-xl border border-[#E0E7E3] bg-[#F8FAF9] px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />

            </div>

          </div>

        </section>

        {/* ====================================
            CONTACT INFORMATION
        ==================================== */}

        <section className="rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm sm:p-7">

          <SectionHeader
            icon={Phone}
            title="Contact Information"
            description="How patients and the platform can contact the hospital."
          />

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <Input
              label="Hospital Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="hospital@example.com"
              required
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+237 6XX XXX XXX"
              required
            />

            <Input
              label="Website"
              name="website"
              type="url"
              value={form.website}
              onChange={handleChange}
              placeholder="https://example.com"
              optional
            />

          </div>

        </section>

        {/* ====================================
            LOCATION
        ==================================== */}

        <section className="rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm sm:p-7">

          <SectionHeader
            icon={MapPin}
            title="Hospital Location"
            description="Provide the physical location of the hospital."
          />

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <div className="md:col-span-2">

              <Input
                label="Street Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="e.g. 25 Independence Avenue"
                required
              />

            </div>

            <Input
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="e.g. Yaoundé"
              required
            />

            <Input
              label="Region"
              name="region"
              value={form.region}
              onChange={handleChange}
              placeholder="e.g. Centre"
              required
            />

          </div>

        </section>

        {/* ====================================
            DEPARTMENTS
        ==================================== */}

        <section className="rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm sm:p-7">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

            <SectionHeader
              icon={Hospital}
              title="Hospital Departments"
              description="Add the departments available in your hospital."
            />

            <button
              type="button"
              onClick={addDepartment}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              <Plus size={17} />
              Add Department
            </button>

          </div>

          <div className="mt-6 space-y-4">

            {departments.map(
              (department, index) => (

                <div
                  key={index}
                  className="rounded-2xl border border-[#E7ECE9] bg-[#F8FAF9] p-4 sm:p-5"
                >

                  <div className="mb-4 flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-700">
                        {index + 1}
                      </div>

                      <p className="text-sm font-bold text-[#152420]">
                        Department {index + 1}
                      </p>

                    </div>

                    {departments.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeDepartment(index)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50"
                        title="Remove department"
                      >
                        <Trash2 size={17} />
                      </button>
                    )}

                  </div>

                  <div className="grid gap-4 md:grid-cols-2">

                    <div>

                      <label className="text-sm font-semibold text-[#152420]">
                        Department Name
                      </label>

                      <input
                        required
                        type="text"
                        value={department.name}
                        onChange={(e) =>
                          handleDepartmentChange(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="e.g. Cardiology"
                        className="mt-2 w-full rounded-xl border border-[#E0E7E3] bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />

                    </div>

                    <div>

                      <label className="text-sm font-semibold text-[#152420]">
                        Description
                      </label>

                      <input
                        type="text"
                        value={
                          department.description
                        }
                        onChange={(e) =>
                          handleDepartmentChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="e.g. Heart and cardiovascular care"
                        className="mt-2 w-full rounded-xl border border-[#E0E7E3] bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

          <p className="mt-4 text-xs text-[#6E7B76]">
            You can add as many departments as your
            hospital provides.
          </p>

        </section>

        {/* ====================================
            VERIFICATION
        ==================================== */}

        <section className="rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm sm:p-7">

          <SectionHeader
            icon={FileText}
            title="Verification Information"
            description="This information will help administrators verify your hospital."
          />

          <div className="mt-6">

            <Input
              label="Hospital Registration / Authorization Number"
              name="registrationNumber"
              value={form.registrationNumber}
              onChange={handleChange}
              placeholder="Enter registration or authorization number"
              required
            />

          </div>

        </section>

        {/* ====================================
            SUBMIT
        ==================================== */}

        <div className="rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm sm:p-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="font-bold text-[#152420]">
                Ready to submit?
              </p>

              <p className="mt-1 max-w-xl text-xs leading-5 text-[#6E7B76]">
                By submitting this request, you confirm
                that the information provided is accurate.
                Your hospital will remain pending until
                reviewed by the platform administrator.
              </p>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Submit for Review
                </>
              )}

            </button>

          </div>

        </div>

      </form>

    </div>
  );
}


// ==================================================
// PENDING HOSPITAL COMPONENT
// ==================================================

function PendingHospital({ hospital }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-3xl items-center justify-center px-5">

      <div className="w-full rounded-3xl border border-[#E7ECE9] bg-white p-8 text-center shadow-sm sm:p-12">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">

          <Clock3
            size={40}
            className="text-amber-500"
          />

        </div>

        <h1 className="mt-6 text-2xl font-extrabold text-[#152420] sm:text-3xl">
          Hospital Creation Pending
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#6E7B76]">

          Your hospital registration request has been
          successfully submitted. Our platform
          administrator will review the information
          before the hospital becomes active.

        </p>

        {/* Hospital name */}

        <div className="mx-auto mt-5 max-w-md rounded-xl bg-[#F5F7F6] p-4">

          <p className="text-xs font-medium text-[#6E7B76]">
            Hospital
          </p>

          <p className="mt-1 text-sm font-bold text-[#152420]">
            {hospital.name}
          </p>

        </div>

        {/* Status */}

        <div className="mx-auto mt-6 flex max-w-md items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-left">

          <Clock3
            size={22}
            className="flex-shrink-0 text-amber-600"
          />

          <div>

            <p className="text-sm font-bold text-amber-800">
              Status: Pending Review
            </p>

            <p className="mt-1 text-xs text-amber-700">
              Your request is waiting for verification
              by the platform administrator.
            </p>

          </div>

        </div>

        {/* What happens next */}

        <div className="mt-8 rounded-2xl bg-[#F5F7F6] p-5 text-left">

          <h2 className="font-bold text-[#152420]">
            What happens next?
          </h2>

          <div className="mt-4 space-y-4">

            <StatusStep
              number="1"
              title="Request submitted"
              description="Your hospital information has been received."
              completed
            />

            <StatusStep
              number="2"
              title="Verification"
              description="A platform administrator will verify your hospital information."
            />

            <StatusStep
              number="3"
              title="Hospital approval"
              description="Once approved, your hospital account will become active."
            />

          </div>

        </div>

        <div className="mt-8">

          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

        </div>

      </div>

    </div>
  );
}


// ==================================================
// APPROVED HOSPITAL COMPONENT
// ==================================================

function ApprovedHospital({
  hospital,
  navigate,
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-3xl items-center justify-center px-5">

      <div className="w-full rounded-3xl border border-[#E7ECE9] bg-white p-8 text-center shadow-sm sm:p-12">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">

          <CheckCircle2
            size={42}
            className="text-emerald-600"
          />

        </div>

        <h1 className="mt-6 text-2xl font-extrabold text-[#152420] sm:text-3xl">
          Hospital Approved
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#6E7B76]">

          Your hospital has been approved by the
          platform administrator. You can now manage
          your hospital.

        </p>

        <div className="mx-auto mt-6 max-w-md rounded-2xl bg-emerald-50 p-5">

          <p className="text-xs text-emerald-700">
            Hospital
          </p>

          <p className="mt-1 text-lg font-bold text-emerald-900">
            {hospital.name}
          </p>

          <p className="mt-2 text-xs text-emerald-700">
            Status: Approved
          </p>

        </div>

        <div className="mt-8">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/hospital-admin/dashboard"
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            Go to Hospital Admin Dashboard
          </button>

        </div>

      </div>

    </div>
  );
}


// ==================================================
// REJECTED HOSPITAL COMPONENT
// ==================================================

function RejectedHospital({ hospital }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-3xl items-center justify-center px-5">

      <div className="w-full rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm sm:p-12">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">

          <XCircle
            size={42}
            className="text-red-500"
          />

        </div>

        <h1 className="mt-6 text-2xl font-extrabold text-[#152420] sm:text-3xl">
          Hospital Request Rejected
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#6E7B76]">

          Unfortunately, your hospital registration
          request was not approved by the platform
          administrator.

        </p>

        <div className="mx-auto mt-6 max-w-md rounded-2xl bg-red-50 p-5">

          <p className="text-xs text-red-600">
            Hospital
          </p>

          <p className="mt-1 text-lg font-bold text-red-900">
            {hospital.name}
          </p>

          <p className="mt-2 text-xs text-red-700">
            Status: Rejected
          </p>

        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

        </div>

      </div>

    </div>
  );
}


// ==================================================
// INPUT COMPONENT
// ==================================================

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  optional = false,
}) {
  return (
    <div>

      <label className="text-sm font-semibold text-[#152420]">

        {label}

        {optional && (
          <span className="ml-1 text-xs font-normal text-[#98A29D]">
            (optional)
          </span>
        )}

      </label>

      <input
        required={required}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-[#E0E7E3] bg-[#F8FAF9] px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
      />

    </div>
  );
}


// ==================================================
// SECTION HEADER
// ==================================================

function SectionHeader({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

        <Icon size={20} />

      </div>

      <div>

        <h2 className="font-bold text-[#152420]">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-[#6E7B76]">
          {description}
        </p>

      </div>

    </div>
  );
}


// ==================================================
// STATUS STEP
// ==================================================

function StatusStep({
  number,
  title,
  description,
  completed = false,
}) {
  return (
    <div className="flex gap-3">

      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          completed
            ? "bg-emerald-600 text-white"
            : "bg-white text-[#6E7B76] ring-1 ring-[#DDE5E1]"
        }`}
      >

        {completed ? (
          <CheckCircle2 size={16} />
        ) : (
          number
        )}

      </div>

      <div>

        <p className="text-sm font-semibold text-[#152420]">
          {title}
        </p>

        <p className="mt-0.5 text-xs leading-5 text-[#6E7B76]">
          {description}
        </p>

      </div>

    </div>
  );
}
