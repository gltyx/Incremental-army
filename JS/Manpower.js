const enlistBase = [D(1),D(2),D(3),D(4)]
const officerBase = [D(1),D(2),D(5),D(10)]

let enlistCost = [D(0),D(0),D(0),D(0)]
let officerCost = [D(0),D(0),D(0),D(0)]

let officerBoost = [D(0),D(0),D(0),D(0)]

function updateMP() {
    for(let i = 0; i < 4; i++) {
        enlistCost[i] = enlistBase[i].times(Decimal.pow(1.5,data.enlisted[i]))
        officerCost[i] = officerBase[i].times(Decimal.pow(1.5,data.officers[i]))
        officerBoost[i] = D(1).plus(Decimal.sqrt(data.officers[i]))
    }
}

function buyMP(a,b) {
    switch(b) {
        case 0:
            if(data.equipment[0].gte(enlistCost[a])) {
                data.equipment[0] = data.equipment[0].sub(enlistCost[a])
                data.enlisted[a] = data.enlisted[a].add(D(1))
            }
            break
        case 1:
            if(data.funds.gte(officerCost[a])) {
                data.funds = data.funds.sub(officerCost[a])
                data.officers[a] = data.officers[a].add(D(1))
            }
            break
    }
}