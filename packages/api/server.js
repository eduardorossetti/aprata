import express from 'express'
import cors from 'cors'
import routes from './routes.js'
import dotenv from 'dotenv'

dotenv.config()
const server = express()

server.use(express.json())
server.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
)
server.use(express.urlencoded({ extended: false }))
server.use(routes)

server.listen(process.env.PORT)
