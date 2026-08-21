// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";

// import LandingPage from "./pages/LandingPage.jsx";
// import Login from "./pages/Login.jsx";
// import Register from "./pages/Register.jsx";
// import Dashboard from "./pages/Dashboard.jsx";
// // import Hospitals from "./pages/Hospitals.jsx";
// import HospitalDetails from "./pages/HospitalDetails.jsx";
// import BookAppointment from "./pages/BookAppointment.jsx";
// import Appointments from "./pages/Appointments.jsx";
// import Profile from "./pages/Profile.jsx";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
// import FindDoctor from "./pages/FindDoctor.jsx";

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter basename="/fronted/healthcare-appointment-platform">
//         <Routes>
//           {/* Public routes */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/forgotpassword" element={<ForgotPasswordPage />} />

//           {/* Protected routes */}
//           {/* <Route element={<ProtectedRoute />}> */}
//             <Route path="/dashboard" element={<Dashboard />} />
//             {/* <Route path="/hospitals" element={<Hospitals />} /> */}
//             <Route path="/hospitals/:id"element={<HospitalDetails />}/>
//             <Route path="/find-doctor" element={<FindDoctor />} />
//             <Route path="/appointments" element={<Appointments />} />

//             <Route path="/appointments/book/:hospitalId" element={<BookAppointment />}/>

//             <Route path="/profile" element={<Profile />} />
//           {/* </Route> */}

//           {/* Fallback */}
//           <Route
//             path="*"
//             element={<Navigate to="/" replace />}
//           />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PatientLayout from './components/PatientLayout.jsx'

import LandingPage from './pages/LandingPage.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import FindDoctor from './pages/FindDoctor.jsx'
import BookAppointment from './pages/BookAppointment.jsx'
import Appointments from './pages/Appointments.jsx'
import MedicalRecords from './pages/MedicalRecors.jsx'
import Profile from './pages/Profile.jsx'
import HospitalDetails from './pages/HospitalDetails.jsx'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/fronted/healthcare-appointment-platform">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPasswordPage />} />

          {/* <Route element={<ProtectedRoute />}> */}
            <Route element={<PatientLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/find-doctor" element={<FindDoctor />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/appointments/book/:doctorId" element={<BookAppointment />} />
              <Route path="/medical-records" element={<MedicalRecords />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/hospitals/:id" element={<HospitalDetails />} />
          {/* </Route> */}

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

