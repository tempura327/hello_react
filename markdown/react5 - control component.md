# 目錄

- [目錄](#目錄)
  - [controlled component是甚麼](#controlled-component是甚麼)
  - [範例](#範例)
  - [參考資料](#參考資料)

## controlled component是甚麼

在HTML中，表單通常會有input、textarea、select這些會根據輸入值管理、更新自身state的組件。
在React，可變的狀態通常會被放在組件的state，並且只能透過setState()更新它們。

> In HTML, form elements such as <input>, <textarea>, and <select> typically maintain their own state and update it based on user input. In React, mutable state is typically kept in the state property of components, and only updated with setState().

表單組件會控制表單該根據使用者輸入的值發生甚麼事。其值以這種方式被React控制的組件即controlled component

> Then the React component that renders a form also controls what happens in that form on subsequent user input. An input form element whose value is controlled by React in this way is called a “controlled component”.

總之粗略說controlled component完全不依賴外部，也就是說它能顯示、更新自己的值

## 範例

```js
class CheckItem extends Component{
  constructor(props){
    super(props);

    this.state = {
      isDone:props.state,
    }

    this.toggle = this.toggle.bind(this);
  }

  toggle(){
    this.setState({
      isDone: !this.state.isDone,
    })
  }

  render(){
    return (
      <div className="inline">
        <input type="checkbox" checked={this.state.isDone} value={this.state.isDone} onChange={this.toggle} disabled={this.state.isDone} className="mr-2" />
        <label className={this.state.isDone? 'line-through' : ''}>{this.props.text}</label>
      </div>
    )
  }
}

class ToDoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingValue:'',
      list:[
        {text:'sweeping floor', state:false},
      ],
    };

    this.addItem = this.addItem.bind(this);
    this.changePendingValue = this.changePendingValue.bind(this);
  }

  changePendingValue(e){
    this.setState({
      pendingValue:e.target.value
    });
  }

  addItem(){
    this.setState((state) => {
      state.list.push({text:this.state.pendingValue, state:false});
    });

    this.setState({
      pendingValue:''
    })
  }

  render() { 
    return (
      <div>
        <input type="text" value={this.state.pendingValue} className="p-2" onChange={this.changePendingValue}/>
        <button className="bg-blue-400 p-2 mb-4 ml-2 rounded text-white" onClick={this.addItem}>add</button>

        <ul>
          {this.state.list.map((i, index) => <CheckItem text={i.text} state={i.state} key={index}></CheckItem>)}
        </ul>
      </div>
    );
  }
}
```

用起來會長這樣

你可以發現ToDoList完全不依賴App

```js
class App extends Component {
  state = {
    
  };

  render(){
    return (
      <div className="container">
        <ToDoList></ToDoList>
      </div>
    )
  };
}
 
export default App;
```

## 參考資料

[Controlled Component](https://zh-hant.reactjs.org/docs/forms.html)