var express = require('express');
var router = express.Router();

/**
 * Middleware function to check if a user is authenticated.
 * If the user has a valid session, they are authenticated.
 * Otherwise, they are redirected to the '/connect' route for logging in.
 */
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        // User is authenticated
        return next();
    } else {
        // User is not authenticated, redirect to login or handle accordingly
        res.redirect('/connect'); // Redirect to the login page or handle it as needed
    }
}

/**
 * Handle GET request to the root of this route.
 * Before accessing the route, the isAuthenticated middleware ensures the user is logged in.
 * If the user is authenticated, their session is destroyed, effectively logging them out.
 * They are then presented with a 'user_disconnect' view.
 */
router.get('/', isAuthenticated, async function (req, res, next) {
    try {
        // Clear the user session to log out
        req.session.destroy(function(err) {
            if (err) {
                console.error('Error destroying session:', err);
            }
            res.status(200).render('user_disconnect');
        });
    } catch (err) {
        res.status(403).render('error', {error: err});
    }
});

module.exports = router;
