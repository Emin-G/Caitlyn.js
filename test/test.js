const caitlyn = require("../../CaitlynJS");

caitlyn.getSummoner("", "", (data) => {
    console.log(data);
});

caitlyn.ddragon.version((ddver) => {
    console.log(ddver);
});

caitlyn.ddragon.queueInfo(440, (queue) => {
    console.log(queue);
});

setTimeout(()=>{}, 10000);