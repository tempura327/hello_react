# 目錄

- [目錄](#目錄)
  - [Higher Order Function](#higher-order-function)
  - [Higher Order Component](#higher-order-component)
    - [注意點](#注意點)
  - [參考資料](#參考資料)

## Higher Order Function

Higher Order Function(HOF)是一種`把共同的地方抽出來`，以達到`抽象化的函式`

因此它有`減少重複程式碼`、`易於組合、重複使用`、`易於debug`的優點

HOF分為2種

1. 接收函式做為參數

  .map()、.filter()、.reduce()就是這類

  ```js
  function repeat(n, action){
    for(let i = 0; i < n; i++){
      action(i);
    }
  }

  repeat(3, (i) => {
    console.log(i);
  });

  repeat(10, (i) => {
    console.log(i);

    if(i !== 0 && i % 3 === 0){
      console.log(`${i} is multiple of 3`);
    }
  });  
  ```  

2. 回傳函式
  currying、partial function就是這類

  ```js
  // currying function
  function add(num1){
    return (num2) => {
      return num1 + num2;
    }
  }

  const add2 = add(2);
  const add5 = add(5);

  add2(10); // 12
  add5(10); // 15
  ```

  ```js
  function getPosition() {
    return new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(res, rej);
    });
  }

  // partial function
  function getWeather(key, unit){
    return async (latitude, longitude) => {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?units=${unit}&lat=${latitude}&lon=${longitude}&appid=${key}`)
                .then((d) => d.json());
            
      return res.list;
    }
  }

  const getCelsiusData = getWeather('your key', 'metric');
  const getFahrenheitData = getWeather('your key', 'imperial');
  const {latitude, longitude} = (await getPosition()).coords;

  const celsiusData = await getCelsiusData(latitude, longitude);
  const fahrenheitData = await getFahrenheitData(latitude, longitude);
  ```

## Higher Order Component

Higher Order Component(HOC)常見於React的第三方package

其概念和HOF一樣，都是`抽象化的函式`，同時它也是pure function

HOC有2種方式，function、function component，但都接收組件回傳組件

假設這是的base component

```js
function SimpleButton(props){
  return (
    <button className={`border-solid border-2 p-2 ${props.className}`}>SimpleButton</button>;
  )
}
```

1. function component接收組件，回傳組件

```js
function addColorButton(WrapComponent, type){
  return (props) => <WrapComponent className={type} {...props} />;
}

```

2. function接收組件，回傳組件

```js

```

### 注意點

1. 使用composition，而不是改動原來的組件
2. 不要在render()內使用HOC
3. Refs無法被當作props傳遞

## 參考資料

[Higher-order function](https://ithelp.ithome.com.tw/articles/10235555)  

[React - Higher-Order Components](https://reactjs.org/docs/higher-order-components.html)
[HOF 的好友 HOC](https://ithelp.ithome.com.tw/articles/10236112)
[Higher order component](https://ithelp.ithome.com.tw/articles/10245544)