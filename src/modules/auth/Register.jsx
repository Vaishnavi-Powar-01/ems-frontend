import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";

const Register = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    department: "",
  });

  // FETCH ROLES & DEPARTMENTS
  useEffect(() => {
    fetchRoles();
    fetchDepartments();
  }, []);

  // AUTO SET ADMIN ROLE AFTER ROLES LOAD
  useEffect(() => {
    if (roles.length > 0) {
      const adminRole = roles.find((r) => r.name === "admin");

      setFormData((prev) => ({
        ...prev,
        role: adminRole ? adminRole.id : prev.role,
      }));
    }
  }, [roles]);

  // ROLES
  const fetchRoles = async () => {
    try {
      const res = await API.get("/roles");
      const data = res.data.data || res.data;
      setRoles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

  // DEPARTMENTS
  const fetchDepartments = async () => {
    try {
      const res = await API.get("/departments");
      const data = res.data.data || res.data;
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

  // HANDLE CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.endsWith("@gmail.com")) {
      alert("Email must be a gmail.com address");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await API.post("/auth/register", formData);

      alert(response.data.message);

      navigate("/");
    } catch (error) {
      console.log("REGISTER ERROR:", error.response?.data);

      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">

      <div className="flex w-[860px] min-h-[520px] rounded-2xl overflow-hidden shadow-xl border border-blue-100">

        {/* LEFT PANEL */}
        <div className="w-72 bg-blue-600 flex flex-col justify-center px-8 py-10 text-white">

          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-5 text-2xl">
            🏢
          </div>

          <h2 className="text-xl font-bold mb-2">
            Join the Portal
          </h2>

          <p className="text-sm text-blue-100 mb-6">
            Create your employee account and access HR tools.
          </p>

          <ul className="space-y-3 text-sm text-blue-100">
            <li>✅ Quick setup</li>
            <li>🔐 Secure access</li>
            <li>📋 Role assignment</li>
            <li>🤝 Team tools</li>
          </ul>

        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 bg-white flex flex-col justify-center px-10 py-10">

          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Create account
          </h1>

          <p className="text-sm text-gray-500 mb-6">
            Register a new employee
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAME */}
            <input
              type="text"
              name="name"
              placeholder="Full name"
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
              required
            />

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
              required
            />

            {/* PASSWORD */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
              required
            />

            {/* ROLE */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
              required
            >
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>

            {/* DEPARTMENT */}
            <select
              name="department"
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
              required
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.department_name}
                </option>
              ))}
            </select>

            {/* BUTTON */}
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
              Create account
            </button>

          </form>

          {/* LOGIN */}
          <p className="text-center text-sm mt-6">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600">
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;