import {
  useState,
} from "react";

import DashboardLayout
from "../../../layouts/DashboardLayout";

import {
  Building2,
} from "lucide-react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import API
from "../../../api/axios";

const Departments = () => {
const navigate = useNavigate();

  const [formData,
    setFormData] =
    useState({
      departmentName: "",
      departmentCode: "",
      managerName: "",
      description: "",
    });

  const handleChange =
    (e) => {

      setFormData({
        ...formData,
        [e.target.name]:
          e.target.value,
      });
  };

const handleSubmit =
  async (e) => {

    e.preventDefault();

    try {

      await API.post(
        "/departments/add",
        formData
      );

      alert(
        "Department Added Successfully"
      );

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      alert(
        "Failed to add department"
      );
    }
};
  return (

  <DashboardLayout>

    <div className="p-6">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="mb-5 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />

        </svg>

        Back

      </button>

      <div className="bg-white rounded-2xl shadow-md p-8 max-w-3xl">

        <div className="flex items-center gap-3 mb-6">

          <div className="bg-blue-100 p-3 rounded-xl">

            <Building2
              className="text-blue-600"
              size={28}
            />

          </div>

          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              Add Department
            </h1>

            <p className="text-gray-500">
              Create and manage
              company departments
            </p>

          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* NAME */}
          <div>

            <label className="block mb-2 font-medium">
              Department Name
            </label>

            <input
              type="text"
              name="departmentName"
              value={
                formData.departmentName
              }
              onChange={handleChange}
              placeholder="Enter department name"
              className="w-full border rounded-xl p-4 outline-none focus:border-blue-500"
              required
            />

          </div>

          {/* CODE */}
          <div>

            <label className="block mb-2 font-medium">
              Department Code
            </label>

            <input
              type="text"
              name="departmentCode"
              value={
                formData.departmentCode
              }
              onChange={handleChange}
              placeholder="Enter department code"
              className="w-full border rounded-xl p-4 outline-none focus:border-blue-500"
            />

          </div>

          {/* MANAGER */}
          <div>

            <label className="block mb-2 font-medium">
              Department Manager
            </label>

            <input
              type="text"
              name="managerName"
              value={
                formData.managerName
              }
              onChange={handleChange}
              placeholder="Enter manager name"
              className="w-full border rounded-xl p-4 outline-none focus:border-blue-500"
            />

          </div>

          {/* DESCRIPTION */}
          <div>

            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows="4"
              name="description"
              value={
                formData.description
              }
              onChange={handleChange}
              placeholder="Enter description"
              className="w-full border rounded-xl p-4 outline-none focus:border-blue-500"
            />

          </div>

          {/* BUTTONS */}
          <div className="flex items-center gap-3">

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-medium"
            >
              Add Department
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="border border-gray-300 hover:bg-gray-100 px-6 py-4 rounded-xl font-medium"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>

  </DashboardLayout>

);
};

export default Departments;