import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import AttendanceCapture from "./AttendanceCapture";

const Attendance = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ---------------- CLOSE ON ESC KEY ----------------
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f4f8ff] p-8 overflow-hidden">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#1e3a8a]">
            Attendance
          </h1>
          <p className="text-gray-500 mt-2">
            Mark your daily attendance
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-3xl shadow-lg p-10 max-w-[500px] border border-blue-100">
          <div className="flex flex-col items-center">

            <div className="w-[120px] h-[120px] rounded-full bg-blue-100 flex items-center justify-center text-5xl mb-6">
              📸
            </div>

            <h2 className="text-3xl font-bold text-[#1e3a8a]">
              Attendance Capture
            </h2>

            <p className="text-gray-500 mt-3 text-center">
              Capture selfie and location to mark attendance
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition"
            >
              Mark Attendance
            </button>

          </div>
        </div>

        {/* MODAL */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">

              {/* HEADER */}
              <div className="sticky top-0 bg-white border-b rounded-t-3xl p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#1e3a8a]">
                  Mark Attendance
                </h2>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-6">
                <AttendanceCapture onClose={() => setIsModalOpen(false)} />
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Attendance;