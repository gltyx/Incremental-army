const enemyDivNames = ["Armored","Recon","Airborne","Infantry"]

let manpowerTotal = [D(0),D(0)]
let attackTotal = [D(0),D(0)]
let enemyOfficerBoost = [D(0),D(0),D(0),D(0)]

function updateBattleground() {
    for(let i = 0; i < 4; i++) {
        enemyOfficerBoost[i] = D(1).plus(Decimal.sqrt(data.officers[i]))
        manpowerTotal[0] = D(0)
        manpowerTotal[1] = D(0)
        manpowerTotal[0] = manpowerTotal[0].add(data.enlisted[i].add(data.officers[i]))
        manpowerTotal[1] = manpowerTotal[1].add(data.currentEnemy.enlisted[i].add(data.currentEnemy.officers[i]))
        attackTotal[0] = D(0)
        attackTotal[1] = D(0)
        attackTotal[0] = attackTotal[0].add(Decimal.times(data.enlisted[i],i+1).times(officerBoost[i]))
        attackTotal[1] = attackTotal[1].add(Decimal.times(data.currentEnemy.enlisted[i],i+1).times(enemyOfficerBoost[i]))
    }
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
    if(num === 1 || num === 21 || num === 31 || num === 41 || num === 51 || num === 61 || num === 71 || num === 81 || num === 91) ending = 'st'
    else if(num === 2 || num === 22 || num === 32 || num === 42 || num === 52 || num === 62 || num === 72 || num === 82 || num === 92) ending = 'nd'
    else if(num === 3 || num === 23 || num === 33 || num === 43 || num === 53 || num === 63 || num === 73 || num === 83 || num === 93) ending = 'rd'
    else ending = 'th'

    enemy.name =  `${num}${ending} ${enemyDivNames[getRandom(0,4)]} Division`
    for(let i = 0; i < 4; i++) {
        enemy.enlisted[i] = D(getRandomDecimal(1,data.enlisted[i].times(1.5)))
        enemy.officers[i] = D(getRandomDecimal(1,data.officers[i].times(1.5)))
        enemy.equipment[i] = D(getRandomDecimal(1,data.equipment[i].times(1.5)))
    }
    data.currentEnemy = enemy
}