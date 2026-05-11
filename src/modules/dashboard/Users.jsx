import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../api/axios";

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
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FETCH ROLES =================
  const fetchRoles = async () => {
    try {
      const res = await API.get("/roles");
      setRoles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FETCH DEPARTMENTS =================
  const fetchDepartments = async () => {
    try {
      const res = await API.get("/departments");
      setDepartments(res.data);
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
    setForm({ name: "", email: "", password: "", role_id: "", department_id: "" });
    setEditingUser(null);
    setIsModalOpen(true);
  };

  // ================= OPEN EDIT =================
  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",                                   // never pre-fill password
      role_id: user.role_id || "",
      department_id: user.department_id || "",
    });
    setIsModalOpen(true);
  };

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  // ================= SUBMIT (CREATE / UPDATE) =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingUser) {
        // Don't send password if left blank on edit
        const payload = { ...form };
        if (!payload.password) delete payload.password;

        await API.put(`/users/${editingUser.id}`, payload);
        alert("User Updated");
      } else {
        await API.post("/users", form);
        alert("User Created");
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
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/users/${id}`);
      alert("User Deleted");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };


  return (
    <DashboardLayout>
      <div className="p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
          <button
            onClick={openAddModal}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + Create User
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white p-5 rounded-xl shadow">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Role</th>
                <th className="p-3 border">Department</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{u.name}</td>
                    <td className="p-3 border">{u.email}</td>
                    {/* ✅ Use role_name / department_name from joined query */}
                    <td className="p-3 border">{u.role_name || u.role || "—"}</td>
                    <td className="p-3 border">{u.department_name || u.department || "—"}</td>
                    <td className="p-3 border">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(u)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                        >
                          Delete
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


      {/* ================= MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[420px] shadow-xl">

            <h2 className="text-xl font-bold mb-4">
              {editingUser ? "Edit User" : "Create User"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              {/* NAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full border p-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="w-full border p-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editingUser && <span className="text-gray-400 font-normal">(leave blank to keep current)</span>}
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={editingUser ? "Leave blank to keep current" : "Password"}
                  required={!editingUser}
                  className="w-full border p-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* ROLE DROPDOWN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role_id"
                  value={form.role_id}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name || r.role_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* DEPARTMENT DROPDOWN — ✅ fixed: was d.name, now d.department_name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  name="department_id"
                  value={form.department_id}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.department_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 hover:bg-gray:300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : editingUser ? "Update" : "Create"}
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