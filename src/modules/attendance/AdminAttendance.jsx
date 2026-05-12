import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import API from "../../api/axios";

// Helper function to format dates with correct timezone
const formatDate = (dateString) => {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return dateString;
    
    // Format in local timezone (will automatically handle IST)
    return date.toLocaleDateString('en-CA', { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
  } catch (error) {
    return dateString;
  }
};

const formatTime = (dateString) => {
  if (!dateString) return "-";

  try {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return dateString;
  }
};

const AdminAttendance = () => {

  const [attendance, setAttendance] = useState([]);

  const fetchAttendance = async () => {

    try {

      const response = await API.get("/attendance/all");
      
      // Sort by date (newest first) based on local timezone
      const sortedData = [...response.data].sort((a, b) => {
        const dateA = new Date(a.attendance_date);
        const dateB = new Date(b.attendance_date);
        return dateB - dateA;
      });
      
      setAttendance(sortedData);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const presentCount = attendance.filter(item => item.punch_in).length;

  return (

    <DashboardLayout>

      <div className="min-h-screen bg-[#f4f8ff] p-6">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-[#1e3a8a]">
            Attendance Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Employee attendance records
          </p>

        </div>


        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-5">

            <p className="text-gray-500 text-sm">
              Total Present
            </p>

            <h2 className="text-4xl font-bold text-blue-600 mt-2">
              {presentCount}
            </h2>

          </div>

        </div>


        {/* TABLE */}

        <div className="bg-white rounded-3xl shadow-lg border border-blue-100 overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px]">

              <thead className="bg-blue-600 text-white">

                <tr>

                  <th className="p-4 text-left font-semibold">
                    Employee
                  </th>

                  <th className="p-4 text-left font-semibold">
                    Date
                  </th>

                  <th className="p-4 text-left font-semibold">
                    Punch In
                  </th>

                  <th className="p-4 text-left font-semibold">
                    Punch Out
                  </th>

                  <th className="p-4 text-left font-semibold">
                    Location
                  </th>

                  <th className="p-4 text-left font-semibold">
                    Work Hours
                  </th>

                  <th className="p-4 text-left font-semibold">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {attendance.map(
                  (item, index) => (

                    <tr
                      key={item.id || index}
                      className={`border-b hover:bg-blue-50 transition ${
                        index % 2 === 0
                          ? "bg-white"
                          : "bg-blue-50/20"
                      }`}
                    >

                      {/* EMPLOYEE */}

                      <td className="p-4">

                        <div>

                          <p className="font-semibold text-gray-800">
                            {item.name || item.employee_name || "N/A"}
                          </p>

                          <p className="text-xs text-gray-500">
                            {item.department || item.department_name || "N/A"}
                          </p>

                        </div>

                       </td>


                      {/* DATE - FIXED WITH TIMEZONE */}

                      <td className="p-4 text-sm text-gray-700">

                        {formatDate(item.attendance_date)}

                       </td>


                      {/* PUNCH IN */}

                      <td className="p-4">

                        <div className="flex items-center gap-3">

                          {item.punch_in_selfie ? (

                            <img
src={`${import.meta.env.VITE_API_URL}/uploads/attendance/${item.punch_in_selfie}`}
alt="Punch In Selfie"
                              className="w-14 h-14 rounded-xl object-cover border"
                            />

                          ) : (

                            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-400">

                              No Img

                            </div>

                          )}

                          <div>

                            <p className="text-sm font-semibold text-green-600">

                              {formatTime(item.punch_in)}

                            </p>

                            <p className="text-xs text-gray-500">
                              Punch In
                            </p>

                          </div>

                        </div>

                       </td>


                      {/* PUNCH OUT */}

                      <td className="p-4">

                        <div className="flex items-center gap-3">

                          {item.punch_out_selfie ? (

                            <img
src={`${import.meta.env.VITE_API_URL}/uploads/attendance/${item.punch_out_selfie}`}                              alt="Punch Out Selfie"
                              className="w-14 h-14 rounded-xl object-cover border"
                            />

                          ) : (

                            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-400">

                              No Img

                            </div>

                          )}

                          <div>

                            <p className="text-sm font-semibold text-red-500">

                              {formatTime(item.punch_out)}

                            </p>

                            <p className="text-xs text-gray-500">
                              Punch Out
                            </p>

                          </div>

                        </div>

                       </td>


                      {/* LOCATION */}

                      <td className="p-4 text-sm text-gray-700">

                        <div className="space-y-1">

                          <p>
                            <span className="font-semibold">
                              Lat:
                            </span>
                            {" "}
                            {
                              item.punch_in_latitude || item.latitude || "-"
                            }
                          </p>

                          <p>
                            <span className="font-semibold">
                              Long:
                            </span>
                            {" "}
                            {
                              item.punch_in_longitude || item.longitude || "-"
                            }
                          </p>

                        </div>

                       </td>


                      {/* WORK HOURS */}

                      <td className="p-4">

                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">

                          {item.work_hours || "0"} hrs

                        </span>

                       </td>


                      {/* STATUS - FIXED */}

                      <td className="p-4">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.punch_in
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >

                          {item.punch_in 
                          ? "Present"
                          : "Absent"}

                        </span>

                       </td>

                     </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </DashboardLayout>

  );
};

export default AdminAttendance;