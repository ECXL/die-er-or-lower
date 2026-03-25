import { CountUp } from './countUp.min.js';

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

    const rightCount = new CountUp('count-1', rightOpponent.count);
    if (!rightCount.error) rightCount.start();
    if (document.getElementById('count-0').textContent == '') {
        const leftCount = new CountUp('count-0', leftOpponent.count);
        if (!leftCount.error) leftCount.start();
    }

    
    // Wait for animation before resolving winner
    setTimeout(() => {
        if (selection.count > rival.count) {
            score += 100;
            document.getElementById("score").innerText = score.toString();
            setTile(0, selection, true);
            setOpponent(1);
        } else {
            document.getElementById("score").innerText = "Game Over: " + score.toString();
            gameOver = true;
        }
    }, 3000);
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

    setTile(side, opponent, false);
}

function setTile(side, opponent, includeCount) {
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

    const countEl = document.getElementById('count-' + side);
    if (includeCount) {
        if (countEl) countEl.textContent = opponent.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        if (countEl) countEl.textContent = '';
    }
}