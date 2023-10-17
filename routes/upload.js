const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploads = multer({dest:'uploads/'});
const fs = require('fs');
const activity_dao = require('sports-track-db').activity_dao;
const activity_entry_dao = require('sports-track-db').activity_entry_dao;

/**
 * Handle GET request to the root of this route.
 * Render the 'upload_activity_form' view.
 * If an error occurs during the rendering process, it will display an error page.
 */
router.get('/', async function (req, res, next) {
    try {
        if(req.session && req.session.user) {
            res.status(200).render('upload_activity_form');
        } else {
            res.redirect('/connect');
        }
    } catch (err) {
        res.status(403).render('error', {error: err});
    }
});

/**
 * Handle POST request to the root of this route.
 * Uses multer middleware to handle file uploads.
 * If a file is uploaded, the content is read, parsed from JSON,
 * and then inserted into the database.
 * If no file is uploaded, the user receives an error.
 */
router.post('/', uploads.single('activity_file'), async function(req, res, next) {
    try {
        if (!req.file) {
            return res.status(500).render("error", {error: {err: "No file uploaded."}});
        }

        const fileContent = fs.readFileSync(req.file.path, 'utf8');
        const jsonData = JSON.parse(fileContent);
        const infoData = jsonData.data;
        jsonData.activity.user = req.session.user.idUser;
        const activityId = await activity_dao.insert(jsonData.activity);
        // Insert each data entry related to the activity
        for (const entry of infoData) {
            entry.theActivity = activityId;
            await activity_entry_dao.insert(entry);
        }
        res.status(201).render("upload_activity_form");
    } catch (err) {
        console.error(err);
        res.status(403).render("error", {error: err});
    }
});

module.exports = router;