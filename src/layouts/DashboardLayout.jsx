import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;