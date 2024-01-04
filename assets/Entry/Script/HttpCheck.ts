import Base64Out from "../jslib/Base64Out";
import { OutConfig } from "./OutConfig";
import PhoneSdk from "./PhoneSdk";
import { ToolsEx } from "./ToolsEx";

export interface MSG_C {
    m: string
    f: string
    d: any
}

export default class HttpCheck {
    private static _Instance: HttpCheck = null;

    private constructor() {}
    public static get Instance(): HttpCheck {
        if (!HttpCheck._Instance) {
            window['base64Ex'] = Base64Out.getInstance()
            HttpCheck._Instance = new HttpCheck();
        }
        return HttpCheck._Instance;
    }

    private _timeout: number = 10000; //超时待时间
    private _reconnectCount: number = 0;
    private ReconnectionCount: number = 12;

    private _onTimeout() {

    }


    private _setRequestHead(xhr: XMLHttpRequest) {
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST');
        xhr.setRequestHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type');
        xhr.setRequestHeader('Content-Type', 'application/json');
    }

    public post(url: string, data?: MSG_C | any, callback?: Function, needEncode?: boolean, ) {
        let xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = this._timeout;
        PhoneSdk.log('HttpCheck post request:' + url,JSON.stringify(data));
        xhr.open('POST', url, true);
        this._setRequestHead(xhr);
        xhr.onload = () => {
            PhoneSdk.log('HttpCheck post  _onReceive:',url,xhr.response);
            this._reconnectCount = 0;
            if (null == xhr || null == xhr.status) {
                this.HttpError(callback)
            } 
            else if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                if (!xhr.response || '' === xhr.response || ' ' === xhr.response) {
                    PhoneSdk.warn(url + 'HttpCheck post  request is error!!!');
                } 
                else {
                    let _msgData = JSON.parse(xhr.response);
                    if (_msgData) {
                        PhoneSdk.log('HttpCheck post response:',url,xhr.response);
                        let message = this.uncodeMsg_c(_msgData);
                        let _Data: any = message.d || null;
                        callback(_Data)
                    } 
                    else {
                        PhoneSdk.warn(url + 'HttpCheck post request is error!!!' + _msgData);
                    }
                }
            } 
            else {
                PhoneSdk.warn(url + 'HttpCheck post request is error!!!')
            }
        }
        xhr.onerror = (error) => {
            PhoneSdk.log('HttpCheck post error: '+JSON.stringify(error));
            this.retury(false, url, data, callback, needEncode);
            this.HttpError(callback)
        }
        xhr.ontimeout = (ret) => {
            PhoneSdk.log('HttpCheck post ontimeout: ');
            this._onTimeout && this._onTimeout();
            this.retury(false, url, data, callback, needEncode);
        };
        try {
            if (data) {
                PhoneSdk.log('HttpCheck post send: - 0 ');
                let _msgdata = needEncode ?  this.encodeMsg_c(data): data;
                let _msgStr = JSON.stringify(_msgdata);
                PhoneSdk.log('HttpCheck post send: needEncode:' +needEncode);
                PhoneSdk.log('HttpCheck post send:' +_msgStr);
                xhr.send(_msgStr);
            } else {
                PhoneSdk.log('HttpCheck post send: null ' );
                xhr.send();
            }
        } catch (error) {
            this.HttpError(callback)
        }
    }

    private HttpError(callback?){
        if(callback){
            callback(-1)
        }
    }

    public retury(get: boolean, url: string, msg: MSG_C | any, call: Function, needEncode?: boolean) {
        this._reconnectCount++;
        if (this._reconnectCount <= this.ReconnectionCount) {
            if (get) {
                //this.get(url, msg, call, needEncode);
            } else {
                this.post(url, msg, call, needEncode);
            }
        } else {
            this._onTimeout && this._onTimeout();
            this._reconnectCount = 0;
        }
    }

    public makeMsg(msgId: string[], data: any): MSG_C {
        let _msg: MSG_C = {
            m: msgId[0],
            f: msgId[1],
            d: data
        }
        return _msg;
    }


    private encodeMsg_c(msg: MSG_C): MSG_C | any {
        let _encodeMsg = {};
        let _msg: MSG_C = ToolsEx.TObj.deepCopy(msg);
    
        if (OutConfig.isEncryption) {
            let encryStr = ToolsEx.Base64.encrypt(JSON.stringify(_msg), OutConfig.encryptionKey, OutConfig.encryptionMD5);
            encryStr = encryStr.replace(/[\r\n]/g, "");
            _encodeMsg[OutConfig.encryptionKey] = encryStr;
            PhoneSdk.log("encodeMsg_c",_encodeMsg);
            return _encodeMsg;
        }
        return _msg;
    }
    
    private uncodeMsg_c(msg: any): any {
        let message = msg;
        if (msg[OutConfig.encryptionKey] != null) {
            let str = ToolsEx.Base64.decrypt(msg[OutConfig.encryptionKey], OutConfig.encryptionKey, OutConfig.encryptionMD5)
            message = JSON.parse(str);
            PhoneSdk.log("uncodeMsg_c",message);
        }
    
        return message;
    }


    private m_ad_type = ""
    // 入口消息，判断进真金还是壳子
    public sendGetGameService(ad_type: string,callback) {
        this.m_ad_type = ad_type
        let packageName = PhoneSdk.getPackageName();
        let channel = 'Sagar';
        let appVersion = PhoneSdk.getVersionCode();
        let imei = '';
        let uid = cc.sys.localStorage.getItem('CommonUserUid');
        uid == null && (uid = '');

        // 随机消息长度，用于google审核
        let useless = ToolsEx.GenerateID(ToolsEx.TNumber.randomNumber(2, 50));

        let invite_uid = '0';
        let clipText = PhoneSdk.getTextFromClipboard();
        if (clipText != null && clipText != '') {
            invite_uid = ToolsEx.TStr.getQueryString('invite_id', clipText);
        }

        if (cc.sys.isNative) {
            imei = PhoneSdk.getOnlyID();
        } else {
            imei = 'web_imei'
        }
        let mcc = PhoneSdk.getNetworkOperatorMCC();
        let _msg = this.makeMsg(['Server', 'game_service'], { p: packageName, c: channel, v: appVersion, i: imei, u: uid, ad: ad_type, invite_u: invite_uid,mcc:mcc, none: useless });
        this.post(OutConfig.HotUpdateUrl, _msg,callback,OutConfig.isEncryption);
    }



}
