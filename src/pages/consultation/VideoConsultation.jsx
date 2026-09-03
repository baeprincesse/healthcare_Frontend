
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Video } from "lucide-react";
import api from "../../services/api.js";

export default function VideoConsultation() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadAppointment = async () => {
      try {
        const response = await api.get(`/appointments/${appointmentId}`);
        const data = response.data?.data;

        if (!data) {
          setError("Appointment not found.");
          setLoading(false);
          return;
        }

        if (
          data.consultationType !== "online" ||
          !data.jitsiRoomName
        ) {
          setError(
            "This appointment does not have an online consultation."
          );
          setLoading(false);
          return;
        }

        if (cancelled) return;

        setAppointment(data);
        setLoading(false);

        loadJitsiScript(
          data.jitsiRoomName,
          data.doctor?.name || "Doctor"
        );
      } catch (err) {
        if (cancelled) return;

        setError(
          err.response?.data?.message ||
            "Unable to load the consultation."
        );

        setLoading(false);
      }
    };

    const loadJitsiScript = (roomName, displayName) => {
      // Jitsi is already loaded
      if (window.JitsiMeetExternalAPI) {
        initJitsi(roomName, displayName);
        return;
      }

      // Check if another component/effect is already loading it
      const existingScript = document.querySelector(
        'script[data-jitsi-api="true"]'
      );

      if (existingScript) {
        existingScript.addEventListener("load", () => {
          if (!cancelled) {
            initJitsi(roomName, displayName);
          }
        });

        return;
      }

      const script = document.createElement("script");

      // IMPORTANT:
      // The URL must include https://
      script.src = "https://meet.jit.si/external_api.js";

      script.async = true;
      script.dataset.jitsiApi = "true";

      script.onload = () => {
        if (!cancelled) {
          initJitsi(roomName, displayName);
        }
      };

      script.onerror = () => {
        if (!cancelled) {
          setError(
            "Failed to load the Jitsi video consultation."
          );
        }
      };

      document.body.appendChild(script);
    };

    const initJitsi = (roomName, displayName) => {
      if (
        cancelled ||
        !jitsiContainerRef.current ||
        !window.JitsiMeetExternalAPI
      ) {
        return;
      }

      // Remove an existing Jitsi instance
      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
        } catch {
          // Ignore dispose errors
        }

        jitsiApiRef.current = null;
      }

      const domain = "meet.jit.si";

      jitsiApiRef.current =
        new window.JitsiMeetExternalAPI(domain, {
          roomName: roomName,
          parentNode: jitsiContainerRef.current,
          width: "100%",
          height: "100%",

          userInfo: {
            displayName: displayName,
          },

          configOverwrite: {
            prejoinPageEnabled: true,
          },

          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              "microphone",
              "camera",
              "closedcaptions",
              "desktop",
              "fullscreen",
              "fodeviceselection",
              "hangup",
              "chat",
              "settings",
              "raisehand",
            ],
          },
        });
    };

    loadAppointment();

    return () => {
      cancelled = true;

      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
        } catch {
          // Ignore
        }

        jitsiApiRef.current = null;
      }
    };
  }, [appointmentId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-dashed border-[#C9D4CF] bg-white p-10 text-center text-sm text-[#6E7B76]">
          Loading video consultation...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#6E7B76] hover:text-emerald-600"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6E7B76] hover:text-emerald-600"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="flex items-center gap-2 text-sm text-emerald-700">
          <Video size={16} />

          <span className="font-semibold">
            {appointment?.consultationType === "online"
              ? "Online Consultation"
              : "Consultation"}
          </span>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-[#E7ECE9] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div>
            <span className="text-[#6E7B76]">Doctor:</span>{" "}
            <span className="font-semibold">
              {appointment?.doctor?.name || "Doctor"}
            </span>
          </div>

          <div>
            <span className="text-[#6E7B76]">Date:</span>{" "}
            <span className="font-semibold">
              {appointment?.appointmentDate}
            </span>
          </div>

          <div>
            <span className="text-[#6E7B76]">Time:</span>{" "}
            <span className="font-semibold">
              {appointment?.appointmentTime}
            </span>
          </div>
        </div>
      </div>

      <div
        ref={jitsiContainerRef}
        className="overflow-hidden rounded-2xl border border-[#E7ECE9] bg-[#152420]"
        style={{
          height: "70vh",
          minHeight: "480px",
        }}
      />
    </div>
  );
}