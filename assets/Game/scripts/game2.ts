import card from "./card";
import Cards from "./types";
import userdata from "./userData";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    moneylabel: cc.Label = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property
    text: string = "hello";
    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    self: cc.Node = null;
    @property(cc.Node)
    other: cc.Node = null;
    @property(cc.Node)
    hit: cc.Node = null;
    @property(cc.Node)
    point: cc.Node = null;
    @property(cc.Node)
    cardPre: cc.Node = null;

    allCards: any[] = null;

    card: any[] = [];
    pos: number = 0; //当前发到哪里了

    tag: boolean = true; //是否可以发牌
    select: any[] = [];
    tt: boolean = true;

    time: number = 0;
    timetag: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    start() {
        Cards.createCards(); //一副牌
        this.allCards = Cards.allCards;
        this.card[0] = []; //other 点数
        this.card[1] = []; //self 点数
        this.card[2] = []; //other 牌对象

        this.moneylabel.string = userdata.money + "";

        this.allCards.forEach((item) => {
            if (item["point"] >= 10) {
                item["point"] = 10;
            }
        });
    }

    init() {
        //cc.log(window["pool"]);
        let pool = window["pool"];
        this.bg.addChild(pool);
        pool.setPosition(0, 50);
        pool.setSiblingIndex(0);
    }

    fapai(target: cc.Node) {
        let pai = cc.instantiate(this.cardPre);
        pai.getComponent(card).init(100);
        this.hit.addChild(pai);
        pai.setPosition(0, 0);

        let pos = target.getPosition();
        let world = target.parent.convertToWorldSpaceAR(pos); //世界坐标
        let poss = this.hit.convertToNodeSpaceAR(world);
        cc.tween(pai)
            .to(0.5, { x: poss.x, y: poss.y })

            .call(() => {
                pai.parent = target;
                pai.setPosition(0, 0);
                if (target == this.self) {
                    // cc.log(pai);
                    let c = this.getCard();
                    this.card[1].push(c["point"]);
                    pai["point"] = c["point"];
                    pai.getComponent(card).init(c["id"] + 1);
                } else {
                    //电脑 other
                    let c = this.getCard();
                    this.card[2].push(c); //存下牌的对象
                    this.card[0].push(c["point"]);
                }
                // cc.log(this.card);
            })
            .start();
    }

    getRandom() {
        return Math.floor(Math.random() * 52) + 1;
    }

    getCard(): object {
        let idx = Math.floor(Math.random() * this.allCards.length);
        let card = this.allCards.splice(idx, 1)[0];
        return card;
    }
    deal(target: cc.Node) {
        let array: any = [this.other, this.self];

        this.fapai(array[this.pos]); //发牌动画
        // let card = this.getCard();
        // this.card[this.pos].push(card["point"]); //记录点数}

        this.pos = (this.pos + 1) % 2;

        //cc.log(this.pos);
    }
    countDown() {
        this.time = 10;
        this.timetag = true;
        this.timeLabel.string = this.time + "";
        cc.log(this.self.children.length);
        this.self.children.forEach((item, idx) => {
            item.on(cc.Node.EventType.TOUCH_END, () => {
                this.onTouch(item);
            });
        });
    }
    onTouch(node: cc.Node) {
        if (this.getSelectNum() == 3 && !node["isSelect"]) {
            return;
        }
        if (node["isSelect"]) {
            node["isSelect"] = 0;
            let index = this.select.indexOf(node);
            if (index > -1) {
                this.select.splice(index, 1);
            }
        } else {
            node["isSelect"] = 1;
            this.select.push(node);
        }

        node.y = 30 * node["isSelect"];
        //cc.log(this.select);
    }
    getSelectNum() {
        let count = 0;
        this.self.children.forEach((item, idx) => {
            if (item["isSelect"]) {
                count++;
            }
        });
        return count;
    }

    onClick(e, custom) {
        if (custom == "hit") {
            if (!this.tag) {
                return;
            }
            this.schedule(this.deal, 0.5);
            this.tag = false;
        }
        if (custom == "finish") {
            cc.director.loadScene("First");
        }
        if (custom == "again") {
            cc.director.loadScene("bet");
        }
        if (custom == "rule") {
            this.bg.getChildByName("ruleNode").active = true;
        }
        if (custom == "closeRule") {
            this.bg.getChildByName("ruleNode").active = false;
        }
    }
    isWin() {
        cc.log(this.select);
        let result = 0;
        for (let node of this.select) {
            result += node["point"];
        }
        cc.log(result);

        this.scheduleOnce(() => {
            //显示自己的点数
            let layout = this.self.getComponent(cc.Layout);
            layout.enabled = false;
            let point = cc.instantiate(this.point);
            point.parent = this.self;
            point.setPosition(0, 0);
            point.getComponentInChildren(cc.Label).string = result + "";
            this.fixPoint(result, point);
        }, 0);

        cc.log(this.card[0]);
        let result2 = 0;
        this.card[0].forEach((element) => {
            result2 += element;
        });
        cc.log(result2);

        this.other.children.forEach((node, idx) => {
            //other 的三张牌
            cc.tween(node)
                .to(0.5, { scaleX: 0 })
                .call(() => {
                    node.getComponent(card).init(this.card[2][idx]["id"] + 1);
                    //this.fixSp("card1/" + idx, node);
                })
                .to(0.5, { scaleX: 1 })
                .call(() => {
                    //显示点数
                    let layout = this.other.getComponent(cc.Layout);
                    layout.enabled = false;
                    let point = cc.instantiate(this.point);
                    point.parent = this.other;
                    point.setPosition(0, 0);
                    point.getComponentInChildren(cc.Label).string = result2 + "";
                    this.fixPoint(result2, point);
                })
                .start();
        });
        this.scheduleOnce(() => {
            this.gameOver(result, result2);
        }, 1.5);
    }
    fixPoint(result: number, pointNode: cc.Node) {
        if (result == 21) {
            //到达21点
            pointNode.getComponentInChildren(cc.Label).string = "";

            cc.resources.load("10", cc.SpriteFrame, (err, res) => {
                if (err) {
                    cc.log(err);
                    return;
                }
                pointNode.getComponent(cc.Sprite).spriteFrame = res;
            });
        } else if (result > 21) {
            pointNode.getChildByName("fail").active = true;
        }
    }
    gameOver(self, other) {
        let result: boolean = false;
        let resultNode = this.bg.getChildByName("result");
        resultNode.active = true;
        if (self > 21) {
            result = false;
            cc.log("输");
        } else if (other > 21) {
            result = true;
            cc.log("赢");
        } else if (self < other) {
            result = false;
            cc.log("输");
        } else {
            result = true;
            cc.log("赢");
        }
        resultNode.getChildByName("win").active = result;
        resultNode.getChildByName("lost").active = !result;

        cc.log(window["betNum"]);
        if (result) {
            userdata.money += window["betNum"];
            this.moneylabel.string = userdata.money + "";
        }
    }

    update(dt) {
        if (this.card[0].length >= 3) {
            this.pos = 1;
        }
        if (this.card[1].length >= 5) {
            this.unschedule(this.deal);
            if (this.tt) {
                this.scheduleOnce(() => {
                    this.countDown();
                }, 0.5);

                this.tt = false;
            }
        }
        if (this.timetag) {
            this.time -= dt;
            this.timeLabel.string = this.time.toFixed(0);
            if (this.time <= 0) {
                this.timetag = false;
                if (this.select.length < 3) {
                    cc.log("输了");
                    this.bg.getChildByName("timeout").active = true;
                } else {
                    cc.log(this.self.children.length);

                    this.self.children.forEach((item) => {
                        if (!item["isSelect"]) {
                            cc.log(item);
                            item.destroy();
                        }
                    });
                    this.isWin(); //判断输赢
                }
            }
        }
    }
}
