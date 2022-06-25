const equipmentCost = [D(1.5e4),D(1.78e5),D(5e5),D(2.22e5)]

function buyEquip(a) {
    const buyAmounts = [1,10,100,1000]
    for(let i = 0; i < buyAmounts[data.buyAmounts[2]]; i++) {
        if(data.funds.lt(equipmentCost[a])) break
        if(data.funds.gte(equipmentCost[a])) {
            data.funds = data.funds.sub(equipmentCost[a])
            data.equipment[a] = data.equipment[a].add(D(1))
        }
    }
}