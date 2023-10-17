var db = require('./sqlite_connection.js');

// User Data Access Object Class
var UserDAO = function () {

    // Insert a new user record into the database
    this.insert = function (values) {
        return new Promise((resolve, reject) => {
            if (!values || !values.email || !values.firstName || !values.lastName || !values.sexe || !values.height
                || !values.weight || !values.age || !values.birthdate || !values.pswd) {
                reject("Values missing for insertion");
                return;
            }
            this.findByEmail(values.email)
                .then((row) => {
                if (row != undefined) {
                    reject("User found with the same email");
                    return;
                }
                const stmt = db.prepare("INSERT INTO User (email, firstname, lastname, sexe, height, weight, age, birthdate, pswd) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                stmt.run(
                    values.email,
                    values.firstName,
                    values.lastName,
                    values.sexe,
                    values.height,
                    values.weight,
                    values.age,
                    values.birthdate,
                    values.pswd,
                    (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    }
                );
                stmt.finalize();
            }).catch((err) => {
                reject(err);
            });
        });
    };

    // Update an existing user record in the database based on email
    this.update = function (key, values) {
        return new Promise((resolve, reject) => {
            if (!key) {
                reject("Missing key values for update");
                return;
            }
            this.findByEmail(key)
                .then(exist => {
                    if (!exist) {
                        reject("No user found");
                        return;
                    }
                    let fieldsToUpdate = [];
                    let parameters = [];
                    for (let prop in values) {
                        if (values[prop] !== null) {
                            fieldsToUpdate.push(`${prop} = ?`);
                            parameters.push(values[prop]);
                        }
                    }
                    if (fieldsToUpdate.length === 0) {
                        reject("No fields provided to update");
                        return;
                    }
                    parameters.push(key);
                    const stmt = db.prepare(`UPDATE User SET ${fieldsToUpdate.join(", ")} WHERE email = ?`);
                    stmt.run(parameters, function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                    stmt.finalize();
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    // Delete a user record from the database based on email
    this.delete = function (key) {
        return new Promise((resolve, reject) => {
            if (!key) {
                reject("Missing key values for update");
                return;
            }
            this.findByEmail(key)
                .then((exist) => {
                    if (!exist) {
                        reject("No user found");
                        return;
                    }
                    const stmt = db.prepare("DELETE FROM user WHERE email = ?");
                    stmt.run(key, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                    stmt.finalize();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    // Fetch all user records from the database
    this.findAll = function () {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare("SELECT * FROM User");
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

    // Fetch a user record from the database based on email (similar to findByKey)
    this.findByEmail = function (email) {
        return new Promise((resolve, reject) => {
            if (!email) {
                reject("Value email missing");
                return;
            }
            const stmt = db.prepare("SELECT * FROM User WHERE email = ?");
            stmt.get(email, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
            stmt.finalize();
        });
    };

    // Get the user ID based on the email address
    this.getIdUser = function(email) {
        return new Promise((resolve, reject) => {
            if (!email) {
                reject("Value email missing");
                return;
            }
            const stmt = db.prepare("SELECT idUser FROM User WHERE email = ?");
            stmt.get(email, (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve(row.idUser);
                } else {
                    resolve(null);
                }
            });
            stmt.finalize();
        });
    };

    // Reset the auto-increment value for the User table
    this.resetAutoIncrement = function () {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare("DELETE FROM sqlite_sequence WHERE name='User'");
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

// Create an instance of UserDAO and export it
var dao = new UserDAO();
module.exports = dao;
