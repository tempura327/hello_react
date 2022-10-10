# 目錄

- [目錄](#目錄)
  - [JSX是甚麼](#jsx是甚麼)
  - [嵌入變數](#嵌入變數)
  - [child & function component](#child--function-component)
  - [React.createElement()](#reactcreateelement)
  - [參考資料](#參考資料)

## JSX是甚麼

`JSX`是`JavaScript的語法擴充`，長得頗像HTML，~~類HTML~~

其`React`專案的`切版時常見`，但因為是JS的語法擴充，所以可以在裡面使用JS功能

另外其優點是React DOM會在`渲染前`將`所有變數轉為字串`，以`避免XSS`

## 嵌入變數

```js
function dateConvertor(date){
   return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

function App(){
   const frameWork = 'React';
   const today = new Date();
   const url = 'https://images.unsplash.com/photo-1532009871151-e1958667c80d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80';

   return (
       <div className="container">
           <h1>Hello {frameWork}</h1>;

           <img src={url}/>

           <p>{dateConvertor(today)}</p>
       </div>            
   );
}
```

Vue對應寫法

```html
<template>
   <div class="container">
       <h1>Hello {{frameWork}}</h1>

       <img :src="url"/>

       <p>today is {{dateConvertor(today)}}</p>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue';

   export default Vue.extend({
       name: 'App',
       data() {
         return {
           frameWork:'React',
           today:new Date(),
           url:'https://images.unsplash.com/photo-1532009871151-e1958667c80d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80',
         };
       },
       methods:{
           dateConvertor(date:Date):string{
               return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
           }
       }
   })
</script>
```

## child & function component
  
在上個例子中可以發現撰寫JSX和Vue的template相當地相似

同樣地它也可以製作組件，並把它包到另一個組件裡

`React的組件`有2種，`分為function` component`和class component`

這個例子使用function component，`組件的名稱開頭`一定要`大寫`

```js
function HelloWorld(){
   const element = (
     <div>
       <h1>Hello! Below are frameworks you can choose</h1>
       <ul>
           <li>Angular</li>
           <li>React</li>
           <li>Vue</li>
       </ul>
     </div>
   );

   return element;
}     

export default HelloWorld;
```

```js
import HelloWord from './HelloWord';

function APP(){
    return (
        <div>
            <HelloWord></HelloWord>
        </div>
    );
}
```

Vue對應寫法

```html
<template>
    <div>
        <HelloWorld></HelloWorld>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({ 
        name: 'App',
    })
</script>
```

## React.createElement()

```js
const element = (
    <h1 className="container">
        Hello React
    </h1>
);
```

babel會將JSX編譯，變成呼叫React.createElement()的程式

```js
const element = React.createElement(
    'h1',
    {className: 'container'},
    'Hello React'
)
```

最後會得到一個物件

![react jsx](https://static.coderbridge.com/img/tempura327/351cbda0e0c34ac49f0618a4ede0c98d.png)

和Vue的render function也差不多

render function，縮寫為h()

之所以是h是來自**h**yperscript()

```html
<template>
    <h1 class="container">
        Hello React
    </h1>
</template>
```

```js
import { h } from 'vue'; // 這是render function

const vnode = h(
  'h1', // type
  {class: 'container'}, // props
  'Hello React'
)

```

最後會得到一個VNode

![VNode](https://static.coderbridge.com/img/tempura327/1f38bf0793c440e8be8fc4d41c1f13d0.png)

## 參考資料

[React - JSX](https://zh-hant.reactjs.org/docs/introducing-jsx.html)
[Vue - Render Functions & JSX](https://vuejs.org/guide/extras/render-function.html)