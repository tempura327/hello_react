# 目錄

- [目錄](#目錄)
  - [JSX是甚麼](#jsx是甚麼)
  - [嵌入變數](#嵌入變數)
  - [child & function component](#child--function-component)
  - [React.createElement() & element](#reactcreateelement--element)
    - [DOM element](#dom-element)
    - [component element](#component-element)
  - [render()](#render)
    - [React](#react)
    - [Vue](#vue)
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

## React.createElement() & element

(10/24更新)

React `element`(或稱element)並不是實例，而是`純JS物件`，因為是純物件所以不會指向螢幕上的任何東西

> What’s important is that both child and parent elements are just descriptions and not the actual instances. They don’t refer to anything on the screen when you create them. You can create them and throw them away, and it won’t matter much.

它有type、props、key 3個欄位，其中只有key可以是null

且是`immutable`的，`一旦建立`，`就不能改變`它的屬性。element就像是電影中的一個幀，代表特定時間點的UI。

`props描述實例、DOM node該有的屬性`(ex: component type、children、className)

### DOM element

DOM element並不是瀏覽器的DOM element，是指描述DOM node的React element

其type屬性是string，type會轉為tag name，props則會變成相應的屬性

例如JSX長這樣

```js
function App(){
    return (
        <div className='container'>
            <button className='bg-blue-600 text-white rounded'>
                <span>BlueButton</span>
            </button>        
        </div>
    );
}
```

經由babel編譯後，變成呼叫React.createElement()的函式，這個函式會回傳React element

也就是說JSX只是createElement()的語法糖

```js
const element = React.createElement(
    'button',
    {className: 'bg-blue-600 text-white rounded'},
    <span>BlueButton</span>
)
```

![element 1](https://static.coderbridge.com/img/tempura327/7588178562b34d379cb84daabb0b7dc8.png)

```js
{
  type: 'button',
  props: {
    className: 'bg-blue-600 text-white rounded',
    children: {
      type: 'span',
      props: {
        children: 'BlueButton'
      }
    }
  }
}
```

render()將其轉換成HTML

> To render a React element, first pass the DOM element to ReactDOM.createRoot(), then pass the React element to root.render()

```html
<button class='bg-blue-600 text-white rounded'>
    <span>BlueButton</span>
</button>
```

### component element

DOM element是指描述component的React element，其type屬性是function或class component

例如class component長這樣

```js
class SimpleButton extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  
  render() { 
    return (
      <button className={`rounded p-2 ${this.props.className}`} onClick={this.props.click}>{this.props.children || 'save'}</button>
    );
  }
}

function App(){
  return (
    <div>
      <SimpleButton className='bg-violet-400 hover:bg-violet-600 text-white'>VioletButton</SimpleButton>
    </div>
  );
}
```

babel編譯後得到的element

![element 2](https://static.coderbridge.com/img/tempura327/a83a234666ba4c36bcc16937c53ed6fe.png)

```js
{
  type: SimpleButton,
  props: {
    className:'bg-violet-400 hover:bg-violet-600 text-white',
    children: 'VioletButton'
  }
}
```

轉換成HTML

```html
<button class="rounded p-2 bg-violet-400 hover:bg-violet-600 text-white">VioletButton</button>
```

## render()

### React

render()Root底下的方法，它接受ReactElement或JSXElementConstructor(回傳component或ReactElement的函式)作為參數

```js
// JSX會被babel編譯成呼叫createElementK的函式，這個函式會回傳element
const element = <h1>Hello React</h1>;
```

```js
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(element);
```

### Vue

Vue的render function也差不多

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
[React - Rendering an Element into the DOM](https://reactjs.org/docs/rendering-elements.html)  
[React - React Components, Elements, and Instances](https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html)  
[React - 不使用 JSX 開發 React](https://zh-hant.reactjs.org/docs/react-without-jsx.html)  

[Vue - Render Functions & JSX](https://vuejs.org/guide/extras/render-function.html)