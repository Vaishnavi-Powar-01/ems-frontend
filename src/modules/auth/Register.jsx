import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";

const Register = () => {
  const navigate = useNavigate();

  // FORM DATA
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: 1,        // DEFAULT ADMIN
    department: 1,  // DEFAULT DEPARTMENT
  });

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

    // EMAIL VALIDATION
    if (!formData.email.endsWith("@gmail.com")) {
      alert("Email must be a gmail.com address");
      return;
    }

    // PASSWORD VALIDATION
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await API.post(
        "/auth/register",
        formData
      );

      alert(response.data.message);

      navigate("/");

    } catch (error) {
      console.log(
        "REGISTER ERROR FULL:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );
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

          <p className="text-sm text-blue-100 leading-relaxed mb-6">
            Create your admin account and access the HR suite.
          </p>

          <ul className="space-y-3 text-sm text-blue-100">
            <li>✅ Quick setup in minutes</li>
            <li>🔐 Secure access</li>
            <li>👨‍💼 Admin privileges enabled</li>
            <li>🚀 Ready for deployment</li>
          </ul>

        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 bg-white flex flex-col justify-center px-10 py-10">

          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Create Admin Account
          </h1>

          <p className="text-sm text-gray-500 mb-6">
            Register your first administrator
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* NAME */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Full name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Jane Smith"
                onChange={handleChange}
                autoComplete="name"
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
                placeholder="admin@gmail.com"
                onChange={handleChange}
                autoComplete="email"
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
                placeholder="Minimum 6 characters"
                onChange={handleChange}
                minLength={6}
                autoComplete="new-password"
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            {/* INFO BOX */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700">
              Default Role: <strong>Admin</strong> <br />
              Default Department: <strong>IT</strong>
            </div>

            {/* BUTTON */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
              Create Admin Account
            </button>

          </form>

          {/* LOGIN */}
          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;