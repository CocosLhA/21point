const { ccclass, property } = cc._decorator;

@ccclass
export default class card extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = "hello";

    // LIFE-CYCLE CALLBACKS:

    onLoad() {}
    init(idx: number) {
        // if (idx == 101) {
        //     console.trace();
        // }
        cc.resources.load("card1/" + idx, cc.SpriteFrame, (err, sp) => {
            if (err) {
                cc.log(err);
                return;
            }
            this.node.getComponent(cc.Sprite).spriteFrame = sp;
        });
    }

    start() {}

    // update (dt) {}
}
