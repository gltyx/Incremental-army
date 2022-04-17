function changeTab(a) {
    data.currentTab = a;
    tabChangeHTML()
}
let diff = 0;
function mainLoop() {
    diff = (Date.now()-data.time)*data.devSpeed/1000;
    updateHTML();
}

window.setInterval(mainLoop(), 10);

