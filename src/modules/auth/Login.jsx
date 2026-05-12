import { useContext, useState } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) setError("");
  };

  // LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await API.post("/auth/login", formData);

      console.log("LOGIN RESPONSE:", response.data);

      const user = response.data.user;
      const token = response.data.token;

      // ❌ safety check
      if (!user || !token) {
        throw new Error("Invalid server response");
      }

      // ✅ CLEAN USER (IMPORTANT FIX)
      const cleanUser = {
        ...user,
        role: user.role?.toLowerCase().trim(),
      };

      console.log("CLEAN USER:", cleanUser);

      // SAVE TO CONTEXT + LOCALSTORAGE
      login(cleanUser, token);

      // ✅ ROLE BASED REDIRECT (FIXED)
      switch (cleanUser.role) {
        case "admin":
          navigate("/dashboard");
          break;

        case "hr":
          navigate("/hr");
          break;

        case "manager":
          navigate("/manager");
          break;

        case "employee":
        default:
          navigate("/attendance");
          break;
      }

    } catch (error) {
      console.error("Login error:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 md:p-10">

          {/* HEADER */}
          <div className="text-center mb-8">

            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-md">
              👥
            </div>

            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back
            </h1>

            <p className="text-gray-500 mt-2">
              Sign in to your employee account
            </p>

          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Email address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="you@company.com"
                onChange={handleChange}
                required
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="Enter your password"
                onChange={handleChange}
                required
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  alert("Password reset link will be sent to your email.")
                }
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>

          </form>

          {/* REGISTER */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 font-medium hover:underline">
                Register here
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;