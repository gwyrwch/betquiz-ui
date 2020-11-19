import Page from "./Page";
import html from '../views/table.html';
import BackButton from "./BackButton";
import DatabaseOperations from "./DatabaseOperations";

let MOVE_TYPE = {
    BLIND: {value: 0, name: 'blind'},
    FOLD: {value: 1, name: 'fold'},
    CALL: {value: 2, name: 'call'},
    RAISE: {value: 3, name: 'raise'},
    CHECK: {value: 4, name: 'check'},
    ANSWER: {value: 5, name: 'answer'}
};

export default class Table extends Page {
    constructor() {
        super();

        let self = this;
        let backButton = new BackButton(() => {
            socket.emit('leave table');
        });
        self.ownerId = firebase.auth().currentUser.uid;

        socket.on('player joined', (response) => {
            self.table = response.table;
            self.renderTable();
            console.log(response);
        });

        socket.on('update table', (response) => {
            self.table = response.table;
            self.renderTable();
            console.log(response);
        });

        socket.on('hand ended', (response) => {
            self.table = response.table;
            self.renderTable();

            let descs = document.getElementsByClassName('player-desc');
            for (let i = 0; i < self.table.gameState.playersCnt; i++) {
                if (response.winners.indexOf(i) !== -1) {
                    descs[i].children[0].className = 'player-photo-img';
                    descs[i].classList.remove('player-desc-empty-seat-folded');
                    descs[i].children[0].classList.add('winner-photo-img');
                }
            }

            console.log(response);
        });
    }

