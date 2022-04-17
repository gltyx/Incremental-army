const enlistBase = [D(1),D(2),D(3),D(4)]
const officerBase = [D(1),D(2),D(5),D(10)]

let enlistCost = [D(0),D(0),D(0),D(0)]
let officerCost = [D(0),D(0),D(0),D(0)]

function updateMP() {
    for(let i = 0; i < 4; i++) {
        enlistCost[i] = enlistBase[i].times(Decimal.pow(1.5,data.enlisted[i]))
        officerCost[i] = officerBase[i].times(Decimal.pow(1.5,data.officers[i]))
    }
}