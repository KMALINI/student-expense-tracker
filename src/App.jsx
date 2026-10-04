import { useEffect, useMemo, useState } from "react";
import "./App.css";

const categories = [
  "Food",
  "Transport",
  "Education",
  "Shopping",
  "Entertainment",
  "Health",
  "Other",
];

const initialForm = {
  title: "",
  amount: "",
  category: "Food",
  date: new Date().toISOString().split("T")[0],
  notes: "",
};

function App() {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("studentExpenses");
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterMonth, setFilterMonth] = useState("All");

  useEffect(() => {
    localStorage.setItem("studentExpenses", JSON.stringify(expenses));
  }, [expenses]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.amount || Number(form.amount) <= 0) {
      alert("Please enter a valid expense name and amount.");
      return;
    }

    const expenseData = {
      id: editingId || Date.now(),
      title: form.title.trim(),
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
      notes: form.notes.trim(),
    };

    if (editingId) {
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === editingId ? expenseData : expense
        )
      );
      setEditingId(null);
    } else {
      setExpenses((prev) => [expenseData, ...prev]);
    }

    setForm(initialForm);
  };

  const handleEdit = (expense) => {
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      notes: expense.notes || "",
    });

    setEditingId(expense.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (confirmed) {
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch =
        expense.title.toLowerCase().includes(search.toLowerCase()) ||
        expense.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        filterCategory === "All" || expense.category === filterCategory;

      const matchesMonth =
        filterMonth === "All" ||
        expense.date.startsWith(filterMonth);

      return matchesSearch && matchesCategory && matchesMonth;
    });
  }, [expenses, search, filterCategory, filterMonth]);

  const totalSpent = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthlySpent = expenses
    .filter((expense) => expense.date.startsWith(currentMonth))
    .reduce((total, expense) => total + Number(expense.amount), 0);

  const highestExpense =
    expenses.length > 0
      ? Math.max(...expenses.map((expense) => Number(expense.amount)))
      : 0;

  const categoryTotals = categories.map((category) => ({
    category,
    total: expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + Number(expense.amount), 0),
  }));

  const getCategoryClass = (category) => {
    return category.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">PERSONAL FINANCE</p>
          <h1>Student Expense Tracker</h1>
          <p className="subtitle">
            Track your spending, understand your habits, and stay within
            budget.
          </p>
        </div>

        <div className="header-icon">₹</div>
      </header>

      <main className="container">
        <section className="summary-grid">
          <div className="summary-card primary">
            <div className="card-icon">₹</div>
            <div>
              <p>Total Spending</p>
              <h2>₹{totalSpent.toLocaleString("en-IN")}</h2>
              <span>All recorded expenses</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon blue">📅</div>
            <div>
              <p>This Month</p>
              <h2>₹{monthlySpent.toLocaleString("en-IN")}</h2>
              <span>Current month spending</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon orange">📊</div>
            <div>
              <p>Total Expenses</p>
              <h2>{expenses.length}</h2>
              <span>Transactions recorded</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon red">↑</div>
            <div>
              <p>Highest Expense</p>
              <h2>₹{highestExpense.toLocaleString("en-IN")}</h2>
              <span>Single highest transaction</span>
            </div>
          </div>
        </section>

        <section className="content-grid">
          <div className="form-card">
            <div className="section-heading">
              <div>
                <h2>{editingId ? "Edit Expense" : "Add New Expense"}</h2>
                <p>
                  {editingId
                    ? "Update your expense details."
                    : "Record your daily spending."}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Expense Name</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Lunch, Bus Pass"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="0"
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Notes <span>(Optional)</span></label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Add a short note..."
                  rows="3"
                />
              </div>

              <div className="button-row">
                <button className="primary-button" type="submit">
                  {editingId ? "Update Expense" : "+ Add Expense"}
                </button>

                {editingId && (
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="category-card">
            <div className="section-heading">
              <div>
                <h2>Spending by Category</h2>
                <p>See where your money goes.</p>
              </div>
            </div>

            <div className="category-list">
              {categoryTotals.map((item) => {
                const percentage =
                  totalSpent > 0 ? (item.total / totalSpent) * 100 : 0;

                return (
                  <div className="category-item" key={item.category}>
                    <div className="category-top">
                      <span>{item.category}</span>
                      <strong>
                        ₹{item.total.toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <div className="progress">
                      <div
                        className={`progress-fill ${getCategoryClass(
                          item.category
                        )}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>

                    <small>{percentage.toFixed(1)}% of total spending</small>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="expenses-card">
          <div className="expenses-header">
            <div>
              <h2>Expense History</h2>
              <p>View and manage your recorded expenses.</p>
            </div>

            <span className="expense-count">
              {filteredExpenses.length} record
              {filteredExpenses.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="filters">
            <input
              type="text"
              placeholder="🔍 Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <input
              type="month"
              value={filterMonth === "All" ? "" : filterMonth}
              onChange={(e) =>
                setFilterMonth(e.target.value || "All")
              }
            />

            {(search || filterCategory !== "All" || filterMonth !== "All") && (
              <button
                className="clear-button"
                onClick={() => {
                  setSearch("");
                  setFilterCategory("All");
                  setFilterMonth("All");
                }}
              >
                Clear
              </button>
            )}
          </div>

          {filteredExpenses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">₹</div>
              <h3>No expenses found</h3>
              <p>
                Add your first expense or change your filters to see records.
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Expense</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Notes</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>
                        <strong>{expense.title}</strong>
                      </td>

                      <td>
                        <span
                          className={`category-badge ${getCategoryClass(
                            expense.category
                          )}`}
                        >
                          {expense.category}
                        </span>
                      </td>

                      <td>
                        {new Date(
                          `${expense.date}T00:00:00`
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="notes-cell">
                        {expense.notes || "—"}
                      </td>

                      <td className="amount-cell">
                        ₹{Number(expense.amount).toLocaleString("en-IN")}
                      </td>

                      <td>
                        <div className="actions">
                          <button
                            className="edit-button"
                            onClick={() => handleEdit(expense)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-button"
                            onClick={() => handleDelete(expense.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>Student Expense Tracker • Built with React & LocalStorage</p>
      </footer>
    </div>
  );
}

export default App;