import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./modules/auth/Login";

import Dashboard from "./modules/dashboard/Dashboard";

import Attendance from "./modules/attendance/Attendance";

import AttendanceCapture from "./modules/attendance/AttendanceCapture";

import AdminAttendance from "./modules/attendance/AdminAttendance";

import Leave from "./modules/leave/Leave";

import Expense from "./modules/expense/Expense";

import ProtectedRoute from "./components/ProtectedRoute";

import Users from "./modules/dashboard/Users";

import Register from "./modules/auth/Register";

import AdminLeave from "./modules/leave/AdminLeave";

import AdminExpense from "./modules/expense/AdminExpense";

import Departments from "./modules/admin/departments/Departments";
import AddDepartment from "./modules/admin/departments/AddDepartment";
import AddRole from "./modules/admin/roles/AddRole";
import EditRole from "./modules/admin/roles/EditRole";
import ViewRole from "./modules/admin/roles/ViewRole";
import RolesPermissions from "./modules/admin/roles/RolesPermission";
import EditDepartment from "./modules/admin/departments/EditDepartment";
import ViewDepartment from "./modules/admin/departments/ViewDepartment";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

 <Route
  path="/admin/departments"
  element={
    <ProtectedRoute>
      <Departments />  {/* List view */}
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/departments/add"
  element={
    <ProtectedRoute>
      <AddDepartment />  {/* Form view */}
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/departments/:id"
  element={
    <ProtectedRoute>
      <ViewDepartment />  {/* Form view */}
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/departments/edit/:id"
  element={
    <ProtectedRoute>
      <EditDepartment />  {/* Form view */}
    </ProtectedRoute>
  }
/>


<Route path="/admin/roles" element={<RolesPermissions />} />
        <Route path="/admin/roles/add" element={<AddRole />} />
        <Route path="/admin/roles/view/:id" element={<ViewRole />} />
        <Route path="/admin/roles/edit/:id" element={<EditRole />} />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/attendance/capture"
          element={
            <ProtectedRoute>
              <AttendanceCapture />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/admin-attendance"
          element={
            <ProtectedRoute>
              <AdminAttendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-expenses"
          element={
            <ProtectedRoute>
              <AdminExpense/>
            </ProtectedRoute>
          }
        />

        <Route
  path="/admin-leaves"
  element={
    <ProtectedRoute>
      <AdminLeave />
    </ProtectedRoute>
  }
/>

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaves"
          element={
            <ProtectedRoute>
              <Leave />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expense />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
