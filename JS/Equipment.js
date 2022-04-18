const equipmentCost = [D(1.5e4),D(1.78e5),D(5e5),D(2.22e5)]

function buyEquip(a) {
    if(data.funds.gte(equipmentCost[a])) {
        data.funds = data.funds.sub(equipmentCost[a])
        data.equipment[a] = data.equipment[a].add(D(1))
    }
}