const enemyDivNames = ["Armored","Recon","Airborne","Infantry","Motorized","Mechanized"]
const enemyDiffScales = [D(1.25),D(1.5),D(1.75),D(2.0),D(2.5)]

let manpowerTotal = [D(0),D(0)]
let attackTotal = [D(0),D(0)]
let enemyOfficerBoost = [D(0),D(0),D(0),D(0)]
let equipmentBoosts = [D(0),D(0),D(0)]
let enemyEquipmentBoosts = [D(0),D(0),D(0)]

const battleRewardBases = [D(10),D(5)]
const diffRewardScales = [D(0.5),D(0.75),D(1),D(1.5),D(2)]
let battleRewards = [D(0),D(0)]


function updateBattleground() {
    manpowerTotal[0] = D(0)
    manpowerTotal[1] = D(0)
    attackTotal[0] = D(0)
    attackTotal[1] = D(0)
    for(let i = 0; i < 2; i++) {
        battleRewards[i] = battleRewardBases[i].times(diffRewardScales[data.difficultyIndex])
    }
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
    for(let i = 0; i < 4; i++) {
        if(data.difficultyIndex < 3) {
            enemy.enlisted[i] = D(getRandom(1,data.enlisted[i].times(enemyDiffScales[data.difficultyIndex])))
            enemy.officers[i] = D(getRandom(0,data.officers[i].times(enemyDiffScales[data.difficultyIndex])))
            enemy.equipment[i] = D(getRandom(0,data.equipment[i].times(enemyDiffScales[data.difficultyIndex])))
        }
        else if(data.difficultyIndex >= 3) {
            enemy.enlisted[i] = D(getRandom(Math.ceil(5 * Number(enemyDiffScales[data.difficultyIndex])),data.enlisted[i].times(enemyDiffScales[data.difficultyIndex])))
            enemy.officers[i] = D(getRandom(Math.ceil(5 * Number(enemyDiffScales[data.difficultyIndex])),data.officers[i].times(enemyDiffScales[data.difficultyIndex])))
            enemy.equipment[i] = D(getRandom(Math.ceil(5 * Number(enemyDiffScales[data.difficultyIndex])),data.equipment[i].times(enemyDiffScales[data.difficultyIndex])))
        }
        
    }
    data.currentEnemy = enemy
    enemy = defaultEnemyObj
}

function switchDifficulty() {
    if(data.difficultyIndex !== 4) data.difficultyIndex++
    else data.difficultyIndex = 0
    generateEnemy()
}
let roundDelay = 0;
let roundDelayTimer = 0;

function battle() {
    //Round 1 
    for(let i = 0; i < 4; i++) {
        let enlistedChecks = [(data.enlisted[i].times(equipmentBoosts[2])).sub(enemyEquipmentBoosts[1]),(data.currentEnemy.enlisted[i].times(enemyEquipmentBoosts[2])).sub(equipmentBoosts[1])]
        let officerChecks = [(data.officers[i].times(equipmentBoosts[2])).sub(enemyEquipmentBoosts[1]),(data.currentEnemy.officers[i].times(enemyEquipmentBoosts[2])).sub(equipmentBoosts[1])]

        if(enlistedChecks[0].gt(enlistedChecks[1])) {
            data.enlisted[i] = data.enlisted[i].sub(data.currentEnemy.enlisted[i])
            data.currentEnemy.enlisted[i] = D(0)
        }
        else if(enlistedChecks[0].lt(enlistedChecks[1])) {
            data.currentEnemy.enlisted[i] = data.currentEnemy.enlisted[i].sub(data.enlisted[i])
            data.enlisted[i] = D(0)
        }

        if(officerChecks[0].gt(officerChecks[1])) {
            data.officers[i] = data.officers[i].sub(data.currentEnemy.officers[i])
            data.currentEnemy.officers[i] = D(0)
        }
        else if(officerChecks[0].lt(officerChecks[1])) {
            data.currentEnemy.officers[i] = data.currentEnemy.officers[i].sub(data.officers[i])
            data.officers[i] = D(0)
        }
    }
    while(roundDelayTimer < roundDelay) {
        roundDelayTimer += diff
    }
    roundDelayTimer = 0
    //Round 2
    
}    