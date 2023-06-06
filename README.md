# Caitlyn.js Preview

<p align="center">
	<img src="./caitlyn.jpg" alt="Pool Party Caitlyn" width="40%">
</p>

<pre align="center">
**복잡한** 라이엇 Api를 **필요한 것만 간단하게**!
</pre>

## 🎉 2.0 업데이트
- 전부 갈아 엎었어요.

## 설치

 1. 이 레포지토리를 프로젝트 폴더 안에 복제 하세요.
 2. `const caitlyn = require("./Caitlyn.js");`

## 사용법
 - **사전 토큰 설정**

> caitlyn.**setToken**( *토큰* );

    caitlyn.setToken(토큰);

토큰은 아래와 같이 dotenv를 사용하여 관리하는 것을 매우 권장합니다.

index.js
    require("dotenv").config();
	caitlyn.setToken(process.env.RIOT_API);

.env
	RIOT_API=RGAPI-...

 - **소환사의 정보 불러오기**

> caitlyn.**getSummoner**( *소환사 이름*, *Callback* );

    caitlyn.getSummoner(소환사 이름, (summoner) => {
	    console.log(summoner);
    });

<details>
<summary>Return 값 보기</summary>

 - Return
	 - id
	 - level
	 - name
	 - profileIconId
	 - puuid
	 - rank
		 - ranked_flex (자유 랭크)
			 - losses
			 - lp
			 - tier
			 - wins
			 - hotStreak (연승)
		 - ranked_solo (솔로 랭크)
			 - losses
			 - lp
			 - tier
			 - wins
			 - hotStreak (연승)
	 - now (플레이 중 일 때)
	 	 - queueId
		 - time (초 단위)
		 - champ

</details>

summoner.profileIconId 같은 경우
	console.log("https://ddragon.leagueoflegends.com/cdn/" + ddver[0] + "/img/profileicon/" + summoner.profileIconId + ".png");
로 소환사의 프로필 사진을 가져올 수 있습니다.
ddver[0] 은 아래의 DDragon - version 함수를 참고해주세요.

summoner.now.queueId 같은 경우
    let queinf = await caitlyn.ddragon.queueInfo(summoner.now.queueId);
로 현재 플레이 중인 게임이 무엇인지 ( ex. 칼바람나락, URF ) 찾을 수 있습니다.

summoner.now.time 같은 경우
    let time_tmp = Math.floor(summoner.now.time / 60);
    console.log("**" + time_tmp + "** 분 **" + (summoner.now.time - (time_tmp * 60)) + "** 초");
와 같이 사용하시면 됩니다.

> caitlyn.**getRecentMatch**( *summoner*, count, *Callback* );

	caitlyn.getSummoner(소환사 이름, (summoner) => {
		console.log(summoner);

		caitlyn.getRecentMatch(summoner, 5, (matchs) => {
			console.log(matchs);
			//최근 5개 게임 정보
		});
	});

<details>
<summary>Return 값 보기</summary>

 - Return
	 - (게임 번호)
		 - champ
			 - name
			 - level (게임에서의 최종 레벨)
		 - dodge (닷지 여부)
		 - duration (게임 길이, 초 단위)
		 - firstblood (퍼블 여부)
		 - gold
		 - kda ('/' 로 끊어져서 나옴 - ex. 10/4/6)
		 - multiKill (최대 다중 킬 - 1 > X, 2 > 더블킬, 3 > 트리플킬)
		 - queueId
		 - time (언제 한건지)
			 - year
			 - month
			 - date
			 - hour
			 - min
			 - sec
		 - win
	 - (게임 번호)
	  ...

</details>

## Caitlyn DDragon
 - **DDragon 최신 버전 가져오기**

> caitlyn.ddragon.**version**();

    let ddver = await caitlyn.ddragon.version();
	console.log(ddver[0]);
	//DDragon 최신 버전

 - **Queue ID 로 게임 속성 불러오기**

> caitlyn.ddragon.queueInfo( *Queue ID* );

	let queinf = await caitlyn.ddragon.queueInfo(440);
	console.log(queinf);
	//자유랭크