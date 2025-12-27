import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import chatRoutes from './routes/chat.routes.js'
import { connectDB } from './lib/db.js'
import path from 'path'

const __dirname = path.resolve()

const app = express()
const PORT = process.env.PORT

app.use(express.json({ limit: '10mb' })) // req.body
app.use(express.urlencoded({ limit: '10mb', urlencoded: true })) // accept POST, PUT
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })) // cho frontend try cap backend khi chay o domain khac, gui cookie tu front len backend
app.use(cookieParser()) // parse cookie tu request header

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/chat', chatRoutes)

// make ready for deployment
if (process.env.NODE_ENV == 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')))
  app.use('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'))
  })
}

app.listen(PORT, () => {
  connectDB()
  console.log(`Server is running on localhost http:://localhost:${PORT}`)
})
