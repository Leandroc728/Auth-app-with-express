const router = require('express').Router()

// Request handler for the dashboard with session verification

router.get('/', (req, res) => {
    if(req.session.loggedIn) {
        res.render('index')
    } else {
        res.redirect('/auth/login')
    }
    
})

module.exports = router