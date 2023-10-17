var db = require('./sqlite_connection.js');

// ActivityEntry Data Access Object Class
var ActivityEntryDAO = function () {

    // Insert a new activity entry record into the database
    this.insert = function (values) {
        return new Promise((resolve, reject) => {
            if (!values || !values.time || !values.cardio_frequency || !values.latitude || !values.longitude || !values.altitude || !values.theActivity) {
                reject("Values missing for insertion activity_entry");
                return;
            }
            const stmt = db.prepare("INSERT INTO Data (time, cardioFrequency, latitude, longitude, altitude, theActivity) VALUES (?, ?, ?, ?, ?, ?)");
            stmt.run(values.time, values.cardio_frequency, values.latitude, values.longitude, values.altitude, values.theActivity, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
            stmt.finalize();
        });
    };

    // Update an existing activity entry record in the database based on idData
    this.update = function (key, values) {
        return new Promise((resolve, reject) => {
            if (!key) {
                reject("Missing key values for update");
                return;
            }
            let fieldsToUpdate = [];
            let parameters = [];
            for (let prop in values) {
                if (values[prop] !== null && values[prop] !== undefined) {
                    fieldsToUpdate.push(`${prop} = ?`);
                    parameters.push(values[prop]);
                }
            }
            if (fieldsToUpdate.length === 0) {
                reject("No fields provided to update");
                return;
            }
            parameters.push(key);
            const stmt = db.prepare(`UPDATE Data SET ${fieldsToUpdate.join(", ")} WHERE idData = ?`);
            stmt.run(parameters, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
            stmt.finalize();
        });
    };

    // Update an existing activity entry record in the database based on idData
    this.delete = function (key) {
        return new Promise((resolve, reject) => {
            if (!key) {
                reject("Key missing for deletion");
                return;
            }
            const stmt = db.prepare("DELETE FROM Data WHERE theActivity = ?");
            stmt.run(key, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
            stmt.finalize();
        });
    };

    // Fetch all activity entry records from the database
    this.findAll = function () {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare("SELECT * FROM Data");
            stmt.all((err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
            stmt.finalize();
        });
    };

    // Get the start time for a specific activity based on theActivity key
    this.getStartTime = function(key) {
        return new Promise((resolve, reject) => {
            if (!key) {
                reject("Key missing for findByActivity");
                return;
            }
            const stmt = db.prepare("SELECT time FROM Data WHERE theActivity = ? ORDER BY time LIMIT 1");
            stmt.get(key,(err, row) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(row.time);
                }
            });
            stmt.finalize();
        })
    };

    // Get the end time for a specific activity based on theActivity key
    this.getEndTime = function(key) {
        return new Promise((resolve, reject) => {
            if (!key) {
                reject("Key missing for findByActivity");
                return;
            }
            const stmt = db.prepare("SELECT time FROM Data WHERE theActivity = ? ORDER BY time DESC LIMIT 1");
            stmt.get(key,(err, row) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(row.time);
                }
            });
            stmt.finalize();
        })
    };

    // Calculate the duration of a specific activity based on theActivity key
    this.getDuration = function(key) {
        return new Promise(async (resolve, reject) => {
            if (!key) {
                reject("Key missing for findByActivity");
                return;
            }
            const startTime = await this.getStartTime(key);
            const endTime = await this.getEndTime(key);
            const [startHours, startMinutes, startSeconds] = startTime.split(":").map(Number);
            const [endHours, endMinutes, endSeconds] = endTime.split(":").map(Number);

            // Calculate the total seconds for each time
            const startTotalSeconds = startHours * 3600 + startMinutes * 60 + startSeconds;
            const endTotalSeconds = endHours * 3600 + endMinutes * 60 + endSeconds;

            // Calculate the difference in total seconds
            const differenceInSeconds = Math.abs(startTotalSeconds - endTotalSeconds);

            // Calculate hours, minutes, and seconds for the difference
            const hours = Math.floor(differenceInSeconds / 3600);
            const remainingSeconds = differenceInSeconds % 3600;
            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;

            // Format the result as HH:MM:SS
            const formattedDuration = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
            resolve(formattedDuration);
        });
    };

    // Retrieve the longitude and latitude for a specific activity based on theActivity key
    this.getCoordinates = function(key) {
        return new Promise((resolve, reject) => {
            if (!key) {
                reject("Key missing for getCoordinates");
                return;
            }
            const stmt = db.prepare("SELECT longitude, latitude FROM Data WHERE theActivity = ?");
            stmt.all(key,(err, row) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
            stmt.finalize();
        })
    };

    // Calculate the average cardio frequency for a specific activity based on theActivity key
    this.getAverageCardioFrequency = function(key) {
        return new Promise((resolve, reject) => {
            if (!key) {
                reject("Key missing for findByActivity");
                return;
            }
            const stmt = db.prepare("SELECT cardioFrequency FROM Data WHERE theActivity = ?");
            stmt.all(key, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows.length === 0) {
                    reject("No data found for the given activity key.");
                    return;
                }
                const sum = rows.map(row => row.cardioFrequency).reduce((acc, num) => acc + num, 0);
                const mean = sum / rows.length;
                resolve(Math.round(mean));
            });
            stmt.finalize();
        });
    };

    // Calculate the difference between the highest and lowest altitude for a specific activity based on theActivity key
    this.getDenivele = function(key) {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare("SELECT altitude FROM Data WHERE theActivity = ?");
            stmt.all(key, (err, row) => {
                if(err) {
                    reject(err);
                } else {
                    if (row && row.length > 0) {
                        const altitudes = row.map(r => r.altitude);
                        const maxAltitude = Math.max(...altitudes);
                        const minAltitude = Math.min(...altitudes);
                        const denivele = maxAltitude - minAltitude;
                        resolve(denivele);
                    } else {
                        resolve(0);
                    }
                }
            });
            stmt.finalize();
        });
    };

    // Reset the auto-increment value for the Data table
    this.resetAutoIncrement = function () {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare("DELETE FROM sqlite_sequence WHERE name='Data'");
            stmt.run((err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    }

};

// Create an instance of ActivityEntryDAO and export it
var dao = new ActivityEntryDAO();
module.exports = dao;
