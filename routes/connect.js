const express = require('express');
const router = express.Router();
const user_dao = require('sports-track-db').user_dao;
const session = require('express-session');

/*
 * Handle GET request to the root of this route.
 * This will render the user connection form.
 */
router.get('/', async function (req, res, next) {
    try {

        res.status(200).render('user_connect_form');
    } catch (err) {
        res.status(403).render('error', {error: err});
    }
});

/*
 * Handle POST request to the root of this route for user authentication.
 * If user's email and password match what's in the database, a session is created.
 * Otherwise, an error is displayed.
 */
router.post('/', async function(req, res, next) {
    try {
        const user = await user_dao.findByEmail(req.body.email);
        if (user && user.pswd === req.body.pswd) {
            req.session.user = user;
            res.status(200).render('user_connect_valid');
        } else {
            res.status(403).render('error', {error: {message: "Invalid email or password"}});
        }
    } catch (err) {
        res.status(403).render('error', {error: {message: "An error occurred. Please try again later."}});
    }
});


module.exports = router;