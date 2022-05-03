const enemyDivNames = ["Armored","Recon","Airborne","Infantry","Motorized","Mechanized"]


let manpowerTotal = [D(0),D(0)]
let attackTotal = [D(0),D(0)]
let enemyOfficerBoost = [D(0),D(0),D(0),D(0)]
let equipmentBoosts = [D(0),D(0),D(0)]
let enemyEquipmentBoosts = [D(0),D(0),D(0)]

const battleRewardBases = [D(20),D(15)]
let difficultyNameIndex = 0
let battleRewards = [D(0),D(0)]
let difficultyScale = D(0)

function updateBattleground() {
    difficultyNameIndex = Decimal.floor(data.wins.div(10))
    manpowerTotal[0] = D(0)
    manpowerTotal[1] = D(0)
    attackTotal[0] = D(0)
    attackTotal[1] = D(0)
    difficultyScale = Decimal.sqrt(data.wins).times(Decimal.floor(Decimal.sqrt(D(1.15).times(data.wins))).plus(1))
    difficultyScale = D(1).plus(difficultyScale)
    for(let i = 0; i < 2; i++) {
        battleRewards[i] = Decimal.round(battleRewardBases[i].times(difficultyScale))
    }
    if(data.promotionUpgrades[4])
        battleRewards[0] = Decimal.round(battleRewards[0].times(2.0))
    if(data.promotionUpgrades[9])
        battleRewards[0] = Decimal.round(battleRewards[0].times(4.0))
    if(battleRewards[1].gt(100)) battleRewards[1] = D(100)
    for(let i = 0; i < 3; i++) {
        if(i === 2)
            equipmentBoosts[i] = D(1).plus(Decimal.sqrt(Decimal.sqrt(data.equipment[i+1])))
        else
            equipmentBoosts[i] = (Decimal.sqrt(Decimal.sqrt(data.equipment[i+1])))
        if(i === 2)
            enemyEquipmentBoosts[i] = D(1).plus(Decimal.sqrt(Decimal.sqrt(data.currentEnemy.equipment[i+1])))
        else enemyEquipmentBoosts[i] = (Decimal.sqrt(Decimal.sqrt(data.currentEnemy.equipment[i+1])))
    }
    for(let i = 0; i < 4; i++) {
        enemyOfficerBoost[i] = D(1).plus(Decimal.sqrt(data.officers[i]))
        
        manpowerTotal[0] = manpowerTotal[0].add(Decimal.times(data.enlisted[i], equipmentBoosts[2]).add(Decimal.times(data.officers[i], equipmentBoosts[2])))
        manpowerTotal[1] = manpowerTotal[1].add(Decimal.times(data.currentEnemy.enlisted[i], enemyEquipmentBoosts[2]).add(Decimal.times(data.officers[i], enemyEquipmentBoosts[2])))
        
        attackTotal[0] = attackTotal[0].add(Decimal.times(data.enlisted[i],i+1).times(officerBoost[i]))
        attackTotal[0] = attackTotal[0].add(data.officers[i])
        attackTotal[0] = attackTotal[0].add(data.equipment[2].times(10))
        attackTotal[1] = attackTotal[1].add(Decimal.times(data.currentEnemy.enlisted[i],i+1).times(enemyOfficerBoost[i]))
        attackTotal[1] = attackTotal[1].add(data.currentEnemy.officers[i])
        attackTotal[1] = attackTotal[1].add(data.currentEnemy.equipment[2].times(10))
    }
    
}

const defaultEnemyObj = {
    name: "",
    enlisted: [D(0),D(0),D(0),D(0)],
    officers: [D(0),D(0),D(0),D(0)],
    equipment: [D(0),D(0),D(0),D(0)],
}

let enemy = {
    name: "",
    enlisted: [D(0),D(0),D(0),D(0)],
    officers: [D(0),D(0),D(0),D(0)],
    equipment: [D(0),D(0),D(0),D(0)],
}

function generateEnemy() {
    const num = getRandom(1,100)
    let ending = ''
    if(num % 10 === 1 && num !== 11) ending = 'st'
    else if(num % 10 === 2 & num !== 12) ending = 'nd'
    else if(num % 10 === 3 && num !== 13) ending = 'rd'
    else ending = 'th'

    enemy.name =  `${num}${ending} ${enemyDivNames[getRandom(0,6)]} Division`
    //Difficulty Progression 0-10 Pvt Only, 11-20 Pvt/Cpl, 21-30 Pvt/Cpl/Sgt, 31-40 Pvt/Cpl/SSgt

    enemy.enlisted[0] = getRandomDecimal(D(1), D(1).times(difficultyScale))
    enemy.enlisted[1] = data.wins.gt(10) ? getRandomDecimal(D(1), D(2).times(difficultyScale)) : D(0)
    enemy.enlisted[2] = data.wins.gt(20) ? getRandomDecimal(D(1), D(3).times(difficultyScale)) : D(0)
    enemy.enlisted[3] = data.wins.gt(30) ? getRandomDecimal(D(1), D(4).times(difficultyScale)) : D(0)

    enemy.officers[0] = data.wins.gt(50) ? getRandomDecimal(D(1), D(1).times(difficultyScale)) : D(0)
    enemy.officers[1] = data.wins.gt(60) ? getRandomDecimal(D(1), D(1).times(difficultyScale)) : D(0)
    enemy.officers[2] = data.wins.gt(70) ? getRandomDecimal(D(1), D(1).times(difficultyScale)) : D(0)
    enemy.officers[3] = data.wins.gt(80) ? getRandomDecimal(D(1), D(1).times(difficultyScale)) : D(0)

    enemy.equipment[1] = data.wins.gt(30) ? getRandomDecimal(D(1), D(1).times(difficultyScale)) : D(0)
    enemy.equipment[2] = data.wins.gt(40) ? getRandomDecimal(D(1), D(3).times(difficultyScale)) : D(0)
    enemy.equipment[3] = data.wins.gt(75) ? getRandomDecimal(D(1), D(5).times(difficultyScale)) : D(0)
    
    data.currentEnemy = enemy
    enemy = defaultEnemyObj
}

