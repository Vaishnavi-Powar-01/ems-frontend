import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import {
  Building2,
  ArrowLeft,
  User2,
  FileText,
  Hash,
} from "lucide-react";
import API from "../../../api/axios";

const ViewDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDepartment = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/departments/${id}`);

      setDepartment(res.data);

    } catch (err) {
      alert("Failed to load department");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[300px]">
          <div className="text-gray-500">Loading department...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!department) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 text-gray-500">
          Department not found
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex items-center gap-2 text-gray-800 font-semibold">
            <Building2 size={22} />
            Department Details
          </div>

        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* TOP */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-10 text-white">

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <Building2 size={32} />
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  {department?.department_name}
                </h1>

                <p className="text-blue-100 mt-1">
                  Department Information
                </p>
              </div>

            </div>

          </div>

          {/* CONTENT */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="rounded-xl border border-gray-100 p-5 bg-gray-50">
              <div className="flex items-center gap-2 mb-3 text-blue-600">
                <Hash size={18} />
                <h3 className="font-semibold">
                  Department Code
                </h3>
              </div>

              <p className="text-gray-700">
                {department?.department_code || "-"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-5 bg-gray-50">
              <div className="flex items-center gap-2 mb-3 text-blue-600">
                <User2 size={18} />
                <h3 className="font-semibold">
                  Manager
                </h3>
              </div>

              <p className="text-gray-700">
                {department?.manager_name || "-"}
              </p>
            </div>

            <div className="md:col-span-2 rounded-xl border border-gray-100 p-5 bg-gray-50">
              <div className="flex items-center gap-2 mb-3 text-blue-600">
                <FileText size={18} />
                <h3 className="font-semibold">
                  Description
                </h3>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {department?.description || "No description available"}
              </p>
            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default ViewDepartment;