import { OutConfig } from "./OutConfig";


export default class PhoneSdk {

    private static isShowLog:boolean=false;
    public static log(...data: any[]){
        if(PhoneSdk.isShowLog){
            console.log(JSON.stringify(data));
        }
    }
    public static warn(...data: any[]){
        if(PhoneSdk.isShowLog){
            console.warn(JSON.stringify(data));
        }
    }
    public static error(...data: any[]){
        if(PhoneSdk.isShowLog){
            console.error(JSON.stringify(data));
        }
    }
    
    public static gameVersion = "1.0.0"
    public static datakey="dsfgfgfgfg"
    public static sepKey=";"

    // 

    public static encryptData(para) {
        para = this.datakey + para +this.datakey
        var encStr = encodeURIComponent(para);
        encStr = btoa(encStr);
        PhoneSdk.log("encryptData para="+para)
        PhoneSdk.log("encryptData encStr="+encStr)
        return encStr;
    }
    public static decryptData(para) {
        var decStr = atob(para);
        decStr = decodeURIComponent(decStr);
        PhoneSdk.log("decryptData para="+para)
        PhoneSdk.log("decryptData encStr="+decStr)
        return decStr;
    }

    // rank char
    public static GetRandomKey(count: number): string {
        let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let len = letters.length;
        let value = "";
        for (let i = 0; i < count; i++) {
            value += letters.charAt(Math.floor(Math.random() * len));
        }
        return value;
    }
    public static GetRankChar(num: number): string {
        let strc = ""
        let count
        for(let i=0;i<num;++i){
            count = parseInt(PhoneSdk.randomFloat(3,6)+"") 
            strc += this.GetRandomKey(count)+this.sepKey;
        }
        return strc
    }
    public static randomFloat(n1,n2) {
        return n1 + Math.random() * (n2 - n1);
    }
    public static makeStr(...data: any[]){
        let pstr = ""
        for (let i=0;i<data.length;++i) {
            if(pstr !=""){
                pstr += PhoneSdk.sepKey;
            }
            pstr += data[i]
        }
        return pstr;
    }
    // 安卓使用的字符串
    public static makeConstChars(): string {
        let para = ""
        para += "SERIAL"+this.sepKey;//0
        para += "window."+this.sepKey;//1
        para += OutConfig.JavaCallbackKey+this.sepKey;//2
        para += ".onResultCallback"+this.sepKey;//3
        para += "MD5"+this.sepKey;//4
        para += "UTF-8"+this.sepKey;//5
        para += "%20"+this.sepKey;//6
        return para;
    }

