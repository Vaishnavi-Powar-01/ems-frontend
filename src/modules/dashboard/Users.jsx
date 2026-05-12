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
  const [tableLoading, setTableLoading] = useState(true);

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
      setTableLoading(true);
      const res = await API.get("/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setTableLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await API.get("/roles");
      setRoles(Array.isArray(res.data) ? res.data : res.data.roles || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await API.get("/departments");
      setDepartments(
        Array.isArray(res.data)
          ? res.data
          : res.data.departments || []
      );
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await API.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">

          <div className="flex items-center gap-3">
            <UsersIcon className="text-blue-600" size={30} />
            <h1 className="text-2xl font-bold">Users</h1>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            <Plus size={18} />
            Add User
          </button>

        </div>

        {/* CARDS */}
        {tableLoading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {users.map((u) => (
              <div
                key={u.id}
                className="bg-white rounded-2xl shadow p-5 border hover:shadow-md transition"
              >

                {/* USER INFO */}
                <div className="flex items-center gap-3 mb-4">

                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                    {u.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div>
                    <h2 className="font-semibold">{u.name}</h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Mail size={14} /> {u.email}
                    </p>
                  </div>

                </div>

                {/* ROLE + DEPT DISPLAY */}
                <div className="flex flex-col gap-2 text-sm mb-4">

                  <span className="flex items-center gap-1 text-blue-600">
                    <Shield size={14} />
                    {u.role_name || "No Role"}
                  </span>

                  <span className="flex items-center gap-1 text-gray-600">
                    <Building2 size={14} />
                    {u.department_name || "No Department"}
                  </span>

                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2">

                  <button
                    onClick={() => openEditModal(u)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => deleteUser(u.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-lg rounded-2xl">

            {/* HEADER */}
            <div className="flex justify-between p-5 border-b">
              <h2 className="font-bold text-lg">
                {editingUser ? "Edit User" : "Add User"}
              </h2>
              <X onClick={() => setIsModalOpen(false)} />
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border p-3 rounded-xl"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border p-3 rounded-xl"
              />

              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full border p-3 rounded-xl"
              />

              {/* ROLE DROPDOWN */}
              <select
                name="role_id"
                value={form.role_id}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name || r.role_name}
                  </option>
                ))}
              </select>

              {/* DEPARTMENT DROPDOWN */}
              <select
                name="department_id"
                value={form.department_id}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.department_name}
                  </option>
                ))}
              </select>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  {loading && <Loader2 className="animate-spin" size={16} />}
                  <Save size={16} />
                  Save
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