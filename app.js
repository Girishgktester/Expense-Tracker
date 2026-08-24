const STORAGE_KEY = "pocket-ledger-expenses-v1";
const CURRENCY = "INR";
const categories = ["Food", "Transport", "Bills", "Shopping", "Health", "Entertainment", "Other"];

const elements = {
  form: document.querySelector("#expense-form"),
  expenseId: document.querySelector("#expense-id"),
  description: document.querySelector("#description"),
  amount: document.querySelector("#amount"),
  date: document.querySelector("#date"),
  category: document.querySelector("#category"),
  submitButton: document.querySelector("#submit-button"),
  cancelButton: document.querySelector("#cancel-button"),
  search: document.querySelector("#search"),
  filterCategory: document.querySelector("#filter-category"),
  filterMonth: document.querySelector("#filter-month"),
  list: document.querySelector("#expense-list"),
  recordCount: document.querySelector("#record-count"),
  visibleTotal: document.querySelector("#visible-total"),
  visibleCount: document.querySelector("#visible-count"),
  monthTotal: document.querySelector("#month-total"),
  monthLabel: document.querySelector("#month-label"),
  topCategory: document.querySelector("#top-category"),
  topCategoryTotal: document.querySelector("#top-category-total"),
  todayLabel: document.querySelector("#today-label"),
  notice: document.querySelector("#app-notice")
};

let expenses = loadExpenses();

function getLocalDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: CURRENCY }).format(amount);
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${dateString}T00:00:00`));
}

function formatMonth(monthString) {
  if (!monthString) return "All months";
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(`${monthString}-01T00:00:00`));
}

function loadExpenses() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(stored)) throw new Error("Stored data is not a list");
    return stored.filter(isValidStoredExpense);
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
    showNotice("We found damaged saved data and reset the local list.", "error");
    return [];
  }
}

function isValidStoredExpense(expense) {
  return expense && typeof expense.id === "string" && typeof expense.description === "string" && expense.description.trim() && Number.isFinite(Number(expense.amount)) && Number(expense.amount) > 0 && /^\d{4}-\d{2}-\d{2}$/.test(expense.date) && categories.includes(expense.category);
}

function saveExpenses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function getVisibleExpenses() {
  const searchTerm = elements.search.value.trim().toLowerCase();
  const selectedCategory = elements.filterCategory.value;
  const selectedMonth = elements.filterMonth.value;

  return expenses.filter((expense) => {
    const matchesSearch = !searchTerm || expense.description.toLowerCase().includes(searchTerm) || expense.category.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === "all" || expense.category === selectedCategory;
    const matchesMonth = !selectedMonth || expense.date.startsWith(selectedMonth);
    return matchesSearch && matchesCategory && matchesMonth;
  }).sort((first, second) => second.date.localeCompare(first.date) || second.createdAt - first.createdAt);
}

function validateForm() {
  const fields = ["description", "amount", "date", "category"];
  const errors = {};
  fields.forEach((field) => {
    const errorElement = document.querySelector(`#${field}-error`);
    const input = elements[field];
    input.classList.remove("field-invalid");
    errorElement.textContent = "";
  });

  if (!elements.description.value.trim()) errors.description = "Add a short description.";
  if (!Number.isFinite(Number(elements.amount.value)) || Number(elements.amount.value) <= 0) errors.amount = "Enter an amount greater than zero.";
  if (!elements.date.value) errors.date = "Choose a date.";
  if (!categories.includes(elements.category.value)) errors.category = "Choose a category.";

  Object.entries(errors).forEach(([field, message]) => {
    elements[field].classList.add("field-invalid");
    document.querySelector(`#${field}-error`).textContent = message;
  });
  return Object.keys(errors).length === 0;
}

function resetForm() {
  elements.form.reset();
  elements.expenseId.value = "";
  elements.date.value = getLocalDate();
  elements.submitButton.innerHTML = "Save expense <span aria-hidden=\"true\">&#8594;</span>";
  elements.cancelButton.hidden = true;
  ["description", "amount", "date", "category"].forEach((field) => {
    elements[field].classList.remove("field-invalid");
    document.querySelector(`#${field}-error`).textContent = "";
  });
}

function startEdit(expense) {
  elements.expenseId.value = expense.id;
  elements.description.value = expense.description;
  elements.amount.value = expense.amount;
  elements.date.value = expense.date;
  elements.category.value = expense.category;
  elements.submitButton.textContent = "Update expense";
  elements.cancelButton.hidden = false;
  elements.description.focus();
  elements.form.scrollIntoView({ behavior: "smooth", block: "center" });
}

