import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const STORAGE_KEY = "pocket-ledger-expenses-v1";
const categories = ["Food", "Transport", "Bills", "Shopping", "Health", "Entertainment", "Other"];
const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

function today() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function loadExpenses() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter((item) => item?.id && item?.description && Number(item.amount) > 0 && categories.includes(item.category)) : [];
  } catch {
    return [];
  }
}

function createExpenseId() {
  return typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `expense-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function App() {
  const [expenses, setExpenses] = useState(loadExpenses);
  const [form, setForm] = useState({ description: "", amount: "", date: today(), category: "" });
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMonth, setFilterMonth] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses)), [expenses]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("quickAdd") !== "1") return;
    const category = params.get("category");
    const amount = Number(params.get("amount"));
    if (!categories.includes(category) || !Number.isFinite(amount) || amount <= 0) {
      setNotice("The quick expense details were invalid. Nothing was added.");
      return;
    }
    setExpenses((current) => [...current, { id: createExpenseId(), description: "Quick expense", amount: Number(amount.toFixed(2)), date: today(), category, createdAt: Date.now() }]);
    window.history.replaceState({}, document.title, window.location.pathname);
    setNotice("Quick expense added.");
  }, []);

  const visibleExpenses = useMemo(() => expenses.filter((expense) => {
    const query = search.toLowerCase().trim();
    return (!query || expense.description.toLowerCase().includes(query) || expense.category.toLowerCase().includes(query)) &&
      (filterCategory === "all" || expense.category === filterCategory) &&
      (!filterMonth || expense.date.startsWith(filterMonth));
  }).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt), [expenses, search, filterCategory, filterMonth]);

  const visibleTotal = visibleExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const month = today().slice(0, 7);
  const monthTotal = expenses.filter((item) => item.date.startsWith(month)).reduce((sum, item) => sum + Number(item.amount), 0);
  const topCategory = Object.entries(expenses.reduce((result, item) => ({ ...result, [item.category]: (result[item.category] || 0) + Number(item.amount) }), {})).sort((a, b) => b[1] - a[1])[0];

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();
    const amount = Number(form.amount);
    if (!form.description.trim() || !Number.isFinite(amount) || amount <= 0 || !form.date || !categories.includes(form.category)) {
      setNotice("Add a description, positive amount, date, and category.");
      return;
    }
    const item = { ...form, description: form.description.trim(), amount: Number(amount.toFixed(2)), id: editingId || createExpenseId(), createdAt: editingId ? expenses.find((expense) => expense.id === editingId).createdAt : Date.now() };
    setExpenses(editingId ? expenses.map((expense) => expense.id === editingId ? item : expense) : [...expenses, item]);
    setForm({ description: "", amount: "", date: today(), category: "" });
    setEditingId("");
    setNotice(editingId ? "Expense updated." : "Expense saved.");
  }

  function edit(expense) {
    setForm({ description: expense.description, amount: expense.amount, date: expense.date, category: expense.category });
    setEditingId(expense.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function remove(id) {
    const item = expenses.find((expense) => expense.id === id);
    if (item && window.confirm(`Delete ${item.description}?`)) {
      setExpenses(expenses.filter((expense) => expense.id !== id));
      setNotice("Expense deleted.");
    }
  }

  return <div className="page-shell">
    <header className="site-header"><a className="brand" href="/"><span className="brand-mark">PL</span> Pocket Ledger</a><span className="storage-note"><span className="status-dot" /> Stored on this device</span></header>
    <main>
      <section className="intro"><div><p className="eyebrow">Personal finance, made clear</p><h1>Know where your money goes.</h1><p className="intro-copy">Capture everyday spending in seconds, then use the patterns to make more intentional choices.</p></div><strong className="intro-date">{new Intl.DateTimeFormat("en-IN", { weekday: "long", month: "long", day: "numeric" }).format(new Date())}</strong></section>
      <section className="summary-grid"><Summary primary label="Visible spending" value={currency.format(visibleTotal)} detail={`${visibleExpenses.length} expenses in view`} /><Summary label="This month" value={currency.format(monthTotal)} detail={new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(new Date())} /><Summary label="Top category" value={topCategory?.[0] || "No data"} detail={topCategory ? currency.format(topCategory[1]) : "Add an expense to see it here"} /></section>
      {notice && <div className="app-notice" role="status">{notice}</div>}
      <section className="workspace-grid"><article className="panel form-panel"><div className="panel-heading"><div><p className="eyebrow">Build your record</p><h2>{editingId ? "Edit expense" : "Add an expense"}</h2></div><span className="panel-icon">+</span></div><form onSubmit={submit}><Field label="What did you spend on?"><input name="description" value={form.description} onChange={updateField} maxLength="80" placeholder="e.g. Morning coffee" /></Field><div className="form-row"><Field label="Amount (INR)"><input name="amount" value={form.amount} onChange={updateField} type="number" min="0.01" step="0.01" placeholder="0.00" /></Field><Field label="Date"><input name="date" value={form.date} onChange={updateField} type="date" /></Field></div><Field label="Category"><select name="category" value={form.category} onChange={updateField}><option value="">Choose a category</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></Field><div className="form-actions"><button className="button button-primary">{editingId ? "Update expense" : "Save expense"} <span>→</span></button>{editingId && <button className="button button-quiet" type="button" onClick={() => { setEditingId(""); setForm({ description: "", amount: "", date: today(), category: "" }); }}>Cancel</button>}</div></form></article>
      <article className="panel list-panel"><div className="panel-heading list-heading"><div><p className="eyebrow">Your activity</p><h2>Expense history</h2></div><span className="record-count">{visibleExpenses.length} records</span></div><div className="filter-bar"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="⌕  Search expenses" /><select value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)}><option value="all">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select><input value={filterMonth} onChange={(event) => setFilterMonth(event.target.value)} type="month" /></div><div className="expense-list">{visibleExpenses.length ? visibleExpenses.map((expense) => <article className="expense-item" key={expense.id}><div className="expense-info"><p className="expense-description">{expense.description}</p><p className="expense-meta">{formatDate(expense.date)}</p></div><span className="category-tag">{expense.category}</span><p className="expense-amount">{currency.format(expense.amount)}</p><div className="item-actions"><button className="icon-button" onClick={() => edit(expense)} aria-label={`Edit ${expense.description}`}>✎</button><button className="icon-button" onClick={() => remove(expense.id)} aria-label={`Delete ${expense.description}`}>×</button></div></article>) : <div className="empty-state"><strong>{search || filterMonth || filterCategory !== "all" ? "No matching expenses" : "Your ledger is waiting"}</strong><p>{search || filterMonth || filterCategory !== "all" ? "Try adjusting your filters." : "Add your first expense to start seeing your spending clearly."}</p></div>}</div></article></section>
    </main><footer className="site-footer">Pocket Ledger · A quiet place for clearer choices.</footer>
  </div>;
}

function Summary({ primary, label, value, detail }) { return <article className={`summary-card ${primary ? "summary-card-primary" : ""}`}><p className="summary-label">{label}</p><p className="summary-value">{value}</p><p className="summary-detail">{detail}</p></article>; }
function Field({ label, children }) { return <div className="field-group"><label>{label}</label>{children}</div>; }

createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
