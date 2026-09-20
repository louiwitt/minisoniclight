import express from 'express'
import db from './db.js'

console.log(db, 'Index initialized')

const app = express()
const port = 3000

app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})