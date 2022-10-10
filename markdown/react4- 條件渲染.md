# 目錄

- [目錄](#目錄)
  - [inline if 與 &&](#inline-if-與-)
  - [inline if-else 與 三元運算子](#inline-if-else-與-三元運算子)
  - [參考資料](#參考資料)

## inline if 與 &&

假設現在有一個組件，可以按鈕可以控制是否顯示

```js
class Hello extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() { 
    return (
      <div className={this.props.className} onClick={this.props.onClick}>
        <h1>hello, {this.props.name}</h1>
      </div>
    );
  }
}
```

使用&&運算子可以達到inline if的功效，對應的Vue寫法是v-if

```js
class App extends Component {
  state = {
    isHelloOn:true
  };

  // methods
  toggle = () => {
    this.setState({
      isHelloOn:!this.state.isHelloOn,
    })
  }

  render(){
    return (
      <div className="container">
        <h1>{`isHelloOn: ${this.state.isHelloOn}`}</h1>

        <button className='mb-3 p-2 bg-blue-500 text-white rounded' onClick={this.toggle}>toggle</button>

        {this.state.isHelloOn && <Hello name="Tempura" className="text-yellow-400"></Hello>}
      </div>
    )
  };
}
 
export default App;
```

另外也可以return null來避免組件被渲染

```js
class Hello extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() { 
    return this.props.isShow? (
      <div className={this.props.className}>
        <h1>hello, {this.props.name}</h1>
      </div>
    ) : null;
  }
}

class App extends Component {
  state = {
    isHelloOn:true
  };

  // methods
  toggle = () => {
    this.setState({
      isHelloOn:!this.state.isHelloOn,
    })
  }

  render(){
    return (
      <div className="container">
        <h1>{`isHelloOn: ${this.state.isHelloOn}`}</h1>

        <button className='mb-3 p-2 bg-blue-500 text-white rounded' onClick={this.toggle}>toggle</button>

        <Hello name="Tempura" className="text-yellow-400" isShow={this.state.isHellOn}></Hello>
      </div>
    )
  };
}
 
export default App;
```


## inline if-else 與 三元運算子

又多了個組件，可以按鈕可以切換他們

```js
class Goodbye extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() { 
    return (
      <div className={this.props.className}>
        <h1>Goodbye, {this.props.name}</h1>
      </div>
    );
  }
}
```

使用三元運算子可以達到inline if-else的功效，對應的Vue寫法是v-if + v-else

```js
class App extends Component {
  state = {
    isHelloOn:true
  };

  // methods
  toggle = () => {
    this.setState({
      isHelloOn:!this.state.isHelloOn,
    })
  }

  render(){
    return (
      <div className="container">
        <h1>{`isHelloOn: ${this.state.isHelloOn}`}</h1>

        <button className='mb-3 p-2 bg-blue-500 text-white rounded' onClick={this.toggle}>toggle</button>

        {this.state.isHelloOn? <Hello name="Tempura" className="text-yellow-400"></Hello> : <Goodbye name="Tempura" className="text-blue-400"></Goodbye>}
      </div>
    )
  };
}
 
export default App;
```

## 參考資料

[條件 Render](https://zh-hant.reactjs.org/docs/conditional-rendering.html)