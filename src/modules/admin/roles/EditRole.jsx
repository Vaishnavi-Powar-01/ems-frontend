// modules/admin/roles/EditRole.jsx

import { useState, useEffect } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Shield, ArrowLeft, Save, Loader, AlertCircle } from "lucide-react";
import API from "../../../api/axios";

const permissionModules = [
  {
    title: "User Permissions",
    key: "users",
    permissions: [
      { code: "user.create", label: "Create Users" },
      { code: "user.view",   label: "View Users" },
      { code: "user.update", label: "Update Users" },
      { code: "user.delete", label: "Delete Users" },
    ],
  },
  {
    title: "Expense Permissions",
    key: "expenses",
    permissions: [
      { code: "expense.create", label: "Create Expenses" },
      { code: "expense.view",   label: "View Expenses" },
      { code: "expense.update", label: "Update Expenses" },
      { code: "expense.delete", label: "Delete Expenses" },
    ],
  },
  {
    title: "Attendance Permissions",
    key: "attendance",
    permissions: [
      { code: "attendance.create", label: "Create Attendance" },
      { code: "attendance.view",   label: "View Attendance" },
      { code: "attendance.update", label: "Update Attendance" },
      { code: "attendance.delete", label: "Delete Attendance" },
    ],
  },
  {
    title: "Leave Permissions",
    key: "leave",
    permissions: [
      { code: "leave.create", label: "Create Leave" },
      { code: "leave.view",   label: "View Leave" },
      { code: "leave.update", label: "Update Leave" },
      { code: "leave.delete", label: "Delete Leave" },
    ],
  },
];

const EditRole = () => {
  const navigate = useNavigate();
  const { id }   = useParams();

  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    name:        "",
    description: "",
    status:      "Active",
    permissions: [],   // array of permission code strings
  });

  // ── fetch role ─────────────────────────────────────────────
  useEffect(() => { fetchRole(); }, [id]);

  const fetchRole = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/roles/${id}`);

      // Backend GET /roles/:id returns the role object directly (not wrapped in data:{})
      // Shape: { id, name, description, status, permissions: [...], created_at }
      const role = response.data;

      // permissions is already parsed to JS array by the backend
      let perms = [];
      if (Array.isArray(role.permissions)) {
        perms = role.permissions;
      } else if (typeof role.permissions === "string") {
        // safety fallback in case backend sends raw JSON string
        try { perms = JSON.parse(role.permissions); } catch { perms = []; }
      }

      setFormData({
        name:        role.name        || "",
        description: role.description || "",
        status:      role.status      || "Active",
        permissions: perms,
      });
    } catch (error) {
      alert("Failed to fetch role");
      navigate("/admin/roles");
    } finally {
      setLoading(false);
    }
  };

  // ── validation ─────────────────────────────────────────────
  const validateField = (name, value) => {
    if (name === "name") {
      if (!value.trim())    return "Role name is required";
      if (value.length < 2) return "Minimum 2 characters required";
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Role name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── field handlers ─────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // ── permission handlers ────────────────────────────────────
  const handlePermissionChange = (code) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(code)
        ? prev.permissions.filter((p) => p !== code)
        : [...prev.permissions, code],
    }));
  };

  const handleSelectAll = (modulePermissions) => {
    const codes      = modulePermissions.map((p) => p.code);
    const allChecked = codes.every((c) => formData.permissions.includes(c));
    setFormData((prev) => ({
      ...prev,
      permissions: allChecked
        ? prev.permissions.filter((p) => !codes.includes(p))
        : [...new Set([...prev.permissions, ...codes])],
    }));
  };

  // ── submit ─────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);

      // Backend PUT /roles/:id expects: { name, description, status, permissions }
      // It does JSON.stringify(permissions) before saving to DB
      const payload = {
        name:        formData.name.trim(),
        description: formData.description.trim(),
        status:      formData.status,
        permissions: formData.permissions,   // send plain JS array
      };

      const response = await API.put(`/roles/${id}`, payload);

      if (response.data.success) {
        alert("Role updated successfully");
        navigate("/admin/roles");
      } else {
        alert(response.data.message || "Failed to update role");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update role");
    } finally {
      setSaving(false);
    }
  };

  // ── loading ────────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader size={40} className="animate-spin text-purple-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 min-h-screen">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Update Role</h1>
            <p className="text-gray-500 mt-1">Editing: <span className="font-semibold text-gray-700">{formData.name}</span></p>
          </div>
          <Link
            to="/admin/roles"
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow border overflow-hidden">

            {/* Card header */}
            <div className="border-b px-6 py-5 flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Shield size={24} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Role Information</h2>
                <p className="text-sm text-gray-500">Update the details below</p>
              </div>
            </div>

            <div className="p-6 space-y-6">

              {/* Name */}
              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Role Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g., Manager"
                  className={`w-full border rounded-xl px-4 py-3 focus:ring-2 outline-none ${
                    touched.name && errors.name
                      ? "border-red-400 focus:ring-red-200"
                      : "border-gray-300 focus:ring-purple-200"
                  }`}
                />
                {touched.name && errors.name && (
                  <p className="mt-2 text-red-600 text-sm flex items-center gap-1">
                    <AlertCircle size={16} /> {errors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Role description..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-200 resize-none"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-200"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Permissions */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-gray-900">Permissions</h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {formData.permissions.length} selected
                  </span>
                </div>

                <div className="space-y-4">
                  {permissionModules.map((module) => {
                    const allSelected  = module.permissions.every((p) => formData.permissions.includes(p.code));
                    const someSelected = module.permissions.some((p)  => formData.permissions.includes(p.code));
                    const selectedCount = module.permissions.filter(p => formData.permissions.includes(p.code)).length;

                    return (
                      <div key={module.key} className="border border-gray-200 rounded-xl overflow-hidden">

                        {/* Module header */}
                        <div className={`flex items-center justify-between px-5 py-3 ${
                          someSelected ? "bg-purple-50 border-b border-purple-100" : "bg-gray-50 border-b border-gray-200"
                        }`}>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{module.title}</h3>
                            {someSelected && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                {selectedCount}/{module.permissions.length}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSelectAll(module.permissions)}
                            className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${
                              allSelected
                                ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                                : "bg-white text-blue-600 hover:bg-blue-50 border border-blue-200"
                            }`}
                          >
                            {allSelected ? "Unselect All" : "Select All"}
                          </button>
                        </div>

                        {/* Checkboxes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2">
                          {module.permissions.map((permission) => {
                            const checked = formData.permissions.includes(permission.code);
                            return (
                              <label
                                key={permission.code}
                                className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-colors border-b border-gray-100 last:border-0 ${
                                  checked ? "bg-purple-50 hover:bg-purple-100" : "hover:bg-gray-50"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => handlePermissionChange(permission.code)}
                                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                />
                                <span className={`text-sm font-medium ${checked ? "text-purple-800" : "text-gray-700"}`}>
                                  {permission.label}
                                </span>
                                {checked && (
                                  <span className="ml-auto text-purple-400">
                                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                                      <path d="M12.207 4.793a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L6.5 9.086l4.293-4.293a1 1 0 0 1 1.414 0z"/>
                                    </svg>
                                  </span>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t px-6 py-4 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 font-medium disabled:opacity-50 transition-colors"
              >
                {saving ? <><Loader size={18} className="animate-spin" /> Updating…</> : <><Save size={18} /> Update Role</>}
              </button>
              <Link
                to="/admin/roles"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-xl font-medium transition-colors"
              >
                Cancel
              </Link>
            </div>

          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditRole;