// Copyright (c) 2017 lizhenyong
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
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