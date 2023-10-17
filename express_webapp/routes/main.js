var express = require('express');
var router = express.Router();
var session = require('express-session');

/**
 * Handle GET request to the root of this route.
 * Render the 'user_main_connect' view.
 * If an error occurs during the rendering process, it will display an error page.
 */
router.get('/', async function (req, res, next) {
    try {
        res.status(200).render('user_main_connect');
    } catch (err) {
        res.status(403).render('error', {error: err});
    }
});

module.exports = router;