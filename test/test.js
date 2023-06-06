const caitlyn = require("../caitlyn.js");

const token = "";

caitlyn.setToken(token);

caitlyn.getSummoner("", (summoner) => {
    console.log(summoner);

    caitlyn.getRecentMatch(summoner, 5, (matchs) => {
        console.log(matchs);
    });
});

setTimeout(()=>{}, 1000000);