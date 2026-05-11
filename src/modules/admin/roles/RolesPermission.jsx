// modules/admin/roles/RolesPermissions.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Shield, Plus } from "lucide-react";
import API from "../../../api/axios";

const RolesPermissions = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/roles");

      if (response.data?.data) {
        setRoles(response.data.data);
      } else if (Array.isArray(response.data)) {
        setRoles(response.data);
      } else {
        setRoles([]);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to fetch roles from server"
      );

      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Roles & Permissions
            </h1>

            <p className="text-gray-600 mt-2 text-lg">
              Manage system roles and permissions
            </p>
          </div>

          <Link
            to="/admin/roles/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all"
          >
            <Plus size={20} />
            Add Role
          </Link>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Error */}
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6">
                {error}
              </div>
            )}

            {/* Roles Grid */}
            {roles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-all"
                  >
                    {/* Top */}
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-3 rounded-xl">
                          <Shield className="text-blue-600" size={22} />
                        </div>

                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {role.name}
                          </h2>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-lg mb-6 min-h-[56px]">
                      {role.description || "No description available"}
                    </p>

                    {/* Info */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-lg">
                          Permissions:
                        </span>

                        <span className="font-bold text-xl text-gray-900">
                          {role.permissions_count || 0}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-lg">
                          Created:
                        </span>

                        <span className="font-semibold text-gray-900">
                          {role.created_at
                            ? new Date(role.created_at).toLocaleDateString("en-GB")
                            : "-"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-gray-200 pt-5">
                      <div className="flex flex-wrap gap-5 text-lg">
                        <Link
                          to={`/admin/roles/view/${role.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details
                        </Link>

                        <Link
                          to={`/admin/roles/edit/${role.id}`}
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty */
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  No Roles Found
                </h3>

                <p className="text-gray-500 mb-6">
                  Start by creating your first role
                </p>

                <Link
                  to="/admin/roles/add"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
                >
                  <Plus size={20} />
                  Add Role
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RolesPermissions;