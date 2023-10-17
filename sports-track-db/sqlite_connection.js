const sqlite3 = require('sqlite3').verbose();

// Create a new connection to the database
const db = new sqlite3.Database('/home/gabriel/Dropbox/univ/s3/r301/js_sports_track/sports-track-db/sports_track.db', (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données :', err.message);
    } else {
        console.log('Connexion à la base de données réussie.');
    }
});

// Export the sqlite3.Database object
module.exports = db;

