// Copyright (c) 2017 lizhenyong
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

var remark = require('remark');

var body = `# Hello`

var mdAst = remark.parse(body)

console.log('语法树 var mdAst = remark.parse(body) *****\n\n mdAst=',mdAst)

var reBody = remark.stringify(mdAst)

console.log('\n\n变回来 var reBody = remark.stringify(mdAst) ****\n\n reBody=',reBody)





