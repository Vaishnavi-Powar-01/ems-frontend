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

  // ROLES
  const fetchRoles = async () => {
    try {
      const res = await API.get("/roles");
      console.log("ROLES:", res.data);
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
      console.log("DEPARTMENTS:", res.data);
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

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{6,}$/;

    if (!passwordRegex.test(formData.password)) {
      alert(
        "Password must contain at least 6 characters, 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.",
      );
      return;
    }

    try {
      // ✅ FIX: role is already a lowercase string from the select value
      // No extra transformation needed — send as-is
      const cleanData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role, // already lowercase from option value
        department: formData.department,
      };

      console.log("REGISTER PAYLOAD:", cleanData);

      const response = await API.post("/auth/register", cleanData);

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

          <h2 className="text-xl font-bold mb-2">Join the Portal</h2>

          <p className="text-sm text-blue-100 leading-relaxed mb-6">
            Create your employee account and get access to the complete HR
            suite.
          </p>

          <ul className="space-y-3 text-sm text-blue-100">
            <li>✅ Quick setup in minutes</li>
            <li>🔐 Secure, encrypted access</li>
            <li>📋 Role & Department assignment</li>
            <li>🤝 Team collaboration tools</li>
          </ul>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 bg-white flex flex-col justify-center px-10 py-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Create account
          </h1>

          <p className="text-sm text-gray-500 mb-6">
            Register as a new employee
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NAME */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Full name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name} // ✅ controlled
                placeholder="Jane Smith"
                onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email} // ✅ controlled
                placeholder="you@gmail.com"
                onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="Min 6 chars, Aa1@"
                onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            {/* ROLE + DEPARTMENT */}
            <div className="flex gap-4">
              {/* ROLE */}
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role} // ✅ FIX: controlled select
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                >
                  <option value="">Select role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name.toLowerCase()}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* DEPARTMENT */}
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department} // ✅ FIX: controlled select
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                >
                  <option value="">Select department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.department_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Create account
            </button>
          </form>

          {/* LOGIN */}
          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
