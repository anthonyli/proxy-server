'use strict';
const fs = require('fs');
const readline = require('readline');

exports.command = 'init';

exports.describe = 'init proxy.json config';

exports.handler = () => {
    const config = {
        name: "proxy-static-server",
        port: 3000,
        staticDir: "./static",
        index: "index",
        proxyTable: {
            "/api": {
                "target": "http://127.0.0.1:8080",
                "changeOrigin": true,
                "pathRewrite": {
                    "^/api": "/api"
                }
            }
        },
        ext: 'html',
        templateDir: './static',
    };
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    new Promise((resolve, reject) => {
        rl.question(`name: `, (answer) => {
            config.name = answer || 'proxy-static-server';
            resolve();
        });
    }).then(() => {
        return new Promise((resolve, reject) => {
            rl.question(`port: `, (answer) => {
                config.port = answer || 3000;
                resolve();
            });
        })
    }).then(() => {
        rl.question(`Is this ok(yes)?:\n${JSON.stringify(config, null, 2)}`, (answer) => {
            if (!answer || answer == 'yes' || answer == 'y') {
                fs.writeFileSync('./proxy.json', JSON.stringify(config, null, 2));
                console.log('write config success');
            } else {
                console.log('Aborted');
            }
            rl.close();
        });
    })
}