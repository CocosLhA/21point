import HttpCheck from "./HttpCheck";
import JavaCallback from "./JavaCallback";
import { OutConfig } from "./OutConfig";
import PhoneSdk from "./PhoneSdk";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Entry extends cc.Component {
    private _isGetServerConfig: boolean = false;
    private static isLoadGame: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._initNative();
        PhoneSdk.setSdkKey();
        PhoneSdk.startConnectGooglePlay();

        this.scheduleOnce(() => {
            if (!this._isGetServerConfig) {
                this._isGetServerConfig = true;
                this.checkAfdata("");
            }
        }, 3);
        JavaCallback.getInstance().setAfBackFun((result) => {
            PhoneSdk.log("checkEntry -- setAfBackFun:" + result);
            if (!Entry.isLoadGame) {
                this.checkAfdata(result);
            }
        });
    }

    start() {
        this._isGetServerConfig = false;
    }

    private _initNative() {
        // 屏蔽多点触摸,注册
        cc.macro.ENABLE_MULTI_TOUCH = false;
        window[OutConfig.JavaCallbackKey] = JavaCallback.getInstance();
    }

    private checkAfdata(strgy) {
        PhoneSdk.log("checkEntry -- checkAfdata:" + strgy);
        if (Entry.checkTime()) {
            HttpCheck.Instance.sendGetGameService(strgy, (data) => {
                if (data != -1) {
                    this.checkEntry(data);
                }
            });
        } else {
            this.checkEntry(null);
        }
    }

    private checkEntry(theData) {
        PhoneSdk.log("checkEntry -- ");
        // let mcc = Platform.getNetworkOperatorMCC();
        // let isWhite = theData.w_list ? true : (404 == mcc || 405 == mcc || 406 == mcc);
        // isWhite = Config.CheckMCC ? isWhite : true;
        if (/*Entry.checkTime() &&*/ theData != null && (theData.fs != 0 || theData.w_list)) {
            Entry.isLoadGame = true;
            //TODO:测试
            // if (true) {
            PhoneSdk.log("checkEntry -- Update");
            // 真金
            PhoneSdk.sendAppFlyerLog("toGame");
            this.scheduleOnce(() => {
                cc.director.loadScene("Update");
            }, 0.1);
        } else {
            PhoneSdk.log("checkEntry -- toFirst");
            // 壳子
            PhoneSdk.sendAppFlyerLog("toFirst");
            this.scheduleOnce(() => {
                cc.director.loadScene("First");
            }, 0.1);
        }
    }

    // true 检测时间已经过去，flse 还在检测期内
    public static checkTime(): boolean {
        let n_time = Date.now();
        let c_time = new Date("2024-1-22 0:0:0:0").getTime(); // 预计检测时间
        if (n_time > c_time) {
            return true;
        }
        return false;
    }

    update(dt) {}
}
