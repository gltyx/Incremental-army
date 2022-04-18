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
        time: Date.now(),
        currentTab: 1,
        currentSubTab: [0,0,0,0,0,0,0],
        currentElement: 0,
        currentUpdate: 'v0.0.0',
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
    if (savedata !== undefined) fixSave(data, savedata)
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
    generateHoldEvents()
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
