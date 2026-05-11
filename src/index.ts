import app from './app'

const DEFAULT_PORT = 3000

const PORT = process.env.PORT ?? DEFAULT_PORT

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
