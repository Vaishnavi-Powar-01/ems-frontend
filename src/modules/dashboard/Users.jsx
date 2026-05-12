import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../api/axios";

import {
  Users as UsersIcon,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  Mail,
  Shield,
  Building2,
} from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: "",
    department_id: "",
  });

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("USERS ERROR:", err);
    }
  };

  // ================= FETCH ROLES =================
  const fetchRoles = async () => {
    try {
      const res = await API.get("/roles");

      setRoles(
        res.data?.roles ||
        res.data?.data ||
        (Array.isArray(res.data) ? res.data : [])
      );
    } catch (err) {
      console.error("ROLES ERROR:", err);
    }
  };

  // ================= FETCH DEPARTMENTS =================
  const fetchDepartments = async () => {
    try {
      const res = await API.get("/departments");

      setDepartments(
        res.data?.departments ||
        res.data?.data ||
        (Array.isArray(res.data) ? res.data : [])
      );
    } catch (err) {
      console.error("DEPARTMENTS ERROR:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchDepartments();
  }, []);

  // ================= OPEN ADD =================
  const openAddModal = () => {
    setEditingUser(null);

    setForm({
      name: "",
      email: "",
      password: "",
      role_id: "",
      department_id: "",
    });

    setIsModalOpen(true);
  };

  // ================= OPEN EDIT =================
  const openEditModal = (user) => {
    setEditingUser(user);

    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role_id: user.role_id || "",
      department_id: user.department_id || "",
    });

    setIsModalOpen(true);
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,
        role_id: Number(form.role_id),
        department_id: form.department_id
          ? Number(form.department_id)
          : null,
      };

      if (editingUser && !payload.password) {
        delete payload.password;
      }

      if (editingUser) {
        await API.put(`/users/${editingUser.id}`, payload);
        alert("User updated successfully");
      } else {
        await API.post("/users", payload);
        alert("User created successfully");
      }

      setIsModalOpen(false);
      fetchUsers();

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/users/${id}`);
      alert("User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <DashboardLayout>

      <div className="p-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center shadow-sm">
              <UsersIcon className="text-blue-600" size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Users Management
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Manage employees, roles and departments
              </p>
            </div>

          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition-all shadow-sm"
          >
            <Plus size={18} />
            Create User
          </button>

        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b border-gray-200">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Department
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {users.length === 0 ? (

                  <tr>
                    <td
                      colSpan={4}
                      className="py-16 text-center"
                    >

                      <UsersIcon
                        size={42}
                        className="mx-auto text-gray-300 mb-3"
                      />

                      <h3 className="text-lg font-semibold text-gray-700">
                        No Users Found
                      </h3>

                      <p className="text-sm text-gray-400 mt-1">
                        Create your first user to get started
                      </p>

                    </td>
                  </tr>

                ) : (

                  users.map((u) => (

                    <tr
                      key={u.id}
                      className="hover:bg-gray-50 transition-all"
                    >

                      {/* USER */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold shadow-sm">
                            {u.name?.charAt(0)?.toUpperCase()}
                          </div>

                          <div>

                            <p className="font-semibold text-gray-800">
                              {u.name}
                            </p>

                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                              <Mail size={13} />
                              {u.email}
                            </div>

                          </div>

                        </div>

                      </td>

                      {/* ROLE */}
                      <td className="px-6 py-5">

                        <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">

                          <Shield size={14} />

                          {u.role_name || "N/A"}

                        </span>

                      </td>

                      {/* DEPARTMENT */}
                      <td className="px-6 py-5">

                        <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">

                          <Building2 size={14} />

                          {u.department_name || "Not Assigned"}

                        </span>

                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-5">

                        <div className="flex items-center justify-center gap-3">

                          <button
                            onClick={() => openEditModal(u)}
                            className="w-9 h-9 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => deleteUser(u.id)}
                            className="w-9 h-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* MODAL */}
      {isModalOpen && (

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">

            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  {editingUser ? "Edit User" : "Create User"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {editingUser
                    ? "Update user information"
                    : "Add a new employee account"}
                </p>

              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              {/* NAME */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={
                    editingUser
                      ? "Leave blank to keep current password"
                      : "Enter password"
                  }
                  required={!editingUser}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* ROLE + DEPARTMENT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* ROLE */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role
                  </label>

                  <select
                    name="role_id"
                    value={form.role_id}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Role</option>

                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}

                  </select>
                </div>

                {/* DEPARTMENT */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department
                  </label>

                  <select
                    name="department_id"
                    value={form.department_id}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Department</option>

                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.department_name}
                      </option>
                    ))}

                  </select>
                </div>

              </div>

              {/* FOOTER */}
              <div className="flex items-center justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 font-medium transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      {editingUser ? "Update User" : "Create User"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </DashboardLayout>
  );
};

export default Users;