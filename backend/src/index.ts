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


// Create and save a drawing
app.post('/drawing', (req, res) => {
  const userId = Number(req.header('X-User-Id'))
  const { data } = req.body

  // Check if id exists and is an integer
  if (!Number.isInteger(userId)) {
    return res.status(401).json({
      error: 'User identification is required',
    })
  }

  // Check the drawing data to save
  if (typeof data !== 'string' || data.trim() === '') {
    return res.status(400).json({
      error: 'Drawing data is required',
    })
  }

  // Get user
  const user = db
    .prepare('SELECT id FROM users WHERE id = ?')
    .get(userId)

  if (!user) {
    return res.status(401).json({
      error: 'User not found',
    })
  }

  // Save drawing
  const insertDrawingStmt = db
    .prepare(`
      INSERT INTO drawings (user_id, data)
      VALUES (?, ?)
    `)

  const insertDrawing = insertDrawingStmt.run(userId, data)

  return res.status(201).json({
    id: insertDrawing.lastInsertRowid,
    userId,
    data,
  })

})

// Get my drawing
app.get('/drawing', (req, res) => {
  const userId = Number(req.header('X-User-Id'))

  // Check if id exists and is an integer
  if (!Number.isInteger(userId)) {
    return res.status(401).json({
      error: 'User identification is required',
    })
  }

  // Get drawing
  const drawing = db
    .prepare(`
      SELECT id, user_id, data, created_at, updated_at
      FROM drawings
      WHERE user_id = ?
    `)
    .get(userId)

  if (!drawing) {
    return res.status(404).json({
      error: 'Drawing not found',
    })
  }

  return res.json(drawing)
})


// Modify my drawing
app.put('/drawing', (req, res) => {
  const userId = Number(req.header('X-User-Id'))
  const { data } = req.body

  // Check if id exists and is an integer
  if (!Number.isInteger(userId)) {
    return res.status(401).json({
      error: 'User identification is required',
    })
  }

  // Check the drawing data to save
  if (typeof data !== 'string' || data.trim() === '') {
    return res.status(400).json({
      error: 'Drawing data is required',
    })
  }

  // Update
  const result = db
    .prepare(`
      UPDATE drawings
      SET data = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `)
    .run(data, userId)

  // If nothing changed, drawing not found
  if (result.changes === 0) {
    return res.status(404).json({
      error: 'Drawing not found',
    })
  }

  return res.json({
    message: 'Drawing updated',
  })
})


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})