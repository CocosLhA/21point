import Cards from "./types";
import card from "./card";
import userdata from "./userData";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    moneylabel: cc.Label = null;

    @property
    text: string = "hello";
    @property(cc.Node)
    bg: cc.Node = null;
    @property(cc.Node)
    handLayer: cc.Node = null;
    @property(cc.Node)
    cardPre: cc.Node = null;
    @property(cc.Node)
    self: cc.Node = null;
    @property(cc.Node)
    other: cc.Node = null;
    @property(cc.Node)
    hit: cc.Node = null;
    @property(cc.Node)
    point: cc.Node = null;

    allCards: any[] = null;
    cardArr: any[] = []; //发出的牌的对象数组    (要牌)  牌对象
    handArr: any[] = []; //牌的节点数组 映射位置 用于旋转  牌节点
    pos: number = null; //当前的牌的下标 handarr
    type: string = "first";

    //当前牌的点数
    card: any[] = [];
    isStand: number[] = [];

    // cardPre: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // cc.resources.load("card", cc.Prefab, (err, pre) => {
        //     if (err) {
        //         cc.log(err);
        //         return;
        //     }
        //     this.cardPre = cc.instantiate(pre);
        // });
    }
    fapai(target: cc.Node) {
        let pai = cc.instantiate(this.cardPre);
        pai.getComponent(card).init(100);
        this.hit.addChild(pai);

        let pos = target.getPosition();
        let world = target.parent.convertToWorldSpaceAR(pos); //世界坐标
        let poss = this.hit.convertToNodeSpaceAR(world);
        pai.position = cc.v3(0, 0, 0);

        cc.tween(pai)
            .to(0.5, { x: poss.x, y: poss.y })

            .call(() => {
                pai.destroy();
            })
            .start();
    }
    addPai(idx: number, target: cc.Node, pos: number) {
        //pos 当前牌的位置 idx 牌面大小
        this.scheduleOnce(() => {
            let pai = cc.instantiate(this.cardPre);
            pai.getComponent(card).init(idx);

            target.addChild(pai);
            pai.setPosition(0, 0);
            if (pos == 0) {
                //上面的横向排布
                pai.x = 50 * this.card[0].length;
            } else {
                //下面的竖向排布
                //                cc.log(this.card[pos]);
                pai.y = -50 * this.card[pos].length;
                this.showYao();
                // cc.log(pos, pai.y);
            }
        }, 0.5);
    }
    getRandom() {
        return Math.floor(Math.random() * 52) + 1;
    }

    getLastChild(node: cc.Node) {
        if (node.children.length == 0) {
            return null;
        }
        node.children.forEach((item, idx) => {
            if (idx == node.children.length - 1) {
                //cc.log(item, 8898979);
                return item;
            }
        });
    }

    onClick(e, custom) {
        if (custom == "hit") {
            if (this.type == "first") {
                this.fapai(this.other); //发牌动画
                let card = this.getCard();

                // cc.log(card, card["id"] + 1);

                this.card[0].push(card["point"]); //记录点数
                this.addPai(100, this.other, 0); //添加节点

                this.scheduleOnce(() => {
                    //cc.log(this.other.children);
                    this.fapai(this.other.children[this.other.children.length - 1]);

                    let card = this.getCard();
                    this.card[0].push(card["point"]); //记录点数
                    //cc.log(card);
                    this.addPai(card["id"] + 1, this.other, 0);
                }, 0.5);

                this.self.children.forEach((item, idx) => {
                    if (item.children.length) {
                        this.fapai(item.children[item.children.length - 1]);
                    } else {
                        this.fapai(item);
                    }

                    let card = this.getCard();
                    this.card[idx + 1].push(card["point"]);
                    this.addPai(card["id"] + 1, item, idx + 1);
                    //cc.log(card, card["id"] + 1);
                });
                this.type = "normal";
                this.yaopai(3);
                // this.scheduleOnce(() => {
                //     this.showYao(); //显示要牌动画
                // }, 0.5);
            } else {
                //发牌流程
                // for (let i = 1; i <= 3; i++) {
                //     if (this.isStand[i] == 1) {
                //         let node = this.self.getChildByName("card" + i);
                //         let target = node.children[node.children.length - 1];
                //         this.fapai(target);
                //         let card = this.getCard();
                //         this.card[i].push(card["point"]);
                //         this.addPai(card["id"] + 1, target, i);
                //     }
                // }
                cc.log(this.handArr, this.cardArr);
                if (this.handArr.length != 0) {
                    cc.log(this.handArr, this.cardArr);
                    return;
                }
                let count = 0;
                for (let i = 1; i <= 3; i++) {
                    //找出还要几张牌
                    cc.log(i, this.isStand[i]);
                    if (this.isStand[i] == 1) {
                        count++;
                        let node = this.self.getChildByName("card" + i);
                        node.getChildByName("stand").active = false;

                        node.getChildByName("yao").active = true;
                        node.getChildByName("yao").setSiblingIndex(node.children.length - 1);
                        node.getChildByName("yao").y = -100 * this.card[i].length;
                    }
                }
                cc.log(count);
                this.yaopai(count);
            }
        }

        if (custom == "next") {
            //cc.log(this.pos);

            // cc.log(this.pos);
            //handarr存牌的位置信息
            this.pos = this.pos > 0 ? this.pos - 1 : this.cardArr.length - 1; //此时选中哪张牌
            this.handArr.forEach((pai, idx) => {
                // cc.log(pai,idx)
                let nextIdx = (idx + 1) % this.handArr.length; //下一个位置
                let nextPos = this.handArr[nextIdx].getPosition();

                let s;
                //cc.log(idx, this.pos);
                if (this.pos == idx) {
                    //下一个位置是中间则大小变为1
                    s = 1;
                    pai.setSiblingIndex(this.handArr.length - 1);
                    //
                } else {
                    s = 0.8;
                    //pai.setSiblingIndex(0);
                }
                //cc.log(idx, this.pos, s);
                cc.tween(pai).to(0.5, { x: nextPos.x, y: nextPos.y, scale: s }).start();
            });
            // cc.log(this.cardArr[this.pos]);
        }

        if (custom == "finish") {
            cc.director.loadScene("First");
        }
        if (custom == "again") {
            cc.director.loadScene("bet");
        }
        if (custom == "rule") {
            this.bg.getChildByName("setNode").active = true;
        }
        if (custom == "closeRule") {
            this.bg.getChildByName("setNode").active = false;
        }
    }
    protected onDestroy(): void {
        userdata.loadlocal();
    }

    showYao() {
        //是否显示要牌动画
        for (let i = 1; i <= 3; i++) {
            let node = this.self.getChildByName("card" + i).getChildByName("yao");
            node.active = Boolean(this.isStand[i]);
            if (node.active) {
                node.setSiblingIndex(node.parent.children.length - 1);
                //cc.log(this.card[i]);
                node.y = -100 * this.card[i].length;
            }
        }
    }

    rangeNode(idx: number, node: cc.Node) {
        //idx 哪副牌
        //一副牌中添加新节点时排列顺序
        node.setSiblingIndex(node.parent.children.length - 1);
        //cc.log(this.card[i]);
        node.y = -50 * this.card[idx].length;
        node.x = 0;
    }

    init() {
        //cc.log(window["pool"]);
        let pool = window["pool"];
        this.bg.addChild(pool);
        pool.setPosition(0, 50);
        pool.setSiblingIndex(0);
    }
    fixCard() {
        // cc.log(this.handArr, this.cardArr);

        this.handArr.splice(this.pos, 1);
        this.cardArr.splice(this.pos, 1);
        //cc.log(this.handArr, this.cardArr);

        this.handArr.forEach((item, idx) => {
            if (idx != Math.floor(this.cardArr.length / 2)) {
                //找到中间那张牌
                item.scale = 0.8;

                // cc.log(this.pos, "位置");
            } else {
                item.setPosition(60, 0);
                item.scale = 1;
                item.setSiblingIndex(item.parent.children.length - 1);
                // cc.log(item.parent.children.length);
            }
            this.pos = Math.floor(this.cardArr.length / 2);
            // if (idx == this.cardArr.length - 1) {
            //     //最后一张牌放前面去
            //     item.setSiblingIndex(0);
            // }
        });
        //cc.log(this.pos);
    }
    yaopai(num: number) {
        //要牌区域
        //cc.log(this.cardArr);
        while (num--) {
            //cc.log(this.getCard);
            this.cardArr.push(this.getCard());
        }

        this.cardArr.forEach((item, idx) => {
            //cc.log(this.cardPre);
            //cc.log(item);
            let pai = cc.instantiate(this.cardPre);
            pai.getComponent(card).init(item.id + 1);
            this.handLayer.addChild(pai);

            this.handArr.push(pai); //与cardArray顺序一样的牌 子节点
            pai.x = 60 * idx;
            pai.y = 0;

            // cc.log(this.cardArr.length);
            if (idx != Math.floor(this.cardArr.length / 2)) {
                //找到中间那张牌
                pai.scale = 0.8;
                this.pos = Math.floor(this.cardArr.length / 2);
            } else {
                pai.setSiblingIndex(pai.parent.children.length - 1);
            }

            if (idx == this.cardArr.length - 1) {
                //最后一张牌放前面去
                pai.setSiblingIndex(0);
            }
            // cc.log(pai.getSiblingIndex())
        });
    }
    addCard(idx, node: Node) {
        //
    }

    start() {
        Cards.createCards(); //一副牌
        this.allCards = Cards.allCards;

        this.moneylabel.string = userdata.money + "";

        this.allCards.forEach((item) => {
            if (item["point"] >= 10) {
                item["point"] = 10;
            }
        });
        //cc.log(this.allCards);

        this.card[0] = [];
        this.card[1] = [];
        this.card[2] = [];
        this.card[3] = [];

        this.isStand[1] = 1;
        this.isStand[2] = 1;
        this.isStand[3] = 1;
        //cc.log(this.cardPre);
        //cc.log(this.allCards);
        cc.log(this.isStand);
        //cc.log(this.allCards);
        //cc.log(this.cardArr);
    }
    onPai(e, custom) {
        //cc.log(custom);
        //cc.log(this.self.children);
        // cc.log(this.pos);
        this.scheduleOnce(() => {
            if (!this.handArr[this.pos]) {
                //cc.log("无");
                return;
            }

            e.target.active = false;
            let node = this.handArr[this.pos]; //当前选中的牌

            let pos = e.target.getPosition();
            let world = e.target.parent.convertToWorldSpaceAR(pos); //目标点的世界坐标
            let poss = node.parent.convertToNodeSpaceAR(world); //变成当前点的局部坐标
            cc.tween(node)
                .to(0.5, { x: poss.x, y: poss.y })

                .call(() => {
                    node.parent = this.self.getChildByName("card" + custom);

                    this.card[custom].push(this.cardArr[this.pos].point); //存入

                    this.rangeNode(custom, node);
                    // cc.log(node.position);
                    this.fixCard();
                    this.showPoint(custom);
                })
                .start();
        }, 0.5);
    }
    onStand(e, custom) {
        //停牌
        cc.log(custom);
        this.isStand[custom] = 0; //停牌
        e.target.active = false;

        this.isGameOver();
    }
    isGameOver() {
        let count = 0;
        for (let i = 1; i <= 3; i++) {
            if (this.isStand[i] == 0) {
                count++;
            }
        }
        if (count == 3) {
            cc.log(this.card[0]);
            let result = this.getResult(0);
            if (result < 15 || (result > 15 && Math.random() > 0.5)) {
                //继续要牌
                cc.log("继续要牌");
                this.fapai(this.other.children[this.other.children.length - 1]);
                let card = this.getCard();
                this.card[0].push(card["point"]); //记录点数
                //cc.log(card);
                this.addPai(card["id"] + 1, this.other, 0);
            }

            this.scheduleOnce(() => {
                cc.log("不再要牌");
                let node = this.other.children[0];
                //node.active = false;
                cc.tween(node)
                    .to(0.5, { scaleX: 0 })
                    .call(() => {
                        cc.log(this.card[0][0]);
                        let idx = this.card[0][0] * 4;
                        this.fixSp("card1/" + idx, node);
                    })
                    .to(0.5, { scaleX: 1 })
                    .call(() => {
                        let point = cc.instantiate(this.point);
                        point.parent = this.other.children[this.other.children.length - 1];
                        point.setPosition(0, 0);

                        let result = this.getResult(0);
                        point.getComponentInChildren(cc.Label).string = result + "";
                        let isBao = false;
                        if (result == 21) {
                            //到达21点
                            this.fixSp("10", point);
                        } else if (result > 21) {
                            point.getChildByName("fail").active = true;
                            isBao = true;
                        }
                        this.isWin(isBao);
                    })

                    .start();
            }, 0.5);
        }
    }
    isWin(isBao: boolean) {
        //判断几数几赢
        let count = 0;
        let other = this.getResult(0);
        for (let i = 1; i <= 3; i++) {
            if (other < this.getResult(i)) {
                count++;
            }
            if (this.getResult(i) > 21) {
                count--;
            }
        }
        if (isBao) {
            count = 3;
        }
        cc.log(count);
        this.scheduleOnce(() => {
            let resultNode = this.bg.getChildByName("result");
            resultNode.active = true;
            if (count) {
                resultNode.getChildByName("win").active = true;
                resultNode.getChildByName("win").getComponentInChildren(cc.Label).string = count + " of 3";
                cc.log("win", window["betNum"]);
                userdata.money += count * window["betNum"];
                this.moneylabel.string = userdata.money + "";
            } else {
                resultNode.getChildByName("lost").active = true;
                cc.log("lost");
            }
        }, 0.5);
    }

    showPoint(custom: number) {
        //哪幅牌的显示
        let node = this.self.getChildByName("card" + custom);
        // cc.log(node);
        let point = cc.instantiate(this.point);
        point.parent = node.children[node.children.length - 1];

        //node.addChild(point);
        point.setPosition(0, 0);

        let stand = node.getChildByName("stand");
        stand.active = true;
        //cc.log(stand);

        stand.setSiblingIndex(stand.parent.children.length - 1);
        stand.y = -stand.parent.children.length * 40;

        let result = this.getResult(custom);
        point.getComponentInChildren(cc.Label).string = result + "";
        if (result == 21) {
            //到达21点
            this.fixSp("10", point);
            point.getComponentInChildren(cc.Label).string = "";
            this.isStand[custom] = 0;
            node.getChildByName("stand").active = false;
            this.isGameOver();
        } else if (result > 21) {
            point.getChildByName("fail").active = true;
            this.isStand[custom] = 0;
            node.getChildByName("stand").active = false;
            //cc.log(node.getChildByName("stand"));
            this.isGameOver();
        }
    }
    fixSp(name: string, node: cc.Node) {
        cc.resources.load(name, cc.SpriteFrame, (err, res) => {
            if (err) {
                cc.log(err);
                return;
            }
            node.getComponent(cc.Sprite).spriteFrame = res;
        });
    }
    getResult(custom) {
        // cc.log(this.card[custom]);
        let count = 0;
        this.card[custom].forEach((element) => {
            count += element;
        });
        return count;
    }
    getCard(): object {
        let idx = Math.floor(Math.random() * this.allCards.length);
        let card = this.allCards.splice(idx, 1)[0];
        return card;
    }

    // update (dt) {}
}
