'use strict';
const spawn = require('child_process').spawn;
const fs = require("fs");

exports.command = "config";

exports.describe = "modify proxy.json config";

exports.handler = () => {
    const exists = fs.existsSync(`./proxy.json`);
    if (!exists) {
        console.log(`fatal: proxy.json file not found(please do "pss init" first)`);
        return
    }
    const editor = process.env.EDITOR || 'vi';
    var child = spawn(editor, ['./proxy.json'], {
        stdio: 'inherit'
    });
    child.on('exit', function(e, code) {
        console.log("finished");
    });
}