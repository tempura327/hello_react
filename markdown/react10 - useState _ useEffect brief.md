# 目錄

- [目錄](#目錄)
  - [React的hook](#react的hook)
  - [useState](#usestate)
    - [基本](#基本)
    - [多個useState](#多個usestate)
    - [functional update](#functional-update)
  - [useEffect](#useeffect)
    - [基本](#基本-1)
    - [忽略effect](#忽略effect)
    - [清除side effect](#清除side-effect)
  - [參考資料](#參考資料)

## React的hook

React hook分為state hook和effect hook，它都只能，也只該在function component的最上層(top level)使用

state hook(useState)讓function component能用state

effect hook(useEffect)則讓function component能用side effect。它可以做出componentDidMount、componentDidUpdate和componentWillUnmount的效果，但`不推薦用class component的life cycle的方式去思考`它們，因為它們事實上並不相同

在function component中`useState、useEffect`都`可以有多個`，它們會依排放順序被執行

但如果state邏輯變得複雜，推薦推薦用reducer

## useState

### 基本

`useState()`會`回傳`兩個值，第一個是`目前的state`，第二個是用來`變更state的function`(setState function)

set function會將接收的值更新到state，並且重新渲染組件

另外需要注意`function component的setState`並不會像class component的會進行merge，它`只會重新賦值`

如果想要進行物件的merge則必須改寫一下

```js
import {useState} from 'react';

import AddIcon from '@mui/icons-material/Add';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function ToDoList_MUI(props){
  const [pendingValue, setPendingValue] = useState('');
  const [list, setList] = useState([
    {text:'sweeping floor', state:false},
  ]);

  const changePendingValue = (e) => {
    setPendingValue(() => e.target.value);
  }

  const addItem = () => {
    // 使用previous state的context進行merge
    setList((prev) => [...prev, {text:pendingValue, state:false}]);
    setPendingValue('');
  }

  const toggle = (e, index) => {
    const copiedList = JSON.parse(JSON.stringify(list));

    copiedList[index] = {text:list[index].text, state:e.target.checked}

    setList(copiedList);
  }

  return (
    <>
      <div className='flex'>
        <Input className='mr-2' value={pendingValue} onChange={changePendingValue}></Input>
        <Button variant="contained" startIcon={<AddIcon />} onClick={addItem}>add</Button>    
      </div>

      <Stack>
        {list.map((i, index) => {
          return <FormControlLabel 
                    key={index}
                    control={<Checkbox checked={i.state} disabled={i.state} onChange={(e) => {toggle(e, index)}} color='info'/>} 
                    label={i.text}
                    sx={{'& .MuiSvgIcon-root': { fontSize: 32 } }}/>
        })}
      </Stack>
    </>
  )
}

export default ToDoList_MUI;
```

另外`setState`只在初次渲染時`將值初始化`

資料`更新`使得DOM時的渲染只會讀取值，而`不會再次初始化`

![](https://static.coderbridge.com/img/tempura327/d7640dee5289430384d2959409db6d34.gif)

### 多個useState

前段中有提到一個function component內可以有`多個useState`，但也可以使用`useReducer代替`

使用useReducer改寫

```js
import {useReducer} from 'react';

import Toast from './Toast';

import AddIcon from '@mui/icons-material/Add';

import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function reducer(state, action){
  const res = {...state}
  res[action.type] = action.value;

  return res;
}

function ToDoList_MUI(props){
  const [state, dispatch] = useReducer(reducer, {
    pendingValue: '',
    list:[
      {text:'sweeping floor', state:false},
    ],
  });

  const changePendingValue = (e) => {
    dispatch({type: 'pendingValue', value: e.target.value});
  }

  const addItem = () => {
    dispatch({type:'list', value:[...state.list, {text:state.pendingValue, state:false}]});
    dispatch({type: 'pendingValue', value: ''});
  }

  const toggle = (e, index) => {
    const copiedList = JSON.parse(JSON.stringify(state.list));

    copiedList[index] = {text:state.list[index].text, state:e.target.checked}

    dispatch({type: 'list', value: copiedList});
  }

  return (
    <>
      <div className='flex'>
        <Input className='mr-2' value={state.pendingValue} onChange={changePendingValue}></Input>
        <Button variant="contained" startIcon={<AddIcon />} onClick={addItem}>add</Button>    
      </div>

      <Stack>
        {state.list.map((i, index) => {
          return <FormControlLabel 
                    key={index}
                    control={<Checkbox checked={i.state} disabled={i.state} onChange={(e) => {toggle(e, index)}} color='info'/>} 
                    label={i.text}
                    sx={{'& .MuiSvgIcon-root': { fontSize: 32 } }}/>
        })}
      </Stack>
    </>
  )
}

export default ToDoList_MUI;
```

### functional update

如果新的state需要根據舊的state來做計算，那可以傳一個函式給set function

set function收到的第一個參數是舊的state

![](https://static.coderbridge.com/img/tempura327/f23d3ba6d1a54b3ebb71858d744d34b2.gif)

```js
function Calculator(props){
  const [count, setCount] = useState(0);
  const [operator, setOperator] = useState(undefined);

  const chooseNumber = (number) => {
    if(operator){
      calculate(number);
      
      return;
    }

    if(count === 0){
      setCount(number);

    }else{
      setCount((prev) => {
        const num = parseInt(prev.toString() + number.toString());

        setCount(num);
      })
    }
  }

  const calculate = (number) => {
    switch(operator){
      case '+':
        setCount((prev) => prev + number);
        break;

      case '-':
        setCount((prev) => prev - number);
        break;
          
      case '*':
        setCount((prev) => prev * number);
        break;
          
      case '/':
        setCount((prev) => prev / number);
        break;       

      default:
    }

    setOperator(undefined);
  }

  return (
    <div>
        <div className='bg-zinc-300 text-right mb-1 p-2 px-4'>{count}</div>

        <div className='grid grid-cols-3 gap-1'>
          <button className='bg-indigo-600 text-white p-2 px-4 col-span-3' onClick={() => setCount(0)}>clear</button>

          <button className='bg-blue-800 text-white p-2 px-4' onClick={() => setOperator('+')}>+</button>
          <button className='bg-blue-800 text-white p-2 px-4' onClick={() => setOperator('-')}>-</button>
          <button className='bg-blue-800 text-white p-2 px-4' onClick={() => setOperator('*')}>*</button>
          <button className='bg-blue-800 text-white p-2 px-4' onClick={() => setOperator('/')}>/</button>
          <button className='bg-blue-800 text-white p-2 px-4' onClick={() => {setCount((prev) => Math.pow(prev, 2))}}>x²</button>
          
          {
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(i => 
                <button className='bg-blue-200 p-2 px-4' key={`button-${i}`} onClick={() => chooseNumber(i)}>{i}</button>
            )
          }
        </div>
    </div>
  )
}
```

## useEffect

在`function component內預設是不允許side effect`的，因為可能導致畫面和資料不一致

useEffect的第一個參數是function，當`初次渲染、DOM被更新時會被執行`。第二個參數則是`dependency array`，用於忽略side effect

side effect分為需要清除的、不需清除的2種

需要清除的是不清除可能導致memory leak(ex:使用package的API訂閱/監聽某些事件、計時器)

不須清除的，執行完之後就沒有了，不會留下潛在的爛攤子(ex:網路請求、手動變更DOM)

### 基本

```js
function ToDoList_MUI(props){
  // 略

  useEffect(() => {
    if(state.list.length > 5){
      dispatch({type:'isWarningShow', value:true});
    }
  });

  // 略
}
```

![](https://static.coderbridge.com/img/tempura327/5b6725887e6e44a8809537930984de36.gif)

Toast怎麼超過5就卡在那邊不關掉🤔

仔細看的話會發現useEffect不斷被呼叫，這是因為沒有設置dependency array，這會導致效能問題

### 忽略effect

使用dependency array解決useEffect不斷被呼叫的問題

React會對比新值與dependency array，若兩者值相同將忽略這個side effect

```js
function ToDoList_MUI(props){
  // 略

    useEffect(() => {
    if(state.list.length > 5){
      dispatch({type:'isWarningShow', value:true});
    }

  }, [state.list.length]); // 相當於list更新時執行componentDidUpdate，若設為[]則相當於componentDidMount

  // 略
}
```

完整版

![](https://static.coderbridge.com/img/tempura327/7a9d877571024f37a267cef28ecae2e4.gif)

```js
import {useReducer, useEffect} from 'react';

import Toast from './Toast';

import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import AddIcon from '@mui/icons-material/Add';

function reducer(state, action){
  const res = {...state}
  res[action.type] = action.value;

  return res;
}

function ToDoList_MUI(props){
  const [state, dispatch] = useReducer(reducer, {
    pendingValue: '',
    list:[
      {text:'sweeping floor', state:false},
    ],
    isWarningShow:false,
    isErrorShow:false,
  });

  const changePendingValue = (e) => {
    dispatch({type: 'pendingValue', value: e.target.value});
    dispatch({type: 'isErrorShow', value: false});
  }

  const addItem = () => {
    if(!state.pendingValue){
      dispatch({type:'isErrorShow', value:true});
      return;
    };

    dispatch({type:'list', value:[...state.list, {text:state.pendingValue, state:false}]});
    dispatch({type: 'pendingValue', value: ''});
  }

  useEffect(() => {
    if(state.list.length > 5){
      dispatch({type:'isWarningShow', value:true});
    }

  });  // 相當於list更新時執行componentDidUpdate , [state.list.length]

  const toggle = (e, index) => {
    const copiedList = JSON.parse(JSON.stringify(state.list));

    copiedList[index] = {text:state.list[index].text, state:e.target.checked};

    dispatch({type: 'list', value: copiedList});
  }

  return (
    <>
      <div className='flex'>
        <Input className='mr-2' value={state.pendingValue} error={state.isErrorShow} onChange={changePendingValue}></Input>
        <Button variant="contained" startIcon={<AddIcon />} onClick={addItem}>add</Button>    
      </div>

      <Toast message='todo items > 5' isShow={state.isWarningShow} autoHide={800} variant='warning' onClose={() => {dispatch({type:'isWarningShow', value:false})}}></Toast>

      <Stack>
        {state.list.map((i, index) => {
          return <FormControlLabel 
                    key={index}
                    control={<Checkbox checked={i.state} disabled={i.state} onChange={(e) => {toggle(e, index)}} color='info'/>} 
                    label={i.text}
                    sx={{'& .MuiSvgIcon-root': { fontSize: 32 } }}/>
        })}
      </Stack>
    </>
  )
}

export default ToDoList_MUI;
```

### 清除side effect

`useEffect`預設`在應用下一個side effect前`，先`清除舊的`

在useEffect內回傳的函式會在組件被unmount時被呼叫(類似componentWillUnmount)，因此可以用於清除舊的side effect

```js
function Clock(props) {
  const [date, setDate] = useState(new Date().toLocaleString());

  useEffect(() => {
      const timer = setInterval(() => {
        setDate(new Date().toLocaleString());
      }, 1000);

      return () => {
        clearInterval(timer);
      }
  });
  
  return (
    <p>{date}</p>
  )
}
```

## 參考資料

[React - Hook 概觀](https://zh-hant.reactjs.org/docs/hooks-overview.html)  
[React - Hook 的規則](https://zh-hant.reactjs.org/docs/hooks-rules.html)  
[React - Hooks API 參考](https://zh-hant.reactjs.org/docs/hooks-reference.html)  
[React - 使用 State Hook](https://zh-hant.reactjs.org/docs/hooks-state.html)  
[React - 使用 Effect Hook](https://zh-hant.reactjs.org/docs/hooks-effect.html)  
[React - Functional updates](https://reactjs.org/docs/hooks-reference.html#functional-updates)  
[React - Component 生命週期](https://zh-hant.reactjs.org/docs/react-component.html#the-component-lifecycle)  
[[React Hook 筆記] 從最基本的useState, useEffect 開始](https://medium.com/hannah-lin/react-hook-%E7%AD%86%E8%A8%98-%E5%BE%9E%E6%9C%80%E5%9F%BA%E6%9C%AC%E7%9A%84-hook-%E9%96%8B%E5%A7%8B-usestate-useeffect-fee6582d8725)
["This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."](https://stackoverflow.com/questions/57853288/react-warning-maximum-update-depth-exceeded)