import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ closeSidebar }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", roles: ["admin", "manager", "hr", "employee"] },
    { name: "Departments", path: "/admin/departments", roles: ["admin"] },
    { name: "Roles", path: "/admin/roles", roles: ["admin"] },
    { name: "Attendance", path: "/attendance", roles: ["employee", "manager", "hr"] },
    { name: "Admin Attendance", path: "/admin-attendance", roles: ["admin"] },
    { name: "My Leaves", path: "/leaves", roles: ["employee", "manager", "hr"] },
    { name: "Leave Approval", path: "/admin-leaves", roles: ["admin", "hr", "manager"] },
    { name: "My Expenses", path: "/expenses", roles: ["employee", "manager", "hr"] },
    { name: "Expense Approval", path: "/admin-expenses", roles: ["admin", "hr", "manager"] },
    { name: "Users", path: "/users", roles: ["admin", "hr"] },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <aside className="w-72 h-screen bg-gray-900 text-white flex flex-col border-r border-gray-800">

      {/* LOGO */}
      <div className="h-16 flex items-center justify-center border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
            EMS
          </div>
          <span className="font-semibold">EmployeeMS</span>
        </div>
      </div>

      {/* USER */}
      <div className="p-4 border-b border-gray-700">
        <p className="font-semibold">{user?.name}</p>
        <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
      </div>

      {/* MENU */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredMenu.map((item, i) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={i}
              to={item.path}
              onClick={closeSidebar}   // ✅ mobile close
              className={`block px-4 py-3 rounded-xl text-sm transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
        EMS v2.0
      </div>
    </aside>
  );
};

export default Sidebar;