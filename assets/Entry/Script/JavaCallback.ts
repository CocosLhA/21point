import { OutConfig } from "./OutConfig";
import PhoneSdk from "./PhoneSdk";


export default class JavaCallback {
    private afBackFun:Function = null
    private adverBackFun:Function = null
    private static _Instance: JavaCallback = null;
    private constructor() {}

    public static getInstance() {
        if (!JavaCallback._Instance) {
            JavaCallback._Instance = new JavaCallback();
        }
        return JavaCallback._Instance;
    }

    public setAfBackFun(back){
        this.afBackFun = back
    }
    public setAdverBackFun(back){
        this.adverBackFun = back
    }
    
    //已经替换
    public onResultCallback(jsonStr: string) {
        let para = PhoneSdk.decryptData(jsonStr)
        PhoneSdk.log('Java2TS:JaveCallback jsonStr =' + jsonStr);
        PhoneSdk.log('Java2TS:JaveCallback para =' + para);
        let sarr = para.split(";")
        let index = parseInt(sarr[0])
        let datastr = sarr[1]
        switch(index){
            case 8:{//af归因
                OutConfig.ad_type = datastr
                if(this.afBackFun){
                    this.afBackFun(datastr)
                }
            }break;
            case 12:{//广告结束
                if(this.adverBackFun){
                    this.adverBackFun(datastr)
                }
            }break;
        }
    }


}
