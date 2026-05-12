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
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("USERS ERROR:", err);
    }
  };

  // ================= FETCH ROLES =================
  const fetchRoles = async () => {
    try {
      const res = await API.get("/roles");

      console.log("ROLES RESPONSE:", res.data);

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

      console.log("DEPARTMENTS RESPONSE:", res.data);

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
    const confirmDelete = window.confirm("Are you sure?");
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
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <UsersIcon className="text-blue-600" size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-800">Users</h1>
              <p className="text-sm text-gray-500">
                Manage employees and permissions
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white"
          >
            <Plus size={18} />
            Create User
          </button>

        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-2xl border bg-white">

          <table className="w-full">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Department</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b">

                    <td className="px-6 py-4">{u.name}</td>
                    <td className="px-6 py-4">{u.email}</td>

                    <td className="px-6 py-4">
                      {u.role_name || "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      {u.department_name || "-"}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button onClick={() => openEditModal(u)}>
                        <Pencil size={16} />
                      </button>

                      <button onClick={() => deleteUser(u.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white w-full max-w-lg p-6 rounded-xl">

            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">
                {editingUser ? "Edit User" : "Create User"}
              </h2>

              <button onClick={() => setIsModalOpen(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border p-2"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border p-2"
              />

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full border p-2"
              />

              {/* ROLE */}
              <select
                name="role_id"
                value={form.role_id}
                onChange={handleChange}
                className="w-full border p-2"
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              {/* DEPARTMENT FIXED */}
              <select
                name="department_id"
                value={form.department_id}
                onChange={handleChange}
                className="w-full border p-2"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.department_name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white p-2"
              >
                {loading ? "Saving..." : "Save"}
              </button>

            </form>

          </div>

        </div>
      )}
    </DashboardLayout>
  );
};

export default Users;