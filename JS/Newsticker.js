var newsArray;

function updateNewsArray() {
newsArray = [//always true
    ["Newsticker Moment","true"], ["I don't know what I've been told, but the 5 hour joke is getting old!","true"], ["Incremental Game without Newsticker Challenge - [Failed]","true"],
    ["Lol among US","true"],["can this be a newticker?","true"],["US army vs the void - coming soonTM","true"],["never gonna give you a rickroll","true"],
    ["I am your friendly news ticker, I tick when there is news. I'm like a Geiger counter, but for news!","true"],["This is a certified Void Moment","true"],
    ["VoidCloud sends his regards","true"],["127.0.0.1","true"],["gamening","true"],["Communism Doesn't Work","true"],["Your mom says hi","true"],
    ["χάος","true"],["Fact Check - False","true"],["If you have the newsticker hidden you can't see this","true"],[`${data.armyName} has won ${data.wins} battles GG!`,"true"],
    [`The ${data.currentEnemy.name} is far superior to you`,'true'],[`You may be good at this so far but can you beat ${difficultyNames[difficultyNames.length - 1]} difficulty?`,'true'],
    [':texas:','true'],[`Today is ${formatDate(Date.now())}`,'true'],
    //Hard to find
    ["This message is extremely rare","getRandom(0,10000)===1000"]

];}

var s = DOMCacheGetOrSet('news');
document.addEventListener("visibilitychange", function() {if (!document.hidden) {scrollNextMessage();}}, false);
var scrollTimeouts = [];
var nextMsgIndex;
function scrollNextMessage() {
  //don't run if hidden to save performance
  if(DOMCacheGetOrSet('newsHolder').style.display === 'none') return
  updateNewsArray();
  //select a message at random

  try {
    do {nextMsgIndex = Math.floor(Math.random() * newsArray.length)} while (!eval(newsArray[nextMsgIndex][1]))
  } catch(e) {
      console.log("Newsarray doesn't work at idx " + nextMsgIndex)
  }

  scrollTimeouts.forEach(function(v) {clearTimeout(v);});
  scrollTimeouts = [];

  //set the text
  s.textContent = newsArray[nextMsgIndex][0];

  //get the parent width so we can start the message beyond it
  let parentWidth = s.parentElement.clientWidth;

  //set the transition to blank so the move happens immediately
  s.style.transition = '';
  //move div_text to the right, beyond the edge of the div_container
  s.style.transform = 'translateX('+parentWidth+'px)';

  //we need to use a setTimeout here to allow the browser time to move the div_text before we start the scrolling
  scrollTimeouts.push(setTimeout( function() {
    //distance to travel is s.parentElement.clientWidth + s.clientWidth + parent padding
    //we want to travel at rate pixels per second so we need to travel for (distance / rate) seconds
    let dist = s.parentElement.clientWidth + s.clientWidth + 20; //20 is div_container padding
    let rate = 100; //change this value to change the scroll speed
    let transformDuration = dist / rate;
    /*
    if (!player.options.newsHidden && !player.newsArray.includes(newsArray[nextMsgIndex][2])) {
        player.newsArray.push(newsArray[nextMsgIndex][2]);
        if (player.newsArray.length>=50) giveAchievement("Fake News")
    }
    */

    //set the transition duration
    s.style.transition = 'transform '+transformDuration+'s linear';
    let textWidth = s.clientWidth;
    //we need to move it to -(width+parent padding) before it won't be visible
    s.style.transform = 'translateX(-'+(textWidth+5)+'px)';
    //automatically start the next message scrolling after this one finishes
    //you could add more time to this timeout if you wanted to have some time between messages
    scrollTimeouts.push(setTimeout(scrollNextMessage, Math.ceil(transformDuration * 1000)));
  }, 100));
}