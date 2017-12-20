# translateMds

[![explain](http://llever.com/explain.svg)](https://github.com/chinanf-boy/Source-Explain)

版本``2.5.6``

## 简述

为了快速翻译`md`文章, 构建了这个翻译工具.

[english](./README.en.zh)

## 为了做到这点， 有几个必要条件

- 一 ：翻译源API国内，我选择了[translate.js](https://github.com/Selection-Translator/translation.js)

- 二 ：提高md翻译的精准度。``「 翻译源可不管你是不是网址链接 」``，总会出现乱码，使用语法树，我选择[remark](https://github.com/Selection-Translator/translation.js)

- 三 ：符号问题。乱码情况，可不单单网址之类，中英文符号的替换，也是正确显示的关键。

- 第四点，：：这个项目版本没有完成的❌，当 ``一`` 翻译API 不给数据，似乎并不会报错，所以一直转圈圈。；P.

这里也是希望有人能 ``ISSUE 或 PULL `` 下下。

---

## 目录

- [翻译API](#翻译源)

- [remark-AST转换器](#remark)

- [符号](#符号)

- [什么都不要管冲冲冲-并发](#并发)

- [其他](#其他)

---
开始吧。

## 翻译源

一开始，构建这个项目的中心，当然是围绕``翻译 API``

因为使用了 ``async/await`` 的特性, 这个API还提供语音

[try_tjs.js](./try/try_tjs.js)

``` js
(async function(){
    const tjs = require('translation.js')
    
    let thisTranString = "hello world"
    let api = "baidu"
    let tranF = "en"
    let tranT = "zh"
    let result = await tjs.translate({
                          text: thisTranString,
                          api: api,
                          from: tranF,
                          to: tranT
                        })
    console.log(result.result)
}
)()
```

``result.result`` 是翻译结果 ``Array``类型，以 ``text`` 中 ``'\n'`` 换行符作为数组分隔的标准

示例
```
npm run try:tjs
```

> ⚠️，有几个点要注意。

- ``text`` 过长 时，它不一定，会给全结果，这个时候就需要比较长度

[./translate-js/src/setObjectKey.js#L53](./translate-js/src/setObjectKey.js#L53)

``` js
if(value.length > result.result.length){
// 递归异步翻译
}
```

- youdao 中文是 ``zh-CN``

[./translate-js/src/setObjectKey.js#L26](./translate-js/src/setObjectKey.js#L26)
``` js
    if(api == 'youdao' && tranT === 'zh'){
      tranT = tranT + '-CN'
    }
```

- 就因为，结果`result.result` 以 ``text`` 中 ``'\n'`` 分隔

确保没有``'\n'``，这个版本这个BUg, 还没有修复

``` js
      tranArray = tranArray.map(x=>{
        if(x.indexOf('\n')>=0){
          return x.replace(/[\n]/g,'')
        }
        return x
      })
      //, 去除每行中的 '\n'
      // 对于 md 的编译器转 HTML 来说，普遍 双换行符，才是换行。
      // 单换行忽视。
```

- ``tjs ``获取数据错误, 做错误处理, ❌

[./translate-js/src/setObjectKey.js#L78](./translate-js/src/setObjectKey.js#L78)
``` js
.catch(error => {
                      if(!error.code){
                        logger.error(api,chalk.red( error,'出现程序错误'))
                      }else{
                        logger.debug(api,chalk.red( error.code,'出现了啦，不给数据'))
                      }
                      return ""

                    })
```

> 当卡住，不给数据情况，上面的错误并没有触发，想不懂。

[<div style="text-align:right">⬆️目录，目录是谁，我怎么知道</div>](#目录)

## remark

remark 清晰的 AST 语法树，我选择

[语法树在线玩网站](http://astexplorer.net/#/Z1exs6BWMq)

``` md
# Hello
```

语法树过于详细，显得过长，简要就是一个对象

``` js
{
    "type": ***, //类型
    "children" : ***, //孩子 孩子有分不同的类型
    "position" : *** // 位置
}
```

[try/try_remark.js](try/try_remark.js)
``` js
var remark = require('remark');

var body = `# Hello`

var mdAst = remark.parse(body)

console.log('语法树 var mdAst = remark.parse(body) *****\n\n mdAst=',mdAst)

var reBody = remark.stringify(mdAst)

console.log('\n\n变回来 var reBody = remark.stringify(mdAst) ****\n\n reBody=',reBody)

```

``` bash
npm run try:remark
```

[<div style="text-align:right">⬆️目录，目录是谁，我怎么知道</div>](#目录)

---

## 符号

[fixEntoZh.js](./translate-js/src/fixEntoZh.js)

``` js
/**
 * @description 
 * @param {Array|String} data 
 * @returns {Array|String}
 */
const fixEntoZh = function fixEntoZh(data){
      if(!(data instanceof Array)){
        data = data.trim()
        return halfStr(data)
    }else{
        
        data = data.map(x =>{
            return halfStr(x)
        })

        return data
    }
}
```

当获得 ``data`` 后，类型分两种

- String

> 去两边空格，给 ``halfStr`` 完成下一步

- Array

> 遍历，然后每个都运行一边，结果返回替换原数组

### ``halfStr`` 函数

从名字上来看，半 字符串

其实是``二分法``，接受 ``String`` 类型

``` js
const halfStr = (str) =>{
    if (str.length <= 1 ) {
        if(reg.test(str) || reg2(str)){ // 是否有中文符号
            return charZh2En(str) // 有，修复
        }
        return str // 没有，直接返回
    }

    let qian = str.substring(0, str.length/2) // 上部分
    let hou = str.substring(str.length/2, str.length) // 下部分

    return halfStr(qian) + halfStr(hou) // 返回结果
}
```

### 验证 ``reg reg2``

``` js
// 验证 1
const reg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;

// 验证 2
const reg2 = (str) => {
    for(i in str){
        if( "～｀！＠＃＄＾％＆＊（）＿＋｜－＝｛｝［］：＂；＜＞？，．／＼＇".indexOf(str[i])>=0 ){
            return true
        }
    }
    return false
} 
```

### ``charZh2En``

这里我就分了两个等级，自定义转型，和普遍转型

``` js
const Store = {
    // 第一优先级
    '“': '"',
    "‘": "'",
    "：": ": ",
    "/ ": "/",
    "ℴ": "-",
    "”": '"',
    "。": ". "

}
function charZh2En(str) {
    var tmp = '';
    for (var i = 0; i < str.length; i++) {
        if( Object.keys(Store).some(x =>x==str[i])){ 
          // 可以自己修正
            // 第一优先级
            tmp += Store[str[i]]
        }else{
          // 下面符号数值的转换，适合大多数情况，但第一优先级就是给那些例外的
            // 第二优先级
            tmp += String.fromCharCode(str.charCodeAt(i) - 65248)
        }
    }
    return tmp // 结果
}
```

[<div style="text-align:right">⬆️目录，目录是谁，我怎么知道</div>](#目录)

---

## 并发

借用 [``Async`` <-- 网址]((https://github.com/caolan/async)) 的力量

只有命令行有并发，``export`` 没有

[./translate-js/index.js](./translate-js/index.js#L98)
``` js
const async = require('async')
async.mapLimit(getList, asyncNum, runTranslate,(err.result)=>{
  //do something
}
// getList 列表
// asyncNum 并发数
// runTranslate 异步函数 就是 开头定义 async function
// (err,result) 结果函数
```

另外你可以看看 [async 使用的例子](https://github.com/alsotang/async_demo)

[<div style="text-align:right">⬆️目录，目录是谁，我怎么知道</div>](#目录)

---

## 其他

### 命令行解析使用 [https://github.com/sindresorhus/meow](https://github.com/sindresorhus/meow)

[./try/try_meow.js](./try/try_meow.js)
``` js
const meow = require('meow');
// ...
console.log(cli.help) // 定义帮助
console.log(cli.input[0], cli.flags);
// input[0] == hello
(node try_meow.js hello -p true)
·
// flags[p] == true or flags[p] == hello
(node try_meow.js -p) or -p hello
```

### 配置文件

[./translate-js/config/] 配置文档

使用了一个默认的 ``配置json``

[./translate-js/config/defaultConfig.json](./translate-js/config/defaultConfig.json)

一般来说，从 ``export 函数参数`` 或 ``命令行参数`` 获取 用户使用参数

这个时候就要比较，这件事我觉得可以这样做·

``` js
function setDefault(option, callback, args){
    return callback(option, args)
}

// 获取默认配置
let args = require('defaultConfig.json')

function fromTodo(tranFrom, args){
if(tranFrom){
  args.from = tranFrom // 替换
} 
return args.from // 返回

// 命令行参数为例子 , f from 从什么语言
const tranfrom = setDefault(cli.flag['f'],fromTodo, args)

// 这个时候 tranfrom 就是 正确的值

```

特别要注意的⚠️

``第一点``，就是更换了默认 ``defaultConfig.json`` 

应该做好一个运行``配置文档``来``给予``其他需要配置的``代码文件使用``。

writeJson.js
``` js
const fs = require('mz/fs') // 异步的文件操作库
module.exports = async function writeJson(jsonFile, jsonObj) {
    await fs.writeFile(jsonFile, JSON.stringify(jsonObj, null, 2))
}
```

[./translate-js/index.js#L74](./translate-js/index.js#L74)
``` js
const configJson = __dirname+'/' //path/to/you/want
await writeJson(configJson, defaultConfig) // 用 defaultConfig 写入 config.json
```

``第二点``, 所以那些需要配置参数的 ``文件`` 需要在

``await writeJson(configJson, defaultConfig)``

这行之后，``require()`` 使用