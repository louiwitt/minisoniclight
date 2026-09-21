import express from 'express'
import db from './db.js'

const app = express()
const port = 3000

app.use(express.json())

// Check API health
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Login
app.post('/login', (req, res) => {
  const { username } = req.body

  // User cannot login without a username
  if (typeof username !== 'string' || username.trim() === '') {
    return res.status(400).json({
      error: 'Username is required',
    })
  }

  // Delete excess spaces
  const trimmedUsername = username.trim()

  // Check if user already exists
  const existingUserStmt = db.prepare('SELECT id, username, role FROM users WHERE username = ?')
  const existingUser = existingUserStmt.get(trimmedUsername)

  // If user exists, return user
  if (existingUser) {
    return res.json(existingUser)
  }

  // Else create user into db
  const insertUserStmt = db.prepare('INSERT INTO users (username) VALUES (?)')
  const insertUser = insertUserStmt.run(trimmedUsername)

  return res.status(201).json({
    id: insertUser.lastInsertRowid,
    username: trimmedUsername,
    role: 'user',
  })

})



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})