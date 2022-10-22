# 目錄

- [目錄](#目錄)
  - [React的hook](#react的hook)
  - [useState](#usestate)
    - [基本](#基本)
    - [setState後merge](#setstate後merge)
    - [多個useState](#多個usestate)
  - [useEffect](#useeffect)
    - [基本](#基本-1)
    - [忽略effect](#忽略effect)
  - [參考資料](#參考資料)

## React的hook

React hook分為state hook和effect hook，它都只能，也只該在function component的最上層(top level)使用

state hook(useState)讓function component能用state

effect hook(useEffect)則讓function component能用side effect，它可以視為componentDidMount、componentDidUpdate和componentWillUnmount的組合

在function component中useState、useEffect都`可以有多個`，它們會依排放順序被執行

但如果state邏輯變得複雜，推薦推薦用reducer

## useState

### 基本

`useState()`會`回傳`兩個值，第一個是`目前的state`，第二個是用來`變更state的function`(setState function)

set function會將接收的值更新到state，並且重新渲染組件

```js
function Calculator(){
  const [num, setNum] = useState(0);

  return (
    <div>
      <p>current number us {num}</p>

      <SimpleButton click={() => {setNum(num + 1)}} class='w-fit'></SimpleButton>
    </div>
  )
}
```

### setState後merge

`function component的setState`並不會像class component的會進行merge，它`只會重新賦值`

如果想要進行物件的merge則必須改寫一下

```js
function Profile(){
  const [data, setData] = useState({
    name:'Alex',
    age:30
  }); 

  let pendingName = '';

  return (
    <div>
      <div>{JSON.stringify(data)}</div>

      <input type="text" onChange={(e) => {pendingName = e.target.value}}/>

      <SimpleButton click={() => {
        setData((prev) => {return {...prev, name:pendingName}})
      }} class='w-fit'>change Name</SimpleButton>
    </div>
  )
}
```

另外setState只在初次渲染時將值初始化

資料更新使得DOM時的渲染只會讀取值，而不會再次初始化

![](https://static.coderbridge.com/img/tempura327/d7e3cffa1ae24ec98f9a4e4bda34e6a1.gif)

```js
function Profile(){
  console.log('first line');

  const [data, setData] = useState(() => {
    console.log('use state')
    return {
      name:'Alex',
      age:30
    }
  }); 

  // 省略
}
```

### 多個useState

前段中有提到一個function component內可以有`多個useState`，但也可以使用`useReducer代替`

```js
function Counter(){
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(3);

  return (
    <div>
      <p className='mb-3'>Count: {count}</p>
 
      <label>multiplier: </label>
      <input type="text" value={multiplier} onChange={(e) => {setMultiplier(e.target.value)}}/>

      <SimpleButton class='ml-3' color='green' click={() => setCount(count - 1)}>-</SimpleButton>
      <SimpleButton class='ml-3' color='green' click={() => setCount(count + 1)}>+</SimpleButton>
      <SimpleButton class='ml-3' color='green' click={() => setCount(count * multiplier)}>×</SimpleButton>
    </div>
  );
}
```

使用useReducer改寫

```js
function reducer(state, action) {
  const map = {
    increment:{...state ,count: state.count + 1},
    decrement:{...state ,count: state.count - 1},
    multiply:{...state, count: state.count * state.multiplier},
    setMultiplier:{...state, multiplier: action.value}
  };

  return map[action.type];
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, {count: 0, multiplier:3});
  return (
    <div>
      <p className='mb-3'>Count: {state.count}</p>

      <label>multiplier: </label>
      <input type="text" value={state.multiplier} onChange={(e) => {dispatch({type: 'setMultiplier', value: e.target.value})}}/>

      {/* useReducer(reducer, undefined, reducer)雖然能摸擬 Redux 的行為，但官方不鼓勵 */}
      <SimpleButton class='ml-3' click={() => dispatch({type: 'decrement'})}>-</SimpleButton>
      <SimpleButton class='ml-3' click={() => dispatch({type: 'increment'})}>+</SimpleButton>
      <SimpleButton class='ml-3' click={() => dispatch({type: 'multiply'})}>×</SimpleButton>
    </div>
  );
}
```

![](https://static.coderbridge.com/img/tempura327/eaac7aeb1fbf493c8bd68a5eb1c37143.gif)

兩者呈現的結果會一樣

## useEffect

在`function component內預設是不允許side effect`的，因為`可能`導致`畫面和資料不一致`

useEffect的第一個參數是function，當`初次渲染、DOM被更新時會被執行`。第二個參數則是dependency array，用於忽略side effect

side effect分為需要清除的、不需清除的2種

需要清除的是不清除可能導致memory leak(ex:使用package的API訂閱/監聽某些事件)

不須清除的，執行完之後就沒有了，不會留下潛在的爛攤子(ex:網路請求、手動變更DOM)

`useEffect`預設`在應用下一個side effect前`，先`清除之前`

### 基本

![](https://static.coderbridge.com/img/tempura327/c0cdaf5b0a2a4a0fb32d850e6cac1504.gif)

```js
function Profile(){
  console.log('first line');

  const [data, setData] = useState({
    name:'Alex',
    age:30,
    pendingName:''
  }); 

  useEffect(() => {
    console.log('useEffect');

    if(data.name === 'Emma'){
      alert('Oh I know her.');
    }
  });

  return (
    <div>
      <div>{JSON.stringify(data)}</div>

      <input type="text" onChange={(e) => {data.pendingName = e.target.value}}/>

      <SimpleButton click={() => {
        setData((prev) => {return {...prev, name: data.pendingName}})
      }} class='w-fit'>change Name</SimpleButton>
    </div>
  )
}
```

![](https://static.coderbridge.com/img/tempura327/06e636c0d9364e1daadaddb5b200035d.gif)

但仔細看的話會發現不論新值是否異於舊值，useEffect都會被呼叫，這可能導致效能問題

### 忽略effect

上一個例子我們發現新值是否異於舊值，useEffect都會被呼叫，使用dependency array解決這個問題

React會對比新值與dependency array，若兩者值相同將忽略這個side effect

![](https://static.coderbridge.com/img/tempura327/3e92b77e76de48729c12446df63aee51.gif)

```js
function Profile(){
  console.log('first line');
  
  const [data, setData] = useState({
    name:'Alex',
    age:30,
    pendingName:''
  }); 

  useEffect(() => {
    console.log('useEffect');

    if(data.name === 'Emma'){
      alert('Oh I know her.');
    }
  }, [data.name]);

  return (
    <div>
      <div>{JSON.stringify(data)}</div>

      <p>{data.name}</p>

      <input type="text" onChange={(e) => {data.pendingName = e.target.value}}/>

      <SimpleButton click={() => {
                            setData((prev) => {return {...prev, name:data.pendingName}})
                          }} class='w-fit'>change Name</SimpleButton>
    </div>
  )
}
```

## 參考資料

[React - Hook 概觀](https://zh-hant.reactjs.org/docs/hooks-overview.html)  
[React - Hook 的規則](https://zh-hant.reactjs.org/docs/hooks-rules.html)  
[React - Hooks API 參考](https://zh-hant.reactjs.org/docs/hooks-reference.html)  
[React - 使用 State Hook](https://zh-hant.reactjs.org/docs/hooks-state.html)  
[React - 使用 Effect Hook](https://zh-hant.reactjs.org/docs/hooks-effect.html)  
[React - Component 生命週期](https://zh-hant.reactjs.org/docs/react-component.html#the-component-lifecycle)  
[[React Hook 筆記] 從最基本的useState, useEffect 開始](https://medium.com/hannah-lin/react-hook-%E7%AD%86%E8%A8%98-%E5%BE%9E%E6%9C%80%E5%9F%BA%E6%9C%AC%E7%9A%84-hook-%E9%96%8B%E5%A7%8B-usestate-useeffect-fee6582d8725)