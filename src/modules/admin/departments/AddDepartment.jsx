import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import {
  Building2,
  ArrowLeft,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/axios";

const Departments = () => {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    departmentName: "",
    departmentCode: "",
    managerName: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await API.post("/departments/add", formData);

      alert("Department added successfully");

      navigate("/admin/departments");

    } catch (error) {
      console.log(error);
      alert("Failed to add department");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex items-center gap-2 text-gray-800 font-semibold">
            <Building2 size={22} />
            Add Department
          </div>

        </div>

        {/* CARD */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">

          {/* TOP */}
          <div className="flex items-center gap-4 mb-8">

            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Building2 className="text-blue-600" size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Create Department
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Add and manage company departments
              </p>
            </div>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department Name
              </label>

              <input
                type="text"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleChange}
                placeholder="Enter department name"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* CODE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Code
                </label>

                <input
                  type="text"
                  name="departmentCode"
                  value={formData.departmentCode}
                  onChange={handleChange}
                  placeholder="e.g. HR01"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* MANAGER */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manager Name
                </label>

                <input
                  type="text"
                  name="managerName"
                  value={formData.managerName}
                  onChange={handleChange}
                  placeholder="Enter manager name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>

              <textarea
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter department description"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex items-center gap-4 pt-2">

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Add Department"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/departments")}
                className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Departments;