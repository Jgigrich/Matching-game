let numOfSets = 8;  // number of card sets in the game
let numInSets = 2;  // number of cards in each set

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/******  timer object *******/
const time = {
      host: document.querySelector(".time .score-value"), // display container
  ellapsed: 0,
        id: null,
     start: function(){this.id = setInterval(()=>{this.update()},1000)},
      stop: function(){clearInterval(this.id)},
    update: function() {
              this.ellapsed++;
              this.display();
            },
   display: function(){
              let minutes = Math.floor(this.ellapsed / 60);
              let seconds = this.ellapsed % 60;
              let txt = `${minutes} min, ${seconds} sec`;
              this.host.textContent = txt;
            },
     reset: function() {
              this.stop();
              this.ellapsed = 0;
              this.display();
            }
};

const iconPool = ["fa-snowflake","fa-paper-plane","fa-anchor","fa-bolt", "fa-ambulance",
                   "fa-cube","fa-leaf","fa-bicycle","fa-bomb", "fa-fire-extinguisher",
                   "fa-moon", "fa-poo", "fa-quidditch", "fa-skull", "fa-train"];

const icons = [];  // holds the icons used in the current game

function getIcons(numOfSets, numInSets) {
  icons.length = 0;  // empty the icons array (for restart)
  for(let i=0; i< numOfSets; i++){
    for(let j=0; j< numInSets; j++){
      icons.push(iconPool[i]);
    }
  }
}

const openCards = [];
let moves = 0;
let matches = 0;
let running = true;  // running allows the player to select cards

function cardClick() {
  if(running){
    if(!this.classList.contains("open")) {
      flipCard(this);
      openCards.push(this);
    }
    if(openCards.length === numInSets) {
      updateMoves();
      if(cardsMatch(openCards)) {
        matched();
      }
      else {
        setTimeout(noMatch, 800);
        running = false;  // no selecting cards until the current set flips back over
      }
    }
  }
}

function flipCard(card) {
  card.classList.toggle("open");
}

function updateMoves() {
  if(moves === 0){time.start()}
  moves++;
  document.querySelector(".moves .score-value").textContent = moves;
  updateStars();
}

/* star ranking decreases as the player makes more moves */
function updateStars() {
  const stars = document.querySelector(".stars").children;
  if(moves === 13){stars[2].firstChild.classList.remove("shine")}
  else if(moves === 16){stars[1].firstChild.classList.remove("shine")}
  else if(moves === 19){stars[0].firstChild.classList.remove("shine")}
}

/* check if all the cards in an array are all the same */
function cardsMatch(arr) {
  let toMatch = arr[0].firstChild.classList.value
  for(let i=1; i<arr.length; i++) {
    if(arr[i].firstChild.classList.value !== toMatch) {
      return false
    }
  }
  return true;
}

function matched() {
  matches++;
  document.querySelector(".matches .score-value").textContent = matches;
  for(let card of openCards) {
    card.classList.add("match");  // add class of "match" to the li
    card.firstChild.classList.add("match"); // add class to icon too
  }
  openCards.length = 0;   // empty the array
  if(matches === numOfSets) {
    time.stop()
    setTimeout(openWinner, 800); // wait for the match animation to finish
  }
}

function noMatch() {
  for(let card of openCards) {
    flipCard(card);       // close the unmatched cards
  }
  openCards.length = 0;   // empty the array
  running = true;         // restart the abilty to select cards
}

const deckContainer = document.querySelector("#deck");

function restart() {
  let stars = document.querySelectorAll(".fa-star");
  for(let star of stars) {
    star.classList.add("shine");  // lightup the stars
  }
  moves = 0;
  document.querySelector(".moves .score-value").textContent = moves;
  matches = 0;
  document.querySelector(".matches .score-value").textContent = matches
  time.reset();
  deckContainer.removeChild(deckContainer.firstElementChild);  // get rid of the deck
  init();
}

function init() {
  shuffle(iconPool);
  getIcons(numOfSets, numInSets);
  shuffle(icons);
  deck = document.createElement("ul");
  deck.classList.add("deck");
  for(let icon of icons) {
    const card = document.createElement("li");
    card.classList.add("card");
    card.addEventListener("click", cardClick);
    card.innerHTML = `<i class="fas ${icon}"></i>`
    deck.appendChild(card);
  }
  deckContainer.appendChild(deck);
}

const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");

function openModal() {
  modal.classList.remove("hide");
  modal.classList.add("show");
  modal.style.display = "block";
}

function openWinner() {
  const scorePanel = document.querySelector(".score-panel").cloneNode(true);
  scorePanel.classList.add("modal-score");
  modalContent.appendChild(scorePanel);
  document.querySelector(".modal .restart-btn").addEventListener("click", closeWinner);
  document.querySelector(".modal .settings-btn").addEventListener("click", closeWinner);
  document.querySelector(".winner-heading").classList.add("show");
  openModal();
}

function closeWinner(e) {
  modal.classList.replace("show", "hide");  // run the fade out animation
  setTimeout(()=>{
    document.querySelector(".winner-heading").classList.remove("show");
    modalContent.removeChild(modalContent.lastElementChild);
    modal.style.display = "none";
    if(e.target.classList.contains("restart-btn")){restart();}
    else {openSettings();}
  }, 650);
}

function openSettings() {
  document.querySelector(".settings").classList.add("show");
  openModal();
}

function closeSettings(e) {
  modal.classList.replace("show", "hide");  // run the fade out animation
  setTimeout(()=>{
    document.querySelector(".settings").classList.remove("show");
    modal.style.display = "none";
    if(e.target.classList.contains("settings-new-game")){
      const selected = document.querySelector("input[name='game']:checked").id;
      numOfSets = parseInt(selected[0], 10);  // get the number of sets form the selected id
      numInSets = parseInt(selected[2], 10);  // get the number of cards in a set form the selected id
      restart();
    }
  }, 650);
}

document.querySelector(".settings-cancel").addEventListener("click", closeSettings);
document.querySelector(".settings-new-game").addEventListener("click", closeSettings);
document.querySelector(".restart-btn").addEventListener("click", restart);
document.querySelector(".settings-btn").addEventListener("click", openSettings);
init();
