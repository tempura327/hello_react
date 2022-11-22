# 目錄

- [目錄](#目錄)
  - [生命週期](#生命週期)
  - [常用的hook](#常用的hook)
  - [少用的hook](#少用的hook)
  - [React & Vue生命週期](#react--vue生命週期)
    - [mounting](#mounting)
    - [updating](#updating)
    - [unmounting](#unmounting)
    - [其他](#其他)
  - [參考資料](#參考資料)

## 生命週期

React的`生命週期`有新版(React 16.3+)和舊版

`新`版新增2個，計畫`廢棄3個hook`(componentWillMount、componentWillUpdate、componentWillReceiveProps)

之所以說計畫是因為直到18.2的現在仍未完全棄用，只要加上UNSAFE_還是能用，但UNSAFE_和安全性並無關

廢棄的原`因`是React`未來`要朝`非同步渲染`走，而那些hook可能被濫用導致生成滿滿的bug

本文的生命週期是指新版的，可以粗分為3個階段

當組件的實例被建立且加入DOM時，生命週期會依照下列的順序被呼叫

1. mounting
   - `constructor`
   - static getDerivedStateFromProps(少用)
   - `render`
   - `componentDidMount`
  
2. updating
   - static getDerivedStateFromProps(少用)
   - shouldComponentUpdate(少用)
   - `render`
   - getSnapshotBeforeUpdate(少用)
   - componentDidUpdate

3. unmounting
   - componentWillUnmount  


render時發生錯誤則會呼叫以下方法  

- static getDerivedStateFromError
- componentDidCatch

## 常用的hook

- constructor
    如果沒有`初始化state`，也不`綁定方法`的話，就不需要

    使用this前必須呼叫super(props)，否則會報錯"Must call super constructor in derived class before accessing 'this' or returning from derived constructor"

    使用這個hook時有幾點需要注意

    1. 避免在constructor中產生side effect(ex: 用package的API訂閱、撈資料)，需要的話就用componentDidMount

    2. 不要複製prop到state，因為props更新時state不會一起被更新，這可能導致bug

        ```js
        constructor(props){
           super(props);

           this.state = {color: props.color}
        }
        ```

- render  
    class component中唯一`必要`的方法

    render()必須是`pure`，也就是說它`不改變state`，且每次都回傳同樣的結果

    shouldComponentUpdate() 回傳的值為false，則render不會被呼叫

    如果`父`組件在`componentDidMount內呼叫setState()`，`子`組件的`render`會跑`2`次

- componentDidMount
    組件被掛載後立刻呼叫

    如果要撈資料的話，官方推薦在此時`打request`(componentDidUpdate也可以)

    ![componentDidMount 1](https://static.coderbridge.com/img/tempura327/0a8a03e570f14bf28bdd164535020ff2.png)
    
    ```js
      class Child extends Component {
        constructor(props) {
          super(props);
          this.state = {  };
        }

        componentDidMount(){
          console.log('child did mount');
          console.log(this.props.message);
        }

        render() { 
          return (
            <div>
              <h1 className='mb-3'>this is child.</h1>

              <p>{this.props.message}</p>
            </div>
          );
        }
      }

      class Parent extends Component {
        constructor(props) {
          super(props);

          this.state = {
            message:'this is message from parent constructor'
          };
        }

        render() { 
          return (
            <div>
              <Child message={this.state.message}></Child>
            </div>
          );
        }
      }
    ```

    ![componentDidMount 2](https://static.coderbridge.com/img/tempura327/e55306ce9a8543649ec4da61a0cdc723.png)

    如果在父組件撈然後傳過來的話，因為是非同步，所以此時`props還沒傳過來`

    ```js
      class Child extends Component {
        constructor(props) {
          super(props);
          this.state = {  };
        }

        componentDidMount(){
          console.log('child did mount');
          console.log(this.props.message);
        }

        render() { 
          console.log('child render');

          return (
            <div>
              <h1 className='mb-3'>this is child.</h1>

              <p>{this.props.message}</p>
            </div>
          );
        }
      }

      class Parent extends Component {
        constructor(props) {
          super(props);
          this.state = {  };
        }

        async componentDidMount(){
         console.log('parent did mount');

         // 在這呼叫setState()會讓Child render()跑2次
         this.setState({
           message:await this.getRes()
         });
        }

        getRes(){
          return new Promise((resolve) => {
            resolve('this is res from this.getRes()');
          });
        }

        render() { 
          return (
            <div>
              <Child message={this.state.message}></Child>
            </div>
          );
        }
      }
    ```

    在此hook`呼叫setState()`，這會觸發一次額外的render，需要慎用，`因為可能衝擊效能`

- componentDidUpdate
   `參數`依序是`舊的props、舊的state`、snapshot，snapshot來自getSnapshotBeforeUpdate的回傳值

   因為有以上參數，所以如果有打request的話在這個hook進行比較，達成條件時才setState()，以避免無限迴圈

   例子可以看以下2篇

   [父組件 - WeatherForecast](https://github.com/tempura327/hello_react/blob/master/src/WeatherForecast.js)、
   [子組件 - BarChart](https://github.com/tempura327/hello_react/blob/master/src/BarChart.js)

- componentWillUnmount
   組件被移除、實例被消滅`前`一刻呼叫
  
   因為馬上就會到componentDidUnmount，所以`不該`在這個階段`呼叫setState()`

   在這個階段可以`取消side effect`(ex: 計時器、訂閱API)

## 少用的hook

- shouldComponentUpdate
    控制資料改變後是否要重新render，初次render不會呼叫，預設為true，回傳false時不重新渲染

    因為是`淺比較`所以如果物件有多層仍可能出錯

    官方建議使用[React.PureComponent](https://zh-hant.reactjs.org/docs/react-api.html#reactpurecomponent)代替，因為它有實作這個hook，不必自行撰寫

- **static** getDerivedStateFromProps
   組件render前呼叫

   多用於state依賴於props的狀況，`監聽props`改變`並更新state`

   需要回傳一個物件，用以更新state，如果不需要更新的話回傳null

- getSnapshotBeforeUpdate
    重新render前呼叫

    參數依序是舊的props、state

    需要回傳值，`回傳`值會傳`給componentDidUpdate`


## React & Vue生命週期

### mounting

| React 16.3+              | Vue 2        | Vue 3 composition API | 說明                                                                                           |
| ------------------------ | ------------ | --------------------- | ---------------------------------------------------------------------------------------------- |
| constructor              | beforeCreate | setup                 | React實例被初始化，此階段可透過this取用props、state，Vue實例已初始化，但無法透過this取用option |
|                          | created      | setup                 | Vue options(ex: data、props、method...)設置完成                                                |
|                          | beforeMount  | onBeforeMount         | render function將template被轉為virtual DOM，但還未掛載到this.$el                               |
| getDerivedStateFromProps |              |                       |                                                                                                |
| render                   |              |                       | 將virtual DOM渲染成真的DOM                                                                     |
| componentDidMount        | mounted      | onMounted             | 組件被掛到DOM，並設為Vue的this.$el                                                             |

### updating

| React                    | Vue2         | Vue 3 composition API | 說明                                                                     |
| ------------------------ | ------------ | --------------------- | ------------------------------------------------------------------------ |
| getDerivedStateFromProps |              |                       |                                                                          |
| shouldComponentUpdate    |              |                       | 控制資料改變後是否要重新render                                           |
|                          | beforeUpdate | onBeforeUpdate        | 資料變動使得DOM被patch前呼叫                                             |
| render                   |              |                       | diff演算法比較virtual DOM的差異，重新渲染不同的地方                      |
| getSnapshotBeforeUpdate  |              |                       | 資料變動導致重新render前，抓住舊的props、state，並傳給componentDidUpdate |
| componentDidUpdate       | updated      | onUpdated             | DOM被更新                                                                |

### unmounting

| React                | Vue2          | Vue 3 composition API | 說明                                                                                                                     |
| -------------------- | ------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| componentWillUnmount | beforeDestroy | onBeforeUnmount       | 組件從DOM移除、實例被消滅前，在此取消side effect。React此時可以，但不該呼叫setState，Vue最後一個可以用this操作實例的hook |
|                      | destroyed     | onUnmounted           | 組件被移除，實例被消滅                                                                                                   |

### 其他

| React                    | Vue2          | Vue 3 composition API | 說明                |
| ------------------------ | ------------- | --------------------- | ------------------- |
| getDerivedStateFromError | errorCaptured | onErrorCaptured       | 捕捉子/孫組件的錯誤 |
| componentDidCatch        | errorCaptured | onErrorCaptured       | 捕捉子/孫組件的錯誤 |

## 參考資料

[React - React.Component](https://zh-hant.reactjs.org/docs/react-component.html#the-component-lifecycle)  
[Vue & React lifecycle method comparison](https://ash.ms/2019/02/20/2019-02-19-vue-react-lifecycle-method-comparison/)  