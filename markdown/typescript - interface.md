# 目錄

- [目錄](#目錄)
  - [interface是甚麼](#interface是甚麼)
  - [定義一般型別](#定義一般型別)
    - [實作interface](#實作interface)
  - [定義function型別](#定義function型別)
  - [定義物件\&陣列型別](#定義物件陣列型別)
  - [延伸interface](#延伸interface)
  - [interface 與 type的差異](#interface-與-type的差異)
    - [比較表](#比較表)
  - [參考資料](#參考資料)

<br/>

## interface是甚麼

interface是介面，它可以用來`定義`物件型別，常以I作為開頭(但實務上以React前端開發來說比較常是...Props)

它關注的重點在於`該型別的物件能做什麼`(duck typing)

具體來說有以下幾個常見用法

1. 定義class具有的屬性、方法
2. 定義function的物件型別參數、React function component的props具有的屬性
3. 定義function的參數及回傳值的型別

```js
export interface RoutesProps {
  children?: React.ReactNode;
  location?: Partial<Location> | string;
}

export function Routes({
  children,
  location,
}: RoutesProps): React.ReactElement | null {
  // 省略
}
```
[react-router - component.tsx](https://github.com/remix-run/react-router/blob/b67538b1172c3dcf07a2e431bbe7c2eb32b06eaf/packages/react-router/lib/components.tsx#L272)

```js
export interface NavigateFunction {
  (to: To, options?: NavigateOptions): void;
  (delta: number): void;
}
export function useNavigate(): NavigateFunction {
  // 省略
  
  let navigate: NavigateFunction = React.useCallback(
    (to: To | number, options: NavigateOptions = {}) => {
      // 省略
    },
    [basename, navigator, routePathnamesJson, locationPathname]
  );

  return navigate;
}
```

[react-router - hooks.tsx](https://github.com/remix-run/react-router/blob/8e09bd601bd7f3066ff598ddd8e23b9b7cc462b3/packages/react-router/lib/hooks.tsx)

<br/>

## 定義一般型別

```js
interface IClock {
  currentTime: Date,
  alarmTime: string,
  alarm: () => string | void,
  setTime: (time: Date) => void,
  setAlarmTime: (time: string) => void,
}
```

最普通的用法是定義一個物件

```js
const clock = {
  currentTime: new Date(),
  alarmTime: '13:00',
  alarm: () => {
    if(`${clock.currentTime.getHours()}:${clock.currentTime.getMinutes()}` !== clock.alarmTime) return;

    return 'beep beep beep';
  },
  setTime: (time:Date) => {
    clock.currentTime = time;
  },
  setAlarmTime: (time:string) => {
    clock.alarmTime = time;
  },
}
```

<br/>

### 實作interface

同一個interface也能定義class具有的屬性、方法

當用到class時需要`用`到`implements`來讓class`實作interface`

```js
class Clock implements IClock{
  currentTime: Date;
  alarmTime:string;

  constructor(time:Date){
    this.currentTime = time;
    this.alarmTime = '';
  }

  alarm(){
    if(`${this.currentTime.getHours()}:${this.currentTime.getMinutes()}` !== this.alarmTime) return;

    return 'beep beep beep';
  }

  setTime(time: Date){
    this.currentTime = time;
  }

  setAlarmTime(time: string){
    this.alarmTime = time;
  }
}
```

<br/>

## 定義function型別

```js
enum ComponentName {
  FadeCarousel,
  SimpleCard,
  SearchBar,
  InputGroup
}

interface CaseProcessor{
  (str: string): string;
}

const snakeCaseConvertor:CaseProcessor = (str) => {
  return str.replace(/[A-Z]/g, (d, i) => {
    return i < 1? `${d.toLocaleLowerCase()}` : `_${d.toLocaleLowerCase()}`;
  });
}

const res = snakeCaseConvertor('SimpleCard');
```

和泛型一起用

```js
interface CaseProcessor<T, K = T>{
  (str: keyof T): K
}

const snakeCaseConvertor:CaseProcessor<typeof ComponentName, Lowercase<keyof typeof ComponentName>> = (str) => {
  return str.replace(/_[a-z]+/g, (d, i) => {
    return i < 1? `${d.toLocaleLowerCase()}` : `_${d.toLocaleLowerCase()}`;
  }) as Lowercase<keyof typeof ComponentName>;
}

const res = snakeCaseConvertor('SimpleCard');
```

不過眼尖的人可能會發現這邊用Lowercase並不恰當

確實，不過要解決這個問題需要用到infer，之後再開一篇來寫infer吧

<br/>

## 定義物件&陣列型別

兩者非常相似，故只用物件當範例

`key(或index)必須string(或number)其中一種`，不能為其他型別、number|string

```js
// 定義物件key必須是string
// 定義陣列則index必須是number
interface IStringList {
    [key:string]: string
}

const strArr: IStringList = {
    Apple: 'apple',
    Tomato: 'tomato'
};
```

有時可能會需要限縮key的範圍

```js
enum Fruit {
    Apple = 'apple',
    Banana = 'banana',
    Tomato = 'tomato'
}

interface IStringList {
    [index: keyof typeof Fruit]: string
}
```

但這會報錯"An index signature parameter type cannot be a literal type or generic type"


因此需要`限縮key的範圍`時，可以`改用Record`

```js
const strArr: Partial<Record<keyof typeof Fruit, string>>  = {
    Apple: 'apple',
    Tomato: 'tomato'
};
```

<br/>

## 延伸interface

interface可以`延伸其他interface`，且一次可延伸多個

透過這種方式可以減少重複的部分，`以增進彈性和複用性`

```js
interface TropicalFruitDemand {
    banana:number;
    papaya:number;
    mango:number;  
}

interface TemperatFruitDemand {
    apple:number;
    cherry:number;
    peach:number;
}

interface FruitDemand extends TemperatFruitDemand, TropicalFruitDemand {}

const fruitINeed:FruitDemand = {
    apple:1,
    cherry:15,
    peach:2,
    banana:3,
    papaya:1,
    mango:6,  
};
```

<br/>

## interface 與 type的差異

- 使用時機
  資料會被`重複使用`時用`interface`
  定義`靜態格式資料`時用`type`

- 創建新名稱
  ![](https://static.coderbridge.com/img/tempura327/69dad9b4e7c9467996f52fb84196b11f.png)

  interface會
  type不會

- 多個相同名稱
  ![](https://static.coderbridge.com/img/tempura327/b0b37c26a40f48e4abbe4fd9d7de666b.png)

  interface可以，而且會自動合併
  type不行

- 定義列舉、元組和複合型別
  `interface只能定義物件型別`，故上列的型別皆無法表現
  type都可以

- 延伸
  ![](https://static.coderbridge.com/img/tempura327/d93b02b6e63b462caf9e6fe0c4471e4f.png)

  interface可以延伸另一個interface或type
  `type每次都是宣告一個新的型別`

<br/>

### 比較表

||interface|type|
|---|---|---|
|使用時機|靜態格式資料|重複使用|
|創建新名稱|〇|✖|
|多個相同名稱|〇|✖|
|定義列舉、元組和複合型別|✖|〇|
|延伸(extends)|〇|✖|

<br/>

## 參考資料

[TypeScript - Interfaces](https://www.tutorialsteacher.com/typescript/typescript-interface)
[【Day 19】TypeScript 介面(Interface) v.s. 型別別名(Type Alias)](https://ithelp.ithome.com.tw/articles/10224646?sc=rss.iron)
[Day 16. 機動藍圖・介面與型別 X 混用與比較 - TypeScript Interface V.S. Type](https://ithelp.ithome.com.tw/articles/10216626)