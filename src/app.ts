import express from 'express'
import subscriptionRouter from '@/routes/subscriptionRoutes.js'

const app = express()

app.use(express.json())
app.use('/api/subs', subscriptionRouter)

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

export default app
