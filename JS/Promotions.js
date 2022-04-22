const levelNameList = ["Bird Colonel","Brigadier General","Major General","Lieutenant General","General","General of the Army"]
const levelImgSrcs = ['Imgs/colonel.svg','Imgs/brigadier_general.svg','Imgs/major_general.svg','Imgs/lieutenant_general.svg','Imgs/general.svg','Imgs/general_of_the_army.svg']
const promotionReqs = [D(1e3),D(1e4),D(1e5),D(1e6),D(1e7)]
const promotionDescs = ['Automated Enlistment','Propaganda only Costs 50% of Funds','Automated Fabrication','Automated Propaganda','Medal Gain 2x','Automated Hiring','Propaganda only costs 25% of Funds','5x Base Funding','Automated Acquisition',
'Medal Gain 4x','Decrease Cost Scaling on Enlisted','10x Base Funding','Being Researched','Being Researched','Being Researched']
const promotionCosts = [D(100),D(500),D(1e3),D(5e3),D(5e3),D(1e4),D(1e5),D(2.5e5),D(5e5),D(1e6),D(2.5e6),D(5e6),D(1e7),D(2.5e7),D(5e7)]

function updatePromotionButtons() {
    for(let i = 0; i < promotionDescs.length; i++) {
        DOMCacheGetOrSet(`pr${i}`).innerHTML = `${promotionDescs[i]}<br>Cost: ${format(promotionCosts[i])} Medals`
        if(!data.promotionUpgrades[i])
            DOMCacheGetOrSet(`pr${i}`).className = data.medals.gte(promotionCosts[i])? "unlocked":"locked"
        else
            DOMCacheGetOrSet(`pr${i}`).className = "maxed"
    }
}

for(let i = 0; i < promotionDescs.length; i++) 
    DOMCacheGetOrSet(`pr${i}`).addEventListener("click",()=>{ purchasePromotionUpgrade(i) })

updatePromotionButtons()

function purchasePromotionUpgrade(i) {
    if(data.medals.lt(promotionCosts[i]) || i >= 12 || data.promotionUpgrades[i]) return
    data.medals = data.medals.sub(promotionCosts[i])
    data.promotionUpgrades[i] = true
    updatePromotionButtons()
}