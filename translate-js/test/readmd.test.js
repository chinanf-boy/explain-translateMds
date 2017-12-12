const { test } = require('ava')

const {Listmd, unique5} = require('../src/readmd.js')


test("read zh md folder", async t =>{
    const len = await Listmd(__dirname+"/../md/").then(x => x)
    
    t.is(len.length, 10)
})

test("read md no / folder", async t =>{
    const len = await Listmd(__dirname+"/../md").then(x => x)
    t.is(len.length, 10)
})

test("read no absolute dir", async t =>{
    const E = await Listmd("/../md").then(x => x).catch(x =>x)
    t.true(E instanceof Error)
})

test.serial.before("read md file", async t =>{
    const len = await Listmd(__dirname+"/testWrite.md").then(x => x)


    t.is(len.length, 1)


})

// test.serial.before("read md no /", async t =>{
 
//     const len2 = await Listmd(__dirname+"/../md").then(x => x)
//     t.is(len2.length, 5)
// })

test("read md no Dir ",async t =>{
    
    const error = await Listmd("/../md/").catch(x => x)
	
    t.true(error instanceof Error)
})

test(" array 去掉重复", t =>{
    var a = [1,2,3,4,5,6]
    var b = ['a','b','c','d']

    const new_b = unique5(Array.from(b+b))
    const new_a = unique5(Array.from(a+a))

    t.is(new_a.length,['1','2','3','4','5','6',','].length)
    t.is(new_b.length,["a","b","d","c",","].length)
    
})