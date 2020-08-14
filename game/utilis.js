exports.utilis = {
	getIsRoyalFlush: (handCards, floop) => {
		const allCards = handCards.concat(floop);
		const groupBySymbol = allCards.reduce((acc, { symbol }) => {
			acc[symbol] = acc[symbol] ? ++acc[symbol] : 1;
			return acc;
		}, {});

		const repetitiveSymbolIndex = Object.values(groupBySymbol).findIndex(
			counterSymbol => counterSymbol > 5
		);
		if (repetitiveSymbolIndex === -1) return false;

		const repetitiveSymbol = Object.keys(groupBySymbol)[repetitiveSymbolIndex];
		const allRepetitiveSymbol = allCards.filter(
			card => card.symbol === repetitiveSymbol
		);
		const cardFilter = allRepetitiveSymbol.filter(
			card => card.number > 9 || card.number === 1
		);
		const sortCards = cardFilter.sort((a, b) => a.number - b.number);
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
	getIsStraightFlush: () => {
		return 'getIsStraightFlush';
	},
	getIsFourOfAKind: () => {
		return 'getIsFourOfAKind';
	},
	getIsFullHouse: () => {
		return 'getIsFullHouse';
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
	getIsThreeOfAkind: () => {
		return 'getIsThreeOfAkind';
	},
	getIsTowPair: () => {
		return 'getIsTowPair';
	},
	getIsPair: () => {
		return 'getIsPair';
	},
	getIsHighCard: () => {
		return 'High_Card';
	},
};
