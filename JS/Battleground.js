const enemyDivNames = ["Armored","Recon","Airborne","Infantry"]

let manpowerTotal = [D(0),D(0)]
let attackTotal = [D(0),D(0)]
let enemyOfficerBoost = [D(0),D(0),D(0),D(0)]

function updateBattleground() {
        manpowerTotal[0] = D(0)
        manpowerTotal[1] = D(0)
        attackTotal[0] = D(0)
        attackTotal[1] = D(0)
    for(let i = 0; i < 4; i++) {
        enemyOfficerBoost[i] = D(1).plus(Decimal.sqrt(data.officers[i]))
        
        manpowerTotal[0] = manpowerTotal[0].add(data.enlisted[i].add(data.officers[i]))
        manpowerTotal[1] = manpowerTotal[1].add(data.currentEnemy.enlisted[i].add(data.currentEnemy.officers[i]))
        
        attackTotal[0] = attackTotal[0].add(Decimal.times(data.enlisted[i],i+1).times(officerBoost[i]))
        attackTotal[1] = attackTotal[1].add(Decimal.times(data.currentEnemy.enlisted[i],i+1).times(enemyOfficerBoost[i]))
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

    enemy.name =  `${num}${ending} ${enemyDivNames[getRandom(0,4)]} Division`
    for(let i = 0; i < 4; i++) {
        enemy.enlisted[i] = D(getRandom(0,data.enlisted[i].times(1.5)))
        enemy.officers[i] = D(getRandom(0,data.officers[i].times(1.5)))
        enemy.equipment[i] = D(getRandom(0,data.equipment[i].times(1.5)))
    }
    data.currentEnemy = enemy
    enemy = defaultEnemyObj
}