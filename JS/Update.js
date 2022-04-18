const rankNameLong = ['Private','Corporal','Sergeant','Staff Sergeant','2nd Lieutenant','1st Lieutenant','Captain','Major']
const rankNameShort = ['Pvt','Cpl','Sgt','SSgt','2nd Lt','1st Lt','Cpt','Maj']
const rankNameIds = ['pvt','cpl','sgt','ssgt','2lt','1lt','cpt','maj']

const equipIds = ['ie','at','art','transport']
const equipNames = ['Infantry Equipment','Anti-Tank Gun','Artillery Gun','Transport']

function updateHTML() {
    //Global HTML Updates

    if(data.currentTab === 0) {
        //Manpower
        for(let i = 0; i < 4; i++) {
            DOMCacheGetOrSet(`${rankNameIds[i]}Amt`).innerHTML = `${rankNameLong[i]}: ${format(data.enlisted[i])}`
            DOMCacheGetOrSet(`${rankNameIds[i]}Button`).innerHTML = `Enlist ${format(D(1))} ${rankNameShort[i]} | Cost: ${format(enlistCost[i])} Infantry Equipment`
            DOMCacheGetOrSet(`${rankNameIds[i]}Button`).className = data.equipment[0].gte(enlistCost[i]) ? 'unlocked' : 'locked'
            
            DOMCacheGetOrSet(`${rankNameIds[i+4]}Amt`).innerHTML = `${rankNameLong[i+4]}: ${format(data.officers[i])}`
            DOMCacheGetOrSet(`${rankNameIds[i+4]}Button`).innerHTML = officerCost[i].gt(1) ? `Hire ${format(D(1))} ${rankNameShort[i+4]} | Cost: ${format(officerCost[i])} Medals` : `Hire ${format(D(1))} ${rankNameShort[i+4]} | Cost: ${format(officerCost[i])} Medal`
            DOMCacheGetOrSet(`${rankNameIds[i+4]}Button`).className = 'locked'
        }
    }
    else if(data.currentTab === 1) {
        //Equipment
        for(let i = 0; i < 4; i++) {
            DOMCacheGetOrSet(`${equipIds[i]}Amt`).innerHTML = data.equipment[i].gt(1) && i !== 0 ? `${equipNames[i]}s: ${format(data.equipment[i])}` : `${equipNames[i]}: ${format(data.equipment[i])}`
            DOMCacheGetOrSet(`${equipIds[i]}Button`).innerHTML = `Fabricate ${format(D(1))} ${equipNames[i]} | Cost: $${format(equipmentCost[i])}`
            DOMCacheGetOrSet(`${equipIds[i]}Button`).className = data.funds.gte(equipmentCost[i]) ? 'unlocked' : 'locked'
        }
    }
    else if(data.currentTab === 2) {
        //Funding
        DOMCacheGetOrSet('fundsText').innerHTML = `Funds: $${format(data.funds)}`
        DOMCacheGetOrSet('approvalText').innerHTML = `Congressional Approval: ${format(data.approval)}/100.00`
    }
}

const tabIDs = ['manpower','equipment','finances','battleground','promotions','settings']

function tabChangeHTML() {
    for(let i = 0; i < tabIDs.length; i++)
        DOMCacheGetOrSet(tabIDs[i] + 'Area').style.display = i === data.currentTab ? 'flex' : 'none'
}