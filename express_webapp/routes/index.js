var express = require('express');
var router = express.Router();

/**
 * Handle GET request to the root of this route.
 * Render the 'index' view when this route is accessed.
 */
router.get('/', function(req, res, next) {
  res.status(200).render('index');
});

module.exports = router;
