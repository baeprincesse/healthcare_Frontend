import RoleLayout from "../../components/layout/RoleLayout.jsx";
import { CalendarDays, Home, Users } from "lucide-react";

export default function SecretaryPage() {
  return (
    <RoleLayout
      role="Secretary"
      title="Secretary Portal"
      links={[
        { to: "/secretary/dashboard", label: "Dashboard", icon: Home },
        { to: "/secretary/appointments", label: "Appointments", icon: CalendarDays },
        { to: "/secretary/patients", label: "Patients", icon: Users },
      ]}
    />
  );
}
