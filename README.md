### **♥** Korean follows English

# Caitlyn.js Preview
<p align="center">
	<img src="https://cdn.discordapp.com/attachments/807077862880444456/908993991276642344/caitlyn.jpg" alt="Pool Party Caitlyn" width="40%">
</p>

> **Complex** Riot Api to **Simple**.


## Setup

 1. Clone this repo in your project.
 2. `const caitlyn = require("./caitlyn");`

## Usage

 - **Get Summoner's Info**

> caitlyn.**getSummoner**( *Token*, *Summoner Name*, *Callback* );

    caitlyn.getSummoner(Token, Summoner Name, (catv4) => {
	    console.log(catv4);
    });

<details>
<summary>View all return values</summary>

 - Return
	 - id
	 - level
	 - name
	 - profileIconId
	 - ranked_flex
		 - losses
		 - lp
		 - tier
		 - wins
	 - ranked_solo
		 - losses
		 - lp
		 - tier
		 - wins

</details>

## Caitlyn DDragon

 - **Before using it**
	 - This function is under development.
	 - There may be many errors and low performance.

 - **Get all the DDragon version list**

> caitlyn.ddragon.**version**( *Callback* );

    caitlyn.ddragon.version((ddver) => {
	    console.log(ddver);
        
        console.log(ddver[0]);
        //Latest DDragon Version
	});

 - **Get game type from Queue ID**

> caitlyn.ddragon.queueInfo( *Queue ID*, *Callback* );

    caitlyn.ddragon.queueInfo(440, (queue) => {
	    console.log(queue);
	    //5v5 Ranked Flex games
    });
