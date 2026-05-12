// Navbar.jsx - No fixed positioning needed
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">

  {/* LEFT */}
  <div>
    <h1 className="text-lg font-semibold text-gray-800">
      Welcome back, {user?.name?.split(" ")[0] || "User"} 👋
    </h1>

    <p className="text-xs text-gray-500">
      {new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </p>
  </div>

  {/* RIGHT */}
  <div className="flex items-center gap-4">

    {/* NOTIFICATION */}
    <button className="relative rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700">
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>

      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
    </button>

    {/* USER */}
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-gray-100"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold shadow">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div className="hidden text-left md:block">
          <p className="text-sm font-semibold text-gray-800">
            {user?.name}
          </p>

          <p className="text-xs capitalize text-gray-500">
            {user?.role}
          </p>
        </div>

        <svg
          className={`h-4 w-4 text-gray-400 transition ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* DROPDOWN */}
      {isDropdownOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-gray-100 bg-white py-2 shadow-xl">

          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-semibold text-gray-800">
              {user?.name}
            </p>

            <p className="text-xs text-gray-500">
              {user?.email}
            </p>
          </div>

          <Link
            to="/profile"
            onClick={() => setIsDropdownOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Logout
          </button>

        </div>
      )}
    </div>
  </div>
</nav>
  );
};

export default Navbar;