// Asign all the necessaries modules

const express = require('express')
const path = require('path')
const auth = require('./router/auth')
const router = require('./router/router')
let session = require('express-session')

const app = express()

// All the cookies configurations

let sessionOpts = {
    secret: 'hey, secret text',
    saveUninitialized: true,
    resave: false,
    maxAge: 50000,
    cookie: {  }
}

// Set ejs as the view engine

app.set('view engine', 'ejs')

/* All the necessary midlewares */

// Set the midlewares to load static files and views

app.use(express.static(path.resolve(__dirname, 'views')))
app.use(express.static(path.resolve(__dirname, 'public')))

// Initialize the session with the options

app.use(session(sessionOpts))

// Request parser

app.use(express.urlencoded({ extended: false }))

// Routes implementation

app.use('/auth', auth)
app.use(router)

// Asign the PORT and then initialize the server

let PORT = process.env.PORT || 3000

app.listen(PORT)