import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

import subscriptionRouter from '@/routes/subscriptionRoutes.js'
// import userRouter from '@/routes/userRoutes.js'
import authRouter from '@/routes/authRoutes.js'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

app.use('/api/subs', subscriptionRouter)
// app.use("/api/users", userRouter)
app.use('/api/auth', authRouter)

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

export default app
