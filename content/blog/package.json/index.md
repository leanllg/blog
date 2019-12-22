---
title: package.json cook-book
date: 2019-12-22
---

> 建一个 package.json 的索引供查看，下面以 npm 为例子，实际上 yarn 也是通用的

[TOC]

## name

name 作为 npm 包的名字，不能有大写字母，个人建议命名采用字母数字和`_ ` `-`，也可以有一个 scope 作为前缀，比如`@myorg/mypackage`

## version

npm 包的版本号，遵循 [semver](https://semver.org/) 规范，也可以看 [semver 语义扫盲](https://juejin.im/post/5ad413ba6fb9a028b5485866)。

另：npm 在发布的时候还可以添加tag，比如`npm publish --tag beta`，然后在安装的时候只需要`npm install xx@beta` 即可。

## description

项目描述，使用`npm search` 或在npm 官网搜索结果会展示

## keywords

关键字，使用`npm search` 或在npm 官网搜索结果会展示

## homepage

项目首页

## bugs

提 issue 的地址

## license

如果不想其他人用的话就设置为`UNLICENSED`，[常用 liscence 列表](https://spdx.org/licenses/)

## author contributers

author设置一个人，contributers 设置为一群人，格式为

```json
{ "name" : "Barney Rubble"
, "email" : "b@rubble.com"
, "url" : "http://barnyrubble.tumblr.com/"
}
```

另外如果在包的根路径上有 AUTHORS 文件，会以`Name <email> (url)` 格式解析为 contributers

## files

作为依赖时要包含哪些文件，也可以使用`.npmignore`忽略文件，根目录下的`.npmignore`不会覆盖files，子目录下的会（尚未亲自验证）。没有`.npmignore`的话默认会使用`.gitignore`

肯定会包括的文件

- `package.json`
- `README`
- `CHANGES` / `CHANGELOG` / `HISTORY`
- `LICENSE` / `LICENCE`
- `NOTICE`
- The file in the “main” field

## main

在`require('foo')`时，返回的导出对象的文件位置

## bin

将命令添加到PATH里面，这样就能直接执行命令，bin 文件要以`#!/usr/bin/env node` 开头，bin的格式

```json
{
  "bin": "bin.js", // 命令将直接以 project name 命名
  "bin": {
    "command-name": "bin/command-name.js",
    "other-command": "bin/other-command"
  }
}
```

另外在 win 下写的命令有坑，TODO: 之后写坑

## man

使用 man 命令时展示的文件

```json
{
  "man": "./man/doc.1",
  "man": ["./man/doc.1", "./man/doc.2"]
}
```

## directories

commonjs 风格的使用目录结构指示文件结构，没啥用

## repository

代码地址

## scripts

可以自定义需要运行的脚本命令，也默认支持一些 npm 生命周期钩子，详情见[npm-scripts](https://docs.npmjs.com/misc/scripts) 几个常用的如下

- prepare: 会在 `npm pulish` `npm install ` 之前触发，原来的`prepublish` 功能一样，但是将会废弃，详情见[prepublish issue](https://github.com/npm/npm/issues/10074)
- prepublishOnly: 只会在`npm publish`之前触发
- publish, postPublish: 会在`npm publish`之后触发

另外任意的自定义命令可以加上 pre 与 post，指定这个命令执行之前做什么，之后做什么

```json
{
  "scripts": {
    "foo": "echo foo",
    "prefoo": "echo prefoo",
    "postfoo": "echo postfoo"
  }
}
```

## config

在使用 yarn 或者 npm 运行时可以通过 `process.env.npm_package_` 访问到 package.json 里面的字段，通过 `process.env.npm_config_` 访问到 config 设置，通过`process.env.npm_package_config`访问到 config 对象，config 对象设置例子：

```json
{
  "config" : { "port" : "8080" }
}
```

## dependencies

要安装的依赖，依赖的版本遵循 semver 规范，如果是要发布的包的话，其他人安装你的包的时候也会安装 dependencies 里面的包，所以把那些测试，编译等开发时候才用到的依赖放到 devDependencies 里面。

在添加依赖的时候，如果没有指定特定的版本号的话，会默认安装最新的，而且依赖版本表示为`^1.1.9`这种类型。几种依赖表示方法如下:

`^1.0.1` 等价于1.x

`1.0.1` 则是表示精确的版本号

`~1.0.1`等价于`1.0.x`

在 npm install 的时候总是会安装依赖版本范围内最新的版本。

另外如果本地写了一个包，想在本地其他地方引用的话，可以使用 `npm install file:../path/test` 来安装本地包，或者直接写在 package.json 里面在 npm install。还有一种情况就是如果已经安装了包，但是本地进行了修改然后想进行测试的话，这种情况下可以使用 `npm link` ，操作示例如下

```bash
// test1: 要引用的包 test2: require("test1")
// 在 test1 下使用，可以将当前的包以及 bin 命令添加到全局
npm link
// 在 test2 根目录下使用, 会与全局的 node_modules 的 test1链接文件建立链接
npm link test1
// 注销全局的链接，需要在 test1 根目录下使用
npm unlink
// test2 不再链接 test1，在 test2 根目录下使用
npm unlink test1
```

另外也可以直接 `npm link /path/to/test1`，但要想注销全局的链接还是得到test1 根目录下 unlink。



## devDependencies

开发中使用的依赖

## peerDependencies

用来表示包在哪种宿主环境下使用，比如一个在 react 16.x 中使用的包可以这么表示依赖

```json
{
  "peerDependencies": {
    "react": "16.x"
  }
}
```

## engines

可以用来制定 node 版本，npm 版本`{ "engines" : { "node" : ">=0.10.3 <0.12" } }`

## private

为 true 的时候，`npm publish`不能执行

## publishConfig

在 `npm publish` 的时候用来指定 “tag”, “registry” and “access”  的配置

## 特殊的配置

