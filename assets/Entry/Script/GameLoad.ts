// import { BundleSoundPath } from "../../BundleGame/Game/client/global/enum/game/Const";
// import AudioHelper from "../../BundleGame/Game/fromework/helper/AudioHelper";

import PhoneSdk from "./PhoneSdk";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameLoad extends cc.Component {
    @property({ type: cc.Asset })
    project: cc.Asset = null;
    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;
    @property(cc.Label)
    completeLab: cc.Label = null;
    @property(cc.Label)
    messageLabel: cc.Label = null;
    @property(cc.Label)
    versionLabel: cc.Label = null;
    @property(cc.Node)
    AlertDlg: cc.Node = null;
    @property(cc.Label)
    LableAlert: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:
    private _updateUrl: string = "";

    private mustupdating: boolean = false;
    private needRetry: boolean = false;

    private _amUp: jsb.AssetsManager = null;
    private isZipLoad: boolean = false;
    private missCount: number = 0;

    onLoad() {
        this.setHotUpdatePath();
        this.hideAlertUI();
        // AudioHelper.Instance.stopBGM();
        // AudioHelper.Instance.playBGMBundle(BundleSoundPath.bgm_lobby);
    }

    start() {
        this.beginCheck();
    }

    beginCheck() {
        this.showLog("GameLoad - beginCheck ");
        this.initUpdate();
        this.VersionText();
    }

    // 设置当前版本号
    VersionText() {
        if (!cc.sys.isNative) return;
        let gamev = "1.0.0";
        if (jsb.fileUtils.isFileExist(this.writePath() + "remoteAssets/project.manifest")) {
            let sevePath = (jsb.fileUtils ? this.writePath() : "/") + "remoteAssets";
            let loadMfest = this.getFileStr(sevePath + "/project.manifest");
            gamev = loadMfest.version;
        } else {
            let originMfest = this.getFileStr(this._updateUrl);
            gamev = originMfest.version;
        }
        this.versionLabel.string = "GameVer: " + gamev;
        PhoneSdk.gameVersion = gamev;
    }
    private writePath() {
        return jsb.fileUtils.getWritablePath();
    }
    private getFileStr(path) {
        return JSON.parse(jsb.fileUtils.getStringFromFile(path));
    }

    private initUpdate() {
        this.showDians("Loading");
        if (cc.sys.isNative) {
            this._updateUrl = this.project.nativeUrl;
            this.readyUpdate();
        } else {
            this._starToHall();
        }
    }

    private showDians(str: string) {
        let dians = "",
            times = 0;
        this.messageLabel.string = "";
        this.messageLabel.node.stopAllActions();
        let delay = cc.delayTime(0.5);
        let func = cc.callFunc(() => {
            if (times > 3) {
                times = 0;
            }
            dians = "";
            for (let i = 0; i < times; ++i) {
                dians += ".";
            }
            this.messageLabel.string = str + dians;
            ++times;
        });
        let gewefeg = cc.sequence(func, delay);
        let rpbvregr = cc.repeatForever(gewefeg);
        this.messageLabel.node.runAction(rpbvregr);
    }

    private readyUpdate() {
        if (!cc.sys.isNative) return;
        this.modifyUpdatePath(this._updateUrl, (manifestUrl) => {
            if (manifestUrl) this._updateUrl = manifestUrl;
            this.LoadLogic();
        });
    }

    modifyUpdatePath(localUrl, Callback) {
        try {
            let expath = "";
            this.isZipLoad = true;
            if (jsb.fileUtils.isFileExist(this.writePath() + "remoteAssets/project.manifest")) {
                let savePath = (jsb.fileUtils ? this.writePath() : "/") + "remoteAssets";
                let manifest = this.getFileStr(savePath + "/project.manifest");
                if (manifest.packageUrl.indexOf("/zip") < 0) {
                    expath = "zip/";
                }
                manifest.remoteManifestUrl = manifest.packageUrl + expath + "project.manifest";
                manifest.remoteVersionUrl = manifest.packageUrl + expath + "version.manifest";
                jsb.fileUtils.writeStringToFile(JSON.stringify(manifest), savePath + "/project.manifest");
                Callback(savePath + "/project.manifest");
            } else {
                expath = "zip/";
                let initPath = (jsb.fileUtils ? this.writePath() : "/") + "remoteAssets";
                if (!jsb.fileUtils.isDirectoryExist(initPath)) jsb.fileUtils.createDirectory(initPath);
                let originPath = localUrl;
                let originMfest = jsb.fileUtils.getStringFromFile(originPath);
                let origin = JSON.parse(originMfest);
                origin.remoteManifestUrl = origin.packageUrl + expath + "project.manifest";
                origin.remoteVersionUrl = origin.packageUrl + expath + "version.manifest";
                jsb.fileUtils.writeStringToFile(JSON.stringify(origin), initPath + "/project.manifest");
                Callback(initPath + "/project.manifest");
            }
        } catch (error) {}
    }

    private LoadLogic() {
        this._amUp = new jsb.AssetsManager("", (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remoteAssets", this.varsionCompare);
        this._amUp.setVerifyCallback(function (path, asset) {
            let compressed = asset.compressed;
            if (compressed) {
                return true;
            } else {
                return true;
            }
        });
        this._amUp.setMaxConcurrentTask(32);
        this.checkLoad();
    }
    private varsionCompare(versionA, versionB) {
        let vA = versionA.split(".");
        let vB = versionB.split(".");
        for (let i = 0; i < vA.length; ++i) {
            let a = parseInt(vA[i]);
            let b = parseInt(vB[i] || 0);
            if (a === b) {
                continue;
            } else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        } else {
            return 0;
        }
    }

    private checkLoad() {
        if (this.mustupdating) return;
        if (this._amUp.getState() === jsb.AssetsManager["State"].UNINITED) {
            let url = this._updateUrl;
            if (cc.loader.md5Pipe) {
                url = cc.loader.md5Pipe.transformURL(url);
            }
            this._amUp.loadLocalManifest(url);
        }
        if (!this._amUp.getLocalManifest() || !this._amUp.getLocalManifest().isLoaded()) {
            return;
        }
        this._amUp.setEventCallback(this.checkMetho.bind(this));
        this._amUp.checkUpdate();
        this.mustupdating = true;
    }

    private checkMetho(event) {
        let isMustLoad = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.onErrorTry("checkCb err " + event.getEventCode());
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                this.onErrorTry("checkCb err " + event.getEventCode());
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.onErrorTry("checkCb err " + event.getEventCode());
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                // 已经是最新版本
                this._starToHall();
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                // 需要热更
                isMustLoad = true;
                break;
            default:
                return;
        }

        this._amUp.setEventCallback(null);
        this.mustupdating = false;

        let rpTime = 0;
        if (isMustLoad) {
            this.LoadData();
            this.progressBar.node.active = true;
            this.completeLab.node.active = true;

            if (this.isZipLoad && this.node) {
                let percent = 0;
                cc.tween(this.node)
                    .delay(0.1)
                    .call(() => {
                        rpTime++;
                        if (rpTime <= 400) {
                            percent += 0.002;
                        } else {
                            percent += 0.001;
                        }

                        if (percent > 1) {
                            percent = 1;
                        }
                        this.progressBar.progress = percent;
                    })
                    .union()
                    .repeat(600)
                    .start();
            }
        }
    }

    private onErrorTry(msg?) {
        this.AlertDlg.active = true;
        this.LableAlert.string = msg == null ? "Network error!" : msg;
    }
    hideAlertUI() {
        this.AlertDlg.active = false;
    }

    //重新启动 检 测热更
    private retryToUpdate() {
        if (jsb.fileUtils.isFileExist(jsb.fileUtils.getWritablePath() + "remoteAssets/project.manifest")) {
            jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + "remoteAssets/project.manifest");
            if (jsb.fileUtils.isFileExist(jsb.fileUtils.getWritablePath() + "remoteAssets_temp/project.manifest.temp")) {
                jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + "remoteAssets_temp/project.manifest.temp");
            }
        }
        this.hideAlertUI();
        cc.audioEngine.stopAll();
        cc.game.restart();
    }

    private retryUpdate() {
        if (!this.mustupdating && this.needRetry) {
            this.needRetry = false;
            this._amUp.downloadFailedAssets();
        }
    }

    private LoadData() {
        if (this._amUp && !this.mustupdating) {
            this._amUp.setEventCallback(this.LoadAssetsCb.bind(this));
            if (this._amUp.getState() === jsb.AssetsManager["State"].UNINITED) {
                let url = this._updateUrl;
                if (cc.loader.md5Pipe) {
                    url = cc.loader.md5Pipe.transformURL(url);
                }
                this._amUp.loadLocalManifest(url);
            }
            this.missCount = 0;
            this._amUp.update();
            this.mustupdating = true;
        }
    }

    private LoadAssetsCb(event: any) {
        let mustRestart = false;
        let isfaile = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                isfaile = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                let Percent = event.getPercentByFile();
                if (isNaN(Percent)) {
                    Percent = 0;
                }
                if (!this.isZipLoad) {
                    this.progressBar.progress = Percent;
                    this.completeLab.string = "Complete:" + Math.ceil(Percent * 100) + "%";
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                isfaile = true;
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                isfaile = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                isfaile = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                mustRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.missCount++;
                this.mustupdating = false;
                if (this.missCount < 5) {
                    this.needRetry = true;
                    this.retryUpdate();
                } else {
                    this.missCount = 0;
                    this.needRetry = false;
                    isfaile = true;
                }
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                isfaile = true;
                break;
            default:
                break;
        }

        if (isfaile) {
            this._amUp.setEventCallback(null);
            this.mustupdating = false;
            this.onErrorTry();
        }

        if (mustRestart) {
            this.showLog("GameLoad - updatefinish restart ");
            this._amUp.setEventCallback(null);
            let filePaths = jsb.fileUtils.getSearchPaths();
            let newPaths = this._amUp.getLocalManifest().getSearchPaths();
            Array.prototype.unshift.apply(filePaths, newPaths);
            Array.prototype.unshift.apply(filePaths, [jsb.fileUtils.getWritablePath() + "remoteAssets"]);
            cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(filePaths));
            jsb.fileUtils.setSearchPaths(filePaths);
            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    }

    private _starToHall() {
        this.showLog("GameLoad - _startGame ");
        this.getBundle("BundleGame", (bundle) => {
            bundle.loadScene("Launch", function (err, scene) {
                cc.director.runScene(scene, null, null);
            });
        });
    }

    showLog(msg) {
        console.log(msg);
    }

    getBundle(name: string, callback) {
        try {
            let bundle = cc.assetManager.getBundle(name);
            if (bundle) {
                callback(bundle);
            } else {
                cc.assetManager.loadBundle(name, (err, bundle) => {
                    if (err) {
                        return null;
                    }
                    bundle = cc.assetManager.getBundle(name);
                    callback(bundle);
                });
            }
        } catch (error) {}
    }

    setHotUpdatePath() {
        if (typeof window.jsb === "object") {
            var hotUpdateSearchPaths = localStorage.getItem("HotUpdateSearchPaths");
            if (hotUpdateSearchPaths) {
                var paths = JSON.parse(hotUpdateSearchPaths);
                jsb.fileUtils.setSearchPaths(paths);

                var fileList = [];
                var storagePath = paths[0] || "";
                var tempPath = storagePath + "_temp/";
                var baseOffset = tempPath.length;

                if (jsb.fileUtils.isDirectoryExist(tempPath) && !jsb.fileUtils.isFileExist(tempPath + "project.manifest.temp")) {
                    jsb.fileUtils.listFilesRecursively(tempPath, fileList);
                    fileList.forEach((srcPath) => {
                        var relativePath = srcPath.substr(baseOffset);
                        var dstPath = storagePath + relativePath;

                        if (srcPath[srcPath.length] === "/") {
                            jsb.fileUtils.createDirectory(dstPath);
                        } else {
                            if (jsb.fileUtils.isFileExist(dstPath)) {
                                jsb.fileUtils.removeFile(dstPath);
                            }
                            jsb.fileUtils.renameFile(srcPath, dstPath);
                        }
                    });
                    jsb.fileUtils.removeDirectory(tempPath);
                }
            }
        }
    }

    // update (dt) {}
}
