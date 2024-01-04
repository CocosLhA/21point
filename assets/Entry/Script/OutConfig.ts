export const OutConfig = {
    // 外网测试
    HotUpdateUrl: 'http://center.phoenw2dw.xyz/center',
    // 正式服
    //HotUpdateUrl: 'http://pury.trerpotv.xyz/mkds',

    // 消息是否加密
    isEncryption: true,
    // 消息加密Key
    encryptionKey: '0wBDRUnCYMJip01ZzBq0ZQ',
    // 消息加密密钥
    encryptionMD5: 'y6ANnu8a1qZGZnw2DHcahHkmOSUrqpE',

    // Java回调Key
    JavaCallbackKey: 'nfvgzdmjgndvdlfz',
    // Android接口路径
    ANDROID_API: 'com/wsx/edctp/a1/sdk/JavaBridge',
    // 包名
    PackageName: 'com.test.test2.test3',
    //广告类型
    ad_type:"",

    // A面看广告可以获得的金币数量
    SingleAdvertMoney: 60,
    // A面单局游戏消耗金币的数量
    SingleLoseMoney: 60,
    // A面用户生成金币数量最小值
    SingleMinMoney: 6000,
    // A面用户生成金币数量最大值
    SingleMaxMoney: 10000,

    isSHowLog: true,
    /// a面vip
    vipData : [
        {vipTag: 1, needVideosNum: 0, rewardNum: 60},
        {vipTag: 2, needVideosNum: 50, rewardNum: 120},
        {vipTag: 3, needVideosNum: 200, rewardNum: 180},
        {vipTag: 4, needVideosNum: 500, rewardNum: 240},
        {vipTag: 5, needVideosNum: 1000, rewardNum: 300},
    ],
    vipLevel: 0,
    isFirstInLobby: false,

}