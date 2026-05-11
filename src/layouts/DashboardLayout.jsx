// DashboardLayout.jsx
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* Sidebar - fixed width on the left */}
      <Sidebar />

      {/* Main Content Area - takes remaining space */}
      <div className="flex-1 flex flex-col">
        
        {/* Navbar - stays at top of main content */}
        <Navbar />

        {/* Page Content - scrolls independently */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;