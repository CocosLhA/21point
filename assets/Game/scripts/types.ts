let A2_10JQK = "NAN,A,2,3,4,5,6,7,8,9,10,J,Q,K".split(",");
var Suit = cc.Enum({
    Spade: 1, // 黑桃
    Heart: 2, // 红桃
    Club: 3, // 梅花(黑)
    Diamond: 4, // 方块(红)
});

//cc.log(A2_10JQK);

class Card {
    point: number = 0; //点数
    suit: number = 0; //花色
    id: number = 0; //每张牌的id
    constructor(point, suit) {
        this.point = point;
        this.suit = suit;
        //this.id = (suit - 1) * 13 + (point - 1);
        this.id = 4 * (point - 1) + suit - 1;
    }
    get pointName() {
        return A2_10JQK[this.point];
    }
    get suitName() {
        return Suit[this.suit];
    }
}
export default class Cards {
    public static allCards = null || new Array(52);

    public static createCards() {
        //let allCards = new Array(52);

        for (var s = 1; s <= 4; s++) {
            for (var p = 1; p <= 13; p++) {
                // cc.log(p, s);
                let card = new Card(p, s);

                Cards.allCards[card.id] = card;
                // this.allCards[card.id] = card;
                // Cards.allCards[card.id] = card;
            }
        }
    }
}
