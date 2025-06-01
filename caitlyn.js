const axios = require("axios");
const ddragon = require("./ddragon/ddragon");

let token_holder;

function setToken (token) {
    token_holder = token;
}

async function getSummoner (name, tag) {
    return new Promise(async (resolve, reject) => {
        let accv4 = await api_accv4(name, tag).catch((error) => {
            return resolve({ code: 500, type: "accv4" });
        });

        let sumv4 = await api_sumv4(accv4.puuid).catch((error) => {
            return resolve({ code: 500, type: "sumv4" });
        });

        let lgev4 = await api_lgev4(sumv4).catch((error) => {
            return resolve({ code: 500, type: "lgev4" });
        });

        let sptv5 = await api_sptv5(sumv4).catch((error) => {
            console.log(error);
            return resolve({ code: 500, type: "sptv5" });
        });

        sumv4["code"] = 200;
        sumv4["name"] = accv4.name;
        sumv4["tag"] = accv4.tag;
        sumv4["rank"] = lgev4;
        sumv4["now"] = sptv5;

        return resolve(sumv4);
    });
}

async function getRecentMatch (summoner, count) {
    return new Promise(async (resolve, reject) => {
        const matv5 = await api_matv5(summoner, count).catch((error) => {
            return resolve({ code: 500, type: "matv5" });
        });;

        return resolve(matv5);
    });
}

async function api_accv4 (name, tag) {
    return new Promise(async (resolve, reject) => {

        let accv4 = await get_asia(encodeURI("riot/account/v1/accounts/by-riot-id/" + name + "/" + tag + "?api_key=" + token_holder));
        if (!accv4) return reject(new Error("Not Found / Accv4"));

        try {
            accv4 = {
                name: accv4.gameName,
                tag: accv4.tagLine,
                puuid: accv4.puuid
            };
        }

        catch (error) {
            return reject(new Error("Parse Failed / Accv4"));
        }

        return resolve(accv4);

    });
}

async function api_sumv4 (puuid) {
    return new Promise(async (resolve, reject) => {

        let sumv4 = await gety(encodeURI("lol/summoner/v4/summoners/by-puuid/" + puuid + "?api_key=" + token_holder));
        if (!sumv4) return reject(new Error("Not Found / Sumv4"));

        try {
            sumv4 = {
                id: sumv4.id,
                puuid: sumv4.puuid,
                level: sumv4.summonerLevel,
                profileIconId: sumv4.profileIconId
            };
        }

        catch (error) {
            return reject(new Error("Parse Failed / Sumv4"));
        }

        return resolve(sumv4);

    });
}

async function api_lgev4 (sumv4) {
    return new Promise(async (resolve, reject) => {

        let lgev4 = await gety(encodeURI("lol/league/v4/entries/by-summoner/" + sumv4.id + "?api_key=" + token_holder));
        if (!lgev4) return reject(new Error("Not Found / Lgev4"));

        if (lgev4.length > 0) {

            let lgeres = new Map();

            try {
                let rnksolo;
                let rnkflex;

                if (lgev4[0].queueType === "RANKED_SOLO_5x5") {
                    rnksolo = 0;
                    rnkflex = 1;
                } else {
                    rnksolo = 1;
                    rnkflex = 0;
                }

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
            }

            catch (error) {
                return reject(new Error("Parse Failed / Lgev4"));
            }

            return resolve(lgeres);

        }

        return resolve(null);

    });
}

async function api_sptv5 (sumv4) {
    return new Promise(async (resolve, reject) => {

        let sptv5 = await gety(encodeURI("lol/spectator/v5/active-games/by-summoner/" + sumv4.puuid + "?api_key=" + token_holder));
        if (!sptv5) return resolve(null);

        let ddver = await ddragon.version();
        if (!ddver) return reject(new Error("Not Found / ddrver"));

        try {
            let chmp_tmp;

            //Catch Player from Game List
            for (let c in sptv5["participants"]) {
                if (sptv5["participants"][c]["summonerId"] === sumv4.id) {
                    chmp_tmp = sptv5["participants"][c]["championId"];
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

            sptv5 = {
                queueId: sptv5.gameQueueConfigId,
                time: sptv5.gameLength,
                champ: chmp_tmp
            };
        }

        catch (error) {
            return reject(new Error("Parse Failed / sptv5"));
        }

        return resolve(sptv5);

    });
}

async function api_matv5 (sumv4, count) {
    return new Promise(async (resolve, reject) => {

        let matv5 = await get_asia(encodeURI("lol/match/v5/matches/by-puuid/" + sumv4.puuid + "/ids?start=0&count=" + count + "&api_key=" + token_holder));
        if (!matv5) return reject(new Error("Not Found / Matv5"));

        let ddver = await ddragon.version();
        if (!ddver) return reject(new Error("Not Found / ddrver"));

        let matres = new Map();

        try {
            for (let q in matv5) {
                let matdata = await api_getMatchData(sumv4, matv5[q], ddver);
                matres[matdata[0]] = matdata[1];
            }
        }

        catch (error) {
            return reject(new Error("Parse Failed / Matv5"));
        }

        return resolve(matres);

    });
}

async function api_getMatchData (sumv4, matv5, ddver) {
    return new Promise(async (resolve, reject) => {

        let mat_dt = await get_asia(encodeURI("lol/match/v5/matches/" + matv5 + "?api_key=" + token_holder));
        if (!mat_dt) return reject(new Error("Not Found / Matv5-getMatchData"));
        
        try {
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

                    mat_dt = [mat_dt.gameCreation, {
                        "time": mat_nd.getTime(),
        
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
                    }];

                    return resolve(mat_dt);
                }
            }
        }

        catch (error) {
            return reject(new Error("Parse Failed / Matv5-getMatchData"));
        }

    });
}

function gety (path) {
    return new Promise((resolve, reject) => {

        axios({
            method: "GET",
            url: "https://kr.api.riotgames.com/" + path
        })

        .then((response) => {
            return resolve(response.data);
        })
        
        .catch((error) => {
            return resolve(null);
        });

    });
}

function get_asia (path) {
    return new Promise((resolve, reject) => {

        axios({
            method: "GET",
            url: "https://asia.api.riotgames.com/" + path
        })

        .then((response) => {
            return resolve(response.data);
        })
        
        .catch((error) => {
            console.log(error);
            return resolve(null);
        });

    });
}

module.exports = {
    setToken: setToken,
    getSummoner: getSummoner,
    getRecentMatch: getRecentMatch,
    ddragon: require("./ddragon/ddragon")
}
