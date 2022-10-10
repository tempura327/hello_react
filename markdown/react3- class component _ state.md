# 目錄

- [目錄](#目錄)
  - [class component](#class-component)
    - [範例](#範例)
    - [function component 與 class component](#function-component-與-class-component)
  - [state](#state)
    - [state是甚麼](#state是甚麼)
    - [state 與 props](#state-與-props)
  - [事件處理](#事件處理)
  - [參考資料](#參考資料)

## class component

### 範例

上一篇的Card組件若用class component撰寫會長這樣

```js
import {Component} from 'react';

class Card extend Component{
  constructor(prop){
    super(prop);
  }

  render(){
    return (
      <div className="flex justify-center flex-col">
        <img src={prop.imgSrc} alt={prop.text} />
        <p className="text-center">{prop.text}</p>
      </div>
    );
  }
}
```

### function component 與 class component

|     | function | class |
| --- | -------- | ----- |
| 分類 |  stateless component   |  stateful component   |
|  state |  除非使用React.useState()，否則沒有  |  〇  |
| kept alive  |  函式執行完就結束   |   只要實例沒有被消滅就會keep alive    |
| 使用生命週期  |  ✖  |  〇  |
|   |     |       |

## state

### state是甚麼

- `不要直接修改State`
  state只能在constructor被賦值，直接修改state的值並不會更新畫面
  
  `更新畫面要用setState()`，它會更新組件的state物件

- state的更新可能是非同步的
  `呼叫setState是非同步的`，當非同步更新發生時，若state中的某個屬性依賴於其他屬性的話可能出錯或者抓到舊資料

  這時可以傳個function給setState，這個function的第1個參數是舊的state，第2個則是新的prop(詳細看[事件處理](#事件處理)的範例)

- state更新後會被merge
  React把你提供的物件merge進去state

### state 與 props

## 事件處理

在到JSX綁定事件的方式和嵌入變數、HTML上綁定事件頗像

```js
<button className='p-3 bg-blue-300 text-white rounded' onClick={this.addNum}>add</button>
```

但是在JSX`呼叫一個方法`時，若後面沒加上()，方法的this指向undefined

雖然也可以選擇加上()，但如果這個function被當作props一層一層傳下去將會衝擊效能，所以官方不推薦這樣做

因此`必須要綁定它`，綁定的方式有2個

1. 必須`在constructor用bind綁定`它
2. 把該方法`變成公開的欄位`(public field)

   ```js
    class Counter extends React.Component {
      constructor(props){
        super(props);
        this.state = {num:0};

        // 一定要使用bind改變this的指向
        this.addNum = this.addNum.bind(this);    
      }

      // methods
      addNum(){
        this.setState((state, prop) => ({
          num: state.num + prop.unit
        }));
      }

      // 直接設成公開欄位
      discountNum = () => {
        this.setState((state, prop) => ({
          num: state.num - prop.unit
        }));
      }

      reset = () => {
        this.setState({
          num: 0
        })
      }

      render() {
        return (
          <div>
            <h2>{this.state.num}</h2>
            <button className='p-3 bg-blue-300 text-white rounded' onClick={this.addNum}>add</button>
            <button className='p-3 ml-3 bg-blue-300 text-white rounded' onClick={this.discountNum}>discount</button>
            <button className='p-3 ml-3 bg-blue-300 text-white rounded' onClick={this.reset}>reset</button>
          </div>
        );
      }
    }

    class App extends Component {
      constructor(props) {
        super(props);
      }

      render() { 
        return (
          <div className="container">
            <Counter unit={2}></Counter>
            <Counter unit={5}></Counter>
          </div>      
        );
      }
    }

    export default App;
   ```

  結果會像這樣

  ![](https://static.coderbridge.com/img/tempura327/19e42e95b3cf4c24a2140bee1cfd0385.gif)

## 參考資料

[State 和生命週期](https://zh-hant.reactjs.org/docs/state-and-lifecycle.html)
[Component State](https://zh-hant.reactjs.org/docs/faq-state.html)
[事件處理](https://zh-hant.reactjs.org/docs/handling-events.html)