//Can be changed through lobbying upgrades
let fundBase = D(1e3)
let fundsToRecieve = D(0)

function updateFinances() {
    fundBase = data.lobbyLevel.gt(0) ? D(1e3).times(data.lobbyLevel.times(2)) : D(1e3)
    if(data.promotionUpgrades[7])
        fundBase = fundBase.times(D(5.0))
    if(data.promotionUpgrades[11])
        fundBase = fundBase.times(D(10.0))
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
            if(data.achievement[16] === false)
                data.achievement[16] = true
            break
        case 1:
            if(data.approval.gt(0)) return
            data.approval = D(50)
            if(!data.promotionUpgrades[1] && !data.promotionUpgrades[6])
                data.funds = data.funds.sub(data.funds.times(.75))
            else if(data.promotionUpgrades[1] && !data.promotionUpgrades[6])
                data.funds = data.funds.sub(data.funds.times(.5))
            else if((!data.promotionUpgrades[1] && data.promotionUpgrades[6]) || (data.promotionUpgrades[1] && data.promotionUpgrades[6]))
                data.funds = data.funds.sub(data.funds.times(.25))
            if(data.achievement[17] === false)
                data.achievement[17] = true
            break
    }
}