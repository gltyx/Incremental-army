function generateAchievementHandlers() {
    for(let i = 0; i < achDescs.length; i++) 
    DOMCacheGetOrSet(`ach${i}`).addEventListener('mouseover', () => { changeDesc(i) })
}

function changeDesc(i) {
    const achNames = ['Alpha','Bravo','Charlie','Delta','Echo']
    let achName
    let achNum
    if(i < 8) {achName = achNames[0]; achNum = i+1 < 10 ? `0${i+1}` : `${i+1}`}
    else if(i < 16) {achName = achNames[1]; achNum = i-7 < 10 ? `0${i-7}` : `${i-7}`}
    else if(i < 19) {achName = achNames[2]; achNum = i-15 < 10 ? `0${i-15}` : `${i-15}`}
    else if(i < 27) {achName = achNames[3]; achNum = i-18 < 10 ? `0${i-18}` : `${i-18}`}
    else if(i < 33) {achName = achNames[4]; achNum = i-26 < 10 ? `0${i-26}` : `${i-26}`}

    DOMCacheGetOrSet(`achDescText`).innerHTML = data.achievement[i] ? `<hr>${achName}-${achNum}: ${achDescs[i]}<br>[Unlocked]` : `<hr>${achName}-${achNum}: ${achDescs[i]}<br>[Locked]`
}
const battleAchReqs = [D(1),D(10),D(20),D(40),D(60),D(80),D(100),D(340)]
function checkAchieves() {
    //Alpha
    for(let i = 0; i < 4; i++) {
        if(data.achievement[i] === false && data.enlisted[i].gte(1))
            data.achievement[i] = true
        if(data.achievement[i+4] === false && data.officers[i].gte(1))
            data.achievement[i+4] = true
    }
    //Bravo
    for(let i = 0; i < 4; i++) {
        if(data.achievement[i+8] === false && data.equipment[i].gte(1))
            data.achievement[i+8] = true
        if(data.achievement[i+12] === false && data.equipment[i].gte(100))
            data.achievement[i+12] = true
    }
    //Charlie
    if(data.achievement[18] === false && data.approval.eq(100))
        data.achievement[18] = true
    //Delta
    for(let i = 0; i < battleAchReqs.length; i++) {
        if(data.achievement[i+19] === false && data.wins.gte(battleAchReqs[i]))
            data.achievement[i+19] = true
    }
    //Echo
    for(let i = 0; i < 5; i++)
        if(data.level >= i+1 && data.achievement[i+27] === false)
            data.achievement[i+27] = true

}

function updateAchieves() {
    for(let i = 0; i < achDescs.length; i++) 
        DOMCacheGetOrSet(`ach${i}`).className = data.achievement[i] ? 'achUnlock' : 'achLock'
}

const achDescs = [
    //Manpower
    'Enlist a Private','Enlist a Corporal','Enlist a Sergeant','Enlist a Staff Sergeant','Hire a 2nd Lieutenant','Hire a 1st Lieutenant','Hire a Captain','Hire a Major',
    //Equipment
    'Fabricate Infantry Equipment','Fabricate an Anti Tank Gun','Fabricate an Artillery Gun','Fabricate a Transport','Fabricate 100 Infantry Equipment','Fabricate 100 Anti Tank Guns','Fabricate 100 Artillery Guns','Fabricate 100 Transports',
    //Finances
    'Release Propaganda','Lobby Congress','Reach Max Approval',
    //Battleground
    'Win 1 Battle','Win 10 Battles','Win 20 Battles','Win 40 Battles','Win 60 Battles','Win 80 Battles','Win 100 Battles','Reach Grand Master Difficulty',
    //Promotions
    'Achieve Brigadier General Rank','Achieve Major General Rank','Achieve Lieutenant General Rank','Achieve General Rank','Achieve General of the Army Rank','Unlock All Promotion Upgrades'
]