"use strict";
console.log("hello");
class Player {
    constructor(name, id = Date.now() * Math.random(), point = 0) {
        this.name = name;
        this.id = id;
        this.point = point;
    }
}
class PlayerManager {
    constructor() {
        var _a;
        this.players = [];
        let playersLocal = JSON.parse((_a = (localStorage.getItem("players"))) !== null && _a !== void 0 ? _a : "[]");
        let playersTemp = [];
        for (let i in playersLocal) {
            playersTemp.push(new Player(playersLocal[i].name, playersLocal[i].id, playersLocal[i].point));
        }
        this.players = playersTemp;
        this.render();
        this.TotalPoints();
        this.TotalPlayers();
    }
    createPlayer(newPlayer) {
        this.players.push(newPlayer);
        localStorage.setItem("players", JSON.stringify(this.players));
        this.render();
    }
    deletePlayer(id) {
        this.players = this.players.filter(player => player.id != id);
        localStorage.setItem("players", JSON.stringify(this.players));
        this.render();
        this.TotalPlayers();
    }
    increasePoint(id) {
        this.players = this.players.map((player) => {
            if (player.id === id) {
                player.point += 1;
            }
            return player;
        });
        localStorage.setItem("players", JSON.stringify(this.players));
        this.TotalPoints();
        this.render();
    }
    decreasePoint(id) {
        this.players = this.players.map((player) => {
            if (player.id === id) {
                if (player.point > 0) {
                    player.point -= 1;
                }
            }
            return player;
        });
        localStorage.setItem("players", JSON.stringify(this.players));
        this.TotalPoints();
        this.render();
    }
    TotalPoints() {
        const totalPointsElement = document.getElementById("points");
        let totalPoints = this.players.reduce((total, player) => {
            return total + player.point;
        }, 0);
        totalPointsElement.innerText = totalPoints.toString();
        return totalPoints;
    }
    TotalPlayers() {
        const totalPlayersElement = document.getElementById("players");
        totalPlayersElement.innerHTML = this.players.length.toString();
    }
    hasPlayers() {
        return this.players.length > 0;
    }
    getHighestScoringPlayers() {
        if (this.players.length == 0) {
            return [];
        }
        const highestScore = this.players.reduce((highest, player) => {
            return Math.max(highest, player.point);
        }, 0);
        if (highestScore == 0) {
            return [];
        }
        return this.players.filter(player => player.point == highestScore);
    }
    render() {
        let renderEl = document.getElementById("list-players");
        let playerString = ``;
        if (this.hasPlayers()) {
            const highestScoringPlayers = this.getHighestScoringPlayers();
            this.players.map((player, index) => {
                const isHighestScoring = highestScoringPlayers.length > 0 && highestScoringPlayers.some(highestPlayer => player.point == highestPlayer.point);
                const crownClass = isHighestScoring ? "fa-crown highest-score" : "fa-crown";
                playerString +=
                    `
                <div class="player">
                    <div>
                        <button class="delete-btn">
                            <span onclick="handleDeletePlayer(${player.id})">
                                <i class="fa-solid fa-x"></i>
                            </span>
                        </button>
                        <i class="fa-solid ${crownClass}"></i>
                        <span>${player.name}</span>
                    </div>
                    <div class="point">
                        <button>
                            <span onclick="handleDecreasePoint(${player.id})">
                                <i class="fa-solid fa-minus"></i>
                            </span>
                        </button>
                        ${player.point}
                        <button>
                            <span onclick="handleIncreasePoint(${player.id})">
                                <i class="fa-solid fa-plus"></i>
                            </span>
                        </button>
                    </div>
                </div>
                `;
            });
            renderEl.innerHTML = playerString;
        }
        else {
            renderEl.innerHTML = "<p>No players available</p>";
        }
    }
}
const players = new PlayerManager();
function addPlayer() {
    if (document.getElementById("player").value != "") {
        let playerValue = document.getElementById("player").value;
        let newPlayer = new Player(playerValue);
        players.createPlayer(newPlayer);
    }
    else {
        const snackbar = document.getElementById("snackbardelete");
        if (snackbar) {
            snackbar.classList.add("show");
            setTimeout(function () {
                snackbar.classList.remove("show");
            }, 2500);
        }
    }
}
function handleDeletePlayer(id) {
    players.deletePlayer(id);
}
function handleIncreasePoint(id) {
    players.increasePoint(id);
}
function handleDecreasePoint(id) {
    players.decreasePoint(id);
}
