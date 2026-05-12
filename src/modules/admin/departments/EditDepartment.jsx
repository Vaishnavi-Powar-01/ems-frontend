import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate, useParams } from "react-router-dom";
import { Building2, ArrowLeft, Save, Loader2 } from "lucide-react";
import API from "../../../api/axios";

const EditDepartment = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    departmentName: "",
    departmentCode: "",
    managerName: "",
    description: "",
  });

  const fetchDepartmentDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/departments/${id}`);
      const d = res.data;

      setFormData({
        departmentName: d.department_name || "",
        departmentCode: d.department_code || "",
        managerName: d.manager_name || "",
        description: d.description || "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to load department details");
      navigate("/admin/departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentDetails();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const res = await API.put(`/departments/${id}`, formData);

      if (res.data.success) {
        alert("Department updated successfully");
        navigate("/admin/departments");
      } else {
        alert(res.data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server error while updating department");
    } finally {
      setSaving(false);
    }
  };

  // Loading UI (Professional skeleton feel)
  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto ">
          <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>

          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
            <div className="h-10 w-40 bg-gray-300 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex items-center gap-2 text-gray-800 font-semibold">
            <Building2 size={20} />
            Edit Department
          </div>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6"
        >

          {/* Department Name */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Department Name
            </label>
            <input
              name="departmentName"
              value={formData.departmentName}
              onChange={handleChange}
              placeholder="Enter department name"
className="w-full mt-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"              required
            />
          </div>

          {/* Code + Manager */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Department Code
              </label>
              <input
                name="departmentCode"
                value={formData.departmentCode}
                onChange={handleChange}
                placeholder="e.g. HR01"
  className="w-full mt-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Manager Name
              </label>
              <input
                name="managerName"
                value={formData.managerName}
                onChange={handleChange}
                placeholder="Manager name"
  className="w-full mt-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Department details..."
className="w-full mt-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"            />
          </div>


          {/* Submit */}
          <button
  disabled={saving}
  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
>
  {saving ? (
    <>
      <Loader2 className="animate-spin" size={18} />
      Updating...
    </>
  ) : (
    <>
      <Save size={18} />
      Update Department
    </>
  )}
</button>

        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditDepartment;