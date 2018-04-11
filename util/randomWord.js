module.exports = {
    createRandomWord() {
        let store = "abcdefghijklmnopqrstuvwxyz" + "1234567890" + "abcdefghijklmnopqrstuvwxyz".toUpperCase();
        let res = "";
        let length = 6;
        for (let i = 0; i < length; i++) {
            res += store[Math.floor(Math.random() * store.length)];
        }
        return res;
    }
}