// Import required dependencies and DAO modules
var db_connection = require('./sqlite_connection');
var user_dao = require('./user_dao');
var activity_dao = require('./activity_dao');
var activity_entry_dao = require('./activity_entry_dao');

// Export the database connection and DAOs as a bundled module
module.exports = {
    db: db_connection,
    user_dao: user_dao,
    activity_dao: activity_dao,
    activity_entry_dao: activity_entry_dao
};