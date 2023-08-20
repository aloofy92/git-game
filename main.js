
//CARD SELECTORS
// Object that grabs all the querySeleectors so they can be reused multiple times
let cardSelectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    cardMoves: document.querySelector('.cardMoves'),
    reset: document.querySelector('#reset-button'),
    youWin: document.querySelector('.youWin')
}

//GAME INFO (KEEPS TRACK!)
// this gameInfo object keeps track of total flips, flipped cards and if the game has 
// starded yet, tracks total time. The loop updates the timer.
let gameInfo = {
    gameStarted: false,
    moves: 0,
    flippedCards: 0,
    totalTime: 0,
    totalFlips: 0,
    loop: null
}




//CREATE GAME FUNCTION
// This function creates the board for the cards to be on using data-dimension attribute
// The dimension is passed is even by using remainder.
// the variable helps set the syle board.
let creatematchGame = () => {
    let dimensions = cardSelectors.board.getAttribute('data-dimension')
    if (dimensions % 2 !== 0) {              // this checks to see if the data dimension is even or not
        console.log("The board must be an even number to work.")
    }
// chooseRandomItems gets random items from the array.

    let cardImages = ['🫠','🐩','👿','🤬','🐈‍⬛','😫','🤮','🐭','😡','👀','🐹','🤧','🐯','😴','🐦','🤢','🐢','😣','🐍','🥶',
                  '🐰','🐍','🤒','🕷️','🤤','😨','💀','🤩','🥳','🔥','🎅','🥹','🫡','🌈','😬','😖','🤕','🐶','🪨','🌞',
                  '🦔','💃','🎵','🎷','🎸','🪗','🥁','☮️','🤎','🦠','🎢','💣','👑','🎡','🪴','🤸‍♀️','🤾‍♀️','🤹‍♀️','🦸‍♀️','🫀'];

    let cardChoice = chooseRandomItems(cardImages, (dimensions * dimensions) / 2); // This chooses half the items from the dimension
    
    let items = shuffleCards([...cardChoice, ...cardChoice]); //the dimension is set to 4, then the grid will have 16 items (4x4), so we want to pick 8 random elements from the array. 
    // this is because two pairs are needed for each emoji, so we pass [...choices, ...choices] twice for shuffling the cards.
    
    let matchCards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
       </div>
    `
    // The parseFromString() method of the DOMParser interface 
    // parses a string containing either HTML or XML, returning an HTMLDocument or an XMLDocument.
    // Parsing means analyzing and converting a program into an internal format that a runtime environment can actually run,
    // for example the JavaScript engine inside browsers.
    const parser = new DOMParser().parseFromString(matchCards, 'text/html')

    cardSelectors.board.replaceWith(parser.querySelector('.board'))
}

//CHOOSERANDOMITEMS FUNCTION
// this copies the original array, loops thru items, grabs item from random and returns it.
// randomcardChoices its sent to the shuffle function.
let chooseRandomItems = (array, items) => {
    let cardArray = [...array]
    let randomcardChoices = []
    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * cardArray.length)

        randomcardChoices.push(cardArray[randomIndex])
        cardArray.splice(randomIndex, 1)
    }
    return randomcardChoices
}


//starts the game

let startmatchGame = (duration, display) => {
    let timer = duration, mins, secs;setInterval(function () {
        mins = parseInt(timer / 60, 10)
        secs = parseInt(timer % 60, 10);

        mins = mins < 10 ? "0" + mins : mins;
        secs = secs < 10 ? "0" + secs : secs;

        display.textContent = mins + ":" + secs;

        if (--timer < 0) {
            timer = 0;
            // timer = duration; // uncomment this line to reset timer automatically after reaching 0
        }
    }, 1000);

    if (secs=== 0 && mins === 0 ){

        alert("Game over");
        //reset();
        }
}

window.onclick = function () {
    let time = 300, // your time in seconds here
        display = document.querySelector('.timer');
    startmatchGame(time,display);
    count++;

    
}  




function stopTime() {
	clearInterval(timer);
}



//SHUFFLE FUNCTION
// This functions shuffles the cards using a for loop  and math.floor + math.random 
// will switch the positions of the items in the array on the board.
// this makes it so the board can have random items generated every round.
let shuffleCards = array => {
    let cardArray = [...array]
        for (let index = cardArray.length - 1; index > 0; index--) {
        let randomIndex = Math.floor(Math.random() * (index + 1))
        let normalCard = cardArray[index]
        cardArray[index] = cardArray[randomIndex]
        cardArray[randomIndex] = normalCard
    }
    return cardArray
}
// checks if 2 cards are flipped over.
// Gets unmatched cards, checks the image emoji if they match by add matched class
//cards flip back all cards after 1 second.
// If cards don't match they get flipped back
let flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    gameInfo.flippedCards = 0
}

// when theres a flip  flipped cards and totalFlips is incremented.
//If the game hasnt statrted it starts the game function. Makes it so 
// game also starts when a card is clicked.
// then checks if card is less than or equal to 2 to make sure more than 2 cards get flipped.

let flipCard = card => {
    gameInfo.flippedCards++
    gameInfo.totalFlips++

    if (!gameInfo.gameStarted) {
        startmatchGame() && moveCounter()
    }

    if (gameInfo.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (gameInfo.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }
      

        setTimeout(() => {
            flipBackCards()
          
        }, 1000)

    }
}

//EVENT LISTENERS!
// one event listener is for the cards the other is for the start button.
// add the event listener to the cards by attaching it to the doc via the classname.
// if card is clicked the event will happen (match game starts)
// if the start button is clicked the event will happen (match game starts)
let appendEventListeners = () => {
    document.addEventListener('click', event => {
        let eventTarget = event.target
        let eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startmatchGame()
        }
    })
}


creatematchGame()
appendEventListeners()


/*
let resetGame = async () => {
    gameInfo.innerHTML = "";
    loop = null;
    matches = 0;
  };
  
  resetGame();
/*
function reset() {
    clearInterval(check);
    check = null;
    document.getElementById("para").innerHTML = '0';
}
*/
///I Had this reset function working before now its not
function resetAll(){
    gameStarted = false;
    totalTime = 0;
    totalFlips = 0;

    mins = 0;
    secs = 0;
    display.textContent = mins + ":" + secs;
    moves = 0;
    cardMoves.innerHTML = moves;
    stopTime();
    creatematchGame();
    startmatchGame();
    flipBackCards();
    clearInterval(interval);
}

function moveCounter(){
    ++cardMoves;
    cardMoves.innerHTML = 0;
    
    }



