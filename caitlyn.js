const https = require("https");
const ddragon = require("./ddragon/ddragon");

let token_holder;

function setToken (token) {
    token_holder = token;
}

async function getSummoner (name, callback) {
    await api_sumv4(name, token_holder).then(async (sumv4) => {
        const lgev4 = await api_lgev4(sumv4, token_holder).catch((error) => {
            console.log(error);
            return null;
        });
        const sptv4 = await api_sptv4(sumv4, token_holder).catch((error) => {
            return null;
        });

        sumv4["rank"] = lgev4;
        sumv4["now"] = sptv4;

        return callback(sumv4);
    }).catch((error) => {
        console.log(error);
        return null;
    });
}

async function getRecentMatch (summoner, count, callback) {
    const matv5 = await api_matv5(summoner, count, token_holder).catch((error) => {
        console.log(error);
        return null;
    });

    return callback(matv5);
}

async function api_sumv4 (name, token_holder) {
    return new Promise(function(resolve, reject) {
        options = {
            host: "kr.api.riotgames.com",
            path: encodeURI("/lol/summoner/v4/summoners/by-name/" + name + "?api_key=" + token_holder)
        }

        gety(options, (sumv4) => {

            if (sumv4.status) return reject(new Error("Not Found / Sumv4 - " + sumv4.status.message));

            return resolve({
                name: sumv4.name,
                id: sumv4.id,
                puuid: sumv4.puuid,
                level: sumv4.summonerLevel,
                profileIconId: sumv4.profileIconId
            });

        });
    });
}

async function api_lgev4 (sumv4, token_holder) {
    return new Promise(function(resolve, reject) {
        options = {
            host: "kr.api.riotgames.com",
            path: encodeURI("/lol/league/v4/entries/by-summoner/" + sumv4.id + "?api_key=" + token_holder)
        }

        gety(options, (lgev4) => {

            if (lgev4.status) return reject(new Error("Not Found / Lgev4 - " + lgev4.status.message));

            if (lgev4.length > 0) {

                let rnksolo;
                let rnkflex;

                if (lgev4[0].queueType === "RANKED_SOLO_5x5") {
                    rnksolo = 0;
                    rnkflex = 1;
                } else {
                    rnksolo = 1;
                    rnkflex = 0;
                }

                let lgeres = new Map();

                if (lgev4[rnksolo]) {

                    lgeres["ranked_solo"] = {
                        tier: lgev4[rnksolo].tier + " " + lgev4[rnksolo].rank,
                        wins: lgev4[rnksolo].wins,
                        losses: lgev4[rnksolo].losses,
                        lp: lgev4[rnksolo].leaguePoints,
                        hotStreak: lgev4[rnksolo].hotStreak
                    }

                }

                if (lgev4[rnkflex]) {

                    lgeres["ranked_flex"] = {
                        tier: lgev4[rnkflex].tier + " " + lgev4[rnkflex].rank,
                        wins: lgev4[rnkflex].wins,
                        losses: lgev4[rnkflex].losses,
                        lp: lgev4[rnkflex].leaguePoints,
                        hotStreak: lgev4[rnkflex].hotStreak
                    }

                }

                return resolve(lgeres);
            }

        });
    });
}

async function api_sptv4 (sumv4, token_holder) {
    return new Promise(function(resolve, reject) {
        options = {
            host: "kr.api.riotgames.com",
            path: encodeURI("/lol/spectator/v4/active-games/by-summoner/" + sumv4.id + "?api_key=" + token_holder)
        }

        gety(options, async (sptv4) => {

            if (sptv4.status) return reject(new Error("Not Found / Sptv4 - " + sptv4.status.message));

            let ddver = await ddragon.version();

            let chmp_tmp;

            //Catch Player from Game List
            for (let c in sptv4["participants"]) {
                if (sptv4["participants"][c]["summonerId"] === sumv4.id) {
                    chmp_tmp = sptv4["participants"][c]["championId"];
                    break;
                }
            }

            //Catch Players Champion from Champion Key
            for (let o in ddver.champ.data) {
                if (ddver.champ.data[o].key == chmp_tmp) {
                    chmp_tmp = ddver.champ.data[o].name;
                    break;
                }
            }

            return resolve({
                queueId: sptv4.gameQueueConfigId,
                time: sptv4.gameLength,
                champ: chmp_tmp
            });

        });
    });
}

async function api_matv5 (sumv4, count, token_holder) {
    return new Promise(function(resolve, reject) {
        options = {
            host: "asia.api.riotgames.com",
            path: encodeURI("/lol/match/v5/matches/by-puuid/" + sumv4.puuid + "/ids?start=0&count=" + count + "&api_key=" + token_holder)
        }

        gety(options, async (matv5) => {
            console.log(matv5);

            if (matv5.status) return reject(new Error("Not Found / Matv5 - " + matv5.status.message));

            let ddver = await ddragon.version();

            let matres = new Map();

            for (let q in matv5) {
                await api_getMatchData(sumv4, matv5[q], ddver, token_holder).then((matdata) => {
                    matres[matdata[0]] = matdata[1];
                }).catch((error) => {
                    return console.log(error);
                });
            }

            return resolve(matres);
        });
    });
}

async function api_getMatchData (sumv4, matv5, ddver, token_holder) {
    return new Promise(function(resolve, reject) {
        let options = {
            host: "asia.api.riotgames.com",
            path: encodeURI("/lol/match/v5/matches/" + matv5 + "?api_key=" + token_holder)
        }

        gety(options, (mat_dt) => {
            if (mat_dt.status) return reject(new Error("Not Found / Matv5-getMatchData - " + mat_dt.status.message));
            
            mat_dt = mat_dt["info"];

            let mat_nd;

            if (mat_dt.gameEndTimestamp) mat_nd = new Date(mat_dt.gameStartTimestamp + mat_dt.gameDuration);
            else {
                mat_dt.gameDuration = mat_dt.gameDuration / 1000;
                mat_nd = new Date(mat_dt.gameStartTimestamp + mat_dt.gameDuration);
            }

            for (let c in mat_dt["participants"]) {
                if (mat_dt["participants"][c].puuid === sumv4.puuid) {
                    let sum_mat_dt = mat_dt["participants"][c];

                    return resolve([ mat_dt.gameCreation, {
                        "time": {
                            "year": mat_nd.getFullYear(),
                            "month": mat_nd.getMonth(),
                            "date": mat_nd.getDate(),
                            "hour": mat_nd.getHours(),
                            "min": mat_nd.getMinutes(),
                            "sec": mat_nd.getSeconds()
                        },
        
                        "duration": mat_dt.gameDuration,
        
                        "queueId": mat_dt.queueId,

                        "kda": sum_mat_dt.kills + "/" + sum_mat_dt.deaths + "/" + sum_mat_dt.assists,
                        "champ": {
                            "name": ddver.champ.data[sum_mat_dt.championName].name,
                            "level": sum_mat_dt.champLevel
                        },
                        "firstblood": sum_mat_dt.firstBloodKill,
                        "gold": sum_mat_dt.goldEarned,
                        "multiKill": sum_mat_dt.largestMultiKill,
                        "win": sum_mat_dt.win,
                        "dodge": sum_mat_dt.gameEndedInEarlySurrender
                    }] );
                }
            }
        });
    });
}

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

module.exports = {
    setToken: setToken,
    getSummoner: getSummoner,
    getRecentMatch: getRecentMatch,
    ddragon: require("./ddragon/ddragon")
}
