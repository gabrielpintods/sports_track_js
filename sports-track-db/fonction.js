const fs = require('fs');

// Class to handle distance calculations related to GPS coordinates
const calculDistance = function () {

    // Calculate the distance (in km) between two GPS points
    this.calculDistance2PointsGPS = function (long1, lat1, long2, lat2) {
        let earthRadius = 6378.137;
        long1 = (Math.PI * long1) / 180;
        lat1 = (Math.PI * lat1) / 180;
        long2 = (Math.PI * long2) / 180;
        lat2 = (Math.PI * lat2) / 180;
        return earthRadius * Math.acos(Math.sin(lat2) * Math.sin(lat1) + Math.cos(lat2)
            * Math.cos(lat1) * Math.cos(long2 - long1));
    }

    // Calculate the total distance (in meters) of a journey given an array of GPS points
    this.calculDistanceTrajet = function (act) {
        let distance = 0.0;
        let lat1;
        let long1;
        let lat2;
        let long2;
        for (let i = 0; i < act.length - 1; i++) {
            lat1 = act[i]['latitude'];
            long1 = act[i]['longitude'];
            lat2 = act[i + 1]['latitude'];
            long2 = act[i + 1]['longitude'];
            distance += this.calculDistance2PointsGPS(long1, lat1, long2, lat2);
        }
        return Math.round(distance * 1000);
    }
}

// Export an instance of the calculDistance class
module.exports = new calculDistance();

// Read the JSON file asynchronously
/*fs.readFile('data/test1.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const objetJSON = JSON.parse(data);
    // Display the description of the activity from the JSON data
    console.log(objetJSON['activity']['description']);
    // Display the total distance of the journey from the JSON data
    console.log(calculDistanceTrajet(objetJSON));
});*/
