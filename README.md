### **♥** Korean follows English

# Caitlyn.js
<p align="center">
	<img src="https://cdn.discordapp.com/attachments/807077862880444456/908993991276642344/caitlyn.jpg" alt="Pool Party Caitlyn" width="40%">
</p>

> **Complex** Riot Api to **Simple**.


## Setup

 1. Clone this repo in your project.
 2. `const caitlyn = require("./caitlyn/caitlyn");`

## Usage

 - **Get Summoner's Info**

> caitlyn.**getSummoner**( *Token*, *Summoner Name*, *Callback* );

    caitlyn.getSummoner(Token, Summoner Name, (catv4) => {
	    console.log(catv4);
    });

<details>
<summary>View all return values</summary>
<div markdown="1">
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
</div>
</details>

## Caitlyn DDragon

 - **Before using it**
	 - This function is under development.
	 - So, it may cause many errors and low performance.

 - **Get all the DDragon version list**

> caitlyn.ddragon.**version**( *Callback* );

    caitlyn.ddragon.version((ddver) => {
	    console.log(ddver);
	});

 - **Get game type from Queue ID**

> caitlyn.ddragon.queueInfo( *Queue ID*, *Callback* );

    caitlyn.ddragon.queueInfo(440, (queue) => {
	    console.log(queue);
	    //5v5 Ranked Flex games
    });
