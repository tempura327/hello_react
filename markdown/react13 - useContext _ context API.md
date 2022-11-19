# 目錄

- [目錄](#目錄)
  - [context & props drilling](#context--props-drilling)
    - [context是甚麼](#context是甚麼)
    - [props drilling](#props-drilling)
  - [context API](#context-api)
    - [createContext & Context.Provider](#createcontext--contextprovider)
    - [Class.contextType](#classcontexttype)
    - [Context.Consumer](#contextconsumer)
  - [useContext](#usecontext)
    - [例子](#例子)
  - [useContext + useReducer](#usecontext--usereducer)
    - [例子](#例子-1)
  - [參考資料](#參考資料)

## context & props drilling

### context是甚麼

![context](https://beta.reactjs.org/_next/image?url=%2Fimages%2Fdocs%2Fdiagrams%2Fpassing_data_context_far.png&w=640&q=75)  
(取自[React Docs Beta](https://beta.reactjs.org/learn/passing-data-deeply-with-context))

context可以讓`多個組件共享資料`，而`不必一層一層`地把props`傳到最底下`

常用於儲存登入的使用者資訊、使用者選擇的語言、設定的主題(ex:暗黑模式)

### props drilling

![props drilling](https://beta.reactjs.org/_next/image?url=%2Fimages%2Fdocs%2Fdiagrams%2Fpassing_data_prop_drilling.png&w=640&q=75)  
(取自[React Docs Beta](https://beta.reactjs.org/learn/passing-data-deeply-with-context))

`props drilling`就是`一層一層把props傳到最底下`

不過如果只是想避免props drilling，也可以使用[composition](https://tempura-good-good.coderbridge.io/2022/10/17/react7-composition/)(把資料塞入組件，組件當作props傳下去)

## context API

### createContext & Context.Provider

建立context物件

組件被渲染後，會訂閱最近的上層Provider的context值

但Provider組件`底下的組件`(其後代)`不論Provider的props有無改變`，`都會被重新渲染`

```js
// 引數defaultValue只有在上層Provider不存在時使用
// {name:'Alex'}即是引數
const YourContext = React.createContext({
  name:'Alex'
});

const MyContext = React.createContext();
```

```js
<MyContext.Provider value={{name:'Tempura'}}></MyContext.Provider>
```

### Class.contextType

class component除了透過Context.Consumer來訂閱context以外，也可以使用contextType直接指定其context

```js
const MyContext = React.createContext({name:'Alex'});

class Foo extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  render() { 
    // console.log(this.context);
    return (
      <div className='w-30 p-4 bg-cyan-500 m-2'>
        {this.props.children || JSON.stringify(this.context)}
      </div>
    );
  }
}

Foo.contextType = MyContext;
```

```js
function App(){
  return (
    <div className='flex flex-col'>
        {/* 直接指定contextType給class component */}
        {/* 會顯示name: Alex */}
        <Foo></Foo>
    </div>
  );
}

```

### Context.Consumer

這個組件`讓function component可以訂閱context`

如果直接設置contextType會報錯"Function components do not support contextType."

```js
<MyContext.Consumer>
  {value => /* render something based on the context value */}
</MyContext.Consumer>
```

```js
function Bar(props){
  console.log(this);
  return (
    <div className='w-30 p-4 bg-pink-300 m-2'>
      {props.children}
    </div>
  );
}

// 會報錯"Function components do not support contextType."
// Bar.contextType = MyContext;

```

`Consumer的child`是個`接收context`，且會回傳React node`的函式`

函式接收的value是最近的上層Provider的value prop，當上層Provider不存在時，則為建立context物件時傳入的defaultValue

```js
function App(){
  const MyContext = React.createContext();

  return (
    <div className='flex flex-col'>
      <MyContext.Provider value={{name:'Tempura'}}>
        {/* function component，不使用Consumer讀不到context */}
        <Bar></Bar>

        {/* Consumer內函式放function component，再將函式收到的context放到function component */}
        {/* 會顯示name: Tempura */}
        <MyContext.Consumer>
          {/* Provider的value會傳給Consumer內部函式，所以這邊的value就是{name:'Tempura'} */}
          {value => <Bar>{Object.keys(value).map(i => <p key={i}>{`${i}: ${value[i]}`}</p>)}</Bar>}
        </MyContext.Consumer>
      </MyContext.Provider>
    </div>
  );
}
```

## useContext

useContext是個hook，能`用途和Context.Consumer差不多`

它`接收context物件，回傳context目前的值`。context目前的值來自於`最近的上層Provider的value` prop

> const value = useContext(MyContext);
> 
> Accepts a context object (the value returned from React.createContext) and returns the current context value for that context. The current context value is determined by the value prop of the nearest <MyContext.Provider> above the calling component in the tree.

`只要context`的目前值`被更新`，`呼叫useContext的組件就會重新渲染`。這可能會衝擊效能，但可以用memo來改善這個問題

```js
// LevelContext.js
export const LevelContext = React.createContext();
```

```js
// Section.js

import { LevelContext } from "../contexts/LevelContext";

// 使用Section組件時會傳遞level prop進來
export default function Section({level, children}){
    return (
        <section className="border-2 border-solid border-zinc-400 p-4 m-2">
            {/* context物件(LevelContext)的目前值(_currentValue)設為level */}
            <LevelContext.Provider value={level}>
                {children}
            </LevelContext.Provider>
        </section>
    );
}
```

```js
// Heading.js
import { useContext } from 'react';
import { LevelContext } from '../contexts/LevelContext';

export default function Heading({children}){
    // 將從context物件傳給useContext，得到context物件的目前值
    // 也就是說透過Provider得到父組件收到的prop
    const level = useContext(LevelContext);

    switch(level){
        case 1:
            return <h1 className='text-3xl'>{children}</h1>;

        case 2:
            return <h2 className='text-2xl'>{children}</h2>;

        case 3:
            return <h3 className='text-xl'>{children}</h3>;

        case 4:
            return <h4 className='text-lg'>{children}</h4>;
            
        case 5:
            return <h5 className='text-base'>{children}</h5>;
        
        case 6:
            return <h6 className='text-sm'>{children}</h6>;
        
        default:
            throw Error('level is invalid.');
    }
}
```

```js
function App(){
  return (
    <div>
      {/* Section收到1，將context的目前值設為1 */}
      <Section level={1}>
        {/* Heading使用useContext取得context的目前值 */}
        <Heading>Passing Data Deeply with Context</Heading>

        {/* Section收到2，將context的目前值設為2 */}
        <Section level={2}>
          {/* Heading使用useContext取得context的目前值 */}
          <Heading>Passing Data Deeply with Context</Heading>

          {/* Section收到3，將context的目前值設為3 */}
          <Section level={3}>
            {/* Heading使用useContext取得context的目前值 */}
            <Heading>Passing Data Deeply with Context</Heading>
          </Section>
        </Section>
      </Section>
    </div>
  );
}
```

### 例子

在開頭提到context的常被用於設定網站佈景主題，這一段就來試一下

先新建context物件，這邊要不要給預設值都可以

```js
// ThemeContext.js

import React from 'react';

export const ThemeContext = React.createContext({mode:'dark'});

export const themeMap = {
    dark:{
        body:'bg-gray-700',
        nav:'bg-zinc-900 text-white',
        footer:'bg-zinc-900 text-white',
        button:'bg-cyan-300 hover:bg-gray-100',
        link:'text-white hover:text-cyan-400 hover:border-b-cyan-400',
        text:'text-white'
    },
    light:{
        body:'bg-gray-100',
        nav:'bg-zinc-300',
        footer:'bg-zinc-300',
        button:'bg-cyan-500 text-white hover:bg-gray-700',
        link:'hover:border-b-zinc-600',
        text:'text-zinc-900'
    }
};
```

準備組件

```js
function Button({onClick, children}){
  const {button} = useContext(ThemeContext);

  return (
    <button className={`rounded p-2 ${button}`} onClick={onClick || null}>{children}</button>
  )
}

function NavigationBar({color, children, className = ''}){
  return (
    <nav className={`flex p-4 px-12 w-full ${color} ${className}`}>
      {children}
    </nav>
  )
}

function Footer({color, children}){
  return (
    <footer className={`flex justify-between items-center p-4 px-12 w-full ${color}`}>
      {children}
    </footer>
  )
}

function Link({href = '#', color, children}){
  return (
    <a href={href} className={`${color} w-fit border-2 border-solid border-transparent`}>
      {children}
    </a>
  )
}

```

完成後NavigationBar、Footer放到PageLayout

因為這兩個組件固定出現在PageLayout裡面，所以不呼叫useContext，統一在PageLayout呼叫

取得context的目前值後，然後用props的方式把樣式傳給它們

```js
function PageLayout(props){
  const {nav, footer, link} = useContext(ThemeContext);
  
  return (
    <>
      <NavigationBar color={nav}>
        <Switch onChange={(e) => {props.onThemeChange(e.target.checked? 'dark' : 'light')}} defaultChecked></Switch>
        <ul className='flex ml-auto'>
          {props.navMenu.map(i => <li className='ml-4' key={i} color={link}>
                              <Link color={link}>{i}</Link>    
                            </li>)}
        </ul>
      </NavigationBar>

      {props.children}
      
      <Footer color={footer}>
        {
          props.footerChildren || <>
                                    <p>Copyright © 2022 Tempura327</p>

                                    <div className='flex'>
                                      {
                                        props.footerMenu.map(i => <div key={i.title} className='flex flex-col ml-6'>
                                                              <span className='font-bold mb-2'>{i.title}</span>
                                                              {i.content.map(item => <Link key={`${i.title}-${item}`} color={link}>{item}</Link>)}
                                                            </div>)
                                      }       
                                    </div>
                                  </>
        }
      </Footer>
    </>
  )
}
```

先將模式(ex: dark, light)設為App的local state

用theme從themeMap取得對應模式的樣式，然後丟給Provider

因為App裡的變數theme就是控制模式的源頭，所以不呼叫useContext，直接使用theme取得樣式

```js
import Switch from '@mui/material/Switch';
import {ThemeContext, themeMap} from './contexts/ThemeContext';

function App(){
  const [theme, setTheme] = useState('dark'); // 將模式設為App的local state 
  const {text, body} = themeMap[theme];

  const navMenu = ['Home', 'About', 'Note'];

  const footerMenu = [
    {title:'Note', content:['Javascript', 'React', 'Vue']}, 
    {title:'Other', content:['Github', 'Side Project']}
  ];

  return (
    {/* 用theme從themeMap取得對應模式的樣式 */}
    <ThemeContext.Provider value={themeMap[theme]}>
      <PageLayout navMenu={navMenu} footerMenu={footerMenu} onThemeChange={(mode) => {setTheme(mode)}}>
        <main className={`flex flex-col items-center p-8 ${body}`}>
            <img src="https://avatars.githubusercontent.com/u/75103292?v=4" alt="" className='w-80 rounded-full mb-4'/>
            <h1 className={`text-3xl mb-2 ${text}`}>Tempura327</h1>
            <h3 className={`text-xl mb-6 ${text}`}>A Tempura Ninja fans</h3>
            <Button>Read More</Button>
        </main>
      </PageLayout>
    </ThemeContext.Provider>
  )
}
```

## useContext + useReducer

useContext與useReducer的結合可以達到`類似Redux`的效果，但仍有2個主要的差異

1. useContext + useReducer的話只要context更新就會重新渲染，Redux則否
2. 只有Redux能處理middleware

之所以需要結合它們是因為`當使用useReducer時`，`state與dispatch`都`只能在該組件`被取`用`

因此在`組件包了很多層時`，就需要把state和dispatch`丟到context`，然後用useContext取用它們

### 例子

用起來會像這樣

```js
// App.js

// 先createContext
import {StateContext, DispatchContext} from './FooContext';

function reducer(state, action){
  const res = {...state}
  res[action.type] = action.value;

  return res;
}

function App(){
    const [state, dispatch] = useReducer(reducer, {
        num:0
    })

    return (
        <StateContext.Provider value={state}>
            <DispatchContext value={dispatch}>
                {/* Bar裡面只裝了Foo，就不多寫了 */}
                <Bar><Bar>
            </DispatchContext>
        </StateContext>
    );
}
```

```js
import {StateContext, DispatchContext} from './FooContext';
import {useContext} from 'react';

function Foo({num}){
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    return (
        <>
            <p>{num}</p>
            <button onClick={dispatch{type: 'num', value: num + 1}}>add</button>
        </>
    );
}
```

## 參考資料

[React - Context](https://reactjs.org/docs/context.html)  
[React Docs Beta - Passing Data Deeply with Context](https://beta.reactjs.org/learn/passing-data-deeply-with-context)  
[How to use React Context](https://www.robinwieruch.de/react-context/)  
[【Day.17】React入門 - 利用useContext進行多層component溝通](https://ithelp.ithome.com.tw/articles/10248080)  
[【Day.22】React效能 - 如何處理useContext的效能問題](https://ithelp.ithome.com.tw/articles/10249827)  
[[Day 22]React hook(中)-useContext&useReducer](https://ithelp.ithome.com.tw/articles/10241780)  

[React Docs Beta - Scaling Up with Reducer and Context](https://beta.reactjs.org/learn/scaling-up-with-reducer-and-context)  
[useReducer 真的能完全取代 Redux 嗎?](https://medium.com/hannah-lin/react-hook-%E7%AD%86%E8%A8%98-usereducer-%E7%9C%9F%E7%9A%84%E8%83%BD%E5%AE%8C%E5%85%A8%E5%8F%96%E4%BB%A3-redux-%E5%97%8E-fabcc1e9b400)  
q