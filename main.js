const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const incomeForm = document.getElementById('income-form');
const expenseForm = document.getElementById('expense-form');
const incomeDialog = document.querySelector('.income-dialog');
const expenseDialog = document.querySelector('.expense-dialog');
const incomeAmount = document.getElementById('income-amount');
const incomeCategory = document.getElementById('income-category');
const incomeDate = document.getElementById('income-date');
const incomeNote = document.getElementById('income-note');
const expenseText = document.getElementById('expense-text');
const expenseAmount = document.getElementById('expense-amount');

// Local storage initialization
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add Income
function addIncome(e) {
  e.preventDefault();
  
  if (!incomeAmount.value || !incomeCategory.value) {
    alert('Please fill in all fields');
  } else {
    const incomeTransaction = {
      id: generateID(),
      text: incomeNote.value || 'No note',
      amount: +incomeAmount.value,
      category: incomeCategory.value,
      date: incomeDate.value
    };
    transactions.push(incomeTransaction);
    addTransactionDOM(incomeTransaction);
    updateValues();
    updateLocalStorage();
    incomeDialog.close();
    incomeForm.reset();
  }
}

// Add Expense
function addExpense(e) {
  e.preventDefault();
  
  if (!expenseText.value || !expenseAmount.value) {
    alert('Please fill in all fields');
  } else {
    const expenseTransaction = {
      id: generateID(),
      text: expenseText.value,
      amount: -Math.abs(expenseAmount.value),
      category: 'Expense',
      date: new Date().toLocaleDateString()
    };
    transactions.push(expenseTransaction);
    addTransactionDOM(expenseTransaction);
    updateValues();
    updateLocalStorage();
    expenseDialog.close();
    expenseForm.reset();
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transaction to DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;
  list.appendChild(item);
}

// Update values for Balance, Income, Expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

  balance.innerText = `₦${total}`;
  money_plus.innerText = `₦${income}`;
  money_minus.innerText = `₦${expense}`;
}

// Remove Transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Update local storage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

function closeModal(className) {
    document.querySelector(`.${className}`).close();
}

init();

// Add event listeners
incomeForm.addEventListener('submit', addIncome);
expenseForm.addEventListener('submit', addExpense);

// Show forms
document.getElementById('showIncomeForm').addEventListener('click', () => {
  incomeDialog.showModal();
});
document.getElementById('showExpenseForm').addEventListener('click', () => {
  expenseDialog.showModal();
});

// Export CSV functionality
document.getElementById('exportCSV').addEventListener('click', exportToCSV);

function exportToCSV() {
  const csvHeader = 'Text,Amount,Category,Date\n';
  const csvRows = transactions.map(txn => {
    return `${txn.text},${txn.amount},${txn.category},${txn.date}`;
  });

  const csvContent = csvHeader + csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'transactions.csv';
  link.click();
}
