const express = require('express')
const cors = require('cors')

const app = express()
const logger = require('./middlewares/logger')

let notes = [
  {
    id: 1,
    content: 'Title',
    date: 'Today',
    important: false
  },
  {
    id: 2,
    content: 'Title 2',
    date: 'Yesterday',
    important: true
  }
]

app.use(cors())
app.use(express.json())

app.use(logger)

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const { id } = req.params
  const note = notes.find(note => note.id === parseInt(id))

  if (!note) {
    res.status(404).end()
  }

  res.send(note)
})

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params
  notes = notes.filter(note => note.id !== parseInt(id))
  res.status(204).end()
})

app.post('/api/notes', (req, res) => {
  const note = req.body

  if (!note.content) {
    return res.status(400).json({ error: 'Note content is missing' })
  }

  const newNote = {
    id: notes.length + 1,
    ...note,
    date: new Date().toISOString()
  }

  notes = [...notes, newNote]

  res.status(201).json(newNote)
})

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' })
})

const PORT = process.env.PORT | process.env.PORT || 3001
app.listen(PORT, () => console.log('Server listening on http://localhost:' + PORT))
