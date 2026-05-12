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

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // FETCH ROLES
  const fetchRoles = async () => {
    try {
      const res = await API.get("/roles");
      setRoles(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // FETCH DEPARTMENTS
  const fetchDepartments = async () => {
    try {
      const res = await API.get("/departments");
      setDepartments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchDepartments();
  }, []);

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
      } else {
        await API.post("/users", payload);
      }

      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;

    await API.delete(`/users/${id}`);
    fetchUsers();
  };

  return (
    <DashboardLayout>
      <div className="p-6">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UsersIcon /> Users
          </h1>

          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={16} /> Add User
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {users.map((u) => (
                <tr key={u.id} className="border-t">

                  <td className="p-4">
                    <div>
                      <div className="font-semibold">{u.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail size={14} /> {u.email}
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="text-blue-600 flex items-center gap-1">
                      <Shield size={14} />
                      {u.role_name || "N/A"}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="flex items-center gap-1">
                      <Building2 size={14} />
                      {u.department_name || "Not Assigned"}
                    </span>
                  </td>

                  <td className="p-4 flex gap-2">
                    <button onClick={() => openEditModal(u)}>
                      <Pencil size={16} />
                    </button>

                    <button onClick={() => deleteUser(u.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        </div>

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-xl w-[400px]"
            >

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border p-2 mb-2"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border p-2 mb-2"
              />

              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full border p-2 mb-2"
              />

              <select
                name="role_id"
                value={form.role_id}
                onChange={handleChange}
                className="w-full border p-2 mb-2"
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              <select
                name="department_id"
                value={form.department_id}
                onChange={handleChange}
                className="w-full border p-2 mb-2"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.department_name}
                  </option>
                ))}
              </select>

              <button
                disabled={loading}
                className="bg-blue-600 text-white w-full p-2 rounded"
              >
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full mt-2"
              >
                Cancel
              </button>

            </form>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Users;