# proxy-server
====

> nodejs开发的proxy服务，用于本地启动静态web服务

```
  Usage: pss [command]

  命令:

    init      初始化proxy配置
    config    修改proxy配置
    start     启动本地web服务

  Options:

    -v, --version  显示版本号  
    -h, --help     显示帮助信息

```

## 安装

```bash
npm i -g pss 

如果没安装可以直接git clone 仓库
npm link 完就可以使用 pss 命令
```

## 使用

进入项目目录

```bash
pss init
修改 proxy.json 配置
pss start
```

## proxy.json 说明

```bash
{
	"name": "proxy-static-server", // 名称
	"port": 3000, // 端口号
	"staticDir": "./static", // 静态资源根目录
	"index": "index", // 首页 模板（html）的名称
	"ext": "html", //首页 模板（html） 后缀名
	"templateDir": "./static", //  模板（html）目录位置
	"proxyTable": { // 和 http-proxy-middleware 的配置一致
		"/api": {
			"target": "http://127.0.0.1:8080",
			"changeOrigin": true,
			"pathRewrite": {
				"^/api": "/api"
			}
		},
	}
}

```