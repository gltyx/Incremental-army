const rankNameLong = ['Private','Corporal','Sergeant','Staff Sergeant','2nd Lieutenant','1st Lieutenant','Captain','Major']
const rankNameShort = ['Pvt','Cpl','Sgt','SSgt','2nd Lt','1st Lt','Cpt','Maj']
const rankNameIds = ['pvt','cpl','sgt','ssgt','2lt','1lt','cpt','maj']

const equipIds = ['ie','at','art','transport']
const equipNames = ['Infantry Equipment','Anti-Tank Gun','Artillery Gun','Transport']

const difficultyNames = ['Conscript','Recruit','Novice','Veteran','Elite','Specialist','Commando','Elite Commando','Hunter','Elite Hunter','Expert','Elite Expert','Master','Elite Master','Legend','Elite Legend']
let enlistString = []
let officerString = []
let equipmentString = []
function updateHTML() {
    //Global HTML Updates
    if(DOMCacheGetOrSet('newsHolder').style.display !== 'none' && !data.settingsToggles[0])
        DOMCacheGetOrSet('newsHolder').style.display = 'none'
    else if(DOMCacheGetOrSet('newsHolder').style.display !== 'block' && data.settingsToggles[0])
        DOMCacheGetOrSet('newsHolder').style.display = 'block'
    if(data.currentTab === 0) {
        //Manpower
        DOMCacheGetOrSet('enlistedDisplay').innerHTML = `Enlisted<br>Equipment: ${format(data.equipment[0])}<hr>`
        DOMCacheGetOrSet('officerDisplay').innerHTML = `Officers<br>Medals: ${format(data.medals)}<hr>`
        for(let i = 0; i < 4; i++) {
            DOMCacheGetOrSet(`${rankNameIds[i]}Amt`).innerHTML = `${rankNameLong[i]}: ${format(data.enlisted[i])}`
            DOMCacheGetOrSet(`${rankNameIds[i]}Button`).innerHTML = `Enlist ${format(D(1))} ${rankNameShort[i]} | Cost: ${format(enlistCost[i])} Infantry Equipment`
            DOMCacheGetOrSet(`${rankNameIds[i]}Button`).className = data.equipment[0].gte(enlistCost[i]) ? 'unlocked' : 'locked'
            
            DOMCacheGetOrSet(`${rankNameIds[i+4]}Amt`).innerHTML = `${rankNameLong[i+4]}: ${format(data.officers[i])} | ${format(officerBoost[i])}x to ${rankNameShort[i]} Attack`
            DOMCacheGetOrSet(`${rankNameIds[i+4]}Button`).innerHTML = officerCost[i].gt(1) ? `Hire ${format(D(1))} ${rankNameShort[i+4]} | Cost: ${format(officerCost[i])} Medals` : `Hire ${format(D(1))} ${rankNameShort[i+4]} | Cost: ${format(officerCost[i])} Medal`
            DOMCacheGetOrSet(`${rankNameIds[i+4]}Button`).className = data.medals.gte(officerCost[i]) ? 'unlocked' : 'locked'
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
        if(!data.promotionUpgrades[1] && !data.promotionUpgrades[6])
            DOMCacheGetOrSet('propButton').innerHTML = data.approval.eq(0) ? `Release Propaganda<br>[Approval set to 50.00 | -$${format(data.funds.times(.75))}]` : `Release Propaganda<br>[Locked - Req: 0.00/100.00 Approval]`
        else if(data.promotionUpgrades[1] && !data.promotionUpgrades[6])
            DOMCacheGetOrSet('propButton').innerHTML = data.approval.eq(0) ? `Release Propaganda<br>[Approval set to 50.00 | -$${format(data.funds.times(.5))}]` : `Release Propaganda<br>[Locked - Req: 0.00/100.00 Approval]`
        else if((!data.promotionUpgrades[1] && data.promotionUpgrades[6]) || (data.promotionUpgrades[1] && data.promotionUpgrades[6]))
            DOMCacheGetOrSet('propButton').innerHTML = data.approval.eq(0) ? `Release Propaganda<br>[Approval set to 50.00 | -$${format(data.funds.times(.25))}]` : `Release Propaganda<br>[Locked - Req: 0.00/100.00 Approval]`
    }
    else if(data.currentTab === 3) {
        //Battleground
        DOMCacheGetOrSet('battleAlertText').style.display = data.enlisted[0].gte(1) || data.enlisted[1].gte(1) || data.enlisted[2].gte(1) || data.enlisted[3].gte(1) ? 'none' : 'flex'
        DOMCacheGetOrSet('battlegroundStatsHolder').style.display = data.enlisted[0].gte(1) || data.enlisted[1].gte(1) || data.enlisted[2].gte(1) || data.enlisted[3].gte(1) ? 'flex' : 'none'
        if(data.enlisted[0].gte(1) || data.enlisted[1].gte(1) || data.enlisted[2].gte(1) || data.enlisted[3].gte(1)) {
            //Strings
            if(data.wins.lt(10))
                enlistString[1] = `${rankNameShort[0]}: ${format(data.currentEnemy.enlisted[0].times(enemyEquipmentBoosts[2]))}<br>Deployed at 10 Wins<br>Deployed at 20 Wins<br>Deployed at 30 Wins<br>`
            else if(data.wins.lt(20))
                enlistString[1] = `${rankNameShort[0]}: ${format(data.currentEnemy.enlisted[0].times(enemyEquipmentBoosts[2]))}<br>${rankNameShort[1]}: ${format(data.currentEnemy.enlisted[1].times(enemyEquipmentBoosts[2]))}<br>Deployed at 20 Wins<br>Deployed at 30 Wins<br>`
            else if(data.wins.lt(30))
                enlistString[1] = `${rankNameShort[0]}: ${format(data.currentEnemy.enlisted[0].times(enemyEquipmentBoosts[2]))}<br>${rankNameShort[1]}: ${format(data.currentEnemy.enlisted[1].times(enemyEquipmentBoosts[2]))}<br>${rankNameShort[2]}: ${format(data.currentEnemy.enlisted[2].times(enemyEquipmentBoosts[2]))}<br>Deployed at 30 Wins<br>`
            else
                enlistString[1] = `${rankNameShort[0]}: ${format(data.currentEnemy.enlisted[0].times(enemyEquipmentBoosts[2]))}<br>${rankNameShort[1]}: ${format(data.currentEnemy.enlisted[1].times(enemyEquipmentBoosts[2]))}<br>${rankNameShort[2]}: ${format(data.currentEnemy.enlisted[2].times(enemyEquipmentBoosts[2]))}<br>${rankNameShort[3]}: ${format(data.currentEnemy.enlisted[3].times(enemyEquipmentBoosts[2]))}<br>`
            enlistString[0] = `${rankNameShort[0]}: ${format(data.enlisted[0].times(equipmentBoosts[2]))} [${format(data.enlisted[0])} - ${format(data.currentEnemy.enlisted[0])}]<br>${rankNameShort[1]}: ${format(data.enlisted[1].times(equipmentBoosts[2]))} [${format(data.enlisted[1])} - ${format(data.currentEnemy.enlisted[1])}]<br>${rankNameShort[2]}: ${format(data.enlisted[2].times(equipmentBoosts[2]))} [${format(data.enlisted[2])} - ${format(data.currentEnemy.enlisted[2])}]<br>${rankNameShort[3]}: ${format(data.enlisted[3].times(equipmentBoosts[2]))}  [${format(data.enlisted[3])} - ${format(data.currentEnemy.enlisted[3])}]<br>`
            
            if(data.wins.lt(50))
                officerString[1] = `Deployed at 50 Wins<br>Deployed at 60 Wins<br>Deployed at 70 Wins<br>Deployed at 80 Wins<br>`
            else if(data.wins.lt(60))
            officerString[1] = `${rankNameShort[4]}: ${format(data.currentEnemy.officers[0].times(enemyEquipmentBoosts[2]))}<br>Deployed at 60 Wins<br>Deployed at 70 Wins<br>Deployed at 80 Wins<br>`
            else if(data.wins.lt(70))
            officerString[1] = `${rankNameShort[4]}: ${format(data.currentEnemy.officers[0].times(enemyEquipmentBoosts[2]))}<br>${rankNameShort[5]}: ${format(data.currentEnemy.officers[1].times(enemyEquipmentBoosts[2]))}<br>Deployed at 70 Wins<br>Deployed at 80 Wins<br>`
            else if(data.wins.lt(80))
            officerString[1] = `${rankNameShort[4]}: ${format(data.currentEnemy.officers[0].times(enemyEquipmentBoosts[2]))}<br>${rankNameShort[5]}: ${format(data.currentEnemy.officers[1].times(enemyEquipmentBoosts[2]))}<br>${rankNameShort[6]}: ${format(data.currentEnemy.officers[2].times(enemyEquipmentBoosts[2]))}<br>Deployed at 80 Wins<br>`
            else
            officerString[1] = `${rankNameShort[4]}: ${format(data.currentEnemy.officers[0].times(enemyEquipmentBoosts[2]))}<br>${rankNameShort[5]}: ${format(data.currentEnemy.officers[1].times(enemyEquipmentBoosts[2]))}<br>${rankNameShort[6]}: ${format(data.currentEnemy.officers[2].times(enemyEquipmentBoosts[2]))}<br>${rankNameShort[7]}: ${format(data.currentEnemy.officers[3].times(enemyEquipmentBoosts[2]))}<br>`
            officerString[0] = `${rankNameShort[4]}: ${format(data.officers[0].times(equipmentBoosts[2]))} [${format(data.officers[0])} - ${format(data.currentEnemy.officers[0])}]<br>${rankNameShort[5]}: ${format(data.officers[1].times(equipmentBoosts[2]))} [${format(data.officers[1])} - ${format(data.currentEnemy.officers[1])}]<br>${rankNameShort[6]}: ${format(data.officers[2].times(equipmentBoosts[2]))} [${format(data.officers[2])} - ${format(data.currentEnemy.officers[2])}]<br>${rankNameShort[7]}: ${format(data.officers[3].times(equipmentBoosts[2]))} [${format(data.officers[3])} - ${format(data.currentEnemy.officers[3])}]<br>`
            
            equipmentString[0] = `Anti-Tank Guns: ${format(data.equipment[1])} [+${format(equipmentBoosts[0])} Damage to Armor]<br>Artillery Guns: ${format(data.equipment[2])} [+${format(equipmentBoosts[1])} Damage to Infantry]<br>Transports: ${format(data.equipment[3])} [${format(equipmentBoosts[2])}x More Troops]`
            if(data.wins.lt(30))
                equipmentString[1] = 'Deployed at 30 Wins<br>Deployed at 40 Wins<br>Deployed at 75 Wins'
            else if(data.wins.lt(40))
                equipmentString[1] = `Anti-Tank Guns: ${format(data.currentEnemy.equipment[1])} [+${format(enemyEquipmentBoosts[0])} Damage to Armor]<br>Deployed at 40 Wins<br>Deployed at 75 Wins`
            else if(data.wins.lt(75))
                equipmentString[1] = `Anti-Tank Guns: ${format(data.currentEnemy.equipment[1])} [+${format(enemyEquipmentBoosts[0])} Damage to Armor]<br>Artillery Guns: ${format(data.currentEnemy.equipment[2])} [+${format(enemyEquipmentBoosts[1])} Damage to Infantry]<br>Deployed at 75 Wins`
            else
                equipmentString[1] = `Anti-Tank Guns: ${format(data.currentEnemy.equipment[1])} [+${format(enemyEquipmentBoosts[0])} Damage to Armor]<br>Artillery Guns: ${format(data.currentEnemy.equipment[2])} [+${format(enemyEquipmentBoosts[1])} Damage to Infantry]<br>Transports: ${format(data.currentEnemy.equipment[3])} [${format(enemyEquipmentBoosts[2])}x More Troops]`
            //Updates
            DOMCacheGetOrSet('playerStats').innerHTML = `${data.armyName}<br>Manpower: ${format(manpowerTotal[0])}<br>Attack Power: ${format(attackTotal[0])}`
            DOMCacheGetOrSet('enemyStats').innerHTML = `${data.currentEnemy.name}<br>Manpower: ${format(manpowerTotal[1])}<br>Attack Power: ${format(attackTotal[1])}`
            DOMCacheGetOrSet('playerArmy').innerHTML = `Soldiers<hr>${enlistString[0]}<br>Officers<hr>${officerString[0]}<br>Equipment<hr>${equipmentString[0]}`
            DOMCacheGetOrSet('enemyArmy').innerHTML = `Soldiers<hr>${enlistString[1]}<br>Officers<hr>${officerString[1]}<br>Equipment<hr>${equipmentString[1]}`
            DOMCacheGetOrSet('battleRewardText').innerHTML = difficultyNameIndex < difficultyNames.length-1 ? `Rewards: +${format(battleRewards[0])} Medals | +/-${format(battleRewards[1])} Approval
            <br>Total Wins: ${format(data.wins)} | Difficulty Scale ${format(difficultyScale)}x<br>
            Difficulty Rating: ${difficultyNames[difficultyNameIndex]}` : `Rewards: +${format(battleRewards[0])} Medals | +/-${format(battleRewards[1])} Approval
            <br>Total Wins: ${format(data.wins)} | Difficulty Scale ${format(difficultyScale)}x<br>
            Difficulty Rating: Grand Master - ${romanize(difficultyNameIndex - difficultyNames.length)}`
            DOMCacheGetOrSet('tiebreakText').innerHTML = (manpowerTotal[0].sub(attackTotal[1])).gte(manpowerTotal[1].sub(attackTotal[0])) ? `Vs.<br>Tie Breaker Status: Win` : `Vs.<br>Tie Breaker Status: Lose`
        }
    }
    else if(data.currentTab === 4) {
        updatePromotionButtons()
        DOMCacheGetOrSet('promotionProgressText').innerHTML = data.level < 5 ? `${levelNameList[data.level]} ==Progress to Promotion: ${format(Decimal.divide(data.medals,promotionReqs[data.level]).times(100))}% (${format(data.medals)}/${format(promotionReqs[data.level])})=> ${levelNameList[data.level+1]}` : `General of the Army`
        if(DOMCacheGetOrSet('currentRankImg').getAttribute('src') !== levelImgSrcs[data.level]) 
            DOMCacheGetOrSet('currentRankImg').src = levelImgSrcs[data.level]
        if((DOMCacheGetOrSet('nextRankImg').getAttribute('src') !== levelImgSrcs[data.level+1] && data.level < 5) || (DOMCacheGetOrSet('nextRankImg').getAttribute('src') !== levelImgSrcs[5] && data.level >= 5))
            DOMCacheGetOrSet('nextRankImg').src = data.level < 5 ? levelImgSrcs[data.level+1] : levelImgSrcs[5]
        DOMCacheGetOrSet('dualPromotionText').innerHTML = `Current Rank: ${levelNameList[data.level]} | Medals: ${format(data.medals)}`
        DOMCacheGetOrSet('promotionButton').style.display = data.level < 5 ? 'flex' : 'none'
        DOMCacheGetOrSet('promotionButton').innerHTML =  `Promote to ${levelNameList[data.level+1]}`
        if(data.level < 5)
            DOMCacheGetOrSet('promotionButton').className = data.medals.lt(promotionReqs[data.level]) ? 'locked' : 'unlocked'
        else
            DOMCacheGetOrSet('promotionButton').className = 'maxed'
        
        DOMCacheGetOrSet('promotionUpAlert').style.display = data.level === 0 ? 'inline' : 'none'
        DOMCacheGetOrSet('oneUp').style.display = data.level >= 1 ? 'flex' : 'none'
        DOMCacheGetOrSet('twoUp').style.display = data.level >= 2 ? 'flex' : 'none'
        DOMCacheGetOrSet('thrUp').style.display = data.level >= 3 ? 'flex' : 'none'
        DOMCacheGetOrSet('forUp').style.display = data.level >= 4 ? 'flex' : 'none'
        DOMCacheGetOrSet('fivUp').style.display = data.level >= 5 ? 'flex' : 'none'
    }
    else if(data.currentTab === 6)
        updateAchieves()
}

const tabIDs = ['manpower','equipment','finances','battleground','promotions','settings','achievements']

function tabChangeHTML() {
    for(let i = 0; i < tabIDs.length; i++)
        DOMCacheGetOrSet(tabIDs[i] + 'Area').style.display = i === data.currentTab ? 'flex' : 'none'
}
