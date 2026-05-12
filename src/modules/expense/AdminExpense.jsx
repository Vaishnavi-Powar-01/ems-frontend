import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../api/axios";

import { MoreVertical } from "lucide-react";

const IMAGE_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "");

// 🔥 SAFE ID HANDLER (IMPORTANT FIX)
const getExpenseId = (expense) =>
  expense.expense_id || expense.id || expense.expenseId || expense._id;

const AdminExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  // FETCH EXPENSES
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await API.get("/expenses/all");
      setExpenses(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    if (!id) {
      console.error("❌ Expense ID missing");
      return;
    }

    try {
      await API.put(`/expenses/update-status/${id}`, {
        status,
      });

      fetchExpenses();
    } catch (err) {
      console.log("UPDATE ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // STATS
  const pendingCount = expenses.filter(
    (e) => e.status === "pending"
  ).length;

  const approvedCount = expenses.filter(
    (e) => e.status === "approved"
  ).length;

  const rejectedCount = expenses.filter(
    (e) => e.status === "rejected"
  ).length;

  const totalAmount = expenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  return (
    <DashboardLayout>
      <div className="p-6 bg-blue-50 min-h-screen">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">
              Expense Management
            </h1>
            <p className="text-gray-600">
              Manage employee expense claims
            </p>
          </div>

          <button
            onClick={fetchExpenses}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl"
          >
            Refresh
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500">Pending</p>
            <h2 className="text-3xl font-bold text-yellow-500">
              {pendingCount}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500">Approved</p>
            <h2 className="text-3xl font-bold text-green-600">
              {approvedCount}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500">Rejected</p>
            <h2 className="text-3xl font-bold text-red-600">
              {rejectedCount}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500">Total</p>
            <h2 className="text-3xl font-bold text-blue-600">
              ₹{totalAmount}
            </h2>
          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full">

            <thead className="bg-blue-100">
              <tr>
                <th className="p-4 text-left">Employee</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Vendor</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Bill</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center p-6">
                    Loading...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center p-6">
                    No Expenses Found
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => {
                  const id = getExpenseId(expense);

                  return (
                    <tr
                      key={id}
                      className="border-b hover:bg-blue-50"
                    >

                      <td className="p-4">{expense.name}</td>
                      <td className="p-4">{expense.category}</td>
                      <td className="p-4">{expense.vendor}</td>
                      <td className="p-4 truncate max-w-xs">
                        {expense.description}
                      </td>
                      <td className="p-4 font-semibold">
                        ₹{expense.amount}
                      </td>
                      <td className="p-4">
                        {expense.expense_date?.split("T")[0]}
                      </td>

                      <td className="p-4">
                        {expense.bill_image ? (
                          <a
                            href={`${IMAGE_BASE_URL}/uploads/expenses/${expense.bill_image}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            View Bill
                          </a>
                        ) : (
                          "No Bill"
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm ${
                            expense.status === "approved"
                              ? "bg-green-500"
                              : expense.status === "rejected"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        >
                          {expense.status}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="p-4 relative">

                        <button
                          onClick={() =>
                            setOpenMenu(
                              openMenu === id ? null : id
                            )
                          }
                          className="p-2 hover:bg-gray-200 rounded-full"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {openMenu === id && (
                          <div className="absolute right-10 mt-2 w-36 bg-white border rounded-xl shadow z-50">

                            <button
                              onClick={() => {
                                updateStatus(id, "approved");
                                setOpenMenu(null);
                              }}
                              className="w-full text-left px-4 py-3 text-green-600 hover:bg-green-50"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() => {
                                updateStatus(id, "rejected");
                                setOpenMenu(null);
                              }}
                              className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                            >
                              Reject
                            </button>

                          </div>
                        )}

                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminExpense;