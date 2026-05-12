import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../api/axios";
import { 
  Users as UsersIcon, Plus, Pencil, Trash2, X, Save, Loader2, Mail, Shield, Building2 
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
    name: "", email: "", password: "", role_id: "", department_id: "",
  });

  // Fetch all necessary data
  const fetchData = async () => {
    setTableLoading(true);
    try {
      const [uRes, rRes, dRes] = await Promise.all([
        API.get("/users"),
        API.get("/roles"),
        API.get("/departments")
      ]);
      setUsers(uRes.data);
      setRoles(Array.isArray(rRes.data) ? rRes.data : rRes.data.roles || []);
      setDepartments(Array.isArray(dRes.data) ? dRes.data : dRes.data.departments || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        role_id: Number(form.role_id),
        department_id: form.department_id ? Number(form.department_id) : null,
      };

      if (editingUser) {
        if (!payload.password) delete payload.password;
        await API.put(`/users/${editingUser.id}`, payload);
      } else {
        await API.post("/users", payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/users/${id}`);
      fetchData();
    } catch (err) { alert("Failed to delete"); }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <UsersIcon className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
              <p className="text-sm text-gray-500">Create and manage staff accounts</p>
            </div>
          </div>
          <button onClick={() => { setEditingUser(null); setForm({name:"", email:"", password:"", role_id:"", department_id:""}); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition shadow-sm">
            <Plus size={18} /> Create User
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">User</th>
                <th className="px-6 py-4 text-left font-semibold">Role</th>
                <th className="px-6 py-4 text-left font-semibold">Department</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tableLoading ? (
                <tr><td colSpan={4} className="py-10 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{u.name}</div>
                      <div className="text-xs text-gray-400">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                        <Shield size={12} /> {u.role_name || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.department_name ? (
                        <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full text-xs">
                          <Building2 size={12} /> {u.department_name}
                        </span>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => { setEditingUser(u); setForm({ ...u, password: "" }); setIsModalOpen(true); }} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Pencil size={16} /></button>
                        <button onClick={() => deleteUser(u.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Section */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">{editingUser ? "Edit User" : "Add User"}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder={editingUser ? "Leave blank to keep same" : "Password"} required={!editingUser} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="grid grid-cols-2 gap-4">
                <select name="role_id" value={form.role_id} onChange={handleChange} required className="border p-2.5 rounded-lg outline-none">
                  <option value="">Select Role</option>
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                <select name="department_id" value={form.department_id} onChange={handleChange} className="border p-2.5 rounded-lg outline-none">
                  <option value="">No Dept</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.department_name}</option>)}
                </select>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition">
                {loading ? <Loader2 className="animate-spin" size={20}/> : <><Save size={20}/> {editingUser ? "Update" : "Save"}</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Users;