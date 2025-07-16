const cardGrid = document.getElementById('card-grid');
const moveCounter = document.getElementById('move-counter');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');
const winMessage = document.getElementById('win-message');

let cards = [];
let flippedCards = [];
let matchedCount = 0;
let moves = 0;
let timer;
let timeLeft = 120;
let countdown;
let seconds = 0;
let gameStarted = false;

// You can use image that you like.
const imageList = [
  'assets/images/img1.png',
  'assets/images/img2.png',
  'assets/images/img3.png',
  'assets/images/img4.png',
  'assets/images/img5.png',
  'assets/images/img6.png',
  'assets/images/img7.png',
  'assets/images/img8.png'
];

// function for duplicating and shuffling the image
function generateShuffledDeck() {
  const deck = [...imageList, ...imageList]; // creates pair
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function createCardElements(deck) {
  cardGrid.innerHTML = '';
  deck.forEach((imageSrc, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.image = imageSrc;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back" style="background-image: url('${imageSrc}')"></div>
      </div>
    `;

    card.addEventListener('click', () => handleCardClick(card));
    cardGrid.appendChild(card);
  });
}

function handleCardClick(card) {
  if (
    card.classList.contains('flipped') ||
    flippedCards.length === 2 ||
    card === flippedCards[0]
  ) return;

  if (!gameStarted) {
    startTimer();
    gameStarted = true;
  }

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    moveCounter.textContent = `Moves: ${moves}`;

    const [first, second] = flippedCards;
    if (first.dataset.image === second.dataset.image) {
      matchedCount++;
      flippedCards = [];

      if (matchedCount === imageList.length) {
        clearInterval(timer);
        setTimeout(() => {
          winMessage.classList.remove('hidden');
        }, 600);
      }
    } else {
      setTimeout(() => {
        first.classList.remove('flipped');
        second.classList.remove('flipped');
        flippedCards = [];
      }, 800);
    }
  }
}

// time limit for 2 mins, pop up message displays when time is up.
function startTimer() {
  countdown = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(countdown);
      alert("⏰ Time's up! Try again.");
      restartGame();
    } else {
      timeLeft--;
      const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
      const secs = String(timeLeft % 60).padStart(2, '0');
      timerDisplay.textContent = `Time: ${mins}:${secs}`;
    }
  }, 1000);
}


function restartGame() {
  clearInterval(countdown);
  seconds = 0;
  timeLeft = 120;
  timerDisplay.textContent = 'Time: 02:00';
  moves = 0;
  moveCounter.textContent = 'Moves: 0';
  matchedCount = 0;
  flippedCards = [];
  gameStarted = false;
  winMessage.classList.add('hidden');
  const newDeck = generateShuffledDeck();
  createCardElements(newDeck);
}

// Initial setup
restartBtn.addEventListener('click', restartGame);
window.onload = restartGame;
