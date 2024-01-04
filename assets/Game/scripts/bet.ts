import Cards from "./types";
import userData from "./userData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    moneyLabel: cc.Label = null;

    // @property
    // text: string = "hello";

    @property(cc.Node)
    pool: cc.Node = null;

    @property(cc.Node)
    bet: cc.Node = null;
    @property(cc.Node)
    setNode: cc.Node = null;

    allCards: any[] = null; //整幅牌
    hasBet: number[] = new Array(6).fill(0); //下注的统计数组
    betNum: number = 0; //下注总额

    onLoad() {
        // Cards.createCards(); //一副牌
        // this.allCards = Cards.allCards;
        //cc.log(this.allCards);

        let data = cc.sys.localStorage.getItem(userData.I.id);
        //cc.log(userData.I.id, data);

        if (data == null) {
            let id = Math.floor(Math.random() * 10) + 1;
            userData.I.id = id;
            userData.load();
        }
        //cc.log(userData.avatar, userData.name, userData.money);
        // cc.log(this.allCards);
    }
    onClick(e, custom) {
        if (custom == "bet") {
            //cc.log(this.pool);
            if (!this.betNum) {
                return;
            }
            window["pool"] = cc.instantiate(this.pool);
            window["betNum"] = this.betNum;
            cc.log("关卡", window["guan"]);
            if (window["guan"] == 1) {
                cc.director.loadScene("game", () => {
                    // cc.log(pool);
                    cc.find("Canvas").getComponent("game").init();
                });
            } else if (window["guan"] == 2) {
                cc.director.loadScene("game2", () => {
                    // cc.log(pool);
                    cc.find("Canvas").getChildByName("game2").getComponent("game2").init();
                });
            }
        }
        if (custom == "clear") {
            // this.pool.getChildByName("total").getChildByName("max").active = false;
            userData.money += this.betNum;
            this.betNum = 0;
            window["betNum"] = this.betNum;

            this.moneyLabel.string = userData.money + "";

            this.hasBet.forEach((val, idx) => {
                this.hasBet[idx] = 0;
            });

            cc.log(this.hasBet);
            for (let child of this.pool.children) {
                if (child.name.split("layer").length >= 2) {
                    //cc.log(child.name);
                    child.removeAllChildren();
                }
                if (child.name == "num") {
                    child.children.forEach((node, idx) => {
                        node.active = false;
                    });
                }
                if (child.name == "total") {
                    child.getChildByName("max").active = false;
                    child.getComponentInChildren(cc.Label).string = this.betNum + "";
                }
            }
        }
        if (custom == "set") {
            this.setNode.active = true;
        }
        if (custom == "close") {
            this.setNode.active = false;
        }
        if (custom == "back") {
            userData.money += this.betNum;
            this.betNum = 0;
            window["betNum"] = this.betNum;
            this.moneyLabel.string = userData.money + "";
            cc.director.loadScene("First");
        }
    }
    onbet(e, custom) {
        cc.log(custom);
        let s = userData.money - custom;
        if (s < 0) {
            return;
        }

        let a = +custom + this.betNum;
        let total = this.pool.getChildByName("total");
        //cc.log(custom, typeof a);
        if (a > 50) {
            total.getChildByName("max").active = true;
            this.scheduleOnce(() => {
                total.getChildByName("max").active = false;
            }, 1);
            return;
        }
        userData.money = s;
        this.moneyLabel.string = userData.money + "";

        //cc.log(e.target);
        this.bet.getChildByName("arrow").active = false;

        this.betNum += +custom;
        total.getChildByName("num").getComponent(cc.Label).string = this.betNum + "";

        this.hasBet[Math.floor(custom / 5)]++;
        if (this.hasBet[Math.floor(custom / 5)] <= 4) {
            //未超过限额
            let poolLayer = this.pool.getChildByName("layer" + custom);
            poolLayer.addChild(cc.instantiate(e.target));
        } else {
            let numNode = this.pool.getChildByName("num");
            numNode.getChildByName("num" + custom).active = true;
            numNode.getChildByName("num" + custom).getComponentInChildren(cc.Label).string = this.hasBet[Math.floor(custom / 5)] + "";
        }
        //cc.log(this.hasBet);
        //cc.log(this.betNum);
    }

    start() {
        this.moneyLabel.string = userData.money + "";
        //let card = this.getCard();
        //cc.log(card);
        // cc.log(this.allCards.length);
    }

    // update (dt) {}
}
