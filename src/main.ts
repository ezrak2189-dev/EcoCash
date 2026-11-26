import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

// App state
// let isLoggedIn = false
let userPhone = ''
let balance = 1000.00
let loanLimit = 50000.00
let activeLoan = 0.00

function renderLogin() {
  app.innerHTML = `
    <div class="card">
      <div class="brand">Eco <span>Cash</span></div>
      <h2>Sign in to your account</h2>
      <p class="subtitle">Access instant loans, send money, and manage payments</p>
      <form id="login-form">
        <label>Mobile Number</label>
        <input type="tel" id="phone" placeholder="+263 77 123 4567" required />
        
        <label>4-Digit PIN</label>
        <input type="password" id="pin" maxlength="4" placeholder="••••" required />
        
        <button type="submit" class="btn-primary">Login</button>
      </form>
    </div>
  `

  document.getElementById('login-form')!.addEventListener('submit', (e) => {
    e.preventDefault()
    const phoneInput = (document.getElementById('phone') as HTMLInputElement).value
    userPhone = phoneInput
    isLoggedIn = true
    renderDashboard()
  })
}

function renderDashboard() {
  app.innerHTML = `
    <div class="dashboard">
      <header class="topbar">
        <div class="brand">EcoCash <span>Finance</span></div>
        <div class="user-info">
          <span>${userPhone}</span>
          <button id="logout-btn" class="btn-outline">Logout</button>
        </div>
      </header>

      <div class="grid">
        <div class="stat-card">
          <span class="label">Wallet Balance</span>
          <h3>$${balance.toFixed(2)}</h3>
        </div>
        <div class="stat-card">
          <span class="label">Available Loan Limit</span>
          <h3>$${(loanLimit - activeLoan).toFixed(2)}</h3>
        </div>
        <div class="stat-card">
          <span class="label">Active Loan Owed</span>
          <h3>$${activeLoan.toFixed(2)}</h3>
        </div>
      </div>

      <div class="actions-grid">
        <div class="card">
          <h3>Request Instant Loan</h3>
          <form id="loan-form">
            <label>Loan Amount ($)</label>
            <input type="number" id="loan-amount" min="10" max="${loanLimit - activeLoan}" placeholder="Enter amount" required />
            <button type="submit" class="btn-primary">Borrow Now</button>
          </form>
        </div>

        <div class="card">
          <h3>Send Payment / Repay</h3>
          <form id="pay-form">
            <label>Recipient Phone or Merchant Code</label>
            <input type="text" id="recipient" placeholder="0772 000 000" required />
            <label>Amount ($)</label>
            <input type="number" id="pay-amount" min="1" max="${balance}" placeholder="Enter amount" required />
            <button type="submit" class="btn-secondary">Send Payment</button>
          </form>
        </div>
      </div>
      <p id="status-msg" class="status"></p>
    </div>
  `

  document.getElementById('logout-btn')!.addEventListener('click', () => {
    isLoggedIn = false
    renderLogin()
  })

  document.getElementById('loan-form')!.addEventListener('submit', (e) => {
    e.preventDefault()
    const amt = Number((document.getElementById('loan-amount') as HTMLInputElement).value)
    if (amt > 0 && amt <= loanLimit - activeLoan) {
      activeLoan += amt
      balance += amt
      renderDashboard()
      showStatus(`Loan of $${amt.toFixed(2)} approved and credited to your wallet.`)
    }
  })

  document.getElementById('pay-form')!.addEventListener('submit', (e) => {
    e.preventDefault()
    const amt = Number((document.getElementById('pay-amount') as HTMLInputElement).value)
    const recipient = (document.getElementById('recipient') as HTMLInputElement).value
    if (amt > 0 && amt <= balance) {
      balance -= amt
      renderDashboard()
      showStatus(`Sent $${amt.toFixed(2)} to ${recipient}.`)
    }
  })
}

function showStatus(message: string) {
  const el = document.getElementById('status-msg')
  if (el) el.textContent = message
}

// Start on Login screen
renderLogin()
