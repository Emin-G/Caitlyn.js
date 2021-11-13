const https = require("https");

function gety (option, callback) {

    https.get(option, function(res) {
        var rse = "";
        res.on("data", function(chunk) {
            rse += chunk;
        });
        res.on("end", function() {
            rse = JSON.parse(rse);
            return callback(rse);
        });
    }).on("error", function(e) {
        return callback(JSON.parse("status:{message: 'Error On Req', status_code: 404}"));
    });

}

function version (callback) {

    let options = {
        host: 'ddragon.leagueoflegends.com',
        path: encodeURI("/api/versions.json")
    }

    gety(options, (ddrver) => {

        if (ddrver.status) return callback({status: "Not Found / DDR Version"});

        return callback(ddrver);

    });

}

function queueInfo (queueId, callback) {

    let options = {
        host: 'static.developer.riotgames.com',
        path: encodeURI("/docs/lol/queues.json")
    }

    gety(options, (queueList) => {
        for (var i in queueList) {

            if (String(queueList[i].queueId) === String(queueId)) {
                return callback(queueList[i].description);
            }
      
        }
    });

}

module.exports = {
    version: version,
    queueInfo: queueInfo
}