'use strict';
const chokidar = require('chokidar');
const fs = require("fs");

exports.command = 'start';

exports.describe = 'start a proxy server';

exports.handler = (argv) => {
    const configPath = './proxy.json'
    const exists = fs.existsSync(configPath);
    if (!exists) {
        console.log(`fatal: proxy.json file not found(please do "pss init" first)`);
        return
    }
    const configStr = fs.readFileSync(configPath).toString();
    const config = JSON.parse(configStr);

    let server = require('../app/server.js')(config);

    server.start(argv.port || config.port);

    chokidar.watch('./', { ignored: /.DS_Store/ }).on('change', (event, path) => {
        server.stop();
        const configStr = fs.readFileSync(configPath).toString();
        const config = JSON.parse(configStr);
        server = require('../app/server.js')(config);
        server.restart(argv.port || config.port);
    })
}