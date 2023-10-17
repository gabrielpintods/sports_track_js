var express = require('express');
var router = express.Router();

/**
 * Handle GET request to the root of this route.
 * If the user is authenticated (has a valid session), render the 'apropos' view.
 * Otherwise, redirect to the '/connect' route for authentication.
 */
router.get('/', async function (req, res, next) {
    if (req.session && req.session.user) {
        res.status(200).render('apropos', req.session.user);
    } else {
        res.redirect('/connect');
    }
});

module.exports = router;