function handleSubmit(event) {
  event.preventDefault();
  if (!validateForm()) return;

  const existingId = elements.expenseId.value;
  const expense = {
    id: existingId || crypto.randomUUID(),
    description: elements.description.value.trim(),
    amount: Number(Number(elements.amount.value).toFixed(2)),
    date: elements.date.value,
    category: elements.category.value,
    createdAt: existingId ? expenses.find((item) => item.id === existingId).createdAt : Date.now()
  };

  if (existingId) {
    expenses = expenses.map((item) => item.id === existingId ? expense : item);
    showNotice("Expense updated.");
  } else {
    expenses.push(expense);
    showNotice("Expense saved.");
  }
  saveExpenses();
  resetForm();
  render();
}

function deleteExpense(id) {
  const expense = expenses.find((item) => item.id === id);
  if (!expense || !window.confirm(`Delete ${expense.description}?`)) return;
  expenses = expenses.filter((item) => item.id !== id);
  saveExpenses();
  showNotice("Expense deleted.");
  render();
}

function renderList(visibleExpenses) {
  elements.recordCount.textContent = `${visibleExpenses.length} ${visibleExpenses.length === 1 ? "record" : "records"}`;
  if (!visibleExpenses.length) {
    const hasFilters = elements.search.value || elements.filterCategory.value !== "all" || elements.filterMonth.value;
    elements.list.innerHTML = `<div class="empty-state"><div><strong>${hasFilters ? "No matching expenses" : "Your ledger is waiting"}</strong><p>${hasFilters ? "Try adjusting your filters." : "Add your first expense to start seeing your spending clearly."}</p></div></div>`;
    return;
  }

  elements.list.innerHTML = visibleExpenses.map((expense) => `<article class="expense-item"><div class="expense-main"><p class="expense-description">${escapeHtml(expense.description)}</p><p class="expense-meta">${formatDate(expense.date)}</p></div><span class="category-tag">${escapeHtml(expense.category)}</span><p class="expense-amount">${formatCurrency(expense.amount)}</p><div class="item-actions"><button class="icon-button" type="button" data-action="edit" data-id="${expense.id}" aria-label="Edit ${escapeHtml(expense.description)}">&#9998;</button><button class="icon-button" type="button" data-action="delete" data-id="${expense.id}" aria-label="Delete ${escapeHtml(expense.description)}">&#10005;</button></div></article>`).join("");
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function renderSummary(visibleExpenses) {
  const visibleTotal = visibleExpenses.reduce((total, expense) => total + expense.amount, 0);
  const currentMonth = getLocalDate().slice(0, 7);
  const monthExpenses = expenses.filter((expense) => expense.date.startsWith(currentMonth));
  const monthTotal = monthExpenses.reduce((total, expense) => total + expense.amount, 0);
  const categoryTotals = expenses.reduce((totals, expense) => ({ ...totals, [expense.category]: (totals[expense.category] || 0) + expense.amount }), {});
  const topEntry = Object.entries(categoryTotals).sort((first, second) => second[1] - first[1])[0];

  elements.visibleTotal.textContent = formatCurrency(visibleTotal);
  elements.visibleCount.textContent = `${visibleExpenses.length} ${visibleExpenses.length === 1 ? "expense" : "expenses"} in view`;
  elements.monthTotal.textContent = formatCurrency(monthTotal);
  elements.monthLabel.textContent = formatMonth(currentMonth);
  elements.topCategory.textContent = topEntry ? topEntry[0] : "No data";
  elements.topCategoryTotal.textContent = topEntry ? formatCurrency(topEntry[1]) : "Add an expense to see it here";
}

function render() {
  const visibleExpenses = getVisibleExpenses();
  renderList(visibleExpenses);
  renderSummary(visibleExpenses);
}

function showNotice(message, type = "success") {
  if (!elements.notice) return;
  elements.notice.textContent = message;
  elements.notice.dataset.type = type;
  elements.notice.hidden = false;
  window.setTimeout(() => { elements.notice.hidden = true; }, 3500);
}

elements.form.addEventListener("submit", handleSubmit);
elements.cancelButton.addEventListener("click", resetForm);
[elements.search, elements.filterCategory, elements.filterMonth].forEach((element) => element.addEventListener("input", render));
elements.list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const expense = expenses.find((item) => item.id === button.dataset.id);
  if (button.dataset.action === "edit" && expense) startEdit(expense);
  if (button.dataset.action === "delete") deleteExpense(button.dataset.id);
});

elements.todayLabel.textContent = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date());
elements.date.value = getLocalDate();
elements.filterMonth.max = getLocalDate().slice(0, 7);
render();