    renderTable() {
        let self = this;
        let players = self.table.players;

        let pos = 0;
        let myPos;

        let descs = document.getElementsByClassName('player-desc');
        // imagine all folded and noone is current player
        for (let playerDesc of descs) {
            if (!playerDesc.classList.contains('player-desc-empty-seat-folded')) {
                playerDesc.classList.add('player-desc-empty-seat-folded');
            }
            playerDesc.children[0].className = 'player-photo-img';
        }

        for (let player of players) {
            let playerId = player.id;
            let stack = player.stack;
            let currentPlayerPos = pos++;

            if (playerId === self.ownerId) {
                myPos = currentPlayerPos;
                descs[myPos].children[0].classList.add('user-photo-img');
            }

            DatabaseOperations.getUserPromiseById(playerId).then(
                (user) => {
                    let playerDesc = descs.item(currentPlayerPos);
                    playerDesc.getElementsByClassName('player-username-label').item(0).innerHTML = user.username;
                    playerDesc.getElementsByClassName('player-balance-label').item(0).innerHTML
                        = '$' + self.table.players[currentPlayerPos].stack;
                }
            );
        }

        for (let i = players.length; i < descs.length; i++) {
            let playerDesc = descs.item(i);
            playerDesc.getElementsByClassName('player-username-label').item(0).innerHTML = 'empty seat';
            playerDesc.getElementsByClassName('player-balance-label').item(0).innerHTML
                = '$' + 10000;
        }

        let buttons = document.getElementsByClassName('user-field-button');
        for (let i = 0; i < 3; i++) {
            buttons.item(i).disabled = true;
        }

        let category = document.getElementsByClassName('category-div').item(0);

        if (self.table.state.name === 'running') {
            DatabaseOperations.getCategory(self.table.currentQuestion.idCategory).then(
                (cat) => {
                    if (cat) {
                        category.innerHTML = cat.name;
                    } else {
                        console.log('unknown category');
                    }
                }
            );

            for (let i = 0; i < self.table.gameState.playersCnt; i++) {
                // выводим не фолданутых
                if (!self.table.gameState.hasFolded[i]) {
                    descs[i].classList.remove('player-desc-empty-seat-folded');
                }
                // выводим bets
                if (!self.table.gameState.betPhaseEnded && (self.table.gameState.hasPlayedThisStreet[i]
                    || self.table.gameState.bets[i] > 0)) {
                    descs[i].getElementsByClassName('player-bet').item(0).innerHTML =
                        self.table.gameState.bets[i];
                } else {
                    descs[i].getElementsByClassName('player-bet').item(0).innerHTML =
                        '';
                }
            }

            // выводим банк
            document.getElementsByClassName('table-bank-val').item(0).innerHTML = '$' + self.table.gameState.bank;

            // выводим нашего игрока
            descs[myPos].children[0].classList.add('user-photo-img');
            // выводим текущего игрока
            descs[self.table.gameState.currentPlayer].children[0].classList.add('current-player');

            // initing question
            let qParts = ['', '', ''];
            if (self.table.gameState.streetNum > 0) {
                qParts[0] = self.table.currentQuestion.part1;
            }
            if (self.table.gameState.streetNum > 1) {
                qParts[1] = self.table.currentQuestion.part2;
            }
            if (self.table.gameState.streetNum > 2) {
                qParts[2] = self.table.currentQuestion.part3;
            }
            for (let i = 0; i < 3; i++) {
                document.getElementsByClassName('question-part').item(i).innerHTML = qParts[i];
            }

            if (self.table.gameState.currentPlayer === myPos) {
                // мы сейчас ходим, нас ждут
                // включить кнопки и ждать нажатий

                let playerInp = document.getElementsByClassName('player-input').item(0);

                if (self.table.gameState.betPhaseEnded) {
                    playerInp.value = '';
                    playerInp.placeholder = `enter answer... (${self.table.currentQuestion.answer.length} symbols)`;
                    buttons.item(0).innerHTML = 'Answer';
                    buttons.item(0).disabled = false;
                    buttons.item(0).classList.add('answer-button');
                    buttons.item(0).onclick = function () {
                        console.log(playerInp.value);
                        let request = {
                            answer: playerInp.value,
                            tableId: self.table.id,
                            bet: 0,
                            moveType: MOVE_TYPE.ANSWER
                        };

                        socket.emit('move', request);
                    };
                } else {
                    playerInp.value = self.table.gameState.lastRaiseBet;
                    playerInp.placeholder = 'enter bet...';

                    playerInp.oninput = function () {
                        // let val = this.value;
                    };

                    for (let i = 0; i < 3; i++) {
                        buttons.item(i).disabled = false;
                        if (i === 0) {
                            // check fold if
                            if (self.table.gameState.lastRaiseBet === self.table.gameState.bets[myPos]) {
                                buttons.item(i).innerHTML = 'Check';
                            } else {
                                buttons.item(i).innerHTML = 'Fold';
                            }
                        }
                        if (i === 1) {
                            if (self.table.gameState.lastRaiseBet === self.table.gameState.bets[myPos]) {
                                buttons.item(i).disabled = true;
                            }
                        }
                        buttons.item(i).onclick = function () {
                            let btn = this;
                            let moveType = btn.innerHTML;
                            console.log(moveType);

                            let request = {
                                answer: null,
                                tableId: self.table.id
                            };

                            if (moveType === 'Check') {
                                request.moveType = MOVE_TYPE.CHECK;
                                request.bet = 0;
                            } else if (moveType === 'Fold') {
                                request.moveType = MOVE_TYPE.FOLD;
                                request.bet = 0;
                            } else if (moveType === 'Raise') {
                                let raiseVal = parseInt(playerInp.value);
                                if (raiseVal > self.table.players[myPos].stack + self.table.gameState.bets[myPos]) {
                                    alert('You cant raise more than you have');
                                    return;
                                }
                                if (raiseVal <= self.table.gameState.lastRaiseBet) {
                                    alert('Please bet more than previous raise');
                                    return;
                                }
                                request.moveType = MOVE_TYPE.RAISE;
                                request.bet = raiseVal;
                            } else if (moveType === 'Call') {
                                let callVal = parseInt(playerInp.value);
                                if (callVal !== self.table.gameState.lastRaiseBet) {
                                    alert('Please call with previous raise bet (default)');
                                    return;
                                }
                                request.moveType = MOVE_TYPE.CALL;
                                request.bet = callVal;
                            }

                            socket.emit('move', request);
                        };
                    }
                }
            }
        } else {
            category.innerHTML = '';
        }
    }


    static getHtml() {
        return html;
    }
}