// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class fullScreenBgShell extends cc.Component {
    // onLoad () {}

    start() {
        let bgNode = this.node;
        let _desWidth = cc.view.getDesignResolutionSize().width;
        let _desHeight = cc.view.getDesignResolutionSize().height;

        // if (!this.viewSize)
        //     this.viewSize = view.getVisibleSize();
        let _realWidth = cc.view.getVisibleSizeInPixel().width;
        let _realHeight = cc.view.getVisibleSizeInPixel().height;

        let _ratioDes = _desWidth / _desHeight;
        let _ratioReal = _realWidth / _realHeight;

        let rito = 1;
        if (_ratioReal >= _ratioDes) {
            rito = _realWidth / _realHeight / (_desWidth / _desHeight);
        } else {
            rito = (_realHeight / _realWidth) * (_desWidth / _desHeight);
        }
        //bgNode.scale =  v3(bgNode.scale.x * rito, bgNode.scale.y * rito, bgNode.scale.z * rito);
        bgNode.setScale((rito * 750) / 720, (rito * 750) / 720, (rito * 750) / 720);
    }
    // update (dt) {}
}
