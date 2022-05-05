function generateEventHandlers() {
    for(let i = 0; i < 4; i++) {
        DOMCacheGetOrSet(`${rankNameIds[i]}Button`).addEventListener('click', () => {buyMP(i,0)})
        DOMCacheGetOrSet(`${rankNameIds[i+4]}Button`).addEventListener('click', () => {buyMP(i,1)})
        DOMCacheGetOrSet(`${equipIds[i]}Button`).addEventListener('click', () => {buyEquip(i)})
    }
    generateAchievementHandlers()
}


function nameArmy() {
    const nameRegex = /[^\w ]|_/g  
    // \w = word library (i.e. all numbers & letters, not case-specific)
    let name = DOMCacheGetOrSet('promptInput').value
    closeModal(1)
    if (!name) { //lol why would you input nothing?
      createAlert('Error!','No Name Inputted!','#ff0000')
      createPrompt('Name your Army!',0)
      return
    }
    if (name.length > 20) {//prevent too long names
      createAlert('Error!','Your army name is too long!','#ff0000')
      createPrompt('Name your Army!',0)
      return
    }
      name = name.replace(nameRegex, "")
      console.log(name)
    data.armyName = name
}
const toggleNames = ['Newsticker','Notation']
function toggle(i) {
    data.settingsToggles[i] = !data.settingsToggles[i]
    if(i !== 1)
        DOMCacheGetOrSet(`setTog${i}`).innerHTML = data.settingsToggles[i] ? `${toggleNames[i]}: On` : `${toggleNames[i]}: Off`
    else
        DOMCacheGetOrSet(`setTog${i}`).innerHTML = data.settingsToggles[i] ? `${toggleNames[i]}: Mixed Sci` : `${toggleNames[i]}: Sci`
    if (i === 0) {
        DOMCacheGetOrSet('newsHolder').style.display = data.settingsToggles[i] ? 'block' : 'none'
        scrollNextMessage()
    }
}

function changeTab(a) {
    data.currentTab = a;
    if(a === 3 && (data.currentEnemy.name === "" && data.enlisted[0].gte(D(1))) || (attackTotal[1].eq(0) && data.enlisted[0].gte(D(1)))) 
        generateEnemy()
    tabChangeHTML()
}
let diff = 0;
function mainLoop() {
    diff = (Date.now()-data.time)*data.devSpeed/1000
    data.time = Date.now()
    updateMP()
    updateFinances()
    updateBattleground()
    runAutomators()
    checkAchieves()
    updateHTML()
}
/**
 * 
 * @param {*} a The Alert Title
 * @param {*} b The Alert Content
 * @param {*} c The Alert Border Color
 */
function createAlert(a,b,c) {
    DOMCacheGetOrSet('alertContainer').style.border = `4px solid #${c}`
    DOMCacheGetOrSet('alertTitle').innerHTML = a
    DOMCacheGetOrSet('alertContent').innerHTML = b
    DOMCacheGetOrSet('alert').style.display = 'block'
    DOMCacheGetOrSet('alertContainer').style.display = 'block'
}

/**
 * 
 * @param {*} a Prompt Title
 * @param {*} b Function Switch
 */
function createPrompt(a,b) {
    
    let old_element = document.getElementById("promptButton");
    let new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
    DOMCacheGetOrSet('promptInput').value = ''
    DOMCacheGetOrSet('promptContainer').style.border = `4px solid whitesmoke`
    DOMCacheGetOrSet('promptTitle').innerHTML = a
    DOMCacheGetOrSet('prompt').style.display = 'block'
    DOMCacheGetOrSet('promptContainer').style.display = 'block'
    switch(b) {
        case 0:
            document.getElementById('promptButton').addEventListener('click', () => { nameArmy() })
            break
        case 1:
            document.getElementById('promptButton').addEventListener('click', () => { importSave() })
            break
    }
}
createPrompt
function closeModal(i) {
    switch(i) {
        case 0:
            document.getElementById('alertContainer').style.display = 'none'
            document.getElementById('alert').style.display = 'none'
            break
        case 1:
            document.getElementById('promptContainer').style.display = 'none'
            document.getElementById('prompt').style.display = 'none'
            break
    }
    
}

function toggleBA(i) {
    if(data.buyAmounts[i] === 0)
    data.buyAmounts[i] = 1
    else if(data.buyAmounts[i] === 1)
    data.buyAmounts[i] = 2
    else if(data.buyAmounts[i] === 2)
    data.buyAmounts[i] = 3
    else if(data.buyAmounts[i] === 3)
    data.buyAmounts[i] = 0
    updateBuyAmounts()
}

function updateBuyAmounts() {
    const baName = ['1','10','100','1e3']
    for(let i = 0; i < 3; i++) {
        DOMCacheGetOrSet(`ba${i}`).innerHTML = `Buy Amount: ${baName[data.buyAmounts[i]]}`
    }
}

function setupHold(el, func) {
    let holdInterval 
    el.addEventListenet("touchstart", (event) => { event.preventDefault(); holdInterval = setInterval(func, 50); })
  
    el.addEventListener("touchend", (event) => clearInterval(holdInterval))
  
    el.addEventListener("touchcancel", (event) => clearInterval(holdInterval))
}

function generateHoldEvents() {
    
    for (let i = 0; i < 4; i++) {
        setupHold(document.getElementById(`${rankNameIds[i]}Button`),buyMP(i,0))
        setupHold(document.getElementById(`${rankNameIds[i+4]}Button`),buyMP(i,1))
        setupHold(document.getElementById(`${equipIds[i]}Button`),buyEquip(i))
    }
    setupHold(document.getElementById('acquireButton'),acquire())
}

window.setInterval(function(){mainLoop()}, 50);

function mobileCheck() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

//if(mobileCheck())
    //generateHoldEvents()

