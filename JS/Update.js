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
        DOMCacheGetOrSet('equipFundsText').innerHTML = `Equipment<br><br>Funds: $${format(data.funds)}<hr>`
    }
    else if(data.currentTab === 2) {
        //Funding
        DOMCacheGetOrSet('fundsText').innerHTML = `Funds: $${format(data.funds)}`
        DOMCacheGetOrSet('approvalText').innerHTML = `Congressional Approval: ${format(data.approval)}/100.00`
        DOMCacheGetOrSet('acquireButton').innerHTML = data.approval.gt(0) ? `Acquire Funding (+$${format(fundsToRecieve)} | -${format(D(1))} Approval)` : `You need congressional approval to acquire funding`
        
        DOMCacheGetOrSet('lobbyButton').innerHTML = data.approval.eq(100) ? `Lobby Congress<br>[Funding Base x2 | -90.00 Approval]`: `Lobby Congress<br>[Locked - Req: 100.00/100.00 Approval]`
        DOMCacheGetOrSet('lobbyButton').className = data.approval.eq(100) ? 'unlocked' : 'locked'
        DOMCacheGetOrSet('propButton').innerHTML = data.approval.eq(0) ? `Release Propaganda<br>[Approval set to 50.00 | -$${format(data.funds.times(.75))}]` : `Release Propaganda<br>[Locked - Req: 0.00/100.00 Approval]`
        DOMCacheGetOrSet('propButton').className = data.approval.eq(0) ? 'unlocked' : 'locked'
    }
    else if(data.currentTab === 3) {
        //Battleground
        DOMCacheGetOrSet('battleAlertText').style.display = data.enlisted[0].gte(1) ? 'none' : 'flex'
        DOMCacheGetOrSet('battlegroundHolder').style.display = data.enlisted[0].gte(1) ? 'flex' : 'none'
        if(data.enlisted[0].gte(1)) {
            DOMCacheGetOrSet('playerStats').innerHTML = `${data.armyName}<br>Manpower: ${format(manpowerTotal[0])}<br>Attack Power: ${format(attackTotal[0])}`
            DOMCacheGetOrSet('enemyStats').innerHTML = `${data.currentEnemy.name}<br>Manpower: ${format(manpowerTotal[1])}<br>Attack Power: ${format(attackTotal[1])}`
        }
    }
}

const tabIDs = ['manpower','equipment','finances','battleground','promotions','settings']

function tabChangeHTML() {
    for(let i = 0; i < tabIDs.length; i++)
        DOMCacheGetOrSet(tabIDs[i] + 'Area').style.display = i === data.currentTab ? 'flex' : 'none'
}