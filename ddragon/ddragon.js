const axios = require("axios");
const queues = require("../ddragon/queues.json");

function gety (path) {
    return new Promise((resolve, reject) => {

        axios({
            method: "GET",
            url: "https://ddragon.leagueoflegends.com/" + path
        })

        .then((response) => {
            return resolve(response.data);
        })
        
        .catch((error) => {
            return resolve(null);
        });

    });
}

function version () {
    return new Promise(async (resolve, reject) => {

        let ddrver = await gety("api/versions.json");
        if (!ddrver) return resolve(null);

        let champ = await champion(ddrver[0]);
        if (!champ) return resolve(null);

        try {
            champ = {
                version: ddrver[0],
                champ: champ
            };
        }

        catch (error) {
            return resolve(null);
        }

        return resolve(champ);

    });
}

function queueInfo (queueId) {
    return new Promise((resolve, reject) => {

        try {
            for (let i in queues) {
                if (String(queues[i].queueId) === String(queueId)) {
                    let que_res = new Map();
                    que_res["map"] = queues[i].map;
                    que_res["desc"] = queues[i].description;
                    return resolve(que_res);
                }
            }
        }

        catch (error) {
            return resolve(null);
        }

    });
}

function champion (ddrver) {
    return new Promise(async (resolve, reject) => {

        let dd_champ = await gety(encodeURI("cdn/" + ddrver + "/data/ko_KR/champion.json"));
        if (!dd_champ) return resolve(null);

        return resolve(dd_champ);

    });
}

module.exports = {
    version: version,
    queueInfo: queueInfo
}
