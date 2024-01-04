import PhoneSdk from "./PhoneSdk";

export namespace ToolsEx {
    export function GenerateUUID() {
        let d = new Date().getTime();
        let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        });
        return uuid;
    }
    export function GenerateID(n: number) {
        let rdmNum = "";
        for (let i = 0; i < n; i++) {
            rdmNum += Math.floor(Math.random() * 10);
        }
        return rdmNum;
    }
    /**
     * 判断一个值是否为空。
     *
     * @param {*} value - 要检查的值。
     * @returns {boolean} - 如果值为空则返回 true，否则返回 false。
     */
    export function isEmpty(value) {
        if (value === null || value === undefined) {
            return true;
        }

        if (typeof value === "string" && value.trim() === "") {
            return true;
        }

        if (Array.isArray(value) && value.length === 0) {
            return true;
        }

        if (typeof value === "object" && Object.keys(value).length === 0) {
            return true;
        }

        return false;
    }

    export const TArray = {
        /*
        数组顺序打乱
        */
        upsetArr: function (arr) {
            return arr.sort(function () {
                return Math.random() - 0.5;
            });
        },
        /*
         数组最大值最小值
         */
        //这一块的封装，主要是针对数字类型的数组
        maxArr: function (arr) {
            return Math.max.apply(null, arr);
        },
        minArr: function (arr) {
            return Math.min.apply(null, arr);
        },
        // 数组求和，平均值
        //这一块的封装，主要是针对数字类型的数组
        //求和
        sumArr: function (arr) {
            return arr.reduce(function (res, cur) {
                return res + cur;
            }, 0);
        },
        //平均值,小数点可能会有很多位，这里不做处理，处理了使用就不灵活了！
        coletr: function (arr) {
            let sumText = this.sumArr(arr);
            let covText = sumText / arr.length;
            return covText;
        },
        //从数组中随机获取元素
        //randomOne([1,2,3,6,8,5,4,2,6])
        //2
        //randomOne([1,2,3,6,8,5,4,2,6])
        //8
        //randomOne([1,2,3,6,8,5,4,2,6])
        //8
        //randomOne([1,2,3,6,8,5,4,2,6])
        randomOne: function (arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        },
        //返回数组（字符串）一个元素出现的次数
        //getEleCount('asd56+asdasdwqe','a')
        //3
        //getEleCount([1,2,3,4,5,66,77,22,55,22],22)
        //2
        getEleCount: function (obj, ele) {
            let num = 0;
            for (let i = 0, len = obj.length; i < len; i++) {
                if (ele == obj[i]) {
                    num++;
                }
            }
            return num;
        },
        //返回数组（字符串）出现最多的几次元素和出现次数
        //arr, rank->长度，默认为数组长度，ranktype，排序方式，默认降序
        /*
        getCount([1,2,3,1,2,5,2,4,1,2,6,2,1,3,2])
        默认情况，返回所有元素出现的次数
        getCount([1,2,3,1,2,5,2,4,1,2,6,2,1,3,2],3)
        传参（rank=3），只返回出现次数排序前三的
        getCount([1,2,3,1,2,5,2,4,1,2,6,2,1,3,2],null,true)
        传参（ascend=true,rank=null），升序返回所有元素出现次数
        getCount([1,2,3,1,2,5,2,4,1,2,6,2,1,3,2],3,true)
        传参（rank=3，ascend=true），只返回出现次数排序（升序）前三的
        */
        getCount: function (arr: any[], rank?: number, ascend?: boolean) {
            if (ascend === void 0) {
                ascend = false;
            }
            let obj = {},
                k,
                arr1 = [];
            //记录每一元素出现的次数
            for (let i = 0, len = arr.length; i < len; i++) {
                k = arr[i];
                if (obj[k]) {
                    obj[k]++;
                } else {
                    obj[k] = 1;
                }
            }
            //保存结果{el-'元素'，count-出现次数}
            for (let o in obj) {
                arr1.push({ el: o, count: obj[o] });
            }
            //排序（降序）
            arr1.sort(function (n1, n2) {
                return n2.count - n1.count;
            });
            //如果ranktype为1，则为升序，反转数组
            if (ascend) {
                arr1 = arr1.reverse();
            }
            let rank1 = rank || arr1.length;
            return arr1.slice(0, rank1);
        },
        //得到n1-n2下标的数组
        //getArrayNum([0,1,2,3,4,5,6,7,8,9],5,9)
        //[5, 6, 7, 8, 9]
        //getArrayNum([0,1,2,3,4,5,6,7,8,9],2) 不传第二个参数,默认返回从n1到数组结束的元素
        //[2, 3, 4, 5, 6, 7, 8, 9]
        getArrayNum: function (arr: any[], n1: number, n2: number) {
            let arr1 = [],
                len = n2 || arr.length - 1;
            for (let i = n1; i <= len; i++) {
                arr1.push(arr[i]);
            }
            return arr1;
        },
        //筛选数组
        //删除值为'val'的数组元素
        //removeArrayForValue(['test','test1','test2','test','aaa'],'test',true)
        //["aaa"]   带有'test'的都删除
        //removeArrayForValue(['test','test1','test2','test','aaa'],'test')
        //["test1", "test2", "aaa"]  //数组元素的值全等于'test'才被删除
        removeArrayForValue: function (arr: any[], val: any, possess?: boolean) {
            if (possess === void 0) {
                possess = false;
            }
            arr.filter(function (item) {
                return possess ? item.indexOf(val) !== -1 : item !== val;
            });
        },
        /**
         * 释放数组对象
         */
        close: function (arrs: any[]) {
            if (arrs) {
                for (let i = 0; i < arrs.length; i) {
                    arrs.splice(i, 1);
                }
            }
        },
        /**
         * 对象转化为数组
         */
        passArray: function (Obj: Object) {
            let arr = [];
            for (let i in Obj) {
                arr.push(Obj[i]);
            }
            return arr;
        },
        /**
         * 降维数组
         */
        flatten: function (arr: any[]) {
            return [].concat(...arr.map((x) => (Array.isArray(x) ? this.flatten(x) : x)));
        },
        /**
         * 两个数组去重
         */
        duplicate: function (arr1: any[], arr2: any[]) {
            if (arr1.length <= 0) {
                return arr2;
            }
            if (arr2.length <= 0) {
                return arr1;
            }
            let _arr1 = arr1.slice(0);
            let _arr2 = arr2.slice(0);

            for (let i = _arr1.length - 1; i >= 0; i--) {
                for (let j = _arr2.length - 1; j >= 0; j--) {
                    if (_arr1[i] == _arr2[j]) {
                        _arr1.splice(i, 1);
                        _arr2.splice(j, 1);
                        break;
                    }
                }
            }
            return _arr1;
        },
        /**
         * 深拷贝数组
         */
        deepCopy: function (arr: any[]) {
            let newAry = [];
            arr.forEach((value, index) => {
                if (value instanceof Array) {
                    newAry[index] = TArray.deepCopy(value);
                } else {
                    newAry[index] = value;
                }
            });
            return newAry;
        },
        /**
         * 判断两个数组值是否完全相同
         */
        equals: function (arr1: any[], arr2: any[]) {
            // if the other array is a falsy value, return
            if (!arr1 || !arr2) {
                return false;
            }
            // compare lengths - can save a lot of time
            if (arr1.length != arr2.length) {
                return false;
            }
            for (var i = 0, l = arr1.length; i < l; i++) {
                // Check if we have nested arrays
                if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
                    // recurse into the nested arrays
                    if (!TArray.equals(arr1[i], arr2[i])) {
                        return false;
                    }
                } else if (arr1[i] != arr2[i]) {
                    // Warning - two different object instances will never be equal: {x:20} != {x:20}
                    return false;
                }
            }
            return true;
        },
        /**
         * 充值数组为某值
         */
        memset(arr: any[], value: any) {
            arr.forEach((item, index) => {
                if (item instanceof Array) {
                    TArray.memset(arr[index], value);
                } else {
                    arr[index] = value;
                }
            });
        },
        /**
         * 获取元素数
         */
        getLength: function (arr: any[]) {
            let _length = 0;
            arr.forEach((value) => {
                if (value instanceof Array) {
                    _length += TArray.getLength(value);
                } else {
                    _length++;
                }
            });
            return _length;
        },
        /**
         * 将数组分成多少个小数组,arr是原数组,length是想分的数量
         */
        division: function (arr: any[], count: number) {
            let newArray = [];
            let aryLength = Math.ceil(arr.length / count);
            for (let i = 0; i < count; i++) {
                newArray.push(arr.slice(i * aryLength, (i + 1) * aryLength));
            }
            return newArray;
        },
        /**
         * 从一个数组中随机取指定个元素
         * @param arr
         * @param count
         * @returns
         */
        getRandomElementsFromArray(arr, count) {
            const shuffledArray = arr.slice(); // 创建原数组的一个副本，以避免修改原数组
            const result = [];

            for (let i = 0; i < count && shuffledArray.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * shuffledArray.length);
                const randomElement = shuffledArray.splice(randomIndex, 1)[0];
                result.push(randomElement);
            }

            return result;
        },
        /**
         * 洗牌算法
         * @param arr
         * @returns
         */
        shuffle(arr) {
            let n = arr.length,
                random;
            while (0 != n) {
                random = (Math.random() * n--) >>> 0; // 无符号右移位运算符向下取整
                [arr[n], arr[random]] = [arr[random], arr[n]]; // ES6的结构赋值实现变量互换
            }
            return arr;
        },
    };

    export const TObj = {
        /*
        判断对象类型
        instanceOf('1','String')    true
        instanceOf([],'Object')     true
        instanceOf([],'Array')      true
        instanceOf(1,'Number')      true
        */
        instanceOf: function (obj, type) {
            return toString.apply(obj) === "[object " + type + "]" || typeof obj === type.toLowerCase();
        },
        //序列化
        toJSON: function (str) {
            let _json = null;
            try {
                _json = JSON.parse(str);
            } catch (e) {
                PhoneSdk.log("to JSON ERROR=" + str);
            }
            return _json;
        },
        //反序列化
        fmtData: function (Obj) {
            let data = JSON.stringify(Obj);
            return data;
        },
        deepCopy: function (source: any): any {
            if (null == source || {} == source || [] == source) {
                return source;
            }

            let newObject: any;
            if (source instanceof Array) {
                newObject = [];
                for (let key in source) {
                    if (typeof source[key] == "function") {
                        newObject[key] = source[key];
                    } else {
                        let sub = typeof source[key] == "object" ? TObj.deepCopy(source[key]) : source[key];
                        newObject.push(sub);
                    }
                }
            } else if (source instanceof Map) {
                newObject = new Map();
                source.forEach((value, key) => {
                    newObject.set(key, TObj.deepCopy(value));
                });
            } else {
                newObject = {};
                for (let key in source) {
                    if (typeof source[key] == "function") {
                        newObject[key] = source[key];
                    } else {
                        let sub = typeof source[key] == "object" ? TObj.deepCopy(source[key]) : source[key];
                        newObject[key] = sub;
                    }
                }
            }

            return newObject;
        },
    };

    export enum BlankType {
        ALL = 1,
        FRONT_AND_BACK = 2,
        FRONT = 3,
        BACK = 4,
    }

    export const TStr = {
        //去除字符串空格
        //去除空格  type 1-所有空格  2-前后空格  3-前空格 4-后空格
        trim: function (str, type) {
            switch (type) {
                case BlankType.ALL:
                    return str.replace(/\s+/g, "");
                case BlankType.FRONT_AND_BACK:
                    return str.replace(/(^\s*)|(\s*$)/g, "");
                case BlankType.FRONT:
                    return str.replace(/(^\s*)/g, "");
                case BlankType.BACK:
                    return str.replace(/(\s*$)/g, "");
                default:
                    return str;
            }
        },
        //字母大小写切换
        /*type
         1:首字母大写
         2：首页母小写
         3：大小写转换
         4：全部大写
         5：全部小写
         * */
        //changeCase('asdasd',1)
        //Asdasd
        changeCase: function (str, type) {
            function ToggleCase(_str) {
                let itemText = "";
                _str.split("").forEach(function (item) {
                    if (/^([a-z]+)/.test(item)) {
                        itemText += item.toUpperCase();
                    } else if (/^([A-Z]+)/.test(item)) {
                        itemText += item.toLowerCase();
                    } else {
                        itemText += item;
                    }
                });
                return itemText;
            }
            switch (type) {
                case 1:
                    return str.replace(/^(\w)(\w+)/, function (v, v1, v2) {
                        return v1.toUpperCase() + v2.toLowerCase();
                    });
                case 2:
                    return str.replace(/^(\w)(\w+)/, function (v, v1, v2) {
                        return v1.toLowerCase() + v2.toUpperCase();
                    });
                case 3:
                    return ToggleCase(str);
                case 4:
                    return str.toUpperCase();
                case 5:
                    return str.toLowerCase();
                default:
                    return str;
            }
        },
        //字符串循环复制
        //repeatStr(str->字符串, count->次数)
        //repeatStr('123',3)
        //"123123123"
        repeatStr: function (str, count) {
            let text = "";
            for (let i = 0; i < count; i++) {
                text += str;
            }
            return text;
        },
        //字符串替换
        //字符串替换(字符串,要替换的字符,替换成什么)
        replaceAll: function (str, AFindText, ARepText) {
            let raRegExp = new RegExp(AFindText, "g");
            return str.replace(raRegExp, ARepText);
        },
        // 字符串替换
        // replaceString('cash: %{num}', { num: 10 })
        // => 'cash: 10'
        replaceString: function (str, obj) {
            let keys = Object.keys(obj);
            keys.forEach((key) => {
                str = TStr.replaceAll(str, "%{" + key + "}", obj[key]);
            });
            return str;
        },
        //替换*
        //replaceStr(字符串,字符格式, 替换方式,替换的字符（默认*）)
        replaceStr: function (str, regArr, type, ARepText) {
            let regtext = "",
                Reg = null,
                replaceText = ARepText || "*";
            //replaceStr('18819322663',[3,5,3],0)
            //188*****663
            //repeatStr是在上面定义过的（字符串循环复制），大家注意哦
            if (regArr.length === 3 && type === 0) {
                regtext = "(\\w{" + regArr[0] + "})\\w{" + regArr[1] + "}(\\w{" + regArr[2] + "})";
                Reg = new RegExp(regtext);
                let replaceCount = this.repeatStr(replaceText, regArr[1]);
                return str.replace(Reg, "$1" + replaceCount + "$2");
            }
            //replaceStr('asdasdasdaa',[3,5,3],1)
            //***asdas***
            else if (regArr.length === 3 && type === 1) {
                regtext = "\\w{" + regArr[0] + "}(\\w{" + regArr[1] + "})\\w{" + regArr[2] + "}";
                Reg = new RegExp(regtext);
                let replaceCount1 = this.repeatSte(replaceText, regArr[0]);
                let replaceCount2 = this.repeatSte(replaceText, regArr[2]);
                return str.replace(Reg, replaceCount1 + "$1" + replaceCount2);
            }
            //replaceStr('1asd88465asdwqe3',[5],0)
            //*****8465asdwqe3
            else if (regArr.length === 1 && type == 0) {
                regtext = "(^\\w{" + regArr[0] + "})";
                Reg = new RegExp(regtext);
                let replaceCount = this.repeatSte(replaceText, regArr[0]);
                return str.replace(Reg, replaceCount);
            }
            //replaceStr('1asd88465asdwqe3',[5],1,'+')
            //"1asd88465as+++++"
            else if (regArr.length === 1 && type == 1) {
                regtext = "(\\w{" + regArr[0] + "}$)";
                Reg = new RegExp(regtext);
                let replaceCount = this.repeatSte(replaceText, regArr[0]);
                return str.replace(Reg, replaceCount);
            }
        },
        //检测字符串
        //checkType('165226226326','phone')
        //false
        //大家可以根据需要扩展
        checkType: function (str, type) {
            switch (type) {
                case "email":
                    return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
                case "phone":
                    return /^1[3|4|5|7|8][0-9]{9}$/.test(str);
                case "tel":
                    return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
                case "number":
                    return /^[0-9]+$/.test(str);
                case "english":
                    return /^[a-zA-Z\s]+$/.test(str);
                case "chinese":
                    return /^[\u4E00-\u9FA5]+$/.test(str);
                case "lower":
                    return /^[a-z]+$/.test(str);
                case "upper":
                    return /^[A-Z]+$/.test(str);
                case "dd/mm/yyyy":
                    return /^(\d{2})(\/)(\d{2})(\/)(\d{4})$/.test(str);
                case "indiaPhone":
                    return /^[0-9]{10}$/.test(str);
                default:
                    return true;
            }
        },
        // 检测是否包含数字
        hasNumber(str) {
            // 创建一个包含数字的正则表达式
            var regex = /\d/;
            // 使用 test 方法来检测字符串是否匹配正则表达式
            return regex.test(str);
        },
        //检测密码强度
        //checkPwd('12asdASAD')
        //3(强度等级为3)
        checkPwd: function (str) {
            let nowLv = 0;
            if (str.length < 6) {
                return nowLv;
            }
            if (/[0-9]/.test(str)) {
                nowLv++;
            }
            if (/[a-z]/.test(str)) {
                nowLv++;
            }
            if (/[A-Z]/.test(str)) {
                nowLv++;
            }
            if (/[\.|-|_]/.test(str)) {
                nowLv++;
            }
            return nowLv;
        },
        //查找字符串
        //找出'blog'的出现次数。代码如下
        //     let strTest='sad44654blog5a1sd67as9dablog4s5d16zxc4sdweasjkblogwqepaskdkblogahseiuadbhjcibloguyeajzxkcabloguyiwezxc967'
        // //countStr(strTest,'blog')
        // //6
        countStr: function (str, strSplit) {
            return str.split(strSplit).length - 1;
        },
        /**
         * 格式化字符串
         * stringFormat('{1}{2}','hello','world')
         *  let teststr = "看样子<color=#ff0000>你常识手册</color>背诵的不是<color=#0fffff>很好啊，正确答案是{1}</color>"
            this.testLable.string = cc.vv.stringFormat(teststr,'hello');
    
         */
        stringFormat: function () {
            if (arguments.length < 2) return;
            let str = arguments[0];
            if (arguments.length == 2 && ToolsEx.TObj.instanceOf(arguments[1], "Array")) {
                let args = arguments[1];
                for (let i = 1; i <= args.length; i++) {
                    let regx = new RegExp("\\{" + i + "\\}", "g");
                    str = str.replace(regx, args[i - 1]);
                }
            } else {
                for (let i = 1; i < arguments.length; i++) {
                    let regx = new RegExp("\\{" + i + "\\}", "g");
                    str = str.replace(regx, arguments[i]);
                }
            }
            return str;
        },
        /**
         * 	索引字符串中 指定的字符   如果未找到指定字符返回元字符
         * @param str  1: 从前向后索引查找  2：反之亦然
         * @param FindObj 要查找的对象为起点
         * @param length 取截取后的字符串长度 默认是全部
         * @returns {string}
         * @constructor
         */
        SubStr: function (type, str, FindObj, length) {
            if (str.indexOf(FindObj) == -1) return str;
            switch (type) {
                case 1:
                    return str.substr(str.indexOf(FindObj), length);
                    break;
                case 2:
                    return str.substr(str.lastIndexOf(FindObj), length);
                    break;
                case 3:
                    return str.substr(FindObj.length, length);
                    break;
                default:
                    return str;
                    break;
            }
        },
        /**
         * 字符串超出长度的部分显示为...
         * @param theString 原字符串
         * @param maxLength 字节数
         */
        ellipsisString: function (theString: string, maxLength: number) {
            let newStr = "";
            // if (maxLength > 3) {
            //     newStr = theString.substr(0, maxLength - 3) + '...';
            // } else {
            //     newStr = theString.substr(0, maxLength) + '...';
            // }
            if (theString.length > maxLength) {
                newStr = theString.substr(0, maxLength) + "...";
            } else {
                newStr = theString;
            }
            return newStr;
        },
        getQueryString: function (name: string, url: string) {
            let newName = name.toLowerCase();
            let reg = new RegExp("(" + newName + ")=([^&]*)(&|$)", "i");
            let value = url.match(reg);
            if (value != null) return decodeURI(value[2]);
            return null;
        },
    };

    export const TDate = {
        MonthSimple: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
        // 秒数转换成天数
        second2Day(sec: number) {
            let d = 0,
                h = 0,
                m = 0,
                s = 0;
            if (sec >= 0) {
                d = Math.floor(sec / 3600 / 24);
                h = Math.floor((sec / 60 / 60) % 24);
                m = Math.floor((sec / 60) % 60);
                s = Math.floor(sec % 60);
            }
            return {
                day: d,
                hour: h,
                minu: m,
                sec: s,
            };
        },
        // 秒数转换成小时数
        second2Hour(sec: number) {
            let h = 0,
                m = 0,
                s = 0;
            if (sec >= 0) {
                h = Math.floor(sec / 60 / 60);
                m = Math.floor((sec / 60) % 60);
                s = Math.floor(sec % 60);
            }
            return {
                hour: h,
                minu: m,
                sec: s,
            };
        },
        //到某一个时间的倒计时
        //getEndTime('2017/7/22 16:0:0')
        //"剩余时间6天 2小时 28 分钟20 秒"
        letgetEndTime: function (endTime) {
            let startDate = new Date(); //开始时间，当前时间
            let endDate = new Date(endTime.replace(/-/g, "/")); //结束时间，需传入时间参数
            let t = endDate.getTime() - startDate.getTime(); //时间差的毫秒数
            let d = 0,
                h = 0,
                m = 0,
                s = 0;
            if (t >= 0) {
                d = Math.floor(t / 1000 / 3600 / 24);
                h = Math.floor((t / 1000 / 60 / 60) % 24);
                m = Math.floor((t / 1000 / 60) % 60);
                s = Math.floor((t / 1000) % 60);
            }
            PhoneSdk.log("剩余时间" + d + "天 " + h + "小时 " + m + " 分钟" + s + " 秒");
            return {
                day: d,
                hour: h,
                minu: m,
                sec: s,
            };
        },
        //获取当前时间戳
        letcurtimestamp: function () {
            return Math.round(new Date().getTime());
        },
        //获取当前时间
        letcurtime: function () {
            let now = new Date();
            let year = now.getFullYear(); //得到年份
            let month = now.getMonth() + 1; //得到月份
            let date = now.getDate(); //得到日期
            let day = now.getDay(); //得到周几
            let hour = now.getHours(); //得到小时
            let minu = now.getMinutes(); //得到分钟
            let sec = now.getSeconds(); //得到秒
            PhoneSdk.log(year + "/" + month + "/" + date + "/" + " " + hour + ":" + minu + ":" + sec);
            return {
                year: Number(year),
                month: Number(month),
                date: Number(date),
                day: Number(day),
                hour: Number(hour),
                minu: Number(minu),
                sec: Number(sec),
            };
        },
        //格式化时间
        // 20171116   return 2017/11/16
        letfmtData: function (strfmt) {
            let date = "";
            if (!ToolsEx.TObj.instanceOf(strfmt, "undefined") && strfmt && ToolsEx.TStr.trim(strfmt, BlankType.ALL) != "" && strfmt.length == 8) {
                date = strfmt.substring(0, 4) + "/";
                date += strfmt.substring(4, 6) + "/";
                date += strfmt.substring(6, 8) + "/";
            }
            return date;
        },
        /**
         * 时间戳转化成日期格式
         * timeFormat("1574092850")  return "2019/11/19 00:00:50"
         */
        lettimeFormat: function (nS) {
            let date = new Date(parseInt(nS) * 1000); // 时间戳为10位需乘1000，为13位则不用
            let Y = date.getFullYear(); // 年
            let M = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1; // 月
            let D = date.getDate() < 10 ? "0" + date.getDate() + "" : date.getDate() + ""; // 日
            let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(); // 时
            let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(); // 分
            let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(); // 秒
            // 一个函数只能有一个return，以下仅做示例
            // return Y + '-' + M + '-' + D // yyyy-mm-dd
            // return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + 's' // yyyy-mm-dd hh:mm:ss
            // return Y + '/' + M + '/' + D // yyyy/mm/dd
            return Y + "/" + M + "/" + D + " " + h + ":" + m + ":" + s; // yyyy/mm/dd hh:mm:ss
        },
        /**
         * 日期转化成时间戳
         * getUnixTime("2019/11/19 00:00:50")  return "1574092850"
         */
        letgetUnixTime: function (dateStr) {
            let newstr = dateStr.replace(/-/g, "/");
            let date = new Date(newstr);
            let time_str = date.getTime().toString();
            return time_str.substr(0, 10);
        },
        /**
         * 格式化时间
         * format(time, 'yyyy/MM/dd hh:mm:ss') retuen '2020/8/21 17:33:00'
         * @param time
         * @param format
         */
        format: function (time: number, format: string = "yyyy-MM-dd hh:mm:ss", isMonthStr: boolean = false) {
            let date = new Date(time);
            let month = isMonthStr ? TDate.MonthSimple[date.getMonth()] : TDate.fix2(date.getMonth() + 1);
            return (format = (format = (format = (format = (format = (format = format.replace("yyyy", date.getFullYear() + "")).replace("MM", month)).replace(
                "dd",
                TDate.fix2(date.getDate())
            )).replace("hh", TDate.fix2(date.getHours()))).replace("mm", TDate.fix2(date.getMinutes()))).replace("ss", TDate.fix2(date.getSeconds())));
        },
        /**
         * 是否需要补零
         * @param num
         */
        fix2: function (num: number) {
            return num < 10 ? "0" + num : "" + num;
        },
        /**
         * 判断两个时间是否为同一天
         */
        isTheSameLocalDay: function (time1: number, time2: number) {
            let date1 = new Date(time1);
            let date2 = new Date(time2);

            return date1.toDateString() === date2.toDateString();
        },
    };
    export const TNumber = {
        toThousands: function (num) {
            return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
        },
        /**
         * 数字格式转换
         * NumFormat(1000)
         * "1.0k"
         * NumFormat(1000000)
         * "1.0M"
         */
        NumFormat: function (n) {
            if (n === 0) return "0 B";
            let k = 1000, // or 1024
                sizes = ["", "k", "m", "b", "t", "aa", "ab", "ac"],
                i = Math.floor(Math.log(n) / Math.log(k));
            let value;
            if (i == 0) {
                value = n / Math.pow(k, i);
                value = Math.floor(value * 100) / 100;
            } else {
                if (i < sizes.length) {
                    value = n / Math.pow(k, i);
                } else {
                    value = n / Math.pow(k, i) + Math.pow(k, i - (sizes.length - 1));
                }
                if (i >= sizes.length) {
                    value = Math.floor(value * 100) / 100 + sizes[sizes.length - 1];
                } else {
                    value = Math.floor(value * 100) / 100 + sizes[i];
                }
            }
            return value;
        },
        MoneyNumFormat: function (n: number) {
            if (!n || isNaN(n) || n < 0) {
                return "0";
            } else if (n < 1000) {
                return ToolsEx.TNumber.numFixed(n, 0);
            } else if (n >= 1000 && n < 100000) {
                n = Math.floor(n);
                return this.toThousands(n);
            } else if (n >= 100000 && n < 1000000) {
                return ToolsEx.TNumber.numFixed(n / 100000, 2) + "L";
            } else if (n >= 1000000 && n < 10000000) {
                return ToolsEx.TNumber.numFixed(n / 100000, 1) + "L";
            } else {
                let cr = Math.floor(n / 10000000);
                return this.toThousands(cr) + "CR";
            }
        },
        //随机返回一个范围的数字
        randomFloat: function (n1, n2) {
            //randomNumber(5,10)
            //返回5-10的随机整数，包括5，10
            if (arguments.length === 2) {
                return n1 + Math.random() * (n2 - n1);
            }
            //randomNumber(10)
            //返回0-10的随机整数，包括0，10
            else if (arguments.length === 1) {
                return Math.random() * n1;
            }
            //randomNumber()
            //返回0-255的随机整数，包括0，255
            else {
                return Math.random() * 255;
            }
        },
        //随机返回一个范围的数字
        randomNumber: function (n1, n2) {
            //randomNumber(5,10)
            //返回5-10的随机整数，包括5，10
            if (arguments.length === 2) {
                return Math.round(n1 + Math.random() * (n2 - n1));
            }
            //randomNumber(10)
            //返回0-10的随机整数，包括0，10
            else if (arguments.length === 1) {
                return Math.round(Math.random() * n1);
            }
            //randomNumber()
            //返回0-255的随机整数，包括0，255
            else {
                return Math.round(Math.random() * 255);
            }
        },
        // 返回一个随机数字
        randomMinMax: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        //随机生成颜色值
        //这种写法，偶尔会有问题
        //Math.floor(Math.random()*0xffffff).toString(16);
        randomColor: function () {
            return "rgb(" + this.randomNumber(255) + "," + this.randomNumber(255) + "," + this.randomNumber(255) + ")";
        },
        /**
         * 通过字符串转换数字类型
         * @param Type
         * @param strObj
         * @returns {number}
         */
        passNum: function (Type, strObj) {
            switch (Type) {
                case "int":
                    return ~~strObj;
                case "float":
                    return 1 * strObj;
                default: //GN.ErrorLog(Type +'Not Find')
                    PhoneSdk.log(Type + "Not Find");
            }
        },
        //数值补零
        addPreZero: function (num, limit) {
            let t = (num + "").length,
                s = "";
            for (let i = 0; i < limit - t; i++) {
                s += "0";
            }
            return s + num;
        },
        // 字节转换成KB,MB,GB
        changeBytes(limit: number) {
            let size = "";
            if (limit < 0.1 * 1024) {
                //小于0.1KB，则转化成B
                size = limit.toFixed(2) + "B";
            } else if (limit < 0.1 * 1024 * 1024) {
                //小于0.1MB，则转化成KB
                size = (limit / 1024).toFixed(2) + "KB";
            } else if (limit < 0.1 * 1024 * 1024 * 1024) {
                //小于0.1GB，则转化成MB
                size = (limit / (1024 * 1024)).toFixed(2) + "MB";
            } else {
                //其他转化成GB
                size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
            }
            let sizeStr = size + ""; //转成字符串
            let index = sizeStr.indexOf("."); //获取小数点处的索引
            let dou = sizeStr.substr(index + 1, 2); //获取小数点后两位的值
            if (dou == "00") {
                //判断后两位是否为00，如果是则删除00
                return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
            }
            return size;
        },
        // 转换成千分位
        num2thousand(num: number) {
            return num * 1000;
        },
        // 转换成个位
        num2single(num: number) {
            return num / 1000;
        },
        // 保留小数位，多余位舍掉
        numFixed(num: number, count: number) {
            if (count <= 0) {
                return Math.floor(num);
            } else {
                let mulNum = Math.pow(10, count);
                return Math.floor(num * mulNum) / mulNum;
            }
        },
        // 简写数字
        simplifyNumber(num: number) {
            if (num >= 1000000) {
                return this.numFixed(num / 1000000, 1) + "m";
            } else if (num >= 1000) {
                return this.numFixed(num / 1000, 1) + "k";
            } else {
                return num;
            }
        },
        // 精确两位小数并转换为字符串
        formatToTwoDecimalString(number) {
            const roundedNumber = Number(number.toFixed(2));
            return roundedNumber.toString();
        },
    };
    export const Base64 = {
        uint8arrayToBase64: function (u8Arr) {
            let CHUNK_SIZE = 0x8000; //arbitrary number
            let index = 0;
            let length = u8Arr.length;
            let result = "";
            let slice;
            while (index < length) {
                slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
                result += String.fromCharCode.apply(null, slice);
                index += CHUNK_SIZE;
            }
            return "data:image/png;base64," + btoa(result);
        },
        base64ToUint8Array: function (base64String) {
            base64String = TStr.replaceAll(base64String, "data:image/png;base64,", "");
            let padding = "=".repeat((4 - (base64String.length % 4)) % 4);
            let base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

            let rawData = window.atob(base64);
            let outputArray = new Uint8Array(rawData.length);

            for (var i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        },
        encode: function (str, secretKey) {
            const base64 = window["base64Ex"];
            return base64.encode(base64.encode(str) + JSMD5.md5(secretKey));
        },
        decode: function (str, secretKey) {
            const base64 = window["base64Ex"];
            let s1 = base64.decode(str);
            let s2 = s1.replace(JSMD5.md5(secretKey), "");
            return base64.decode(s2);
        },
        encrypt_chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.",
        encrypt: function (txt, key, secret, l_f = 8, l = 16) {
            let nh1 = TNumber.randomMinMax(0, 64);
            let nh2 = TNumber.randomMinMax(0, 64);
            let nh3 = TNumber.randomMinMax(0, 64);
            let ch1 = Base64.encrypt_chars[nh1];
            let ch2 = Base64.encrypt_chars[nh2];
            let ch3 = Base64.encrypt_chars[nh3];
            let nhnum = nh1 + nh2 + nh3;
            let knum = 0;
            let i = 0;
            while (key[i] != undefined) knum += key[i++].charCodeAt(0);
            let mdKey = JSMD5.md5(JSMD5.md5(JSMD5.md5(key + ch1) + ch2 + secret) + ch3).substr(nhnum % l_f, (knum % l_f) + l);
            let base_64 = window["base64Ex"];
            txt = base_64.encode(txt);
            txt = txt.replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, ".");
            // Platform.log('encrypt_1:' + txt);
            let tmp = "";
            let j = 0;
            let k = 0;
            let tlen = txt.length;
            let klen = mdKey.length;
            for (let i = 0; i < tlen; i++) {
                k = k == klen ? 0 : k;
                j = (nhnum + Base64.encrypt_chars.indexOf(txt[i]) + mdKey[k++].charCodeAt(0)) % 64;
                tmp += Base64.encrypt_chars[j];
            }
            let tmplen = tmp.length;
            tmplen++;
            tmp = tmp.slice(0, nh2 % tmplen) + ch3 + tmp.slice(nh2 % tmplen);
            tmplen++;
            tmp = tmp.slice(0, nh1 % tmplen) + ch2 + tmp.slice(nh1 % tmplen);
            tmplen++;
            tmp = tmp.slice(0, knum % tmplen) + ch1 + tmp.slice(knum % tmplen);
            return tmp;
        },
        decrypt: function (txt, key, secret, l_f = 8, l = 16) {
            let knum = 0;
            let i = 0;
            let tlen = txt.length;
            while (key[i] != undefined) knum += key[i++].charCodeAt(0);
            let ch1 = txt[knum % tlen];
            let nh1 = Base64.encrypt_chars.indexOf(ch1);
            txt = txt.substr(0, knum % tlen) + txt.substr((knum % tlen) + 1);
            tlen--;
            let ch2 = txt[nh1 % tlen];
            let nh2 = Base64.encrypt_chars.indexOf(ch2);
            txt = txt.substr(0, nh1 % tlen) + txt.substr((nh1 % tlen) + 1);
            tlen--;
            let ch3 = txt[nh2 % tlen];
            let nh3 = Base64.encrypt_chars.indexOf(ch3);
            txt = txt.substr(0, nh2 % tlen) + txt.substr((nh2 % tlen) + 1);
            tlen--;
            let nhnum = nh1 + nh2 + nh3;
            let mdKey = JSMD5.md5(JSMD5.md5(JSMD5.md5(key + ch1) + ch2 + secret) + ch3).substr(nhnum % l_f, (knum % l_f) + l);
            let tmp = "";
            let j = 0;
            let k = 0;
            tlen = txt.length;
            let klen = mdKey.length;
            for (let i = 0; i < tlen; i++) {
                k = k == klen ? 0 : k;
                j = Base64.encrypt_chars.indexOf(txt[i]) - nhnum - mdKey[k++].charCodeAt(0);
                while (j < 0) j += 64;
                tmp += Base64.encrypt_chars[j];
            }
            tmp = tmp.replace(/\-/g, "+").replace(/\_/g, "/").replace(/\./g, "=");
            tmp = window["base64Ex"].decode(tmp);
            //tmp = Base64Out.getInstance().decode(tmp);

            return tmp.trim().replace(/\x00/g, "");
        },
    };
    export const JSMD5 = {
        md5: function (string) {
            function md5_RotateLeft(lValue, iShiftBits) {
                return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
            }
            function md5_AddUnsigned(lX, lY) {
                var lX4, lY4, lX8, lY8, lResult;
                lX8 = lX & 0x80000000;
                lY8 = lY & 0x80000000;
                lX4 = lX & 0x40000000;
                lY4 = lY & 0x40000000;
                lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
                if (lX4 & lY4) {
                    return lResult ^ 0x80000000 ^ lX8 ^ lY8;
                }
                if (lX4 | lY4) {
                    if (lResult & 0x40000000) {
                        return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
                    } else {
                        return lResult ^ 0x40000000 ^ lX8 ^ lY8;
                    }
                } else {
                    return lResult ^ lX8 ^ lY8;
                }
            }
            function md5_F(x, y, z) {
                return (x & y) | (~x & z);
            }
            function md5_G(x, y, z) {
                return (x & z) | (y & ~z);
            }
            function md5_H(x, y, z) {
                return x ^ y ^ z;
            }
            function md5_I(x, y, z) {
                return y ^ (x | ~z);
            }
            function md5_FF(a, b, c, d, x, s, ac) {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            }
            function md5_GG(a, b, c, d, x, s, ac) {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            }
            function md5_HH(a, b, c, d, x, s, ac) {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            }
            function md5_II(a, b, c, d, x, s, ac) {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            }
            function md5_ConvertToWordArray(string) {
                var lWordCount;
                var lMessageLength = string.length;
                var lNumberOfWords_temp1 = lMessageLength + 8;
                var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
                var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                var lWordArray = Array(lNumberOfWords - 1);
                var lBytePosition = 0;
                var lByteCount = 0;
                while (lByteCount < lMessageLength) {
                    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                    lBytePosition = (lByteCount % 4) * 8;
                    lWordArray[lWordCount] = lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition);
                    lByteCount++;
                }
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
                lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                return lWordArray;
            }
            function md5_WordToHex(lValue) {
                var WordToHexValue = "",
                    WordToHexValue_temp = "",
                    lByte,
                    lCount;
                for (lCount = 0; lCount <= 3; lCount++) {
                    lByte = (lValue >>> (lCount * 8)) & 255;
                    WordToHexValue_temp = "0" + lByte.toString(16);
                    WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
                }
                return WordToHexValue;
            }
            function md5_Utf8Encode(string) {
                string = string.replace(/\r\n/g, "\n");
                var utftext = "";
                for (var n = 0; n < string.length; n++) {
                    var c = string.charCodeAt(n);
                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    } else if (c > 127 && c < 2048) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    } else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                }
                return utftext;
            }
            var x = Array();
            var k, AA, BB, CC, DD, a, b, c, d;
            var S11 = 7,
                S12 = 12,
                S13 = 17,
                S14 = 22;
            var S21 = 5,
                S22 = 9,
                S23 = 14,
                S24 = 20;
            var S31 = 4,
                S32 = 11,
                S33 = 16,
                S34 = 23;
            var S41 = 6,
                S42 = 10,
                S43 = 15,
                S44 = 21;
            string = md5_Utf8Encode(string);
            x = md5_ConvertToWordArray(string);
            a = 0x67452301;
            b = 0xefcdab89;
            c = 0x98badcfe;
            d = 0x10325476;
            for (k = 0; k < x.length; k += 16) {
                AA = a;
                BB = b;
                CC = c;
                DD = d;
                a = md5_FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
                d = md5_FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
                c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070db);
                b = md5_FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
                a = md5_FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
                d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
                c = md5_FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
                b = md5_FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
                a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
                d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
                c = md5_FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
                b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
                a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
                d = md5_FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
                c = md5_FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
                b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
                a = md5_GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
                d = md5_GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
                c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
                b = md5_GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
                a = md5_GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
                d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                c = md5_GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
                b = md5_GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
                a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
                d = md5_GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
                c = md5_GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
                b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
                a = md5_GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
                d = md5_GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
                c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
                b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
                a = md5_HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
                d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
                c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
                b = md5_HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
                a = md5_HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
                d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
                c = md5_HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
                b = md5_HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
                a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
                d = md5_HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
                c = md5_HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
                b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
                a = md5_HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
                d = md5_HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
                c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
                b = md5_HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
                a = md5_II(a, b, c, d, x[k + 0], S41, 0xf4292244);
                d = md5_II(d, a, b, c, x[k + 7], S42, 0x432aff97);
                c = md5_II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
                b = md5_II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
                a = md5_II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
                d = md5_II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
                c = md5_II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
                b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
                a = md5_II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
                d = md5_II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
                c = md5_II(c, d, a, b, x[k + 6], S43, 0xa3014314);
                b = md5_II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
                a = md5_II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
                d = md5_II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
                c = md5_II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
                b = md5_II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
                a = md5_AddUnsigned(a, AA);
                b = md5_AddUnsigned(b, BB);
                c = md5_AddUnsigned(c, CC);
                d = md5_AddUnsigned(d, DD);
            }
            return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
        },
    };
    export const TCreator = {
        getAngle: function (start: cc.Vec2, end: cc.Vec2, offset = 0) {
            let x = end.x - start.x;
            let y = end.y - start.y;
            let radian = Math.atan2(y, x);
            let angle = (((180 * radian) / Math.PI) % 360) + offset;
            return angle;
        },
        imageAutoSize(headNode: cc.Node, frame: cc.SpriteFrame, maxWidth: number, maxHeight: number) {
            let imageSize = frame.getOriginalSize();
            if (maxHeight == 0 || imageSize.height == 0) return;

            if (imageSize.width > imageSize.height) {
                headNode.width = imageSize.width * (maxHeight / imageSize.height);
                headNode.height = maxHeight;
            } else if (imageSize.width < imageSize.height) {
                headNode.width = maxWidth;
                headNode.height = imageSize.height * (maxWidth / imageSize.width);
            } else {
                headNode.width = maxWidth;
                headNode.height = maxHeight;
            }

            // if (maxWidth / maxHeight < imageSize.width / imageSize.height) {
            //     headNode.width = maxHeight * (imageSize.width / imageSize.height);
            //     headNode.height = maxHeight;
            // } else if (maxWidth / maxHeight > imageSize.width / imageSize.height) {
            //     headNode.width = maxWidth;
            //     headNode.height = maxWidth * (imageSize.height / imageSize.width);
            // } else {
            //     headNode.width = maxWidth;
            //     headNode.height = maxHeight;
            // }
        },
    };

    /**
     * floatObj 包含加减乘除四个方法，能确保浮点数运算不丢失精度
     *
     * 我们知道计算机编程语言里浮点数计算会存在精度丢失问题（或称舍入误差），其根本原因是二进制和实现位数限制有些数无法有限表示
     * 以下是十进制小数对应的二进制表示
     *      0.1 >> 0.0001 1001 1001 1001…（1001无限循环）
     *      0.2 >> 0.0011 0011 0011 0011…（0011无限循环）
     * 计算机里每种数据类型的存储是一个有限宽度，比如 JavaScript 使用 64 位存储数字类型，因此超出的会舍去。舍去的部分就是精度丢失的部分。
     *
     * ** method **
     *  add / subtract / multiply /divide
     *
     * ** explame **
     *  0.1 + 0.2 == 0.30000000000000004 （多了 0.00000000000004）
     *  0.2 + 0.4 == 0.6000000000000001  （多了 0.0000000000001）
     *  19.9 * 100 == 1989.9999999999998 （少了 0.0000000000002）
     *
     * floatObj.add(0.1, 0.2) >> 0.3
     * floatObj.multiply(19.9, 100) >> 1990
     *
     */
    export const TFloat = {
        // 除法
        div(arg1: number, arg2: number) {
            let t1 = 0,
                t2 = 0,
                r1,
                r2;
            try {
                t1 = arg1.toString().split(".")[1].length;
            } catch (e) {}
            try {
                t2 = arg2.toString().split(".")[1].length;
            } catch (e) {}
            r1 = Number(arg1.toString().replace(".", ""));
            r2 = Number(arg2.toString().replace(".", ""));
            return TFloat.mul(r1 / r2, Math.pow(10, t2 - t1));
        },
        //乘法
        mul(arg1: number, arg2: number) {
            let m = 0,
                s1 = arg1.toString(),
                s2 = arg2.toString();
            try {
                m += s1.split(".")[1].length;
            } catch (e) {}
            try {
                m += s2.split(".")[1].length;
            } catch (e) {}
            return (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) / Math.pow(10, m);
        },
        //加法
        add(arg1: number, arg2: number) {
            let r1, r2, m;
            try {
                r1 = arg1.toString().split(".")[1].length;
            } catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split(".")[1].length;
            } catch (e) {
                r2 = 0;
            }
            m = Math.pow(10, Math.max(r1, r2));
            return (arg1 * m + arg2 * m) / m;
        },
        //减法
        sub(arg1: number, arg2: number) {
            let r1, r2, m, n;
            try {
                r1 = arg1.toString().split(".")[1].length;
            } catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split(".")[1].length;
            } catch (e) {
                r2 = 0;
            }
            m = Math.pow(10, Math.max(r1, r2));
            n = r1 >= r2 ? r1 : r2;
            return TNumber.numFixed((arg1 * m - arg2 * m) / m, n);
        },
    };
    export const TUrl = {
        // 获取链接中的参数
        getQueryString(url: string) {
            //如果参数不是对象。返回空对象
            if (typeof url != "string") {
                return {};
            }

            //保存最终输出的对象
            let paramObj: any = {};
            let _str = url.substr(url.indexOf("?") + 1);

            //解析中文
            let paraArr = decodeURI(_str).split("&");

            let tmp, key, value, newValue;
            for (let i = 0, len = paraArr.length; i < len; i++) {
                tmp = paraArr[i].split("=");
                key = tmp[0];
                value = tmp[1] || true;

                //处理数字'100'=>100
                if (typeof value === "string" && isNaN(Number(value)) === false) {
                    value = Number(value);
                }

                //如果key没有出现过(可能是0 或者false)
                if (typeof paramObj[key] === "undefined") {
                    paramObj[key] = value;
                } else {
                    newValue = Array.isArray(paramObj[key]) ? paramObj[key] : [paramObj[key]];
                    newValue.push(value);
                    paramObj[key] = newValue;
                }
            }

            return paramObj;
        },
        // 设置链接参数
        setQueryString(param: any) {
            let str = "";
            let i = 0;
            for (let k in param) {
                if (i == 0) {
                    str += "?" + k + "=" + param[k];
                } else {
                    str += "&" + k + "=" + param[k];
                }
                i++;
            }
            return encodeURI(str);
        },
    };
}
