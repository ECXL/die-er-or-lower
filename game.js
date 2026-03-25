let score = 0;
let gameOver = false;
let deathDic = {};
var jsonData;
var leftOpponent;
var rightOpponent;

window.onload = function() {
    setGame();
}

function setGame() {
    // set up the grid for the board in html
    fetch('./deaths.json')
    .then(response => response.json())
    .then(data => {
        jsonData = data;

        console.log(jsonData)

        for (let i = 0; i < 2; i++) {
            document.getElementById(i.toString()).addEventListener('click', selectTile);
            setOpponent(i);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function selectTile() {
    if (gameOver) {
        return;
    }

    let selection;
    let rival;

    if (this.id == "0") {
        selection = leftOpponent;
        rival = rightOpponent;
    } else {
        selection = rightOpponent;
        rival = leftOpponent;
    }

    if (selection.count > rival.count) {
        score += 100;
        document.getElementById("score").innerText = score.toString();
        setTile(0, selection);
        setOpponent(1);
    } else {
        document.getElementById("score").innerText = "Game Over: " + score.toString();
        gameOver = true;
    }
}

function setOpponent(side) {
    let opponent;
    let repeat = true;

    while (repeat) {
        opponent = jsonData[Math.floor(Math.random() * jsonData.length)];
        if ((opponent !== leftOpponent) && (opponent !== rightOpponent)) {
            repeat = false;
        }
    }

    setTile(side, opponent);
}

function setTile(side, opponent) {
    if (side == 0) {
        leftOpponent = opponent;
    } else {
        rightOpponent = opponent;
    }

    const tile = document.getElementById(side.toString());
    tile.style.backgroundImage = `url(${opponent.path})`;

    // Remove any existing name label before adding a new one
    const existing = tile.querySelector('.opponent-name');
    if (existing) existing.remove();

    const nameLabel = document.createElement('div');
    nameLabel.classList.add('opponent-name');
    nameLabel.textContent = opponent.name;
    tile.appendChild(nameLabel);
}