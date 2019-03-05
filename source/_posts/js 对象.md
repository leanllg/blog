---
title: 深入了解 JS 对象
date: 2019-03-01
tags: Javascript
categories: 前端
---

​	Js 的数据类型分为两种，一种是基本类型：Undefined, Null, Boolean, Number, String, Symbol。另一种则是引用类型：Object。

​	对象有很多种类，函数也是对象，对象都会有一个 `__proto__`  属性获得对象的原型对象（在ES6标准中有提及，浏览器必须实现，其他环境不要求，不建议直接使用），还会有一个`constructor` 属性指向对象的构造函数。函数在创建的时候一般都会有`prototype` 属性（使用 bind 创建的函数无, 箭头函数也无）对于这几个属性，举几个例子：

```javascript
// 实际使用推荐使用Object.getPrototypeOf()来获得原型对象.
// 使用Object.create()或Object.setPrototypeOf()来设置原型对象
Object.__proto__ === Function.prototype // true
// 注意 Symbol 为构造函数
Symbol.__proto__ === Function.prototype // true
Function.prototype.constructor === Function // true
Object.prototype.__proto__ === null // true

function Person(name) {
  this.name = name
}
let llg = new Person('llg')

llg.constructor === Person // true
llg.__proto__ === Person.prototype //true
Person.__proto__ === Function.prototype // true
```

从以上几个例子，我们可以知道函数 prototype 是用来确定实例对象 `__proto__` 属性指向的，在构造函数生成实例对象的过程中需要用到 new 操作符，new 操作符其实是一个语法糖。实际实现代码

```javascript
function _new (constructor, ...params) {
  // 以下两行可以简化为 const object = Object.create(constructor.prototype)
  const object = {}
  object.__proto__ = constructor.prototype
  
  const reObject = constructor.apply(object, params)
  return (typeof reObject === 'object' && reObject !== null) ? reObject : object
}
```

原型对象，简单的说就是用来共享属性方法的，我们可以借助原型来实现继承。首先是原型式继承，在 ES5 中实现为 `Object.create` 方法

```javascript
function create(object, properties) {
  function F(){}
  F.prototype = object
  const newObj = new F()
  
  if (typeof properties === 'object') {
    Object.defineProperties(newObj, properties)
  }
  
  return newObj
}

const llg = create({sayName() {console.log(this.name)}}, {name: {value: 'llg'}})
llg.sayName() // llg
```

就继承而言，一般通用的是寄生组合式继承，主要实现如下：

```javascript
function inherit(subType, superType) {
  let prototype = Object.create(superType.prototype)
  prototype.constructor = subType
  subType.prototype = prototype
  
  Object.setPrototypeOf
    ? Object.setPrototypeOf(subType, superType)
    : subType.__proto__ === superType
}

function Pet(name) {this.name = name}
Pet.prototype.getName = function() {
  console.log(this.name)
}

function Dog(name, type) {
  Pet.call(this, name)
  this.type = type
}

inherit(Dog, Pet)
Dog.prototype.getType = function() {
  console.log(this.type)
}

const xh = new Dog('XiaoHuang', 'husky')
xh.getName() // XiaoHuang
xh.getType() // husky
xh.hasOwnProperty('getName') // false
```

到了 ES6 有了 `class` 关键字后，继承之类的也就变得更加的直观了，定义构造函数简洁明了，而且可以将 getter, setter 与静态函数封装在一起。

```javascript
// ES6
class Person {
  // 相当于构造函数
  constructor(name, age) {
    this.name = name
    this._age = age
  }
  
  //定义在 Person 上的方法
  static sayHello() {
    console.log('Hello World')
  }
  
  // 以下方法相当于定义 Peron.prototype 上的方法
  get age() {
    return this._age
  }
  
  set age(age) {
    this._age = age
  }
  
  getName() {
    return this.name
  }
}

class Chinese extends Person {
  constructor(name, age, province) {
    // 相当于 Person.call(this, name, age)
    super(name, age)
    this.province = province
  }
  
  static sayHello() {
    super.sayHello()
  }
}

const llg = new Chinese('llg', 21, 'WuHan')
llg.getName()
Chinese.sayHello()

// 模块模式定义私有属性与静态属性
(function(window) {
  // 私有属性
  const friends = []
  
  window.Person = class {
    constructor(name) {
      this.name = name
    }
    
    addFriends(...name) {
      friends.push(...name)
    }
    
    friendsCount() {
      return friends.length
    }
  }
  
  window.Person.sayHello = function() {
    console.log('Hello World!')
  }
})(window)

Person.sayHello() // Hello World!
const llg = new Person('llg')
llg.addFriends('l', 'l', 'g')
llg.friendsCount() // 3
```

在 ES6 的中使用 class 定义静态属性与私有属性的方法仍然与 ES5中一样 ，当然在之后的 ES 版本中将会给 class 加入私有属性与静态属性让 class 变得更为强大。ES6 的类声明虽然是 ES5 的构造函数形式的一个语法糖，但是它们之间存在着很多的差异：

- 类声明默认在严格模式下，不能被提升
- 类声明中定义的所有方法都是**不可枚举**的，在 ES5 中需通过 Object.defineProperty() 指定不可枚举
- 类内部有名为`[[construct]]` 的内部方法，通过 new 调用不含 `[[construct]]` 的方法都会报错
- 类的构造函数只能通过 new 调用，否则报错
- 类内部不能修改类名

在 ES6 中继承使用关键字 extends , 静态成员也可以被继承，extends后面可以接任意的表达式，而且还可以继承内建对象。

```javascript
// 继承内建对象 ES5 无法完成，如下代码 Babel 转义后运行会出错
class MyArr extends Array {
  unique() {
    return [...new Set(this)]
  }
}
const arr = new MyArr(1, 1, 3)
arr.length // 3
arr.unique() // [1, 3]
```

在 ES6 中可以使用 new.target 属性判断调用的构造函数的种类, 使用 new.target 可以实现抽象基类

```javascript
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('不能实例化')
    }
  }
}

class Rectangle extends Shape {
  constructor(width, length) {
    // 必须有super， 且要出现在 this 前面
    super()
    this.width = width
    this.length = length
  }
}
```

