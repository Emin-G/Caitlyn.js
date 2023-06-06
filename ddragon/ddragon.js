const https = require("https");

const queues = require("../ddragon/queues.json");

function gety (option, callback) {

    https.get(option, function(res) {
        let rse = "";
        res.on("data", function(chunk) {
            rse += chunk;
        });
        res.on("end", function() {
            rse = JSON.parse(rse);
            return callback(rse);
        });
    }).on("error", function(e) {
        return callback(null);
    });

}

function version () {
    return new Promise(function(resolve, reject) {

        let options = {
            host: "ddragon.leagueoflegends.com",
            path: encodeURI("/api/versions.json")
        }

        gety(options, (ddrver) => {

            if (ddrver.status) return reject(new Error("Not Found / DDR Version - " + ddrver.message));

            champion(ddrver[0], (champ) => {
                return resolve({ version: ddrver[0], champ: champ });
            });

        });

    });
}

function queueInfo (queueId) {
    return new Promise(function(resolve, reject) {

        for (let i in queues) {
            if (String(queues[i].queueId) === String(queueId)) {
                let que_res = new Map();
                que_res["map"] = queues[i].map;
                que_res["desc"] = queues[i].description;
                return resolve(que_res);
            }
        }

    });
}

function champion (ddrver, callback) {
    let options = {
        host: "ddragon.leagueoflegends.com",
        path: encodeURI("/cdn/" + ddrver + "/data/ko_KR/champion.json")
    }
    
    gety(options, (dd_champ) => {
        return callback(dd_champ);
    });
}

module.exports = {
    version: version,
    queueInfo: queueInfo
}
