const tileDisplay = document.querySelector('.tile-container');
const keyboard = document.querySelector('.key-container');
const messageDisplay = document.querySelector('.message-container');

//let wordle = 'SUPER';
let definitionOfTheWord =
  'A NUMERICAL SCALE USED TO COMPARE VARIABLES WITH ONE ANOTHER OR WITH SOME REFERENCE NUMBER (A VALUE ON A SCALE OF MEASUREMENT) DERIVED FROM A SERIES OF OBSERVED FACTS; CAN REVEAL RELATIVE CHANGES AS A FUNCTION OF TIME';

let wordle;

const getWordle = () => {
  fetch('http://localhost:8000/word')
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      wordle = json.toUpperCase();
    })
    .catch((err) => console.log(err));
};

//! Тут надо будет раскоментить
getWordle();

//! Тут сейчас попробую  сделать запрос на получения определения
const getDefinition = () => {
  setTimeout(() => {
    fetch(`http://localhost:8000/definition/?word=${wordle}`)
      .then((response) => response.json())
      .then((json) => {
        console.log(
          'json из getDefinition',
          json.noun.replaceAll('(nou)', '&&').toUpperCase()
        );
        definitionOfTheWord = json;
      })
      .catch((err) => console.log(err));
  }, 2000);
};

getDefinition();

console.log('definitionOfTheWord', definitionOfTheWord);

const keys = [
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'ENTER',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M',
  '<<',
];

const guessRows = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
];
let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

guessRows.forEach((guessRow, guessRowIndex) => {
  const rowElement = document.createElement('div');
  rowElement.setAttribute('id', 'guessRow-' + guessRowIndex);

  guessRow.forEach((guess, guessIndex) => {
    const tileElement = document.createElement('div');
    tileElement.setAttribute(
      'id',
      'guessRow-' + guessRowIndex + '-tile-' + guessIndex
    );
    tileElement.classList.add('tile');
    rowElement.append(tileElement);
  });

  tileDisplay.append(rowElement);
});

keys.forEach((key) => {
  const buttonElement = document.createElement('button');
  buttonElement.textContent = key;
  buttonElement.setAttribute('id', key);
  buttonElement.addEventListener('click', () => handleClick(key));
  keyboard.append(buttonElement);
});
const handleClick = (letter) => {
  if (!isGameOver) {
    console.log('clicked', letter);

    if (letter === '<<') {
      deleteLetter();
      console.log('guessRows', guessRows);
      return;
    }

    if (letter === 'ENTER') {
      checkRow();
      console.log('guessRows', guessRows);

      return;
    }
    addLetter(letter);

    console.log('guessRows', guessRows);
  }
};

const addLetter = (letter) => {
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(
      'guessRow-' + currentRow + '-tile-' + currentTile
    );

    tile.textContent = letter;
    guessRows[currentRow][currentTile] = letter;
    tile.setAttribute('data', letter);
    currentTile++;
  }
};

const deleteLetter = () => {
  if (currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(
      'guessRow-' + currentRow + '-tile-' + currentTile
    );

    tile.textContent = '';
    guessRows[currentRow][currentTile] = '';
    tile.setAttribute('data', '');
  }
};

const checkRow = () => {
  const guess = guessRows[currentRow].join('');
  console.log('guess', guess);

  //===================== НАЧАЛО УСЛОВИЯ
  if (currentTile > 4) {
    fetch(`http://localhost:8000/check/?word=${guess}`)
      .then((response) => response.json())
      .then((json) => {
        console.log('JSON из функции checkRow', json);
        if (json == 'Entry word not found') {
          showMessage('word not in list');
          return;
        }
      });
    //====================================

    //=====================================

    flipTitle();
    console.log('guess is ' + guess, 'worlde is ' + wordle);
    if (wordle === guess) {
      showMessage('Magnificent!');
      isGameOver = true;
      return;
    } else {
      if (currentRow >= 5) {
        isGameOver = true;
        showMessage('Game Over');
        return;
      }

      if (currentRow < 5) {
        console.log('current row', currentRow);
        currentRow++;
        currentTile = 0;
        return;
      }
    }
  }
  //============КОНЕЦ УСЛОВИЯ
};

const showMessage = (message) => {
  console.log('message', message);
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  messageElement.style.marginBottom = '50px';

  messageDisplay.append(messageElement);
  messageDisplay.style.marginTop = '25px';
  messageDisplay.style.marginBottom = '25px';

  setTimeout(() => {
    messageDisplay.removeChild(messageElement);
    messageDisplay.style.marginTop = '0px';
    messageDisplay.style.marginBottom = '0px';
  }, 2000);
};

const addColorToKey = (keyLetter, color) => {
  const key = document.getElementById(keyLetter);

  console.log('addColorToKey', key);

  key.classList.add(color);
};

const flipTitle = () => {
  const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes;
  let checkWordle = wordle;
  const guess = [];

  rowTiles.forEach((tile) => {
    guess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay' });
  });

  guess.forEach((guess, index) => {
    if (guess.letter === wordle[index]) {
      guess.color = 'green-overlay';
      checkWordle = checkWordle.replace(guess.letter, '');
    }
  });

  guess.forEach((guess) => {
    if (checkWordle.includes(guess.letter)) {
      guess.color = 'yellow-overlay';
      checkWordle = checkWordle.replace(guess.letter, '');
    }
  });

  rowTiles.forEach((tile, index) => {
    //const dataLetter = tile.getAttribute('data');

    setTimeout(() => {
      tile.classList.add('flip');
      tile.classList.add(guess[index].color);
      addColorToKey(guess[index].letter, guess[index].color);
    }, 500 * index);
  });
};

// ADD CLUES

function addMessageClue() {
  console.log(definitionOfTheWord);
}
addMessageClue();
