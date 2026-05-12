import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../api/axios";

const Leave = () => {
  const [formData, setFormData] = useState({
    leave_type: "",
    from_date: "",
    to_date: "",
    reason: "",
    document: null,
  });

  const [leaves, setLeaves] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState("");

  // Get today's date
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });

    if (name === "from_date" || name === "to_date") {
      setDateError("");
    }
  };

  // Validate Dates
  const validateDates = () => {
    const { from_date, to_date } = formData;

    if (!from_date || !to_date) return true;

    const fromDate = new Date(from_date);
    const toDate = new Date(to_date);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (fromDate < today) {
      setDateError(
        "From date cannot be in the past. Please select today's date or future date."
      );
      return false;
    }

    if (toDate < fromDate) {
      setDateError("To date cannot be before from date.");
      return false;
    }

    setDateError("");
    return true;
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      leave_type: "",
      from_date: "",
      to_date: "",
      reason: "",
      document: null,
    });

    setDateError("");
  };

  // Apply Leave
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateDates()) return;

    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      submitData.append("leave_type", formData.leave_type);
      submitData.append("from_date", formData.from_date);
      submitData.append("to_date", formData.to_date);
      submitData.append("reason", formData.reason);

      if (formData.document) {
        submitData.append("document", formData.document);
      }

      const response = await API.post(
        "/leaves/apply",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);

      setIsModalOpen(false);
      resetForm();
      fetchLeaves();

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to apply leave"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch Leaves
  const fetchLeaves = async () => {
    try {
      const response = await API.get("/leaves/my-leaves");
      setLeaves(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Calculate Days
  const calculateDays = (fromDate, toDate) => {
    if (!fromDate || !toDate) return 0;

    const from = new Date(fromDate);
    const to = new Date(toDate);

    const diffTime = Math.abs(to - from);

    return (
      Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    );
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Status Badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: {
        color: "bg-green-500",
        text: "Approved",
      },
      rejected: {
        color: "bg-red-500",
        text: "Rejected",
      },
      pending: {
        color: "bg-yellow-500",
        text: "Pending",
      },
    };

    const config =
      statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`px-3 py-1 rounded-full text-white text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Leave Management
            </h1>

            <p className="text-gray-500 mt-1">
              Manage your leave requests and history
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md"
          >
            + Apply Leave
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="text-gray-500 text-sm">
              Total Leaves
            </div>

            <div className="text-2xl font-bold text-gray-800">
              {leaves.length}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="text-gray-500 text-sm">
              Approved
            </div>

            <div className="text-2xl font-bold text-green-600">
              {
                leaves.filter(
                  (l) => l.status === "approved"
                ).length
              }
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
            <div className="text-gray-500 text-sm">
              Rejected
            </div>

            <div className="text-2xl font-bold text-red-600">
              {
                leaves.filter(
                  (l) => l.status === "rejected"
                ).length
              }
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <div className="text-gray-500 text-sm">
              Pending
            </div>

            <div className="text-2xl font-bold text-yellow-600">
              {
                leaves.filter(
                  (l) => l.status === "pending"
                ).length
              }
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800">
                  Apply for Leave
                </h2>

                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="p-6"
              >
                <div className="space-y-4">
                  {/* Leave Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Leave Type *
                    </label>

                    <select
                      name="leave_type"
                      value={formData.leave_type}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">
                        Select Leave Type
                      </option>

                      <option value="Sick Leave">
                        Sick Leave
                      </option>

                      <option value="Casual Leave">
                        Casual Leave
                      </option>

                      <option value="Paid Leave">
                        Paid Leave
                      </option>

                      <option value="Unpaid Leave">
                        Unpaid Leave
                      </option>
                    </select>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* From Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Date *
                      </label>

                      <input
                        type="date"
                        name="from_date"
                        value={formData.from_date}
                        onChange={handleChange}
                        required
                        min={getTodayDate()}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* To Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To Date *
                      </label>

                      <input
                        type="date"
                        name="to_date"
                        value={formData.to_date}
                        onChange={handleChange}
                        required
                        min={
                          formData.from_date ||
                          getTodayDate()
                        }
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Error */}
                  {dateError && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                      <p className="text-sm text-red-600">
                        {dateError}
                      </p>
                    </div>
                  )}

                  {/* Days */}
                  {formData.from_date &&
                    formData.to_date &&
                    !dateError && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-700">
                          Total Days:{" "}
                          <strong>
                            {calculateDays(
                              formData.from_date,
                              formData.to_date
                            )}
                          </strong>{" "}
                          day(s)
                        </p>
                      </div>
                    )}

                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason *
                    </label>

                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      required
                      rows="4"
                      placeholder="Enter leave reason..."
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {/* Upload Document */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Medical Certificate /
                      Leave Letter
                    </label>

                    <input
                      type="file"
                      name="document"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <p className="text-xs text-gray-500 mt-1">
                      Accepted formats: PDF, JPG,
                      JPEG, PNG
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Leave History */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">
              Leave History
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Leave Type
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    From Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    To Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Days
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Reason
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Document
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Admin Comment
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {leaves.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No leave records found
                    </td>
                  </tr>
                ) : (
                  leaves.map((leave) => (
                    <tr
                      key={leave.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        {leave.leave_type}
                      </td>

                      <td className="px-6 py-4">
                        {leave.from_date
                          ? new Date(
                              leave.from_date
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-6 py-4">
                        {leave.to_date
                          ? new Date(
                              leave.to_date
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-6 py-4">
                        {leave.total_days || "-"}
                      </td>

                      <td className="px-6 py-4">
                        <div
                          className="max-w-xs truncate"
                          title={leave.reason}
                        >
                          {leave.reason}
                        </div>
                      </td>

                      {/* Document */}
                      <td className="px-6 py-4">
                        {leave.document ? (
                          <a
                            href={`${import.meta.env.VITE_API_URL}/uploads/leaves/${leave.document}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View File
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {leave.admin_comment || "—"}
                      </td>

                      <td className="px-6 py-4">
                        {getStatusBadge(
                          leave.status
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

export default Leave;