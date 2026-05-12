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

      console.log("USERS:", res.data);

      setUsers(Array.isArray(res.data) ? res.data : []);

    } catch (err) {
      console.error(err);
    }
  };

  // ================= FETCH ROLES =================
  const fetchRoles = async () => {
    try {
      const res = await API.get("/roles");

      console.log("ROLES:", res.data);

      setRoles(Array.isArray(res.data) ? res.data : []);

    } catch (err) {
      console.error(err);
    }
  };

  // ================= FETCH DEPARTMENTS =================
  const fetchDepartments = async () => {
    try {
      const res = await API.get("/departments");

      console.log("DEPARTMENTS:", res.data);

      setDepartments(Array.isArray(res.data) ? res.data : []);

    } catch (err) {
      console.error(err);
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

      // IMPORTANT
      if (editingUser && !payload.password) {
        delete payload.password;
      }

      console.log("PAYLOAD:", payload);

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

      alert(
        err.response?.data?.message ||
        "Something went wrong"
      );

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

      alert(
        err.response?.data?.message ||
        "Failed to delete user"
      );
    }
  };

  return (
    <DashboardLayout>

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <UsersIcon className="text-blue-600" size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Users
              </h1>

              <p className="text-sm text-gray-500">
                Manage employees and permissions
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Create User
          </button>

        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b border-gray-100">

                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Name
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Department
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody>

                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-16 text-center text-gray-400"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >

                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">
                          {u.name}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {u.email}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          {u.role_name || "N/A"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {u.department_name || "-"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">

                          <button
                            onClick={() => openEditModal(u)}
                            className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => deleteUser(u.id)}
                            className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
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

      {/* ================= MODAL ================= */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {editingUser ? "Edit User" : "Create User"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Manage user details and permissions
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required={!editingUser}
                  placeholder={
                    editingUser
                      ? "Leave blank to keep current"
                      : "Enter password"
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* ROLE + DEPARTMENT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Role
                  </label>

                  <select
                    name="role_id"
                    value={form.role_id}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">
                      Select Role
                    </option>

                    {roles.map((r) => (
                      <option
                        key={r.id}
                        value={r.id}
                      >
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Department
                  </label>

                  <select
                    name="department_id"
                    value={form.department_id}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">
                      Select Department
                    </option>

                    {departments.map((d) => (
                      <option
                        key={d.id}
                        value={d.id}
                      >
                        {d.department_name}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  <Save size={18} />

                  {loading
                    ? "Saving..."
                    : editingUser
                    ? "Update User"
                    : "Create User"}
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