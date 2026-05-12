import { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../api/axios";

const IMAGE_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "");

// Helper: determine if file is a PDF by extension
const isPDF = (filename) => {
  if (!filename) return false;
  return filename.toLowerCase().endsWith(".pdf");
};
 console.log(import.meta.env.VITE_API_URL)
const AdminLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState({});
  const [openMenu, setOpenMenu] = useState(null);

  // FETCH LEAVES
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await API.get("/leaves/all");
      setLeaves(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      const comment = comments[id] || "";
      const response = await API.put(`/leaves/update-status/${id}`, {
        status,
        admin_comment: comment,
      });
      alert(response.data.message);
      fetchLeaves();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f4f9ff] p-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0f172a]">
              Leave Approval Panel
            </h1>
            <p className="text-gray-500 mt-1">
              Manage employee leave requests
            </p>
          </div>
          <button
            onClick={fetchLeaves}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-md transition"
          >
            Refresh Data
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
            <p className="text-gray-500 text-sm">Total Leaves</p>
            <h2 className="text-3xl font-bold text-blue-700 mt-2">{leaves.length}</h2>
          </div>
          <div className="bg-white border border-yellow-100 rounded-2xl p-5 shadow-sm">
            <p className="text-gray-500 text-sm">Pending</p>
            <h2 className="text-3xl font-bold text-yellow-500 mt-2">
              {leaves.filter((item) => item.status === "pending").length}
            </h2>
          </div>
          <div className="bg-white border border-green-100 rounded-2xl p-5 shadow-sm">
            <p className="text-gray-500 text-sm">Approved</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {leaves.filter((item) => item.status === "approved").length}
            </h2>
          </div>
          <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
            <p className="text-gray-500 text-sm">Rejected</p>
            <h2 className="text-3xl font-bold text-red-500 mt-2">
              {leaves.filter((item) => item.status === "rejected").length}
            </h2>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold">Employee</th>
                  <th className="p-4 text-left text-sm font-semibold">Leave Type</th>
                  <th className="p-4 text-left text-sm font-semibold">From</th>
                  <th className="p-4 text-left text-sm font-semibold">To</th>
                  <th className="p-4 text-left text-sm font-semibold">Days</th>
                  <th className="p-4 text-left text-sm font-semibold">Reason</th>
                  {/* ✅ NEW: Document column */}
                  <th className="p-4 text-left text-sm font-semibold">Document</th>
                  <th className="p-4 text-left text-sm font-semibold">Admin Comment</th>
                  <th className="p-4 text-left text-sm font-semibold">Status</th>
                  <th className="p-4 text-center text-sm font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="11" className="text-center p-8 text-gray-500">
                      Loading leave requests...
                    </td>
                  </tr>
                ) : leaves.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center p-8 text-gray-500">
                      No leave requests found
                    </td>
                  </tr>
                ) : (
                  leaves.map((leave, index) => (
                    <tr
                      key={leave.id}
                      className={`border-b hover:bg-blue-50 transition ${
                        index % 2 === 0 ? "bg-white" : "bg-blue-50/30"
                      }`}
                    >
                      <td className="p-4 font-medium text-gray-800">{leave.name}</td>
                      <td className="p-4 text-gray-600">{leave.leave_type}</td>
                      <td className="p-4 text-gray-600">{leave.from_date?.split("T")[0]}</td>
                      <td className="p-4 text-gray-600">{leave.to_date?.split("T")[0]}</td>
                      <td className="p-4 font-semibold text-blue-700">{leave.total_days}</td>
                      <td className="p-4 text-gray-600 max-w-[180px] truncate" title={leave.reason}>
                        {leave.reason}
                      </td>

                    
                      {/* ✅ DOCUMENT COLUMN */}
                      <td className="p-4">
                        {leave.document ? (   
                           <a href={`${IMAGE_BASE_URL}/uploads/leaves/${leave.document}`}
                            target="_blank"
                            rel="noreferrer"
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              isPDF(leave.document)
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                            }`}
                          >
                            {isPDF(leave.document) ? "📄 PDF" : "🖼️ Image"}
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">No file</span>
                        )}
                      </td>

                      {/* COMMENT */}
                      <td className="p-4 min-w-[200px]">
                        <textarea
                          rows="2"
                          placeholder="Write comment..."
                          value={comments[leave.id] || ""}
                          onChange={(e) =>
                            setComments({ ...comments, [leave.id]: e.target.value })
                          }
                          className="w-full border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-2 rounded-xl text-sm"
                        />
                      </td>

                      {/* STATUS */}
                      <td className="p-4">
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold text-white ${
                            leave.status === "approved"
                              ? "bg-green-500"
                              : leave.status === "rejected"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="p-4 relative">
                        <button
                          onClick={() =>
                            setOpenMenu(openMenu === leave.id ? null : leave.id)
                          }
                          className="w-10 h-10 rounded-full hover:bg-blue-100 flex items-center justify-center transition"
                        >
                          <MoreVertical size={18} className="text-gray-700" />
                        </button>

                        {openMenu === leave.id && (
                          <div className="absolute right-5 top-14 bg-white border border-blue-100 shadow-xl rounded-xl w-40 z-50 overflow-hidden">
                            <button
                              onClick={() => {
                                updateStatus(leave.id, "approved");
                                setOpenMenu(null);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-green-50 text-green-600 font-medium transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                updateStatus(leave.id, "rejected");
                                setOpenMenu(null);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-500 font-medium transition"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminLeave;