const D = x => new Decimal(x)
//create all the variables in a data object for saving
function getDefaultObject() {
    return {
        enlisted: [D(0),D(0),D(0),D(0)],
        officers: [D(0),D(0),D(0),D(0)],
        equipment: [D(0),D(0),D(0),D(0)],
        funds: D(7.5e4),
        approval: D(50),
        lobbyLevel: D(0),
        armyName: undefined,
        currentEnemy: {
            name: "",
            enlisted: [D(0),D(0),D(0),D(0)],
            officers: [D(0),D(0),D(0),D(0)],
            equipment: [D(0),D(0),D(0),D(0)],
        },
        medals: D(0),
        wins: D(0),
        promotionUpgrades: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
        autoActive: [false,false,false,false,false,false,false,false,false,false,false,false,false,false],
        acquireAutoReq: D(0),
        level: 0,
        time: Date.now(),
        currentTab: 1,
        settingsToggles: [true],
        currentUpdate: 'v0.0.4',
        devSpeed: 1,
    }
}
let data = getDefaultObject()
//saving and loading
const saveName = 'incArmy'
function save(){
    window.localStorage.setItem(saveName, JSON.stringify(data))
}
function load() {
    let savedata = JSON.parse(window.localStorage.getItem(saveName))
    if(savedata === null || savedata === undefined) savedata = getDefaultObject()
    else if (savedata !== undefined) fixSave(data, savedata)
    if(data.armyName === undefined)
        nameArmy()
    if(data.currentUpdate !== "v0.0.4") {
        createAlert("Welcome Back!","The current version is v0.0.4, View the Changelog for details","812626")
        data.currentUpdate = "v0.0.4"
    }
    updateAutomators()
    updatePromotionButtons()
    for(let i = 0; i < toggleNames.length; i++)
        DOMCacheGetOrSet(`setTog${i}`).innerHTML = data.settingsToggles[i] ? `${toggleNames[i]}: On` : `${toggleNames[i]}: Off`
}
//fix saves
function fixSave(main=getDefaultObject(), data) {
    if (typeof data === "object") {
        Object.keys(data).forEach(i => {
            if (main[i] instanceof Decimal) {
                main[i] = D(data[i]!==null?data[i]:main[i])
            } else if (typeof main[i]  == "object") {
                fixSave(main[i], data[i])
            } else {
                main[i] = data[i]
            }
        })
        return main
    }
    else return getDefaultObject()
}
function exportSave(){
    save()
    let exportedData = btoa(JSON.stringify(data));
    const exportedDataText = document.createElement("textarea");
    exportedDataText.value = exportedData;
    document.body.appendChild(exportedDataText);
    exportedDataText.select();
    exportedDataText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(exportedDataText);
}
function importSave(){
    let importedData = prompt("Paste your save data here!")
    data = Object.assign(getDefaultObject(), JSON.parse(atob(importedData)))
    save()
    location.reload()
}
window.setInterval(function(){
    save()
}, 10000);
window.onload = function (){
    load()
    tabChangeHTML()
    scrollNextMessage()
}
//full reset
function fullReset(){
    exportSave()
    window.localStorage.removeItem(saveName)
    prevAmount = D(0)
    location.reload()
}
function deleteSave(){
        window.localStorage.removeItem(saveName)
        location.reload()
}
