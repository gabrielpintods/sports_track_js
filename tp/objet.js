function CalculDistance() {

    CalculDistance.prototype.calculDistance2PointsGPS = function (long1, lat1, long2, lat2) {
        let earthRadius = 6378.137;
        long1 = (Math.PI * long1) / 180;
        lat1 = (Math.PI * lat1) / 180;
        long2 = (Math.PI * long2) / 180;
        lat2 = (Math.PI * lat2) / 180;
        return earthRadius * Math.acos(Math.sin(lat2) * Math.sin(lat1) + Math.cos(lat2)
            * Math.cos(lat1) * Math.cos(long2 - long1));
    };

    CalculDistance.prototype.calculDistanceTrajet = function (act) {
        let distance = 0.0;
        let lat1;
        let long1;
        let lat2;
        let long2;
        for (let i = 0; i < act['data'].length - 1; i++) {
            lat1 = act['data'][i]['latitude'];
            long1 = act['data'][i]['longitude'];
            lat2 = act['data'][i + 1]['latitude'];
            long2 = act['data'][i + 1]['longitude'];
            distance += this.calculDistance2PointsGPS(long1, lat1, long2, lat2);
        }
        return Math.round(distance * 1000);
    };
}

cd = new CalculDistance();

const fs = require('fs');

fs.readFile('data/test.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const objetJSON = JSON.parse(data);
    console.log(objetJSON['activity']['description']);
    console.log(cd.calculDistanceTrajet(objetJSON));
});

