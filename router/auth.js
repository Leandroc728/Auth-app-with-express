// Import the modules

const connection = require('../model/model')
const auth = require('express').Router()
const bcrypt = require('bcrypt')

// On get resquest, verify if there's a session, if not render login

auth.get('/login', (req, res) => {
    if(req.session.loggedIn) {
        res.redirect('/')
    } else {
        res.render('login')
    }

})

// Auth post handler from login

auth.post('/login', (req, res) => {

    // Query the database to search if there's a user

    connection.query('SELECT username FROM users WHERE username=?', [req.body.username], (err, data) => {
        if (err) throw err

        // If don't exist or any other error, send a message. Else, compare the passwords

        if(data.length == 0) {
            res.send('No such user')
        }
        else if(data[0].username == req.body.username) {

            // Query the password from the database

            connection.query('SELECT password FROM users WHERE username=?', [req.body.username],  (err, pass) => {
                if(err) throw err

                // Compare the hashed password and the password from the request

                bcrypt.compare(req.body.password, pass[0].password, (err,result) => {
                    if(err) throw err

                    // If return true as the result, verify the 'remember me', asign the session and then login

                    if(result) {
                        if(req.body.rememberMe) {
                            req.session.loggedIn = true
                            req.session.username = req.body.username
                        } else {
                            req.session.loggedIn = true
                            req.session.username = req.body.username
                            req.session.cookie.maxAge = 3600000
                        }

                        res.redirect('/')
                    } else {
                        // Error message
                        
                        res.send('Wrong password')
                    }
                })
            })
        } else {
            res.send('No such user')
        }
    })
})

// On get resquest, verify if there's a session, if not render register

auth.get('/register', (req, res) => {
    if(req.session.loggedIn) {
        res.redirect('/')
    } else {
        res.render('register')
    }
})

// Handler for the post request

auth.post('/register', async (req, res) => {
    // Get the actual date and asign it to a variable

    let date = new Date
    let dateFormated = `${date.toLocaleDateString()}-${date.toLocaleTimeString()}`

    // Format the name

    let name = `${req.body.firstName} ${req.body.lastName}`

    try {

        // Query the database to see if the user already exists

        connection.query(`SELECT username FROM users WHERE username=?;`, [req.body.username], async (err, data) => {
            if(err) throw err

            // If so, send a message, else continue
    
            if(data.length != 0) {
                res.send('This user already exist')
            } else {
                // Hash the password and asign it to a variable

                let password = await bcrypt.hash(req.body.password, 10)

                // Persist the user to the database

                connection.query(`INSERT INTO users(name, username, password, created_at) VALUES(?, ?, ?, '${dateFormated}');`, [name, req.body.username, password], (err, data) => {
                if (err) throw err;
                })

                // Asign a session based on 'remember me'

                if(req.body.rememberMe) {
                    req.session.loggedIn = true
                    req.session.username = req.body.username
                } else {
                    req.session.loggedIn = true
                    req.session.username = req.body.username
                    req.session.cookie.maxAge = 3600000
                }

                res.redirect('/')
            }
            
        })

    } catch(err) {

        throw err;
    }

})

// Handler to the logout post

auth.post('/logout', (req, res) => {
    // Clear the username session

    req.session.username = null

    // Handlers for a clean and safe session clean out

    req.session.save((err) => {
        if (err) throw err

        req.session.regenerate((err) => {
          if (err) throw err

          res.redirect('/auth/login')
        })
      })
})

module.exports = auth 