    // 设置key和分隔符 --
    public static setSdkKey() {
        PhoneSdk.log("setSdkKey : ")
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            jsb.reflection.callStaticMethod(OutConfig.ANDROID_API, "toSetKeyToJS", "(Ljava/lang/String;Ljava/lang/String;)V",this.datakey,this.sepKey);
        }
        PhoneSdk.pushConstChars()
    }
    //设置 字符串 --
    public static pushConstChars() {
        let para = PhoneSdk.makeConstChars()
        let jiamichar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
        PhoneSdk.log("pushConstChars : "+para)
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            jsb.reflection.callStaticMethod(OutConfig.ANDROID_API, "toSetCharsToJS", "(Ljava/lang/String;Ljava/lang/String;)V",jiamichar,this.encryptData(para));
        }
        else if(cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative){
            //jsb.reflection.callStaticMethod("SdkUtils","toSetCharsToJS:jiamichar:",jiamichar,this.encryptData(para))
        }
    }
    //无返回接口 --
    public static callJavaVoidModth(para) {
        PhoneSdk.log("callJavaVoidModth : "+para)
        para = this.encryptData(para)
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            jsb.reflection.callStaticMethod(OutConfig.ANDROID_API, "toSetTSSelct", "(Ljava/lang/String;)V",para);
        }
        else if(cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative){
           // jsb.reflection.callStaticMethod("SdkUtils","toSetTSSelct:",para)
        }
    }
    //有返回接口 --
    public static callJavaReturnModth(para):string {
        PhoneSdk.log("callJavaReturnModth : "+para)
        para = this.encryptData(para)
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            return jsb.reflection.callStaticMethod(OutConfig.ANDROID_API, "toSetCallRtn", "(Ljava/lang/String;)Ljava/lang/String;",para);
        }
        else if(cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative){
            return ""
           // return jsb.reflection.callStaticMethod("SdkUtils","toSetCallRtn:",para)
        }
    }


    public static t_facebook=1
    public static t_fireBase=2
    public static t_appsFlyer=3
   

    public static funVoid(...data: any[]) {

        if(data[0] == "loginFb"){
            PhoneSdk.loginFb()
        }
        else if(data[0] == "logOutFb"){
            PhoneSdk.logOutFb()
        }
        else if(data[0] == "getFbUserInfo"){
            PhoneSdk.getFbUserInfo()
        }
        else if(data[0] == "shareFb"){
            PhoneSdk.shareFb(data[1])
        }
        else if(data[0] == "startConnectGooglePlay"){
            PhoneSdk.startConnectGooglePlay()
        }
        else if(data[0] == "logSignUp"){
            PhoneSdk.logSignUp(data[1])
        }
        else if(data[0] == "logLogin"){
            PhoneSdk.logLogin(data[1])
        }
        else if(data[0] == "logUnlockAchievement"){
            PhoneSdk.logUnlockAchievement(data[1])
        }
        else if(data[0] == "logPurchase"){
            PhoneSdk.logPurchase(data[1])
        }
        else if(data[0] == "logRefund"){
            PhoneSdk.logRefund(data[1])
        }
        else if(data[0] == "logEarnVirtualCurrency"){
            PhoneSdk.logEarnVirtualCurrency(data[1])
        }
        else if(data[0] == "logSpendVirtualCurrency"){
            PhoneSdk.logSpendVirtualCurrency(data[1])
        }
        else if(data[0] == "logEvent"){
            PhoneSdk.logEvent(data[1], data[2])
        }
        else if(data[0] == "fireBaseCreateDynamicLink"){
            PhoneSdk.fireBaseCreateDynamicLink(data[1], data[2],data[3], data[4])
        }
        else if(data[0] == "fireBaseGetDynamicLink"){
            PhoneSdk.fireBaseGetDynamicLink() 
        }
        else if(data[0] == "sendLoginEvent"){
            PhoneSdk.sendLoginEvent() 
        }
        else if(data[0] == "sendCompleteRegistrationEvent"){
            PhoneSdk.sendCompleteRegistrationEvent(data[1]) 
        }
        else if(data[0] == "sendPurchaseEvent"){
            PhoneSdk.sendPurchaseEvent(data[1], data[2]) 
        }
        else if(data[0] == "sendFirstPurchaseEvent"){
            PhoneSdk.sendFirstPurchaseEvent(data[1], data[2]) 
        }
        else if(data[0] == "sendEvent"){
            PhoneSdk.sendEvent(data[1], data[2]) 
        }
        else if(data[0] == "sendAppFlyerLog"){
            PhoneSdk.sendAppFlyerLog(data[1]) 
        }
        else if(data[0] == "vibrator"){
            PhoneSdk.vibrator()
        }
        else if(data[0] == "takePhoto"){
            PhoneSdk.takePhoto() 
        }
        else if(data[0] == "copyTextToClipboard"){
            PhoneSdk.pickImageFromAlbum() 
        }
        else if(data[0] == ""){
            PhoneSdk.copyTextToClipboard(data[1])
        }
        else if(data[0] == "setOrientation"){
            PhoneSdk.setOrientation(data[1])
        }
        else if(data[0] == "shareToPhoneText"){
            PhoneSdk.shareToPhoneText(data[1], data[2])
        }
        else if(data[0] == "shareTextToPackage"){
            PhoneSdk.shareTextToPackage(data[1], data[2]) 
        }
        else if(data[0] == "signInByGoogle"){
            PhoneSdk.signInByGoogle() 
        }
        else if(data[0] == "initRewardedAd"){
            PhoneSdk.initRewardedAd()
        }
        else if(data[0] == "playRewardedAd"){
            PhoneSdk.playRewardedAd()
        }
        else if(data[0] == "sendGoodPay"){
            PhoneSdk.sendGoodPay(data[1])
        }
        else if(data[0] == "sendGoodPayPurchase"){
            PhoneSdk.sendGoodPayPurchase()
        }

    }
    public static funReturn(...data: any[]):any {
        if(data[0] == "getOnlyID"){
            return PhoneSdk.getOnlyID()
        }
        else if(data[0] == "getDeviceID"){
            return PhoneSdk.getDeviceID()
        }
        else if(data[0] == "getPackageName"){
            return PhoneSdk.getPackageName()
        }
        else if(data[0] == "getVersionCode"){
            return PhoneSdk.getVersionCode()
        }
        else if(data[0] == "getNetworkOperatorMCC"){
            return PhoneSdk.getNetworkOperatorMCC()
        }
        else if(data[0] == "getTextFromClipboard"){
            return PhoneSdk.getTextFromClipboard()
        }
        else if(data[0] == "getAFID"){
            return PhoneSdk.getAFID()
        }
        else if(data[0] == "getGoogleAdID"){
            return PhoneSdk.getGoogleAdID()
        }
        else if(data[0] == "getLogInstanceID"){
            return PhoneSdk.getLogInstanceID()
        }
        else if(data[0] == "getAdType"){
            return PhoneSdk.getAdType()
        }
        else if(data[0] == "getHotUpdateUrl"){
            return PhoneSdk.getHotUpdateUrl()
        }
        else if(data[0] == "getSingleMinMoney"){
            return PhoneSdk.getSingleMinMoney()
        }
        else if(data[0] == "getisEncryption"){
            return PhoneSdk.getisEncryption()
        }
        else if(data[0] == "getencryptionKey"){
            return PhoneSdk.getencryptionKey()
        }
        else if(data[0] == "getencryptionMD5"){
            return PhoneSdk.getencryptionMD5()
        }
        return "";
    }



