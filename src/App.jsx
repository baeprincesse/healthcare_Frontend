import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

import ProtectedRoute from "./components/cards/ProtectedRoute.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import RoleProtectedRoute from "./components/RoleProtectedRoute.jsx";
import PatientLayout from "./components/layout/PatientLayout.jsx";
import SystemAdminLayout from "./components/layout/SystemAdminLayout.jsx";
import RoleLayout from "./components/layout/RoleLayout.jsx";

import LandingPage from "./pages/user/LandingPage.jsx";
import Login from "./pages/user/Login.jsx";
import Register from "./pages/user/Register.jsx";
import ForgotPasswordPage from "./pages/user/ForgotPasswordPage.jsx";
import Dashboard from "./pages/user/Dashboard.jsx";
import FindDoctor from "./pages/user/FindDoctor.jsx";
import BookAppointment from "./pages/user/BookAppointment.jsx";
import Appointments from "./pages/user/Appointments.jsx";
import MedicalRecords from "./pages/user/MedicalRecors.jsx";
import Profile from "./pages/user/Profile.jsx";
import HospitalDetails from "./pages/user/HospitalDetails.jsx";
import Prescription from "./pages/user/UserPrescription.jsx";
import Payment from "./pages/user/Payment.jsx";
import Notifications from "./pages/user/Notification.jsx";
import CreateHospital from "./pages/hospital/CreateHospital.jsx";

import PlatformAdminDashboard from "./pages/PlatformAdminDashboard.jsx";
import SystemAdminSimplePage from "./pages/systemadmin/SystemAdminSimplePage.jsx";
import { DoctorDashboard, SecretaryDashboard } from "./pages/role/RoleDashboards.jsx";
import { HospitalAdminDashboard } from "./pages/hospital/HospitalAdminDashboard.jsx";
import HospitalStaff from "./pages/hospital/HospitalStaff.jsx";
import HospitalAppointments from "./pages/hospital/HospitalAppointments.jsx";
import VideoConsultation from "./pages/consultation/VideoConsultation.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/fronted/healthcare-appointment-platform">
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPasswordPage />} />

          {/* Authenticated patient */}
          <Route element={<ProtectedRoute />}>
            <Route element={<PatientLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/find-doctor" element={<FindDoctor />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/appointments/book/:doctorId" element={<BookAppointment />} />
              <Route path="/medical-records" element={<MedicalRecords />} />
              <Route path="/prescriptions" element={<Prescription />} />
              <Route path="/payments" element={<Payment />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/create" element={<CreateHospital />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="/hospitals/:id" element={<HospitalDetails />} />
          </Route>

          {/* Video consultation - accessible to authenticated patient or doctor */}
          <Route element={<ProtectedRoute />}>
            <Route path="/video-consultation/:appointmentId" element={<VideoConsultation />} />
          </Route>

          {/* System Administrator */}
          <Route element={<AdminProtectedRoute />}>
            <Route element={<SystemAdminLayout />}>
              <Route path="/platform-admin/dashboard" element={<PlatformAdminDashboard />} />
              <Route
                path="/platform-admin/hospital-requests"
                element={<PlatformAdminDashboard />}
              />
              <Route
                path="/platform-admin/hospitals"
                element={<SystemAdminSimplePage section="hospitals" />}
              />
              <Route
                path="/platform-admin/users"
                element={<SystemAdminSimplePage section="users" />}
              />
              <Route
                path="/platform-admin/profile"
                element={<SystemAdminSimplePage section="profile" />}
              />
              <Route
                path="/platform-admin/settings"
                element={<SystemAdminSimplePage section="settings" />}
              />
            </Route>
          </Route>

          {/* Hospital administrator */}
          <Route element={<RoleProtectedRoute roles={["hospital_admin"]} />}>
            <Route element={<RoleLayout role="Hospital Administrator" title="Hospital Administration" links={[
              { to: "/hospital-admin/dashboard", label: "Dashboard", icon: HospitalAdminDashboardIcon },
              { to: "/hospital-admin/staff", label: "Staff", icon: UsersIcon },
              { to: "/hospital-admin/appointments", label: "Appointments", icon: CalendarIcon },
            ]} />}>
              <Route path="/hospital-admin/dashboard" element={<HospitalAdminDashboard />} />
              <Route path="/hospital-admin/staff" element={<HospitalStaff />} />
              <Route path="/hospital-admin/appointments" element={<HospitalAppointments />} />
            </Route>
          </Route>

          {/* Doctor */}
          <Route element={<RoleProtectedRoute roles={["doctor"]} />}>
            <Route element={<RoleLayout role="Doctor" title="Doctor Portal" links={[
              { to: "/doctor/dashboard", label: "Dashboard", icon: HospitalAdminDashboardIcon },
              { to: "/doctor/appointments", label: "Appointments", icon: CalendarIcon },
              { to: "/doctor/patients", label: "Patients", icon: UsersIcon },
            ]} />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/appointments" element={<SimpleRolePage title="Doctor Appointments" />} />
              <Route path="/doctor/patients" element={<SimpleRolePage title="Doctor Patients" />} />
            </Route>
          </Route>

          {/* Secretary */}
          <Route element={<RoleProtectedRoute roles={["secretary"]} />}>
            <Route element={<RoleLayout role="Secretary" title="Secretary Portal" links={[
              { to: "/secretary/dashboard", label: "Dashboard", icon: HospitalAdminDashboardIcon },
              { to: "/secretary/appointments", label: "Appointments", icon: CalendarIcon },
              { to: "/secretary/patients", label: "Patients", icon: UsersIcon },
            ]} />}>
              <Route path="/secretary/dashboard" element={<SecretaryDashboard />} />
              <Route path="/secretary/appointments" element={<SimpleRolePage title="Secretary Appointments" />} />
              <Route path="/secretary/patients" element={<SimpleRolePage title="Secretary Patients" />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function SimpleRolePage({ title }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-2 text-sm text-gray-500">
        This role-specific section is ready to be connected to the backend.
      </p>
    </div>
  );
}

// Small icon components kept here to avoid additional imports in App.jsx.
function HospitalAdminDashboardIcon(props) {
  return <span {...props}>📊</span>;
}
function UsersIcon(props) {
  return <span {...props}>👥</span>;
}
function CalendarIcon(props) {
  return <span {...props}>📅</span>;
}
