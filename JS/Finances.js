//Can be changed through lobbying upgrades
let fundBase = D(1e3)
let fundsToRecieve = D(0)

function updateFinances() {
    fundBase = data.lobbyLevel.gt(0) ? D(1e3).times(data.lobbyLevel.times(2)) : D(1e3)
    if(data.approval.gte(50)) {
        fundsToRecieve = fundBase.times(Decimal.pow(1.5,D(1).plus(data.approval.div(100))))
    } 
    else if(data.approval.lt(50)) {
        fundsToRecieve = fundBase.times(Decimal.pow(1.5,data.approval.div(100)))
    }


}

function acquire() {
    if(data.approval.lt(1)) return
    data.funds = data.funds.plus(fundsToRecieve)
    data.approval = data.approval.sub(1)
}

function specialItem(a) {
    switch(a) {
        case 0:
            if(data.approval.lt(100)) return
            data.approval = data.approval.sub(90)
            data.lobbyLevel = data.lobbyLevel.add(1)
            break
        case 1:
            if(data.approval.gt(0)) return
            data.approval = D(50)
            data.funds = data.funds.sub(data.funds.times(.75))
            break

    }
}