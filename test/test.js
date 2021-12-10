const caitlyn = require("../../CaitlynJS");

const token = "";

caitlyn.getSummoner(token, "", (data) => {
    console.log(data);
});

caitlyn.ddragon.version((ddver) => {
    console.log(ddver);
});

caitlyn.ddragon.queueInfo(440, (queue) => {
    console.log(queue);
});

setTimeout(()=>{}, 10000);