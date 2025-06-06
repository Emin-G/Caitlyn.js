const caitlyn = require("../caitlyn.js");

const token = "";
caitlyn.setToken(token);

async function main () {

    let summoner = await caitlyn.getSummoner("", "");
    console.log(summoner);

    let matchs = await caitlyn.getRecentMatch(summoner, 5);
    console.log(matchs);

}

main();

setTimeout(()=>{}, 1000000);