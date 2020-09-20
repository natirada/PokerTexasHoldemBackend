exports.utilis = {
	getIsRoyalFlush: (handCards, floop) => {
		const isFlush = this.utilis.getIsFlush(handCards, floop);
		if (!isFlush) return false;
		const allCards = handCards.concat(floop);

		const repetitiveSymbol = this.utilis.getMaxOccurSymbol(allCards);
		const allRepetitiveSymbol = allCards.filter(
			card => card.symbol === repetitiveSymbol
		);
		const cardFilter = allRepetitiveSymbol.filter(
			card => card.number > 9 || card.number === 1
		);
		const sortCards = cardFilter.sort((a, b) => a.number - b.number);

		if (sortCards.length < 5) return false;
		for (let i = 0; i < sortCards.length; i++) {
			if (i === 0 && sortCards[i].number !== 1) {
				return false;
			}
			if (i !== 0) {
				if (sortCards[i].number !== i + 9) {
					return false;
				}
			}
		}
		return true;
	},
	getIsStraightFlush: (handCards, floop) => {
		const isFlush = this.utilis.getIsFlush(handCards, floop);
		if (!isFlush) return false;
		const allCards = handCards.concat(floop);

		const repetitiveSymbol = this.utilis.getMaxOccurSymbol(allCards);
		const allRepetitiveSymbol = allCards.filter(
			card => card.symbol === repetitiveSymbol
		);
		const sortCards = allRepetitiveSymbol.sort((a, b) => a.number - b.number);
		if (sortCards.length < 5) return false;
		for (let i = 0; i < sortCards.length - 1; i++) {
			if (sortCards[i].number + 1 !== sortCards[i + 1].number) return false;
		}
		return true;
	},
	getIsFourOfAKind: (handCards, floop) => {
		const allCards = handCards.concat(floop);
		const reduceAllCards = allCards.reduce((acc, { number }) => {
			acc[number] = acc[number] ? acc[number] + 1 : 1;
			return acc;
		}, {});
		const indexOccursCounter = Object.values(reduceAllCards).findIndex(
			el => el == 4
		);
		if (indexOccursCounter === -1) return false;

		return true;
	},
	getIsFullHouse: (handCards, floop) => {
		const allCards = handCards.concat(floop);
		const reduceAllCards = allCards.reduce((acc, { number }) => {
			acc[number] = acc[number] ? acc[number] + 1 : 1;
			return acc;
		}, {});
		const indexOccursThree = Object.values(reduceAllCards).findIndex(
			el => el == 3
		);
		const indexOccursPair = Object.values(reduceAllCards).findIndex(
			el => el == 2
		);
		if (indexOccursThree !== -1 && indexOccursPair !== -1) return true;

		return false;
	},
	getIsFlush: (handCards, floop) => {
		const allCards = handCards.concat(floop);
		const groupBySymbol = allCards.reduce((acc, { symbol }) => {
			acc[symbol] = acc[symbol] ? ++acc[symbol] : 1;
			return acc;
		}, {});

		const repetitiveSymbolIndex = Object.values(groupBySymbol).findIndex(
			counterSymbol => counterSymbol >= 5
		);

		if (repetitiveSymbolIndex === -1) return false;

		return true;
	},
	getIsStraight: (handCards, floop) => {
		const allCards = handCards.concat(floop);
		const sortCards = allCards.sort((a, b) => a.number - b.number);
		for (let i = 0; i < 2; i++) {
			let counter = 0;
			for (let j = i; j < sortCards.length - 1; j++) {
				if (counter === 4) return true;
				if (sortCards[j].number + 1 === sortCards[j + 1].number) {
					counter++;
				} else if (sortCards[j].number === sortCards[j + 1].number) {
					//counter++;
				} else {
					counter = 0;
					break;
				}
			}
			if (counter === 4) return true;
		}
		return false;
	},
	getIsThreeOfAkind: (handCards, floop) => {
		const allCards = handCards.concat(floop);
		const reduceAllCards = allCards.reduce((acc, { number }) => {
			acc[number] = acc[number] ? acc[number] + 1 : 1;
			return acc;
		}, {});

		const indexOccursThree = Object.values(reduceAllCards).findIndex(
			el => el == 3
		);
		if (indexOccursThree === -1) return false;
		return true;
	},
	getIsTowPair: (handCards, floop) => {
		const allCards = handCards.concat(floop);
		const reduceAllCards = allCards.reduce((acc, { number }) => {
			acc[number] = acc[number] ? acc[number] + 1 : 1;
			return acc;
		}, {});

		let counterPair = 0;
		for (let key in reduceAllCards) {
			if (reduceAllCards[key] === 2) counterPair++;
		}
		if (counterPair === 2) return true;
		return false;
	},
	getIsPair: (handCards, floop) => {
		const allCards = handCards.concat(floop);
		const reduceAllCards = allCards.reduce((acc, { number }) => {
			acc[number] = acc[number] ? acc[number] + 1 : 1;
			return acc;
		}, {});

		const indexOccursThree = Object.values(reduceAllCards).findIndex(
			el => el == 2
		);
		if (indexOccursThree === -1) return false;
		return true;
	},
	getIsHighCard: (handCards, floop) => {
		return 'High_Card';
	},

	getMaxOccurSymbol: cards => {
		const reduceCards = cards.reduce((acc, { symbol }) => {
			acc[symbol] = acc[symbol] ? ++acc[symbol] : 1;
			return acc;
		}, {});
		let maxKey;
		let max = 0;
		for (let key in reduceCards) {
			if (reduceCards[key] > max) {
				max = reduceCards[key];
				maxKey = key;
			}
		}
		return maxKey;
	},
};

// const Poker = require('./poker');

// const poker = new Poker();
// poker.addPlayer(1);
// poker.addPlayer(2);
// poker.addPlayer(3);

// poker.newRound();
// poker.setScore();

// console.log('===================================================');
// console.log(poker.players);