function switchDifficulty() {
    if(data.difficultyIndex !== 4) data.difficultyIndex++
    else data.difficultyIndex = 0
    generateEnemy()
}

function battle() {
    //Round 1 
    const mpTotals = manpowerTotal
    const atkTotals = attackTotal
    for(let i = 0; i < 4; i++) {
        const enlistedChecks = [(data.enlisted[i].times(equipmentBoosts[2])).sub(enemyEquipmentBoosts[1]),(data.currentEnemy.enlisted[i].times(enemyEquipmentBoosts[2])).sub(equipmentBoosts[1])]
        const officerChecks = [(data.officers[i].times(equipmentBoosts[2])).sub(enemyEquipmentBoosts[1]),(data.currentEnemy.officers[i].times(enemyEquipmentBoosts[2])).sub(equipmentBoosts[1])]

        if(enlistedChecks[0].gt(enlistedChecks[1])) {
            data.enlisted[i] = data.enlisted[i].sub(data.currentEnemy.enlisted[i])
            data.currentEnemy.enlisted[i] = D(0)
            if(data.enlisted[i].lt(0))
                data.enlisted[i] = D(0)
        }
        else if(enlistedChecks[0].lt(enlistedChecks[1])) {
            data.currentEnemy.enlisted[i] = data.currentEnemy.enlisted[i].sub(data.enlisted[i])
            data.enlisted[i] = D(0)
        }
        else if(enlistedChecks[0].eq(enlistedChecks[1])) {
            const composite = [mpTotals[0].sub(atkTotals[1]),mpTotals[1].sub(atkTotals[0])]
            data.enlisted[i] = composite[0].gte(composite[1]) ? data.enlisted[i].sub(data.currentEnemy.enlisted[i]) : D(0)
            data.currentEnemy.enlisted[i] = composite[0].gte(composite[1]) ? D(0) : data.currentEnemy.enlisted[i].sub(data.enlisted[i])
            if(data.enlisted[i].lt(0))
                data.enlisted[i] = D(0)
        }
        if(officerChecks[0].gt(officerChecks[1])) {
            data.officers[i] = data.officers[i].sub(data.currentEnemy.officers[i])
            data.currentEnemy.officers[i] = D(0)
            if(data.officers[i].lt(0))
                data.officers[i] = D(0)
        }
        else if(officerChecks[0].lt(officerChecks[1])) {
            data.currentEnemy.officers[i] = data.currentEnemy.officers[i].sub(data.officers[i])
            data.officers[i] = D(0)
        }
        else if(officerChecks[0].eq(officerChecks[1])) {
            const composite = [mpTotals[0].sub(atkTotals[1]),mpTotals[1].sub(atkTotals[0])]
            data.officers[i] = composite[0].gte(composite[1]) ? data.officers[i].sub(data.currentEnemy.officers[i]) : D(0)
            data.currentEnemy.officers[i] = composite[0].gte(composite[1]) ? D(0) : data.currentEnemy.officers[i].sub(data.officers[i])
            if(data.officers[i].lt(0))
                data.officers[i] = D(0)
        }
    }
    const composite = [mpTotals[0].sub(atkTotals[1]),mpTotals[1].sub(atkTotals[0])]
    if(composite[0].gt(composite[1])) {
        data.medals = data.medals.plus(battleRewards[0])
        data.approval = data.approval.plus(battleRewards[1])
        if(data.approval.gt(100)) data.approval = D(100)
        createAlert("Victory!","You have defeated the enemy and earned " + format(battleRewards[0]) + " Medals and " + format(battleRewards[1]) + " Approval","268135")
        data.wins = data.wins.plus(1)
        generateEnemy()
        updatePromotionButtons()
    }
    else if(composite[0].lt(composite[1])) {
        data.approval = data.approval.sub(battleRewards[1])
        if(data.approval.lt(D(0))) data.approval = D(0)
        //data.funds = data.funds.sub(data.funds.times(moneyLossScales[data.difficultyIndex]))
        if(data.funds.lt(D(0))) data.funds = D(0)
        createAlert("Defeat!","You have been defeated by the enemy and lost " + format(battleRewards[1]) + " Approval","812626")
        generateEnemy()
    }
    else if(composite[0].eq(composite[1])) {
        createAlert("Stalemate!","This Battle ended in a Stalemate.","9aa226")
        generateEnemy()
    }
}    
