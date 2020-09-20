const EventEmitter = require('events');
const { cardsNames, actionsType } = require('./constans');
const { utilis } = require('./utilis');

// const floop = [];
// for (let i = 1; i < Cards.length; i = i + 4) {
// 	if (floop.length >= 5) break;
// 	floop.push(Cards[i]);
// }
// floop[0] = Cards[20];
// floop[1] = Cards[13];
// const handsCards = [Cards[10], Cards[22]];

// console.log('floop', floop);
// console.log('handsCards', handsCards);

// const res = utilis.getIsStraight(handsCards, floop);
// console.log('<======res=======>>>', res);

module.exports = class Poker {
	constructor() {
		this.allCards = cardsNames.map(card => ({
			isSeleted: false,
			...card,
		}));
		this.players = []; //{id: 1....},{id:2},{}
		this.flop = [];
		this.turnPlayer = { index: -1, playerId: -1 };
		this.setTimeoutId = null;
		this.moneyOnTable = 0;
		this.roundMoneyOnTable = 0;
		this.emitter = new EventEmitter();
	}

	startRound = () => {
		this.roundMoneyOnTable = 50;
		this.nextTurn();
	};

	action = payload => {
		//payload ={playerId,action,}
		if (payload.playerId !== this.turnPlayer.playerId) return;

		switch (payload.action) {
			case actionsType.CHEEK:
				this.cheak(payload);
				//cheak
				break;
			case actionsType.FOLD:
				this.fold(payload);
				//fold
				break;
			case actionsType.RASIE:
				this.raise(payload);
				//raise
				break;

			default:
				break;
		}
	};

	cheak = payload => {
		const player = this.players.find(player => player.id === payload.playerId);
		if (player) {
			player.money -= this.roundMoneyOnTable;
			this.nextTurn();
		}
	};

	fold = payload => {};

	raise = payload => {
		const player = this.player.find(player => player.id === payload.playerId);
		player.money -= payload.raise;
		this.roundMoneyOnTable += payload.raise;
		this.nextTurn();
	};

	nextTurn = () => {
		const { index, playerId } = this.turnPlayer;

		if (index < this.players.length) {
			clearTimeout(this.setTimeoutId);
			if (index + 1 >= this.players.length) {
				this.finshRound();
				return;
			}
			this.turnPlayer = {
				index: index + 1,
				playerId: this.players[index + 1].id,
			};

			this.emitter.emit('cahngePlayer', this.turnPlayer);
			//	console.log('the turn now for ======>', this.turnPlayer);

			this.setTimeoutId = setTimeout(() => {
				this.nextTurn();
			}, 1000 * 10);
		} else {
			this.finshRound();
		}
	};

	finshRound = () => {
		this.moneyOnTable += this.roundMoneyOnTable;
		this.roundMoneyOnTable = 50;
		console.log('***finshRound****');
	};

	addPlayer = playerId => {
		if (this.players.length < 4)
			this.players.push({
				id: playerId,
				score: 0,
				cards: [],
				maxCard: null,
				money: 1000,
			});
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

	start = () => {};

	setScore = () => {
		try {
			this.players.forEach(player => {
				if (utilis.getIsRoyalFlush(player.cards, this.flop)) {
					player.score = 10;
				} else if (utilis.getIsStraightFlush(player.cards, this.flop)) {
					player.score = 9;
				} else if (utilis.getIsFourOfAKind(player.cards, this.flop)) {
					player.score = 8;
				} else if (utilis.getIsFullHouse(player.cards, this.flop)) {
					player.score = 7;
				} else if (utilis.getIsFlush(player.cards, this.flop)) {
					player.score = 6;
				} else if (utilis.getIsStraight(player.cards, this.flop)) {
					player.score = 5;
				} else if (utilis.getIsThreeOfAkind(player.cards, this.flop)) {
					player.score = 4;
				} else if (utilis.getIsTowPair(player.cards, this.flop)) {
					player.score = 3;
				} else if (utilis.getIsPair(player.cards, this.flop)) {
					player.score = 2;
				}

				player.maxCard =
					player.cards[0].number > player.cards[1].number ||
					player.cards[0].number == 1
						? player.cards[0]
						: player.cards[1];
			});
		} catch (error) {
			console.log(error);
		}
	};
};

function getRandomInt() {
	return Math.floor(Math.random() * Math.floor(51));
}

// const poker = new Poker();
// poker.emitter.on('cahngePlayer', playerTurn => {
// 	console.log('the turn now is for this player: --->', playerTurn);
// });

// poker.addPlayer(1);
// poker.addPlayer(2);
// poker.addPlayer(3);

// poker.newRound();
// poker.setScore();

// poker.startRound();
