export default class data {
    public id = 0;
    public static money = 0;
    public static userName = "0";
    public static avatar = 0;

    static instance: data = null;

    static get I() {
        if (!data.instance) {
            data.instance = new data();
        }
        return data.instance;
    }
    public static load() {
        data.money = 1000;
        data.userName = "adad";
        data.avatar = 1;

        let ddd = {
            money: data.money,
            userName: data.userName,
            avatar: data.avatar,
        };
        cc.sys.localStorage.setItem(data.I.id, JSON.stringify(ddd));
    }
    public static loadlocal() {
        let ddd = {
            money: data.money,
            userName: data.userName,
            avatar: data.avatar,
        };
        cc.sys.localStorage.setItem(data.I.id, JSON.stringify(ddd));
    }
}
