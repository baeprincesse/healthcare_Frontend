import RoleLayout from "../../components/layout/RoleLayout.jsx";
import { CalendarDays, FileText, Home, Users, ClipboardList } from "lucide-react";

export default function DoctorPage() {
  return (
    <RoleLayout
      role="Doctor"
      title="Doctor Portal"
      links={[
        { to: "/doctor/dashboard", label: "Dashboard", icon: Home },
        { to: "/doctor/appointments", label: "Appointments", icon: CalendarDays },
        { to: "/doctor/patients", label: "Patients", icon: Users },
        { to: "/doctor/records", label: "Medical Records", icon: FileText },
        { to: "/doctor/record-access", label: "Record Access", icon: ClipboardList },
      ]}
    />
  );
}
