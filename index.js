const express = require('express')
const app = express()
require('express-async-errors')
const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const authorsRouter = require('./controllers/authors')
const readingListRouter = require('./controllers/readingList')
const logoutRouter = require('./controllers/logout')
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const { errorHandler } = require('./util/middleware')

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readingListRouter)
app.use('/api/logout', logoutRouter)
app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()