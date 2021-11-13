const caitlyn = require("../caitlyn");

caitlyn.getSummoner("", "", (data) => {
    console.log(data);
});

setTimeout(()=>{}, 10000);