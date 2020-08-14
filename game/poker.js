const Cards = require('./constans');
const { utilis } = require('./utilis');

const floop = Cards.filter(
	el => (el.number > 9 || el.number === 1) && el.symbol === 'S'
);
floop[0] = Cards[5];
const handsCards = [Cards[1], Cards[2]];

const res = utilis.getIsFlush(handsCards, floop);
console.log('floop', floop);
console.log('handsCards', handsCards);

console.log('<======res=======>>>', res);

class Poker {
	constructor() {
		this.allCards = Cards.map(card => ({ name: card, isSeleted: false }));
		this.players = [];
		this.flop = [];
	}

	addPlayer = playerId => {
		if (this.players.length < 4) this.players.push({ id: playerId, cards: [] });
	};
	newRound = () => {
		this.allCards.forEach(card => {
			card.isSeleted = false;
		});
		this.initialFlop();
		this.initialPlayerCards();
	};

	initialFlop = () => {
		while (this.flop.length <= 4) {
			const randonIndex = getRandomInt();
			const cardSelected = this.allCards[randonIndex];
			if (!cardSelected.isSeleted) {
				this.flop.push(cardSelected);
				cardSelected.isSeleted = true;
			}
		}
	};

	initialPlayerCards = () => {
		this.players.forEach(player => {
			while (player.cards.length < 2) {
				const randonIndex = getRandomInt();
				const cardSelected = this.allCards[randonIndex];
				if (!cardSelected.isSeleted) {
					player.cards.push(cardSelected);
					cardSelected.isSeleted = true;
				}
			}
		});
	};
}

function getRandomInt() {
	return Math.floor(Math.random() * Math.floor(51));
}

// const pokerObj = new Poker();
// pokerObj.addPlayer(1);
// pokerObj.addPlayer(2);

// pokerObj.newRound();

// console.log('flop', pokerObj.flop);
// console.log('card players', pokerObj.players[0]);
// console.log('card players', pokerObj.players[1]);
