# 目錄

- [目錄](#目錄)
  - [型別守衛(type guard)是什麼](#型別守衛type-guard是什麼)
  - [型別預測](#型別預測)
  - [泛型與型別預測](#泛型與型別預測)
  - [參考資料](#參考資料)

## 型別守衛(type guard)是什麼

`型別守衛`是TypeScript中的一種`技巧`，用於`compile time區分變數的型別`，以避免在runtime時出錯

像是常見的typeof、in、instanceof都算是簡單的型別守衛

```js
const foo = (data) => {
    if('name' in data){
        return `Hello, ${data.name}`;
    }else{
        return data;
    }
}
```

型別守衛中還有另一種叫做型別預測(type predicate)


## 型別預測

`型別預測`是TypeScript 中的一種`技巧`，用於在`runtime區分變數的型別`

具體的做法是`定義一個函式`，這個函式會返回一個布林值，表示這個變數是否符合指定的型別

但是需要注意的是雖然說最後返回的是布林值，但`回傳值的型別`定義絕對不是boolean，而是`要使用`Typescript的`is`進行標記

```js
enum Fruit {
  Apple = 'Apple',
  Banana = 'Banana'
}

// good
const isFruitKey = (f:string):f is keyof typeof Fruit => {
  return f in Fruit;
}

// bad
// 這樣的話即使回傳true，型別也不會被判斷為Fruit內的key
const isFruitKey2 = (f:string):boolean => {
  return f in Fruit;
}
```

用起來會像這樣
![](https://static.coderbridge.com/img/tempura327/92d11b530ec24f06b97c6cba36f33fe6.png)

## 泛型與型別預測

上段的例子只能判斷某個字串是否是enum Fruit的key

但如果要讓`型別預測`的函示`更泛用`就會需要`配合泛型`使用

```js
// 因為這個方法會用在物件上，所以用extends object限縮T的型別為物件
const isKeyOfEnum = <T extends object>(enumObject: T) => {
    // 因為value是string，所以用Extract限縮value的型別為T的key中是string的那幾個
    return (value: string): value is Extract<keyof T, string> => {
        return value in enumObject;
    }
}
  

console.log(isKeyOfEnum(Fruit)('Apple')); // true
console.log(isKeyOfEnum(Fruit)('peach')); // false
```

判斷某個字串是不是某個enum的value則如下

```js
// 使用Record<string, unknown>而不是object來限縮型別，
// 因為object的話TS會斷言其key可能為string | number | symbol，
// 但是keys為string[]，所以一定要限縮T為key為string的物件
const isElementOfEnum = <T extends Record<string, unknown>>(enumObject: T) => {
  return (value: unknown):value is T[keyof T] => {
    const keys = Object.keys(enumObject);

    for(let i = 0; i < keys.length - 1; i++){
      if(enumObject[keys[i]] === value){
        return true;
      }
    }

    return false;
  }
};

console.log(isElementOfEnum(Fruit)('apple')); // true
console.log(isElementOfEnum(Fruit)('peach')); // false
```

## 參考資料

[What are Type Predicates in Typescript?](https://dev.to/matiasfha/what-are-type-predicates-in-typescript-2232)
[type guard function doesn't work. type still be judged as string](https://stackoverflow.com/questions/76070868/type-guard-function-doesnt-work-type-still-be-judged-as-string)