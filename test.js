let fs = require("fs-extra");
let path = require("path");
async function test() {
    try {
        await fs.unlink(path.join(__dirname, "./a.txt"));
        console.log("success!");
    } catch (e) {
        console.log(e);
    }
}

test();