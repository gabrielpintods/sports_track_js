const express = require('express');
const activity_dao = require('sports-track-db/activity_dao')
const activity_entry_dao = require('sports-track-db/activity_entry_dao');
const fonction = require('sports-track-db/fonction');
const router = express.Router();

// Define the GET route for the root path of this router
router.get('/', async function (req, res, next) {
    try {
        if(req.session && req.session.user) {
            const idActivities = await activity_dao.findByUser(req.session.user.idUser);
            const activitiesDetails = [];
            for (const act of idActivities) {
                const theAct = await activity_dao.getActivity(act.idActivity);
                console.log(theAct)
                const details = {
                    "description": theAct.desc,
                    "date": theAct.date,
                    "startTime": await activity_entry_dao.getStartTime(act.idActivity),
                    "endTime": await activity_entry_dao.getEndTime(act.idActivity),
                    "duration": await activity_entry_dao.getDuration(act.idActivity),
                    "averageHeartRate": await activity_entry_dao.getAverageCardioFrequency(act.idActivity),
                    // Calculate the total distance of the journey using the provided function
                    "distance": fonction.calculDistanceTrajet(await activity_entry_dao.getCoordinates(act.idActivity)),
                    "altitude": await activity_entry_dao.getDenivele(act.idActivity)
                };
                activitiesDetails.push(details);
            }
            res.status(200).render('list_activities', { activitiesDetails });
        } else {
            // If the session does not have a user, redirect to the "/connect" route
            res.redirect("/connect");
        }
    } catch (err) {
        console.error(err);
        res.status(403).render('error', {error: err});
    }
});

module.exports = router;