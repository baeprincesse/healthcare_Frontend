import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";

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
import ResetPassword from "./pages/user/ResetPassword.jsx";
import Dashboard from "./pages/user/Dashboard.jsx";
import FindDoctor from "./pages/user/FindDoctor.jsx";
import BookAppointment from "./pages/user/BookAppointment.jsx";
import Appointments from "./pages/user/Appointments.jsx";
import MedicalRecords from "./pages/user/MedicalRecors.jsx";
import PatientMedicalRecordsPage from "./pages/PatientMedicalRecordsPage.jsx";
import DoctorMedicalRecordsPage from "./pages/DoctorMedicalRecordsPage.jsx";
import DoctorRecordAccessPage from "./pages/DoctorRecordAccessPage.jsx";
import DoctorAppointmentsPage from "./pages/DoctorAppointmentsPage.jsx";
import DoctorPatientsPage from "./pages/DoctorPatientsPage.jsx";
import MedicalRecordAccessPage from "./services/MedicalRecordAccessPage.jsx";
import PendingDoctorsPage from "./pages/PendingDoctorsPage.jsx";
import Profile from "./pages/user/Profile.jsx";
import HospitalDetails from "./pages/user/HospitalDetails.jsx";
import Prescription from "./pages/user/UserPrescription.jsx";
import Payment from "./pages/user/Payment.jsx";
import Notifications from "./pages/user/Notification.jsx";
import AiHealthAssistant from "./pages/user/AiHealthAssistant.jsx";
import DoctorProfile from "./pages/user/DoctorProfile.jsx";
import Settings from "./pages/user/Settings.jsx";
import CreateHospital from "./pages/hospital/CreateHospital.jsx";

import PlatformAdminDashboard from "./pages/PlatformAdminDashboard.jsx";
import SystemAdminSimplePage from "./pages/systemadmin/SystemAdminSimplePage.jsx";
import { DoctorDashboard } from "./pages/role/RoleDashboards.jsx";
import { HospitalAdminDashboard } from "./pages/hospital/HospitalAdminDashboard.jsx";
import HospitalStaff from "./pages/hospital/HospitalStaff.jsx";
import HospitalAppointments from "./pages/hospital/HospitalAppointments.jsx";
import VideoConsultation from "./pages/consultation/VideoConsultation.jsx";
import OnSiteConsultation from "./pages/consultation/OnSiteConsultation.jsx";

import { CalendarDays, Home, Stethoscope, Users, FileText, ShieldCheck } from "lucide-react";

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter basename="/fronted/healthcare-appointment-platform">
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Authenticated patient */}
          <Route element={<ProtectedRoute />}>
            <Route element={<PatientLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/find-doctor" element={<FindDoctor />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/appointments/book/:doctorId" element={<BookAppointment />} />
              <Route path="/doctors/:doctorId" element={<DoctorProfile />} />
              <Route path="/medical-records" element={<PatientMedicalRecordsPage />} />
              <Route path="/medical-record-access" element={<MedicalRecordAccessPage />} />
              <Route path="/medical-record-access-requests" element={<MedicalRecordAccessPage />} />
              <Route path="/prescriptions" element={<Prescription />} />
              <Route path="/payments" element={<Payment />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/ai-health-assistant" element={<AiHealthAssistant />} />
              <Route path="/create" element={<CreateHospital />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="/hospitals/:id" element={<HospitalDetails />} />
          </Route>

          {/* Video consultation - accessible to authenticated patient or doctor */}
          <Route element={<ProtectedRoute />}>
            <Route path="/video-consultation/:appointmentId" element={<VideoConsultation />} />
            <Route path="/onsite-consultation/:appointmentId" element={<OnSiteConsultation />} />
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
                path="/platform-admin/pending-doctors"
                element={<PendingDoctorsPage />}
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
          <Route element={<RoleProtectedRoute roles={["HEAD_ADMINISTRATOR"]} />}>
            <Route element={<RoleLayout role="Hospital Administrator" title="Hospital Administration" links={[
              { to: "/hospital-admin/dashboard", label: "Dashboard", icon: Home },
              { to: "/hospital-admin/staff", label: "Staff", icon: Users },
              { to: "/hospital-admin/appointments", label: "Appointments", icon: CalendarDays },
            ]} />}>
              <Route path="/hospital-admin/dashboard" element={<HospitalAdminDashboard />} />
              <Route path="/hospital-admin/staff" element={<HospitalStaff />} />
              <Route path="/hospital-admin/appointments" element={<HospitalAppointments />} />
            </Route>
          </Route>

          {/* Doctor */}
          <Route element={<RoleProtectedRoute roles={["DOCTOR"]} />}>
            <Route element={<RoleLayout role="Doctor" title="Doctor Portal" links={[
              { to: "/doctor/dashboard", label: "Dashboard", icon: Home },
              { to: "/doctor/appointments", label: "Appointments", icon: CalendarDays },
              { to: "/doctor/patients", label: "Patients", icon: Users },
              { to: "/doctor/medical-records", label: "Medical Records", icon: FileText },
              { to: "/doctor/record-access", label: "Record Access", icon: ShieldCheck },
            ]} />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
              <Route path="/doctor/patients" element={<DoctorPatientsPage />} />
              <Route path="/doctor/medical-records" element={<DoctorMedicalRecordsPage />} />
              <Route path="/doctor/record-access" element={<DoctorRecordAccessPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
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
