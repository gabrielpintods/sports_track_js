var express = require('express');
var router = express.Router();
var user_dao = require('sports-track-db').user_dao;

/**
 * Handle GET request to the root of this route.
 * Renders the 'user_add_form' view with a 201 status code.
 */
router.get('/', async function (req, res, next) {
  res.status(201).render('user_add_form');
  }
);

/**
 * Handle POST request to the root of this route.
 * Formats the user's birthdate and then attempts to insert
 * the new user data into the database.
 * If the insertion is successful, renders the 'user_add_valid' view.
 * If there's an error during insertion, renders the error view.
 */
router.post('/', async function(req, res, next) {
  try {
    const birthdate = new Date(req.body.birthdate);
    req.body.birthdate = birthdate.toLocaleDateString("fr");
    await user_dao.insert(req.body);
    res.status(201).render('user_add_valid');
  } catch (err) {
    res.status(403).render('error', {error: err});
  }
})
module.exports = router;