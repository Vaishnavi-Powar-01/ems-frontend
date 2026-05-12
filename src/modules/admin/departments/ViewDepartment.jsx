import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import API from "../../../api/axios";

const ViewDepartment = () => {
  const { id } = useParams();

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
        <div className="p-6">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!department) {
    return (
      <DashboardLayout>
        <div className="p-6">No department found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4">

        <h1 className="text-2xl font-bold">
          {department?.department_name}
        </h1>

        <p><b>Code:</b> {department?.department_code}</p>
        <p><b>Manager:</b> {department?.manager_name}</p>
        <p><b>Description:</b> {department?.description}</p>

        <Link
          to="/admin/departments"
          className="text-blue-600"
        >
          Back
        </Link>

      </div>
    </DashboardLayout>
  );
};

export default ViewDepartment;