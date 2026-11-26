const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

// In-memory account state (replace with a database like SQLite/MongoDB/PostgreSQL later)
let account = {
  phone: '',
  balance: 1000.00,
  loanLimit: 50000.00,
  activeLoan: 0.00,
  transactions: []
}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { phone, pin } = req.body
  if (!phone || !pin || String(pin).length !== 4) {
    return res.status(400).json({ error: 'Valid phone and 4-digit PIN are required.' })
  }
  account.phone = phone
  res.json({ message: 'Logged in', account })
})

// Get current account state
app.get('/api/account', (req, res) => {
  res.json(account)
})

// Request instant loan
app.post('/api/loan', (req, res) => {
  const amount = Number(req.body.amount)
  const availableLimit = account.loanLimit - account.activeLoan

  if (!amount || amount <= 0 || amount > availableLimit) {
    return res.status(400).json({ error: 'Invalid or exceeding loan amount.' })
  }

  account.activeLoan += amount
  account.balance += amount
  account.transactions.unshift({
    id: Date.now(),
    type: 'LOAN',
    amount,
    note: 'Instant Loan Disbursement',
    date: new Date().toISOString()
  })

  res.json({
    message: `Loan of $${amount.toFixed(2)} approved and credited to your wallet.`,
    account
  })
})

// Send payment
app.post('/api/pay', (req, res) => {
  const amount = Number(req.body.amount)
  const recipient = String(req.body.recipient || '').trim()

  if (!recipient || !amount || amount <= 0 || amount > account.balance) {
    return res.status(400).json({ error: 'Invalid recipient or insufficient balance.' })
  }

  account.balance -= amount
  account.transactions.unshift({
    id: Date.now(),
    type: 'PAYMENT',
    amount,
    note: `Paid to ${recipient}`,
    date: new Date().toISOString()
  })

  res.json({
    message: `Sent $${amount.toFixed(2)} to ${recipient}.`,
    account
  })
})

app.listen(PORT, () => {
  console.log(`EcoCash backend running on http://localhost:${PORT}`)
})