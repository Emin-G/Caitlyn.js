### **♥** Korean follows English

# Caitlyn.js Preview
<p align="center">
	<img src="./caitlyn.jpg" alt="Pool Party Caitlyn" width="40%">
</p>

> **Complex** Riot Api to **Simple**.

Before starting, this project is **under development.**  
many essential functions are not included yet and some functions are **terribly unstable.**  
If you are watching this project for not testing but using it for your important project, <u>**Please re-think before using it.**</u>

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
	 - now (When playing)
	 	 - queueId
		 - <p style="color:#e01032">*time*</p>

</details>
.now.time is <u>NOT working correctly.</u>  

We are aware of this problem and will fix it ASAP.

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

>

# Caitlyn.js Preview -Kr
<p align="center">
	<img src="./caitlyn.jpg" alt="Pool Party Caitlyn" width="40%">
</p>

> **복잡한** 라이엇 Api를 **간단하게**!

시작하기 전에, 이 프로젝트는 **개발 중입니다.**  
끔찍할 정도로 **불안정**하고, 많은 기능들이 아직 **구현되지 않았습니다**.  
기능 테스트가 아닌 중요한 프로젝트에 사용하려고 한다면 <u>**사용하기 전에 다시 한번 생각하세요.**</u>

## 설치

 1. 이 레포지토리를 프로젝트 폴더 안에 복제 하세요.
 2. `const caitlyn = require("./caitlyn");`

## 사용법

 - **소환사의 정보 불러오기**

> caitlyn.**getSummoner**( *토큰*, *소환사 이름*, *Callback* );

    caitlyn.getSummoner(토큰, 소환사 이름, (catv4) => {
	    console.log(catv4);
    });

<details>
<summary>Return 값 보기</summary>

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
	 - now (플레이 중 일 때)
	 	 - queueId
		 - <p style="color:#e01032">*time*</p>

</details>
.now.time 은 <u>버그가 있습니다.</u>  

현재 이 버그를 인지하고 있으며, 최대한 빠른 시일 내에 수정될 예정입니다.

## Caitlyn DDragon

 - **사용하기 전에**
	 - 이 기능은 개발 단계에 있습니다.
	 - 오류나 성능 저하가 있을 수 있습니다.

 - **모든 DDragon 버전 리스트 가져오기**

> caitlyn.ddragon.**version**( *Callback* );

    caitlyn.ddragon.version((ddver) => {
	    console.log(ddver);
        
        console.log(ddver[0]);
        //DDragon 최신 버전
	});

 - **Queue ID 로 게임 속성 불러오기**

> caitlyn.ddragon.queueInfo( *Queue ID*, *Callback* );

    caitlyn.ddragon.queueInfo(440, (queue) => {
	    console.log(queue);
	    //5v5 Ranked Flex games
    });

