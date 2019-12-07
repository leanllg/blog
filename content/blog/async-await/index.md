---
title: Async and await（前言）
date: '2019-12-07'
---

Async 与 await 使用起来很是方便，然而其与 Promise, setTimeout 联合使用时，要搞懂运行的顺序却不是那么的容易。先举两个例子。（注：resolve 并不是代表已经 fullfilled，理解这点很重要）

```javascript
console.log('start')

function t1() {
  console.log('t1 start')

  setTimeout(() => {
    console.log('setTimeout in t1')
  }, 0)

  return Promise.resolve('t1 end')
}

function t2() {
  console.log('t2 start')

  return Promise.resolve('t2 end')
}

async function asy1() {
  console.log('async start')
  const rt1 = await t1()
  console.log(rt1)
  const rt2 = await t2()
  console.log(rt2)
}

asy1()

const p1 = new Promise(resolve => {
  console.log('p1 start')

  resolve('p1 then')
})

p1.then(val => {
  console.log(val)
})

setTimeout(() => {
  console.log('setTimeout')

  Promise.resolve('promise in setTimeout').then(val => {
    console.log(val)
  })
}, 0)

console.log('end')
```

运行结果如下图所示：

<img src="./1.png" align="left">

上面的代码可能一开始看上去就会看上去感觉很晕的样子，但这段代码也就只是涉及到了事件循环，宏任务队列与微任务队列的知识而已，我们要注意以下几点:

​ 1. await 到底有什么作用呢? 具体的大家可以去阅读 [官方文档第二段](https://tc39.github.io/ecmascript-asyncawait/#abstract-ops)， 简而言之，执行到 await 时会继续执行其后面的代码， 然后切换执行上下文，执行 async 函数后的代码。然后根据返回值，如果是 promise 的话，加入微任务队列等待 fullfilled 或 rejected 并取得返回值，否则继续执行后续代码

2. node 的运行结果与浏览器是不同的，故会有所出入
