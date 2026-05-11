import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import API from "../../api/axios";

const AdminExpense = () => {

  const [expenses, setExpenses] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [openMenu, setOpenMenu] =
    useState(null);


  // FETCH ALL EXPENSES
  const fetchExpenses =
    async () => {

      try {

        setLoading(true);

        const response =
          await API.get(
            "/expenses/all"
          );

        setExpenses(
          response.data
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };


  // UPDATE STATUS
  const updateStatus =
    async (id, status) => {

      try {

        await API.put(
          `/expenses/update-status/${id}`,
          {
            status,
          }
        );

        alert(
          "Expense Updated"
        );

        fetchExpenses();

      } catch (error) {

        console.log(error);

      }
    };


  useEffect(() => {

    fetchExpenses();

  }, []);


  // STATS
  const pendingCount =
    expenses.filter(
      (item) =>
        item.status ===
        "pending"
    ).length;


  const approvedCount =
    expenses.filter(
      (item) =>
        item.status ===
        "approved"
    ).length;


  const rejectedCount =
    expenses.filter(
      (item) =>
        item.status ===
        "rejected"
    ).length;


  const totalAmount =
    expenses.reduce(
      (total, item) =>
        total +
        Number(item.amount),
      0
    );


  return (
    <DashboardLayout>

      <div className="p-6 bg-blue-50 min-h-screen">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-8">

          <div>

            <h1 className="text-3xl font-bold text-blue-900">
              Expense Management
            </h1>

            <p className="text-gray-600 mt-1">
              Manage employee expense claims
            </p>

          </div>


          <button
            onClick={
              fetchExpenses
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow"
          >
            Refresh
          </button>

        </div>


        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

          <div className="bg-white border border-yellow-200 rounded-2xl p-5 shadow">

            <h2 className="text-gray-500">
              Pending
            </h2>

            <p className="text-3xl font-bold text-yellow-500 mt-3">
              {pendingCount}
            </p>

          </div>


          <div className="bg-white border border-green-200 rounded-2xl p-5 shadow">

            <h2 className="text-gray-500">
              Approved
            </h2>

            <p className="text-3xl font-bold text-green-600 mt-3">
              {approvedCount}
            </p>

          </div>


          <div className="bg-white border border-red-200 rounded-2xl p-5 shadow">

            <h2 className="text-gray-500">
              Rejected
            </h2>

            <p className="text-3xl font-bold text-red-600 mt-3">
              {rejectedCount}
            </p>

          </div>


          <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow">

            <h2 className="text-gray-500">
              Total Amount
            </h2>

            <p className="text-3xl font-bold text-blue-600 mt-3">

              ₹
              {totalAmount}

            </p>

          </div>

        </div>


        {/* TABLE */}

        <div className="bg-white rounded-2xl shadow overflow-x-auto">

          <table className="w-full">

            <thead className="bg-blue-100">

              <tr>

                <th className="p-4 text-left text-blue-900">
                  Employee
                </th>

                <th className="p-4 text-left text-blue-900">
                  Category
                </th>

                <th className="p-4 text-left text-blue-900">
                  Vendor
                </th>

                <th className="p-4 text-left text-blue-900">
                  Description
                </th>

                <th className="p-4 text-left text-blue-900">
                  Amount
                </th>

                <th className="p-4 text-left text-blue-900">
                  Date
                </th>

                <th className="p-4 text-left text-blue-900">
                  Bill
                </th>

                <th className="p-4 text-left text-blue-900">
                  Status
                </th>

                <th className="p-4 text-left text-blue-900">
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="9"
                    className="text-center p-6"
                  >
                    Loading...
                  </td>

                </tr>

              ) : expenses.length === 0 ? (

                <tr>

                  <td
                    colSpan="9"
                    className="text-center p-6"
                  >
                    No Expenses Found
                  </td>

                </tr>

              ) : (

                expenses.map(
                  (expense) => (

                    <tr
                      key={expense.id}
                      className="border-b hover:bg-blue-50 transition"
                    >

                      <td className="p-4 font-medium">
                        {expense.name}
                      </td>

                      <td className="p-4">
                        {
                          expense.category
                        }
                      </td>

                      <td className="p-4">
                        {
                          expense.vendor
                        }
                      </td>

                      <td className="p-4 max-w-xs truncate">
                        {
                          expense.description
                        }
                      </td>

                      <td className="p-4 font-semibold">
                        ₹
                        {
                          expense.amount
                        }
                      </td>

                      <td className="p-4">

                        {
                          expense.expense_date?.split(
                            "T"
                          )[0]
                        }

                      </td>

                      <td className="p-4">

                        {expense.bill_image ? (

                          <a
                            href={`http://localhost:5000/uploads/expenses/${expense.bill_image}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
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
                            expense.status ===
                            "approved"
                              ? "bg-green-500"
                              : expense.status ===
                                "rejected"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        >
                          {
                            expense.status
                          }
                        </span>

                      </td>

                      {/* ACTION */}

                      <td className="p-4 relative">

                        <button
                          onClick={() =>
                            setOpenMenu(
                              openMenu === expense.id
                                ? null
                                : expense.id
                            )
                          }
                          className="p-2 rounded-full hover:bg-gray-200 text-xl"
                        >
                          ⋮
                        </button>

                        {openMenu === expense.id && (

                          <div className="absolute right-10 mt-2 w-36 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">

                            <button
                              onClick={() => {
                                updateStatus(
                                  expense.id,
                                  "approved"
                                );
                                setOpenMenu(null);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-green-50 text-green-600 font-medium"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() => {
                                updateStatus(
                                  expense.id,
                                  "rejected"
                                );
                                setOpenMenu(null);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 font-medium"
                            >
                              Reject
                            </button>

                          </div>

                        )}

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default AdminExpense;