const CardController = (function () {
    const state = {
        cards: []
    };

    const monsters = [
        "sock.svg",
        "sock.svg",
        "sock.svg",
        "sock.svg",
        "monster1.svg",
        "monster2.svg",
        "monster3.svg",
        "monster4.svg",
        "monster5.svg",
        "monster6.svg",
        "monster7.svg",
        "monster8.svg",
        "monster9.svg",
        "monster10.svg",
        "monster11.svg"
    ];

    const shuffle = (a) => {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    return {
        shuffleCards: function (cardsInScene) {
            state.cards = shuffle(monsters).slice(0, cardsInScene).map(a => ({ card: a, opened: false, sock: a === 'sock.svg' }));
            console.log(state.cards);
        },
        getCards: function () {
            return state.cards;
        },
        setCardOpened: function (idx) {
            state.cards[idx].opened = true;
        },
        getCard: function (idx) {
            return state.cards[idx];
        },
        isAllCardsOpened: function () {
            return state.cards.filter(a => a.opened === false).length === 0;
        },
        isOneClosedCardWithSock: function () {
            const closedCards = state.cards.filter(a => a.opened === false);
            // only one door
            if (closedCards.length === 1) {
                return closedCards[0].sock;
            }
            // check if all closed doors contains the sock
            let isOnlySocks = true;
            closedCards.forEach(a => {
                if (!a.sock) {
                    isOnlySocks = false;
                }
            });
            return isOnlySocks;
        }
    }
})();

const UIController = (function () {
    const UISelectors = {
        cards: document.querySelectorAll('div.card'),
        container: document.querySelector('.container'),
        endstate: document.querySelector('.game-end'),

        stateLoose: document.querySelector('.game-end-loose'),
        stateWin: document.querySelector('.game-end-win'),

        btnPlay: document.getElementById('play'),
    }

    const state = {
        gameOver: false
    };

    return {
        isGameOver: function () {
            return state.gameOver;
        },
        setStateForEnd: function (show, win = false) {
            if (!show) {
                // hide all
                UISelectors.endstate.style.display = 'none';
                UISelectors.stateWin.style.display = 'none';
                UISelectors.stateLoose.style.display = 'none';
                state.gameOver = false;
                return;
            }
            state.gameOver = true;
            UISelectors.endstate.style.display = 'inline';
            if (win) {
                UISelectors.stateWin.style.display = 'inline';
            } else {
                UISelectors.stateLoose.style.display = 'inline';
            }
        },
        getCardCount: function () {
            return UISelectors.cards.length;
        },
        getSelectors: function () {
            return UISelectors;
        },
        renderCards: function (cards) {
            UISelectors.cards.forEach((card, idx) => {
                const img = card.children[0].children[0];
                if (cards[idx].opened) {
                    img.setAttribute('src', `img/${cards[idx].card}`);
                } else {
                    img.setAttribute('src', `img/door.svg`);
                }
            });
        }
    }

})();

const App = (function (UIController) {
    const selectors = UIController.getSelectors();

    const addEventListeners = function () {


        selectors.btnPlay.addEventListener('click', (e) => {
            UIController.setStateForEnd(false);
            CardController.shuffleCards(UIController.getCardCount());
            UIController.renderCards(CardController.getCards());
        });

        selectors.container.addEventListener('click', (e) => {
            if (UIController.isGameOver()) {
                console.log('game is over');
                return;
            }

            let selectedCard = null;
            if (e.target.parentElement.classList.contains('card-content')) {
                selectedCard = e.target.parentElement.parentElement;
                let { id } = selectedCard.dataset;
                id = parseInt(id);
                if (!CardController.getCard(id).opened) {
                    CardController.setCardOpened(id);
                }
                UIController.renderCards(CardController.getCards());
                // Loose case
                if (CardController.getCard(id).sock) {
                    UIController.setStateForEnd(true, false);
                } else {
                    if (CardController.isAllCardsOpened()) {
                        UIController.setStateForEnd(true, true);
                    }
                    // check if only one card closed with sock
                    if (CardController.isOneClosedCardWithSock()) {
                        UIController.setStateForEnd(true, true);
                    }
                }
            }
        });
    }

    return {
        init: function () {
            CardController.shuffleCards(UIController.getCardCount());
            UIController.renderCards(CardController.getCards());
            addEventListeners();
        }
    }

})(UIController);


App.init(document.querySelector('#app'));