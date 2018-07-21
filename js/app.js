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

const time = {
      host: document.querySelector(".time .score-value"), //display element
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

const icons = [];

function getIcons(numOfSets, numInSets) {
  icons.length = 0;
  for(let i=0; i< numOfSets; i++){
    for(let j=0; j< numInSets; j++){
      icons.push(iconPool[i]);
    }
  }
}

const openCards = [];
let moves = 0;
let matches = 0;
let running = true;

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
        setTimeout(noMatch, 1000);
        running = false;
      }
    }
  }
}

function updateStars() {
  const stars = document.querySelector(".stars").children;
  if(moves === 4){stars[2].firstChild.classList.remove("shine")}
  else if(moves === 6){stars[1].firstChild.classList.remove("shine")}
  else if(moves === 8){stars[0].firstChild.classList.remove("shine")}
}

function updateMoves() {
  if(moves === 0){time.start()}
  moves++;
  document.querySelector('.moves .score-value').textContent = moves;
  updateStars();
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
  matches++;
  document.querySelector(".matches .score-value").textContent = matches;
  if(matches === numOfSets) {time.stop()}
  for(let card of openCards) {
    card.classList.add("match");
    card.firstChild.classList.add("match");
  }
  openCards.length = 0;
}

function noMatch() {
  for(let card of openCards) {
    flipCard(card);
  }
  openCards.length = 0;
  running = true;
}

const deckContainer = document.querySelector('#deck');

function restart() {
  let stars = document.querySelectorAll(".fa-star");
  for(let star of stars) {
    star.classList.add("shine");
  }
  moves = 0;
  document.querySelector('.moves .score-value').textContent = moves;
  matches = 0;
  document.querySelector(".matches .score-value").textContent = matches
  time.reset();
  deckContainer.removeChild(deckContainer.firstElementChild);
  init();
}

function init() {
  shuffle(iconPool);
  getIcons(numOfSets, numInSets);
  shuffle(icons);
  deck = document.createElement('ul');
  deck.classList.add('deck');
  for(let icon of icons) {
    const card = document.createElement('li');
    card.classList.add('card');
    card.addEventListener("click", cardClick);
    card.innerHTML = `<i class="fas ${icon}"></i>`
    deck.appendChild(card);
  }
  deckContainer.appendChild(deck);
}

function openModal() {
  console.log(document.querySelector('.modal'));
  document.querySelector('.modal').style.display = 'block';
}

document.querySelector('.restart-btn').addEventListener("click", restart);
document.querySelector('.settings-btn').addEventListener("click", openModal);
init();




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
