let numOfSets = 8;
let numInSets = 2;

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

const iconPool = ["fa-snowflake","fa-paper-plane","fa-anchor","fa-bolt", "fa-ambulance",
                   "fa-cube","fa-leaf","fa-bicycle","fa-bomb", "fa-fire-extinguisher",
                   "fa-moon", "fa-poo", "fa-quidditch", "fa-skull", "fa-train"];

const icons = [];

function getIcons(numOfSets, numInSets) {
  for(let i=0; i< numOfSets; i++){
    for(let j=0; j< numInSets; j++){
      icons.push(iconPool[i]);
    }
  }
}

const openCards = [];
let moves = 0;
let running = true;

function cardClick(e) {
  if(e.target.tagName !== "UL" && running) {
    let card;
    if(e.target.tagName === "I") {card = e.target.parentElement;}
    else {card = e.target;}
    if(!card.classList.contains("open")) {
      flipCard(card);
      openCards.push(card);
    }
    if(openCards.length === numInSets) {
      updateMoves();
      if(cardsMatch(openCards)) {
        matched();
      }
      else {
        setTimeout(noMatch, 1000);
        running = false;
      }
    }
  }
}

function updateMoves() {
  moves++;
  let moveText = moves;
  moveText === 1 ? moveText += " Move" : moveText += " Moves";
  document.querySelector('.moves').textContent = moveText;
}

function flipCard(card) {
  card.classList.toggle('show');
  card.classList.toggle('open');
}

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
  console.log("matched");
  openCards.length = 0;
}

function noMatch() {
  for(let card of openCards) {
    flipCard(card);
  }
  openCards.length = 0;
  running = true;
}

function init() {
  shuffle(iconPool);
  getIcons(numOfSets, numInSets);
  shuffle(icons);
  const deckContainer = document.querySelector('#deck');
  const deck = document.createElement('ul');
  deck.classList.add('deck');
  deck.addEventListener("click", cardClick);
  for(let icon of icons) {
    const card = document.createElement('li');
    card.classList.add('card');
    card.innerHTML = `<i class="fas ${icon}"></i>`
    deck.appendChild(card);
  }
  deckContainer.appendChild(deck);
}

init();

const time = {
  ellapsed: 0,
        id: null,
     start: function(){this.id = setInterval( ()=>{this.ellapsed++;},1000) },
      stop: function(){clearInterval(this.id)},
   getTime: function(){
              let minutes = Math.floor(this.ellapsed / 60);
              let seconds = this.ellapsed % 60;
              if(minutes === 0) {return `${seconds} seconds`}
              if(minutes === 1) {return `${minutes} minute and ${seconds} seconds`}
              else {return `${minutes} minutes and ${seconds} seconds`}
            }
};


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
