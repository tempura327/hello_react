# 目錄

- [目錄](#目錄)
  - [createRoot() 與 render()](#createroot-與-render)
  - [prop 與 JSX + loop](#prop-與-jsx--loop)
    - [prop](#prop)
    - [JSX + loop](#jsx--loop)
  - [參考資料](#參考資料)

## createRoot() 與 render()

React跟Vue一樣都需要一個root，所有在root內的element都由React DOM做管理

```js
// index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // App.js是一個function component，也是root component

// 將#root與React做掛勾
const root = ReactDOM.createRoot(document.getElementById('root'));

// 這裡傳入render的element相當於Vue的App.vue
// 將App渲染出來

// React.StrictMode是一個用來突顯應用程式裡潛在問題的工具，它只會在開發模式中執行
// 如果在開發環境發現render()或constructor被呼叫2次就是因為它
root.render(
  <React.StrictMode> 
    <App />
  </React.StrictMode>
);
```

Vue3對應寫法

```js
// main.js

import { createApp } from 'vue';
import App from './App.vue'; // root component

const app = createApp(App); // 建立Vue實例

app.mount('#app'); // 把Vue實例掛到root
```

## prop 與 JSX + loop

### prop

`Props是唯讀的`，這邊的唯獨並不是read-only，而是指`component不該異動自己的props`

假設今天有一個Card組件，上面需要一張圖片，下面顯示文字

為了`讓組件`可以`重複使用`，這時就需要`prop`

function component接收的第一個參數會是prop context，可以用解構將屬性取出

```js
function Card({imgSrc, text}){
  return (
    <div className="flex justify-center flex-col">
      <img src={imgSrc} alt={text} />
      <p className="text-center">{text}</p>
    </div>
  );
}
```

使用時會長這樣

```js
function App(){
  const data = [
    {url:'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1856&q=80', name:'Unknown'},
    {url:'https://images.unsplash.com/photo-1524316607912-93c3468d9d28?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80', name:'Alex'},
    {url:'https://images.unsplash.com/photo-1622022267545-43443d206072?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', name:'Jill'},
    {url:'https://images.unsplash.com/photo-1616745309504-0cb79e9ae590?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80', name:'Emma'},
  ];

  return (
    <div className="container">
      <div className="grid grid-cols-3 gap-2">
        <Card imgSrc={authorData[0].url} text={authorData[0].name}></Card>
        <Card imgSrc={authorData[1].url} text={authorData[1].name}></Card>
        <Card imgSrc={authorData[2].url} text={authorData[2].name}></Card>
        <Card imgSrc={authorData[3].url} text={authorData[3].name}></Card>
      </div>
    </div>
  );  
}
```

但這樣如果有50張卡片豈不是要放50次Card🤔

這時就需要用到JSX + loop了，這個方式在Vue對應v-for

### JSX + loop

先來做個List組件(Card組件不需要改)，並在裡面跑迴圈

```js
function List({data}){
  const elementArr = [];

  for(let i = 0; i < data.length; i++){
    elementArr.push(<Card imgSrc={data[i].url} text={data[i].name} key={i}></Card>);
  }

  return <div className="grid grid-cols-3 gap-2">{elementArr}</div>;
}
```

或者

```js
function List({data}){
  const elementArr = data.map(i => <Card imgSrc={i.url} text={i.name}></Card>);

  return <div className="grid grid-cols-3 gap-2">{elementArr}</div>;
}

```

再或者

```js
function List({data}){
  return (
    <div className="grid grid-cols-3 gap-2">
      {data.map(i => <Card imgSrc={i.url} text={i.name}></Card>)}
    </div>
  );
}
```

以上不管哪種，在App使用時都長這樣，簡潔多了

```js
function App(){
  const data = [
    {url:'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1856&q=80', name:'Unknown'},
    {url:'https://images.unsplash.com/photo-1524316607912-93c3468d9d28?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80', name:'Alex'},
    {url:'https://images.unsplash.com/photo-1622022267545-43443d206072?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', name:'Jill'},
    {url:'https://images.unsplash.com/photo-1616745309504-0cb79e9ae590?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80', name:'Emma'},
  ];

  return (
    <div className="container">
      <div className="grid grid-cols-3 gap-2">
        <List data={data}></List>
      </div>
    </div>
  );  
}
```

跳回去，如果另一個地方的List組件裡面要放FlipCard呢🤔

```js
function FlipCard({imgSrc, text}){
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <img src={imgSrc} alt="" className="w-full rounded-full"/>
        </div>

        <div className="flip-card-back">
          <h1>{text}</h1>
        </div>
      </div>
    </div>
  );
}
```

為此需要新增一個ele prop用來傳組件進去，但注意`如果List內的組件有prop`的話`不要直接傳組件`給ele

```js
function List({data, ele, className}){
  const elementArr = [];

  for(let i = 0; i < data.length; i++){
    // ele這個prop是個函式，它接收的參數是組件的prop，呼叫後會回傳component
    // 使用展開運算子將資料依序傳入ele()
    elementArr.push(ele(...Object.values(data[i]), i));
  }

  return <div className={className}>{elementArr}</div>
}
```

使用時會長這樣

這邊之所以`不直接將`Card`組件傳入`ele，`因為`迴圈在List組件裡跑，`這時還取不到資料傳給`Card的`prop`，如果直接傳組件渲染出來會一片空白

所以傳一個會回傳組件的函式，傳資料給Card的prop的任務就交給List

```js
function App(){
  const data = [
    {url:'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1856&q=80', name:'Unknown'},
    {url:'https://images.unsplash.com/photo-1524316607912-93c3468d9d28?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80', name:'Alex'},
    {url:'https://images.unsplash.com/photo-1622022267545-43443d206072?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', name:'Jill'},
    {url:'https://images.unsplash.com/photo-1616745309504-0cb79e9ae590?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80', name:'Emma'},
  ];

  return (
    <div className="container">
      <List data={data}  ele={(url, name, index) => {return <Card imgSrc={url} text={name} key={index}></Card>}} className="grid grid-cols-3 gap-2"></List>

      <hr className="my-8"/>

      <List data={data}  ele={(url, name, index) => {return <FlipCard imgSrc={url} text={name} key={index}></FlipCard>}} className="flex justify-around"></List>
    </div>
  );
}
```

## 參考資料

[Render Element](https://zh-hant.reactjs.org/docs/rendering-elements.html)
[Components 與 Props](https://zh-hant.reactjs.org/docs/components-and-props.html)
[列表與 Key](https://zh-hant.reactjs.org/docs/lists-and-keys.html)
[Loop inside React JSX](https://stackoverflow.com/questions/22876978/loop-inside-react-jsx)
