var db = require('./sqlite_connection.js');

// Activity Data Access Object Class
var ActivityDAO = function () {

    // Insert a new activity record into the database
    this.insert = function (values) {
        return new Promise((resolve, reject) => {
            if (!values || !values.description || !values.date || !values.user) {
                reject("Values missing for insertion");
                return;
            }
            const stmt = db.prepare("INSERT INTO Activity (desc, date, theUser) VALUES (?, ?, ?)");
            stmt.run(values.description, values.date, values.user, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(stmt.lastID);
                }
            });
            stmt.finalize();
        });
    };

    // Update an existing activity record in the database based on idActivity
    this.update = function (key, values) {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare("UPDATE Activity SET desc = (?), date = (?), theUser = (?) WHERE idActivity = ?");
            stmt.run(values.desc, values.date, values.user, key, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
            stmt.finalize();
        });
    };

    // Delete an activity record from the database based on idActivity
    this.delete = function (key) {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare("DELETE FROM Activity WHERE idActivity = ?");
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

    // Fetch all activity records from the database
    this.findAll = function () {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare("SELECT * FROM Activity");
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

    // Fetch an activity record from the database based on idActivity
    this.getActivity = function (key) {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare("SELECT * FROM Activity WHERE idActivity = ?");
            stmt.get(key, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
            stmt.finalize();
        });
    };

    // Fetch all activity IDs associated with a user from the database
    this.findByUser = function (key) {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare("SELECT idActivity FROM Activity WHERE theUser = ?");
            stmt.all(key, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
            stmt.finalize();
        });
    };

    // Reset the auto-increment value for the Activity table
    this.resetAutoIncrement = function () {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare("DELETE FROM sqlite_sequence WHERE name='Activity'");
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

// Create an instance of ActivityDAO and export it
var dao = new ActivityDAO();
module.exports = dao;
