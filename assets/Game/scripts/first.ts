import userdata from "./userData";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    money: cc.Label = null;

    @property
    text: string = "hello";

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onClick(e, custom) {
        cc.log(custom);
        if (custom == "1") {
            cc.director.loadScene("bet");
            window["guan"] = 1;
        }
        if (custom == "2") {
            cc.director.loadScene("bet");
            window["guan"] = 2;
        }
    }

    start() {
        let id = userdata.I.id;
        let data = cc.sys.localStorage.getItem(id);
        if (!data) {
            userdata.load();
        } else {
            userdata.money = JSON.parse(data).money;
            cc.log(JSON.parse(data));
        }
        this.money.string = userdata.money + "";
        cc.log(userdata.money);
    }

    // update (dt) {}
}
