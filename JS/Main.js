
if(data.armyName === " ") {
    let name = prompt('Name your army!:')
    data.armyName = name
}

function changeTab(a) {
    data.currentTab = a;
    tabChangeHTML()
}
let diff = 0;
function mainLoop() {
    diff = (Date.now()-data.time)*data.devSpeed/1000;
    updateMP()
    updateFinances()
    updateHTML();
}

let holdInterval = 50 //this will be used for the holding
function startHold(event,funct) {
    event.preventDefault()
    holdInterval = setInterval(function() {funct},50) 
}

function stopHold(event) {
 clearInterval(holdInterval)//stop it
}

function generateHoldEvents() {
    
    for (let i = 0; i < 4; i++) {
        DOMCacheGetOrSet(`${rankNameIds[i]}Button`).addEventListener('touchstart',startHold(event,buyMP(i,0)))
        DOMCacheGetOrSet(`${rankNameIds[i]}Button`).addEventListener('touchend',stopHold(event))

        DOMCacheGetOrSet(`${equipIds[i]}Button`).addEventListener('touchstart',startHold(event,buyEquip(i)))
        DOMCacheGetOrSet(`${equipIds[i]}Button`).addEventListener('touchend',stopHold(event))
    }

    DOMCacheGetOrSet('acquireButton').addEventListener('touchstart',startHold(event,acquire()))
    DOMCacheGetOrSet('acquireButton').addEventListener('touchend',stopHold(event))

    DOMCacheGetOrSet('lobbyButton').addEventListener('touchstart',startHold(event,specialItem(0)))
    DOMCacheGetOrSet('lobbyButton').addEventListener('touchend',stopHold(event))
    DOMCacheGetOrSet('propButton').addEventListener('touchstart',startHold(event,specialItem(1)))
    DOMCacheGetOrSet('propButton').addEventListener('touchend',stopHold(event))
}

window.setInterval(function(){mainLoop()}, 50);

