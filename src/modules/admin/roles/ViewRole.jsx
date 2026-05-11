// modules/admin/roles/ViewRole.jsx

import { useState, useEffect } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Shield, ArrowLeft, Edit, Calendar, User, Key, Info,
  CheckCircle, XCircle, Fingerprint, Briefcase, Building2,
  Clock, Eye, Lock
} from "lucide-react";
import API from "../../../api/axios";

const ViewRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoleDetails();
  }, [id]);

  const fetchRoleDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.get(`/roles/${id}`);

      // handle both formats safely
      const data = response.data?.data || response.data;

      setRole(data);
    } catch (error) {
      console.error("Error fetching role:", error);
      setError(error.response?.data?.message || "Failed to load role details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    if (status === "Active") {
      return (
        <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-green-50 text-green-700">
          <CheckCircle size={14} className="mr-1" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-red-50 text-red-700">
        <XCircle size={14} className="mr-1" />
        Inactive
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading role details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center py-12">
            <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to Load Role
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={fetchRoleDetails}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg"
              >
                Try Again
              </button>

              <Link
                to="/admin/roles"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg"
              >
                Back to Roles
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!role) {
    return (
      <DashboardLayout>
        <div className="p-6 bg-gray-50 min-h-screen text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Role Not Found</h3>
          <Link to="/admin/roles" className="text-purple-600">
            Go Back
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 min-h-screen">

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Role Details</h1>
            <p className="text-gray-500">Details of {role.name}</p>
          </div>

          <div className="flex gap-3">
            <Link
              to={`/admin/roles/edit/${role.id}`}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Edit size={18} />
              Edit
            </Link>

            <Link
              to="/admin/roles"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Back
            </Link>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="text-gray-500">Role Name</p>
              <h2 className="text-xl font-bold">{role.name}</h2>
            </div>

            <div>
              <p className="text-gray-500">Status</p>
              {getStatusBadge(role.status)}
            </div>

            <div>
              <p className="text-gray-500">Permissions Count</p>
              <h2 className="text-xl font-bold text-purple-600">
                {role.permissions_count || 0}
              </h2>
            </div>

            <div>
              <p className="text-gray-500">Created</p>
              <p>{formatDate(role.created_at)}</p>
            </div>

          </div>

          {/* Description */}
          <div>
            <p className="text-gray-500">Description</p>
            <p className="text-gray-800">
              {role.description || "No description"}
            </p>
          </div>

          {/* 🔥 PERMISSIONS SECTION (FIXED) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Key className="text-purple-600" size={20} />
              <h3 className="font-semibold text-lg">Permissions</h3>
            </div>

            {role.permissions && role.permissions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((perm, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-sm"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No permissions assigned</p>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewRole;