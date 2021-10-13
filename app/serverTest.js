/* central server setup */

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const socketIo = require('socket.io')
const cookieParser = require('cookie-parser')

const socketConnection = require('./socket/socketConnection')
const {authenticateToken} = require('./utils/auth')

const accountsRouter = require('./routers/accountsRouter')
const internEventsRouter = require('./routers/internEventsRouter')
const socialRouter = require('./

require('dotenv').config()

/* app configurations */

const app = express()
const port = process.env.PORT || 5000

/* middlewares */

app.use(cors({
	origin: ['https://restify.vercel.app', 'http://localhost:3000'],
	credentials: true,
	sameSite: 'None',
	secure: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static('media'))

/* mongodb database connection */

const MONGO_URI = process.env.MONGO_URI
mongoose.connect(MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
})
mongoose.connection.on('error', () => {})
mongoose.connection.on('open', () => {})

/* api */

app.use('/accounts', accountsRouter)
app.use('/internEvents', internEventsRouter)
app.use('/social', socialRouter)

module.exports = app.listen(port)
