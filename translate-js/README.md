# translate .md to *.md 

like
```
.md to .zh.md
```

[![Build Status](https://travis-ci.org/chinanf-boy/translate-js.svg?branch=master)](https://travis-ci.org/chinanf-boy/translate-js)
[![codecov](https://codecov.io/gh/chinanf-boy/translate-js/branch/master/graph/badge.svg)](https://codecov.io/gh/chinanf-boy/translate-js)
[![GitHub license](https://img.shields.io/github/license/chinanf-boy/translate-js.svg)](https://github.com/chinanf-boy/translate-js/blob/master/License)
[![NPM](https://nodei.co/npm/translate-mds.png)](https://nodei.co/npm/translate-mds/)

## 这个项目是 hugo 官方文档 

``` js
npm install -g translate-mds
```

``` js
// all folder
translateMds md/

//or single file

translateMds test.md
```
cli
``` js
Usage
  $ translateMds [folder name] [options]

Example
  $ translateMds md/ 
  
  [options]
  -a   API      : default < baidu > {google,baidu,youdao}

  -f   from     : default < en >

  -t   to       : default < zh >

  -N   num      : default < 5 > {async number}

  -D   debug    : default < false >
  
  -R   rewrite  : default < false > {yes/no retranslate and rewrite translate file}

```
---

## 项目引用

``` js
const translate = require('translate-mds')
//
let results = await translate([__dirname+'/testWrite1.md'])
//or
let results = await translate([__dirname+'/md/'])
// results is Array


```

## translate(options,debug)

## options 当用 []

[ aFile,api,tF,tT ] = options
## options 当 用 {}

- aFile 

> absolute file

- api

>``default : baidu``

>{'google','baidu','youdao'}

- tF

>``default : en``

- tT

>``default : zh``

- debug

> ``default : verbose``
# 下面的Demo 你 应该 

下载这个项目

```
git clone https://github.com/chinanf-boy/translate-js.git
```

## Demo

[![asciicast](https://asciinema.org/a/aPDJ0Vdt3awZs8NJV8DtYH0ww.png)](https://asciinema.org/a/aPDJ0Vdt3awZs8NJV8DtYH0ww)

# Video sometime very quick

- So the cmd Step is 

``` js
node index.js md/
```

> Done !! Or

[查看我 you dont know js 翻译](https://github.com/chinanf-boy/You-Dont-Know-JS)

所有的 ``.zh.md`` 都是通过 下面命令

```
tanslateMds <folder>
```


> ⏰ tips 有时会抽风，正在查找 会卡住 Issue

>你只要再运行。！！！

# 抱歉 ,我能力不足，node 并发问题在于，我也不知道问题在哪里。

# 问题：忽然间就没有网络流量的速度一样，不知道这是不是，禁止IP ？？？？

# 当 并数是 ``1`` 的时候，很凑巧的，You-dont-know-js 68个md文件，能成功几次，但是当并发数超 1，特别是临近结束的那几个文件，等待就一直在转，这时网络速度变0，这时就需要 ctrl + c ,终止了！
# [ X ] 提高http之类的md格式准确率
# [ X ] 自动换 翻译源

# [ x ] 启用 md AST

使用 [``remark``](https://github.com/wooorm/remark) 提高精准度

使用 [``translate.js``](https://github.com/Selection-Translator/translation.js) 完成 与翻译网站的交互

还有个 [异步Promise 递归的 例子](https://github.com/chinanf-boy/translate-js/blob/master/src/setObjectKey.js#L78)
