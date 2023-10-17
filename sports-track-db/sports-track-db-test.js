const fs = require("fs");
const lodash = require('lodash');
const user_dao = require('./sports-track-db').user_dao;
const activity_dao = require('./sports-track-db').activity_dao;
const activity_entry_dao = require('./sports-track-db').activity_entry_dao;

const SportsTrackDBTest = function() {
    this.runTests = async function() {
        console.log("===== UserDAO test =====");
        await this.testUserDAO();
        console.log("===== ActivityDAO test =====");
        await this.testActivityDAO();
        console.log("===== ActivityEntryDAO test =====");
        await this.testActivityEntryDAO();
    }

    this.testUserDAO = async function() {
        const user1 = {
            email: "gabriel@gmail.com",
            firstName: "Gabriel",
            lastName: "Pinto",
            sexe: "homme",
            height: 173,
            weight: 70,
            age: 19,
            birthdate: "21/01/2000",
            pswd: "mdpDeGabriel"
        }

        try {
            await user_dao.insert(user1);
            console.log("Insertion passed");
        } catch (err) {
            console.error(err);
        }

        try {
            await user_dao.update(user1.email, null);
            console.error("Update error, update passed with null values");
        } catch (err) {
            console.log("Update passed: ", err);
        }

        user1.lastName = "Da Silva";
        try {
            await user_dao.update(user1.email, user1);
            console.log("Update passed");
        } catch (err) {
            console.error(err);
        }

        try {
            await user_dao.findByEmail(user1.email)
                .then((usr) => {
                    if(usr !== undefined) {
                        console.log("findByEmail passed");
                    } else {
                        console.log("findByEmail failed")
                    }
                });
        } catch (err) {
            console.error(err);
        }

        try {
            const users = await user_dao.findAll();
            if (Array.isArray(users) && users.length > 0) {
                console.log("FindAll passed: Found", users.length, "users.");
            } else {
                console.log("FindAll returned no users.");
            }
        } catch (err) {
            console.error("FindAll error: ", err);
        }

        try {
            const userId = await user_dao.getIdUser(user1.email);
            if (userId) {
                console.log("User ID:", userId);
            } else {
                console.log("No user associated with this email.");
            }
        } catch (err) {
            console.error("Error fetching user ID:", err);
        }

        try {
            await user_dao.delete(user1.email);
            console.log("Delete passed: User successfully deleted.");
        } catch (err) {
            console.error("Delete error: ", err);
        }
    }

    this.testActivityDAO = async function() {
        const user1 = {
            email: "gabriel@gmail.com",
            firstName: "Gabriel",
            lastName: "Pinto",
            sexe: "homme",
            height: 173,
            weight: 70,
            age: 19,
            birthdate: "21/01/2000",
            pswd: "mdpDeGabriel"
        }

        await user_dao.insert(user1);

        const userId = await user_dao.getIdUser(user1.email);
        const activity = {
            desc: "Running",
            date: "10/01/2023",
            user: userId
        }

        let idAct = null;
        try {
            idAct = await activity_dao.insert(activity);
            console.log("Activity Insertion passed : idActivity = ", idAct);
        } catch (err) {
            console.error(err);
        }

        try {
            const userActivities = await activity_dao.findByUser(activity.user);
            if (Array.isArray(userActivities) && userActivities.length > 0) {
                console.log("findByUser passed: Found", userActivities.length, "activities for the user.");
            } else {
                console.log("findByUser returned no activities for the user.");
            }
        } catch (err) {
            console.error("findByUser error: ", err);
        }

        activity.desc = "Jogging";
        try {
            await activity_dao.update(idAct, activity);
            console.log("Activity Update passed");
        } catch (err) {
            console.error(err);
        }

        try {
            const activities = await activity_dao.findAll();
            if (Array.isArray(activities) && activities.length > 0) {
                console.log("Activity FindAll passed: Found", activities.length, "activities.");
            } else {
                console.log("Activity FindAll returned no activities.");
            }
        } catch (err) {
            console.error("Activity FindAll error: ", err);
        }

        try {
            await activity_dao.delete(idAct);
            console.log("Activity Delete passed: Activity successfully deleted.");
        } catch (err) {
            console.error("Activity Delete error: ", err);
        }

        await user_dao.delete("gabriel@gmail.com");
    }

    this.testActivityEntryDAO = async function() {
        const user1 = {
            email: "gabriel@gmail.com",
            firstName: "Gabriel",
            lastName: "Pinto",
            sexe: "homme",
            height: 173,
            weight: 70,
            age: 19,
            birthdate: "21/01/2000",
            pswd: "mdpDeGabriel"
        }

        await user_dao.insert(user1);
        const userId = await user_dao.getIdUser(user1.email);

        const activity = {
            description: "Swimming",
            date: "15/10/2023",
            user: userId
        }
        const idActivity = await activity_dao.insert(activity);

        fs.readFile('data/test1.json', 'utf8',  async (err, data) => {
            if (err) {
                console.error('Error reading the fille:', err);
            }
            const jsonData = JSON.parse(data);
            let entries = [];
            for (let item of jsonData.data) {
                const entry = {
                    time: item.time,
                    cardio_frequency: item.cardio_frequency,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    altitude: item.altitude,
                    theActivity: idActivity
                };
                entries.push(entry);
            }
            try {
                for (let entry of entries) {
                    await activity_entry_dao.insert(entry);
                }
                console.log("ActivityEntry Insertion passed");
            } catch (err) {
                console.error("ActivityEntry Insertion error:", err);
            }

            // Test fetching all entries
            let entry = null;
            try {
                const entries = await activity_entry_dao.findAll();
                console.log("Fetched", entries.length, "entries.");
                entry = entries[0];
            } catch (err) {
                console.error("ActivityEntry FindAll error:", err);
            }
            // Test updating an entry
            if(entry !== null ) {
                entry.time = "16:00:00";
            }

            try {
                await activity_entry_dao.update(1, entry)
                console.log("ActivityEntry Update passed");
            } catch (err) {
                console.error("ActivityEntry Update error:", err);
            }

            try {
                const time = await activity_entry_dao.getStartTime(idActivity);
                if(time.time === "13:00:05") {
                    console.log("ActivityEntry getStartTime passed");
                } else {
                    console.error("ActivityEntry getStartTime failed");
                }
            } catch (err) {
                console.error("AcvitityEntry getStartTime error:", err);
            }

            try {
                const time = await activity_entry_dao.getEndTime(idActivity);
                if(time.time === "16:00:00") {
                    console.log("ActivityEntry getEndTime passed");
                } else {
                    console.error("ActivityEntry getEndTime failed", time);
                }
            } catch (err) {
                console.error("AcvitityEntry getEndTime error:", err);
            }

            try {
                const mean = await activity_entry_dao.getAverageCardioFrequency(idActivity);
                if(mean === 100) {
                    console.log("ActivityEntry getAverageCardioFrequency passed");
                } else {
                    console.error("ActivityEntry getAverageCardioFrequency failed");
                }
            } catch (err) {
                console.error("AcvitityEntry getAverageCardioFrequency error:", err);
            }

            try {
                const time = await activity_entry_dao.getDuration(idActivity);
                if(time === '02:59:55') {
                    console.log("ActivityEntry getDuration passed");
                } else {
                    console.error("ActivityEntry getDuration failed", time);
                }
            } catch (err) {
                console.error("AcvitityEntry getDuration error:", err);
            }

            try {
                const denivele = await activity_entry_dao.getDenivele(idActivity);
                if(denivele === 2) {
                    console.log("ActivityEntry getDenivele passed");
                } else {
                    console.error("ActivityEntry getDenivele failed", denivele);
                }
            } catch (err) {
                console.error("AcvitityEntry getDenivele error:", err);
            }

            const coordExp = [
                { longitude: -2.776605, latitude: 47.644795 },
                { longitude: -2.778911, latitude: 47.64687 },
                { longitude: -2.78022, latitude: 47.646197 },
                { longitude: -2.781068, latitude: 47.646992 },
                { longitude: -2.781744, latitude: 47.647867 },
                { longitude: -2.780145, latitude: 47.64851 }
            ];

            try {
                const coordinates = await activity_entry_dao.getCoordinates(idActivity);
                if(lodash.isEqual(coordinates, coordExp)) {
                    console.log("ActivityEntry getCoordinates passed");
                } else {
                    console.error("ActivityEntry getCoordinates failed", coordinates, coordExp);
                }
            } catch (err) {
                console.error("ActivityEntry getCoordinates error:", err);
            }

            try {
                for(let entry of entries) {
                    await activity_entry_dao.delete(idActivity);
                }
                console.log("ActivityEntry Deletion passed");
            } catch (err) {
                console.error("ActivityEntry Deletion error:", err);
            }

            try {
                await activity_dao.delete(idActivity);
                await user_dao.delete(user1.email);
            } catch (err) {
                console.error("Deletion error:", err);
            }

            await user_dao.resetAutoIncrement();
            await activity_dao.resetAutoIncrement();
            await activity_entry_dao.resetAutoIncrement();
        });
    }
}

const test = new SportsTrackDBTest();
test.runTests();
