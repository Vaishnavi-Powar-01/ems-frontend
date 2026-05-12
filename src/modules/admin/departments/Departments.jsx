// modules/admin/departments/Departments.jsx
import { useState, useEffect } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Plus, Edit, Trash2, Eye } from "lucide-react";
import API from "../../../api/axios";

const Departments = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await API.get("/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/departments/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department? This action cannot be undone.")) {
      try {
        setDeleteLoading(id);
        const response = await API.delete(`/departments/${id}`);
        
        if (response.data.success) {
          setDepartments(prev => prev.filter(dept => dept.id !== id));
          alert(response.data.message || "Department deleted successfully");
        } else {
          alert(response.data.message || "Failed to delete department");
        }
      } catch (error) {
        console.error("Error deleting department:", error);
        const errorMessage = error.response?.data?.message || 
                            "Failed to delete department. It may have associated users or data.";
        alert(errorMessage);
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Building2 className="text-blue-600" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Departments</h1>
                <p className="text-gray-500">Manage system departments</p>
              </div>
            </div>
            <Link
              to="/admin/departments/add"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={18} />
              Add Department
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">Loading departments...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DEPARTMENT</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CODE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MANAGER</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {departments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{dept.department_name}</div>
                          <div className="text-sm text-gray-500">{dept.description || `${dept.department_name} department`}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-gray-600">{dept.department_code}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {dept.manager_name ? (
                            <>
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                                <span className="text-xs font-medium text-blue-600">
                                  {dept.manager_name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="text-sm text-gray-900">{dept.manager_name}</span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-400 italic">Not assigned</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/departments/${dept.id}`}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="View"
                          >
                            <Eye size={18} />
                          </Link>
                          <button
                            onClick={() => handleEdit(dept.id)}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(dept.id)}
                            disabled={deleteLoading === dept.id}
                            className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete"
                          >
                            {deleteLoading === dept.id ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {departments.length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No departments</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new department.</p>
                  <Link
                    to="/admin/departments/add"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Department
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Departments;