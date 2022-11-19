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

HOC有2種方式，function、function component，但都接收組件(wrapped component)回傳組件(enhanced component)

假設這是的base component

```js
function SimpleButton(props){
  const newProps = {...props, className:`${props.className || ''} p-2`};

  return <button {...newProps}>{props.children}</button>
}
```

這是HOC

```js
// function component接收組件，回傳組件
function WithColorButton(WrapComponent){
  return (props) => <WrapComponent {...props}></WrapComponent>
}

// function接收組件，回傳組件
function addColorButton(WrapComponent){
  return (props) => <WrapComponent {...props}></WrapComponent>
}
```

使用起來會長這樣

![HOC SimpleButton example](https://static.coderbridge.com/img/tempura327/0325485ee9224cd9ad6b191baa4f23f3.png)

```js
const BlueButton = addColorButton(SimpleButton);
const VioletButton = WithColorButton(SimpleButton); 

function App(){
  return (
    <div className='container py-2'>
      <SimpleButton>SimpleButton</SimpleButton>
      
      <BlueButton className='bg-blue-600 text-white rounded ml-3'>BlueButton</BlueButton>

      <VioletButton className='bg-violet-600 hover:bg-violet-800 text-white rounded-md ml-3'  onClick={() => {alert('this is VioletButton')}}>VioletButton</VioletButton>

      {addColorButton(SimpleButton)({className:'bg-pink-400 hover:bg-pink-600 text-white rounded-full ml-3', children:'PinkButton'})}
    </div>
  )
}
```

### 注意點

1. 使用composition，而`不`是`改動原來的組件`

  不要在HOC裡去改變wrapped component的prototype，這會使得HOC 和wrapped component產生耦合，而無法拆開使用
  
  ```js
  // bad
  function foo(InputComponent) {
    InputComponent.prototype.componentWillMount = function (nextProps) {
      console.log('component is mounted');
    };

    return InputComponent;
  }

  const EnhancedComponent = foo(SimpleButton);
  ```

  若同時使用了多個HOC，其他HOC的prototype也會被覆蓋
  
  此以上面的例子而言，將不能傳入function components，因為function component預設沒有生命週期

  ```js
  // good
  function foo(WrappedComponent) {
    return class extends React.Component {
      componentWillMount(nextProps) {
        console.log('component is mounted');
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    };
  }
  ```
  
2. `不`要`在render()內使用HOC`
   React的diff演算法(Reconciliation)使用key來辨別是否需要更新subtree，或者直接mount一個新的

   資料變動時，若render()回傳的組件等於先前的組件，則diff演算法會遞迴更新subtree，反之unmount舊的subtree

   不要在render()內用HOC，是因為render除了在mounting階段會被呼叫，updating階段也會

   如果寫在render()內的話`組件會重複被建立`(remount)，這`會降低效能`，且組件一旦remount其state、其子組件的`state都會消失`

   <!-- 關於生命週期可以看[React(10) - ]() -->

3. `Refs無法`被當作`props`傳遞
   雖然HOC的概念是將所有的東西都以props的形式傳給wrapped component，但是ref(React.createRef())不行，因為它並不是真的prop

   如果你在HOC回傳的組件上加了ref，ref的指向會是最外層的container component，但這可以用[React.forwardRef](https://reactjs.org/docs/forwarding-refs.html)解決

4. 透過`wrapped component`將具體的`props傳入`
   HOC回傳的組件都應該有一樣的interface，所以不該將具體的方法直接寫在HOC

   應該使用props將具體的方法傳入，以此加額外的方法給enhanced component

## 參考資料

[Higher-order function](https://ithelp.ithome.com.tw/articles/10235555)  

[React - Higher-Order Components](https://reactjs.org/docs/higher-order-components.html)
[Higher order component](https://ithelp.ithome.com.tw/articles/10245544)
[React - Forwarding Refs](https://zh-hant.reactjs.org/docs/forwarding-refs.html)