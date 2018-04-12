module.exports = {
    createRandomWord() {
        let store = "abcdefghijklmnopqrstuvwxyz" + "1234567890" + "abcdefghijklmnopqrstuvwxyz".toUpperCase();
        let res = "";
        let length = 4;
        for (let i = 0; i < length; i++) {
            res += store[Math.floor(Math.random() * store.length)];
        }
        return res;
    },
    /**
     * 
     * @param {Date} pastDate
     * @return {String} 
     */
    getDif(pastDate) {
        if (!(pastDate instanceof Date)) throw "the parameter should be an instance of Date";
        let past = pastDate.getTime();
        let dif = Date.now() - past; // millisecond

        let secondDif = parseInt(dif / 1000);
        if (secondDif >= 1 && secondDif < 60) {
            return `${secondDif}秒前`;
        }
        let minDif = parseInt(secondDif / 60);
        if (minDif >= 1 && minDif < 60) {
            return `${minDif}分钟前`;
        }
        let hourDif = parseInt(minDif / 60);
        if (hourDif >= 1 && hourDif < 24) {
            return `${hourDif}小时前`;
        }
        let dayDif = parseInt(hourDif / 24);
        if (dayDif >= 1 && dayDif < 30) {
            return `${dayDif}天前`;
        }
        let monthDif = parseInt(dayDif / 30);
        if (monthDif >= 1 && monthDif < 12) {
            return `${monthDif}月前`;
        } 
        let yearDif = parseInt(monthDif / 12);
        return `${yearDif}年前`;
    }
}