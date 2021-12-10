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

function getSummoner (token, name, callback) {

    let options = {
        host: 'kr.api.riotgames.com',
        path: encodeURI("/lol/summoner/v4/summoners/by-name/" + name + "?api_key=" + token)
    }

    gety(options, (sumv4) => {

        if (sumv4.status) return callback({status: "Not Found / Sumv4"});

        options = {
            host: 'kr.api.riotgames.com',
            path: encodeURI("/lol/league/v4/entries/by-summoner/" + sumv4.id + "?api_key=" + token)
        }

        gety(options, (lgev4) => {

            if (sumv4.status) return callback({status: "Not Found / Lgev4"});

            let sumlge = {
                name: sumv4.name,
                id: sumv4.id,
                level: sumv4.summonerLevel,
                profileIconId: sumv4.profileIconId
            }

            if (lgev4.length > 0) {

                var rnksolo;
                var rnkflex;

                if (lgev4[0].queueType === "RANKED_SOLO_5x5") {
                    rnksolo = 0;
                    rnkflex = 1;
                } else {
                    rnksolo = 1;
                    rnkflex = 0;
                }

                if (lgev4[rnksolo]) {

                    sumlge["ranked_solo"] = {
                        tier: lgev4[rnksolo].tier + " " + lgev4[rnksolo].rank,
                        wins: lgev4[rnksolo].wins,
                        losses: lgev4[rnksolo].losses,
                        lp: lgev4[rnksolo].leaguePoints
                    }

                }

                if (lgev4[rnkflex]) {

                    sumlge["ranked_flex"] = {
                        tier: lgev4[rnkflex].tier + " " + lgev4[rnkflex].rank,
                        wins: lgev4[rnkflex].wins,
                        losses: lgev4[rnkflex].losses,
                        lp: lgev4[rnkflex].leaguePoints
                    }

                }

            }

            options = {
                host: 'kr.api.riotgames.com',
                path: encodeURI("/lol/spectator/v4/active-games/by-summoner/" + sumv4.id + "?api_key=" + token)
            }

            gety(options, (sptv4) => {

                if (!sptv4.status) {

                    let today = new Date();

                    var starten = new Date(sptv4.gameStartTime);
    
                    let tdmin = parseInt(today.getMinutes());
    
                    if (today.getHours() != starten.getHours()) {
                        tdmin = tdmin + ((parseInt(today.getHours()) - parseInt(starten.getHours())) * 60);
                    }

                    if (tdmin - parseInt(starten.getMinutes()) > 0) tdmin = tdmin - parseInt(starten.getMinutes());
                    else tdmin = 0;

                    sumlge["now"] = {
                        queueId: sptv4.gameQueueConfigId,
                        time: tdmin
                    }

                }

                return callback(sumlge);

            });

        });

    });
}

module.exports = {
    getSummoner: getSummoner,
    ddragon: require("./ddragon/ddragon")
}