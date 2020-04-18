const path = require("path");
const Koa = require("koa");
const Router = require("koa-router");
const staticServer = require("koa-static-cache");
const nunjucks = require("koa-nunjucks-2");
const devip = require('dev-ip');
const c2k = require('koa2-connect');
const koaProxy = require('http-proxy-middleware');

module.exports = (config) => {

    const app = new Koa();
    const IPv4 = devip()[0];

    app.name = config.name;

    const staticDir = path.join(process.cwd(), config.staticDir)
    const templateDir = path.join(process.cwd(), config.templateDir)
    // 中间件

    const tplRender = () => {
        return nunjucks({
            ext: config.ext,
            path: templateDir,
            nunjucksConfig: {
                noCache: true,
                autoescape: true
            }
        });
    };
    // view
    app.use(tplRender());
    // 启动静态资源
    app.use(
        staticServer(staticDir, {
            maxage: 3600 * 24 * 30,
            gzip: true
        })
    );

    const router = new Router();

    const proxy = (route, options) => {
        if (typeof options == 'string') {
            options = { target: options }
        }

        return async (ctx, next) => {
            await c2k(koaProxy(route, options))(ctx, next)
        }
    }
    const proxyTable = config.proxyTable

    Object.keys(proxyTable).forEach((route) => {
        var options = proxyTable[route]
        app.use(proxy(route, options))
    })

    // 首页
    router
        .get("/", async ctx => {
            await ctx.render(config.index);
        })
        .all("*", async (ctx, next) => {
            await ctx.render(config.index);
        });

    // 路由配置
    app.use(router.routes(), router.allowedMethods());

    return {
        start: function (port, cb) {
            // 启动服务
            this.server = app.listen(port, function () {
                console.log(`proxy server start at http://${IPv4}:${port}`)
                cb && cb();
            });
            this.port = port;
            this.cb = cb;
        },
        stop: function () {
            this.server.close();
        },
        restart: function (port, cb) {
            console.log(`restarting proxy server...`)
            // 启动服务
            this.server = app.listen(port, function () {
                console.log(`proxy server start at http://${IPv4}:${port}`)
                cb && cb();
            });
            this.port = port;
            this.cb = cb;
        }
    }
}