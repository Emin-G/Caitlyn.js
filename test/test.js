const caitlyn = require("../caitlyn.js");

const token = "";
caitlyn.setToken(token);

async function main () {

    let summoner = await caitlyn.getSummoner("", "");
    console.log(summoner);

    let matchs = caitlyn.getRecentMatch(summoner, 5);
    console.log(matchs);

}

setTimeout(()=>{}, 1000000);