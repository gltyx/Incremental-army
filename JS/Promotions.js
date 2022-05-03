const levelNameList = ["Colonel","Brigadier General","Major General","Lieutenant General","General","General of the Army"]
const levelImgSrcs = ['Imgs/colonel.svg','Imgs/brigadier_general.svg','Imgs/major_general.svg','Imgs/lieutenant_general.svg','Imgs/general.svg','Imgs/general_of_the_army.svg']
const promotionReqs = [D(500),D(1e3),D(1e4),D(5e4),D(1e5)]
const promotionDescs = ['Automated Enlistment','Propaganda only Costs 50% of Funds','Automated Fabrication','Automated Propaganda','Medal Gain 2x','Automated Hiring','Propaganda only costs 25% of Funds','5x Base Funding','Automated Acquisition',
'Medal Gain 4x','Decrease Cost Scaling on Enlisted','10x Base Funding','Being Researched','Being Researched','Being Researched']
const promotionCosts = [D(100),D(500),D(1e3),D(5e3),D(5e3),D(1e4),D(1.5e4),D(2.5e4),D(5e4),D(1e5),D(1.5e5),D(5e5),D(1e7),D(2.5e7),D(5e7)]

function updatePromotionButtons() {
    for(let i = 0; i < promotionDescs.length; i++) {
        DOMCacheGetOrSet(`pr${i}`).innerHTML = `${promotionDescs[i]}<br>Cost: ${format(promotionCosts[i])} Medals`
        if(!data.promotionUpgrades[i])
            DOMCacheGetOrSet(`pr${i}`).className = data.medals.gte(promotionCosts[i])? "unlocked":"locked"
        else
            DOMCacheGetOrSet(`pr${i}`).className = "maxed"
    }
}

function updateAutomators() {
    for(let i = 0; i < 14; i++) {
        if(i <= 3)
            DOMCacheGetOrSet(`auto${i}`).style.display = data.promotionUpgrades[0]?"inline-block":"none"
        else if(i <= 7)
            DOMCacheGetOrSet(`auto${i}`).style.display = data.promotionUpgrades[2]?"inline-block":"none"
        else if(i === 8)
            DOMCacheGetOrSet(`auto${i}`).style.display = data.promotionUpgrades[3]?"inline-block":"none"
        else if(i <= 12)
            DOMCacheGetOrSet(`auto${i}`).style.display = data.promotionUpgrades[5]?"inline-block":"none"
        else if(i === 13)
            DOMCacheGetOrSet(`acquireAutoHolder`).style.display = data.promotionUpgrades[8]?"flex":"none"
        DOMCacheGetOrSet(`auto${i}`).className = data.autoActive[i]?"on":"off"
        DOMCacheGetOrSet(`auto${i}`).innerHTML = data.autoActive[i]?"Automator: ON":"Automator: OFF"
    }
}

function runAutomators() {
    if(D(DOMCacheGetOrSet('acquireInput').value).gt(data.acquireAutoReq) || D(DOMCacheGetOrSet('acquireInput').value).lt(data.acquireAutoReq))
        data.acquireAutoReq = D(DOMCacheGetOrSet('acquireInput').value)
    if(data.acquireAutoReq.gt(100)) data.acquireAutoReq = D(100)
    DOMCacheGetOrSet('inputText').innerHTML = `Input Minimum Req to Acquire (Current: ${format(data.acquireAutoReq)})`
    for(let i = 3; i > -1; i--)
        if(data.autoActive[i]) buyMP(i,0)
    for(let i = 3; i > -1; i--) 
        if(data.autoActive[i + 4]) buyEquip(i)
    if(data.autoActive[8] && data.approval.eq(0)) specialItem(1)
    for(let i = 3; i > -1; i--)
        if(data.autoActive[i + 9]) buyMP(i,1)
    if(data.autoActive[13] && data.acquireAutoReq.lt(data.approval)) acquire()

}

function purchasePromotionUpgrade(i) {
    if(data.medals.lt(promotionCosts[i]) || data.promotionUpgrades[i] === true) return
    data.medals = data.medals.sub(promotionCosts[i])
    data.promotionUpgrades[i] = true
    updatePromotionButtons()
    updateAutomators()
}

function toggleAutomators(i) {
    data.autoActive[i] = !data.autoActive[i]
    DOMCacheGetOrSet(`auto${i}`).className = data.autoActive[i]?"on":"off"
    DOMCacheGetOrSet(`auto${i}`).innerHTML = data.autoActive[i]?"Automator: ON":"Automator: OFF"
}

for(let i = 0; i < 14; i++) {
    DOMCacheGetOrSet(`auto${i}`).addEventListener("click",()=>{ toggleAutomators(i) })
}

function promote() {
    if(data.medals.lt(promotionReqs[data.level]) || data.level === 5) return
    
    data.medals = data.medals.sub(promotionReqs[data.level])
    data.level += 1
}