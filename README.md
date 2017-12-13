# translateMds


[![explain](./minilogo.svg)](https://github.com/chinanf-boy/Source-Explain)

版本`` 2.5.6``

## 简述

为了快速翻译``md``文章, 构建了这个翻译工具。

[english](./README.en.zh)

## 为了做到这点， 有几个必要条件

- 一 翻译源API国内，我选择了[translate.js](https://github.com/Selection-Translator/translation.js)

- 二 提高md翻译的精准度。``「 翻译源可不管你是不是网址链接 」``，总会出现乱码，使用语法树，我选择[remark](https://github.com/Selection-Translator/translation.js)

- 三 符号问题。乱码情况，可不单单网址之类，中英文符号的替换，也是正确显示的关键。

- 第四点，这个项目版本没有完成的❌，当 ``一`` 翻译API 不给数据，似乎并不会报错，所以一直转圈圈。；P.
这里也是希望有人能 `` ISSUE 或 PULL `` 下下。

---

## 目录

- [翻译API](#翻译API)

- [remark](#remark)

- [符号](#符号)

- [什么都不要管冲冲冲-并发](#并发)

---
开始吧。

## 翻译API

一开始，构建这个项目的中心，当然是围绕``翻译API``

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
// 递归异步翻译
}
```

- youdao 中文是 ``zh-CN``

[./translate-js/src/setObjectKey.js#L26](./translate-js/src/setObjectKey.js#L26)
``` js
    if(api == 'youdao' && tranT === 'zh'){
      tranT = tranT + '-CN'
    }
```

- 就因为，结果``result.result`` 以 ``text`` 中 ``'\n'`` 分隔

确保没有``'\n'``，这个版本这个BUg, 还没有修复

``` js
      tranArray = tranArray.map(x=>{
        if(x.indexOf('\n')>=0){
          return x.replace(/[\n]/g,'')
        }
        return x
      })
      //, 去除每行中的 '\n'
      // 对于 md 的编译器转 HTML 来说，普遍 双换行符，才是换行。
      // 单换行忽视。
```

- ``tjs ``获取数据错误，做错误处理,❌

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

> 当卡住，不给数据情况，上面的错误并没有触发，想不懂。

## remark

[<div style="text-align:right">⬆️</div>](#目录)

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

## 符号