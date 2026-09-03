import RoleLayout from "../../components/layout/RoleLayout.jsx";
import { CalendarDays, Home, Users, Hospital } from "lucide-react";

export default function HospitalAdminPage() {
  return (
    <RoleLayout
      role="Hospital Administrator"
      title="Hospital Administration"
      links={[
        { to: "/hospital-admin/dashboard", label: "Dashboard", icon: Home },
        { to: "/hospital-admin/staff", label: "Staff", icon: Users },
        { to: "/hospital-admin/appointments", label: "Appointments", icon: CalendarDays },
        { to: "/hospital-admin/hospital", label: "Hospital", icon: Hospital },
      ]}
    />
  );
}