/////////////////////////////////////////////////////////////////////
    /****************************************Face Book*********************************************/
    public static loginFb() {
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(PhoneSdk.t_facebook,1,PhoneSdk.GetRankChar(3))
            PhoneSdk.callJavaVoidModth(para)
        }
    }
    public static logOutFb() {//
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(PhoneSdk.t_facebook,2,PhoneSdk.GetRankChar(3))
            PhoneSdk.callJavaVoidModth(para)
        }

    }
    public static getFbUserInfo() {
    }

    public static shareFb(jsonStr: string) {
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(PhoneSdk.t_facebook,3,jsonStr,PhoneSdk.GetRankChar(3))
            PhoneSdk.callJavaVoidModth(para)
        }
    }

    ////fireBase-------------------------------------------
    /********************************************Google InstallReferrer****************************/

    public static startConnectGooglePlay() { //--
        PhoneSdk.log("startConnectGooglePlay");
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(PhoneSdk.t_fireBase,1,PhoneSdk.GetRankChar(3))
            PhoneSdk.callJavaVoidModth(para)
        }
    }

    // 注册 method:注册方式
    public static logSignUp(method: string = 'Guest') {
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(PhoneSdk.t_fireBase,2,method,PhoneSdk.GetRankChar(3))
            PhoneSdk.callJavaVoidModth(para)
        }
    }
    // 登录
    public static logLogin(method: string = 'Guest') {
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(PhoneSdk.t_fireBase,3,method,PhoneSdk.GetRankChar(3))
            PhoneSdk.callJavaVoidModth(para)
        }
    }
    // 解锁成就
    public static logUnlockAchievement(achievement_id: string) {
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(PhoneSdk.t_fireBase,4,achievement_id,PhoneSdk.GetRankChar(3))
            PhoneSdk.callJavaVoidModth(para)
        }
    }

    // 充值事件
    public static logPurchase(num: number) {
        let transaction_id = new Date().getTime();
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(PhoneSdk.t_fireBase,5,transaction_id.toString(),(num+0.0),'INR','0','0','Gold','0')
            PhoneSdk.callJavaVoidModth(para)
        }
    }
    // 提现事件
    public static logRefund(num: number) {//
        let transaction_id = new Date().getTime();
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(PhoneSdk.t_fireBase,6,transaction_id.toString(),(num+0.0),'INR','0','0','Gold')
            PhoneSdk.callJavaVoidModth(para)
        }
    }
    // 获得虚拟货币
    public static logEarnVirtualCurrency(num: number) {
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(PhoneSdk.t_fireBase,7,'Gold',(num+0.0),'INR')
            PhoneSdk.callJavaVoidModth(para)
        }
    }
    // 消耗虚拟货币
    public static logSpendVirtualCurrency(num: number) {//
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(PhoneSdk.t_fireBase,8,'Gold','Gold',(num+0.0))
            PhoneSdk.callJavaVoidModth(para)
        }
    }
    // 自定义事件
    public static logEvent(eventName: string, eventData: string = '{param:1}') {
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(PhoneSdk.t_fireBase,9,eventName,eventData)
            PhoneSdk.callJavaVoidModth(para)
        }
    }
    // 创建动态链接 lym
    public static fireBaseCreateDynamicLink(link: string, domainUriPrefix: string,fallbackUrl: string, minimumVersion:number) {
    }
    // 获取动态链接数据 lym
    public static fireBaseGetDynamicLink() {
    }
    

    ////af-----------------------------------------------------------------


    public static sendLoginEvent() {
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(PhoneSdk.t_appsFlyer,2,PhoneSdk.GetRankChar(3))
            PhoneSdk.callJavaVoidModth(para)
        }
    }

    public static sendCompleteRegistrationEvent(method: string = 'Guest') {
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(PhoneSdk.t_appsFlyer,3,method,PhoneSdk.GetRankChar(3))
            PhoneSdk.callJavaVoidModth(para)
        }
    }

    public static sendPurchaseEvent(revenue: number, currency: string) {
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(PhoneSdk.t_appsFlyer,4,revenue,currency,PhoneSdk.GetRankChar(3))
            PhoneSdk.callJavaVoidModth(para)
        }
    }

    public static sendFirstPurchaseEvent(revenue: number, currency: string) {
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(PhoneSdk.t_appsFlyer,5,revenue,currency,PhoneSdk.GetRankChar(3))
            PhoneSdk.callJavaVoidModth(para)
        }
    }

    public static sendEvent(event: string, jsonString: string = '{param:1}') {
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(PhoneSdk.t_appsFlyer,6,event,jsonString,PhoneSdk.GetRankChar(3))
            PhoneSdk.callJavaVoidModth(para)
        }
    }

    public static sendAppFlyerLog(msg: string) {//--
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = this.makeStr(this.t_appsFlyer,7,msg,this.GetRankChar(3))
            this.callJavaVoidModth(para)
        }
    }

    public static vibrator() {
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            jsb.reflection.callStaticMethod("org/cocos2dx/lib/Cocos2dxHelper", "vibrate", "(F)V",1.0);
        }
    }

    public static copyTextToClipboard(text: string) {
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            jsb.reflection.callStaticMethod("org/cocos2dx/lib/Cocos2dxHelper", "copyTextToClipboard", "(Ljava/lang/String;)V",text);
        }
    }

    // 屏幕常亮
    public static setKeepScreenOn(value: boolean) {
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            jsb.reflection.callStaticMethod("org/cocos2dx/lib/Cocos2dxHelper", "setKeepScreenOn", "(Z)V",value);
        }
    }

    public static takePhoto() {

    }

    public static pickImageFromAlbum() {

    }


    public static setOrientation(Orientation: string) {
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {

        }
        else if(cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative){

        }
        let frameSize = cc.view.getFrameSize();
        if (Orientation == 'PORTRAIT') {
            cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
            if (frameSize.width > frameSize.height) {
                cc.view.setFrameSize(frameSize.height, frameSize.width);
            }
            cc.Canvas.instance.designResolution = cc.size(750, 1334);
        } else {
            cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
            if (frameSize.height > frameSize.width) {
                cc.view.setFrameSize(frameSize.height, frameSize.width);
                cc.Canvas.instance.designResolution = cc.size(1334, 750);
            }
        }

        if (CC_JSB) {
            window.dispatchEvent(new Event('resize'));
        }
    }
    public static shareToPhoneText(text: string, title: string) {
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(10,text,title,PhoneSdk.GetRankChar(2))
            PhoneSdk.callJavaVoidModth(para)
        }
    }
    public static shareTextToPackage(text: string, packageName: string) {
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(11,text,packageName,PhoneSdk.GetRankChar(3))
            PhoneSdk.callJavaVoidModth(para)
        }
    }

    //Google SignIn 谷歌登录
    public static signInByGoogle() {
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(12,PhoneSdk.GetRankChar(3))
            PhoneSdk.callJavaVoidModth(para)
        }
    }


    public static initRewardedAd(){
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(13,this.GetRankChar(3))
            this.callJavaVoidModth(para)
        }
        else if(cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative){
        }
    }
    public static playRewardedAd(){
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(14,this.GetRankChar(2))
            this.callJavaVoidModth(para)
        }
        else if(cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative){
        }
    }




    public static getOnlyID(): string {//--
        let onlyId: string = ''
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = this.makeStr(1,this.GetRankChar(2))
            onlyId = this.callJavaReturnModth(para)
        }
        else if(cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative){
            onlyId = jsb.reflection.callStaticMethod("SDKWrapper","getUUID");
        }
        let editBoxIMEI = cc.sys.localStorage.getItem('EditBoxIMEI');
        if (null != editBoxIMEI && undefined != editBoxIMEI && '' != editBoxIMEI) {
            onlyId = editBoxIMEI;
        }
        return onlyId;
    }

    public static getDeviceID(): string {
        let deviceID: string = ''
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(2,PhoneSdk.GetRankChar(2))
            deviceID = PhoneSdk.callJavaReturnModth(para)
        }
        else if(cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative){
            deviceID = jsb.reflection.callStaticMethod("SDKWrapper","getUUID");
        }
        return deviceID;
    }

    
    // 獲取MCC
    public static getNetworkOperatorMCC() {//--
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = this.makeStr(5,this.GetRankChar(2))
            return parseInt(this.callJavaReturnModth(para)) 
        }
        else if(cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative){
            return 406;
        }
        return 0;
    }


    public static getTextFromClipboard(): string {//--
        let text = '';
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = this.makeStr(6,this.GetRankChar(3))
            text = this.callJavaReturnModth(para)
        } else if (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) {
            text = jsb.reflection.callStaticMethod("SDKWrapper", "getPasteBoard");
        }
        PhoneSdk.log('getTextFromClipboard:' + text);
        return text;
    }
    public static getAFID(): string {//
        let afid: string = ''
        if(cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative){
            afid = jsb.reflection.callStaticMethod("SDKWrapper","getafid");
            return afid;
        }
    }
    //获取谷歌广告id
    public static getGoogleAdID(): string {//null
        let adid: string = ''
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(8,PhoneSdk.GetRankChar(3))
            adid = PhoneSdk.callJavaReturnModth(para)
        }
        return adid;
    }

    // FireBase
    //获取FireBase 唯一标识符
    public static getLogInstanceID(): string {
        let adid: string = ''
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(9,PhoneSdk.GetRankChar(3))
            adid = PhoneSdk.callJavaReturnModth(para)
        }
        return adid;
    }
    public static getPackageName() {//--
        let packname = OutConfig.PackageName
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            packname = jsb.reflection.callStaticMethod("org/cocos2dx/lib/Cocos2dxHelper", "getPackageName", "()Ljava/lang/String;");
        }
        PhoneSdk.log("getPackageName : "+packname)
        return packname;
    }

    public static getVersionCode(): string {//--
        let ver = "1"
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            ver = jsb.reflection.callStaticMethod("org/cocos2dx/lib/Cocos2dxHelper", "getVersion", "()Ljava/lang/String;");
            if(ver==""){
                ver = "1"
            }
        }
        PhoneSdk.log("getVersionCode : "+ver)
        return ver;
    }
    
    //发起支付
    public static sendGoodPay(productId){
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(15,productId,this.GetRankChar(3))
            PhoneSdk.callJavaVoidModth(para)
        }
    }
    //补单
    public static sendGoodPayPurchase(){
        if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
            let para = PhoneSdk.makeStr(16,this.GetRankChar(3))
            PhoneSdk.callJavaVoidModth(para)
        }
    }





    public static getAdType(): string {
        return OutConfig.ad_type
    }

    public static getHotUpdateUrl(): string {
        return OutConfig.HotUpdateUrl
    }
    public static getSingleMinMoney() {
        return OutConfig.SingleMinMoney
    }
    

    public static getisEncryption(): boolean {
        return OutConfig.isEncryption;
    }
    public static getencryptionKey(): string {
        return OutConfig.encryptionKey
    }
    public static getencryptionMD5(): string {
        return OutConfig.encryptionMD5
    }




}
