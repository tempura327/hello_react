# 目錄

- [目錄](#目錄)
  - [controlled component](#controlled-component)
    - [controlled component是甚麼](#controlled-component是甚麼)
    - [例子](#例子)
  - [uncontrolled component](#uncontrolled-component)
    - [uncontrolled component是甚麼](#uncontrolled-component是甚麼)
    - [例子](#例子-1)
  - [參考資料](#參考資料)

<br>

## controlled component

### controlled component是甚麼

在HTML中，表單通常會有input、textarea、select這些會根據輸入值管理、更新自身state的組件。
在React，可變的狀態通常會被放在組件的state，並且只能透過setState()更新它們。

> In HTML, form elements such as input, textarea, and select typically maintain their own state and update it based on user input. In React, mutable state is typically kept in the state property of components, and only updated with setState().

表單組件會控制表單該根據使用者輸入的值發生甚麼事。其值以這種方式被React控制的組件即controlled component

> Then the React component that renders a form also controls what happens in that form on subsequent user input. 
> An input form element whose value is controlled by React in this way is called a “controlled component”.

總之粗略說`controlled component`完全不依賴外部，`只透過state和setState()控制資料的組件`

因為只要資料更新就要setState()，所以controlled component對於`資料的更新會比較及時`，但也因為setState後畫面重新就重新渲染，`效能會較差`

一個controlled component中至少有一個controlled element

<br>

### 例子

```js
class CheckItem extends Component{
  constructor(props){
    super(props);

    this.state = {};

    this.toggle = this.toggle.bind(this);
  }

  toggle(e){
    this.props.onToggle(Boolean(e.target.value), this.props.index);
  }

  render(){
    return (
      <div className="inline">
        <input type="checkbox" checked={this.props.state} value={this.props.state} onChange={this.toggle} disabled={this.props.state} className="mr-2" />
        <label className={this.props.state? 'line-through' : ''}>{this.props.text}</label>
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
    this.toggle = this.toggle.bind(this);
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

  toggle(value, index){
    const copiedList = JSON.parse(JSON.stringify(this.state.list));

    copiedList.splice(index, index + 1, {
      text:copiedList[index].text,
      state:value
    });

    this.setState({
      list:copiedList
    });
  }

  render() { 
    return (
      <div>
        <input type="text" value={this.state.pendingValue} className="p-2" onChange={this.changePendingValue}/>
        <button className="bg-blue-400 p-2 ml-2 rounded text-white" onClick={this.addItem}>add</button>

        <ul className='flex flex-col'>
          {this.state.list.map((i, index) => <CheckItem text={i.text} state={i.state} onToggle={this.toggle} key={index} index={index}></CheckItem>)}
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

當有`多個controlled element`時，可以在controlled element加上name屬性方便區分

但這樣可能導致一個controlled component裡面有太多變數、event handler，所以`官方推薦`大多情況`用uncontrolled component`來實作表單

<br>

## uncontrolled component

### uncontrolled component是甚麼

`uncontrolled component常用於file input`

它是`用ref來取得DOM的資料`，而不為每個state的更新寫event handler

`uncontrolled component`有以下優點

1. 更`容易整合`React和非React的`程式碼`，且能`減少程式碼`
2. 不用setState()，效能會比較好可以

雖然有這些優點，`但`其實這作法滿`髒`的，官方推薦通常還是盡量使用controlled component

<br>

### 例子

```js
class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewUrl:'',
      previewFileName:''
    };

    this.fileInput = React.createRef();
    this.fileInputClick = this.fileInputClick.bind(this);
    this.changePreview = this.changePreview.bind(this);
  }

  fileInputClick() {
    this.fileInput.current.click();
  }

  changePreview(e){
    const files = e.target.files;
    const reader = new FileReader();

    reader.onload = (e) => {
      this.setState({
        previewUrl:e.target.result,
        previewFileName:files[0].name
      });
    }

    reader.readAsDataURL(files[0]);    
  }

  render() { 
    return (<div>
      <img src={this.state.previewUrl} alt="" className='w-32'/>

      <div className='flex'>
        {/* 把醜醜的fileInput藏起來 */}
        <input type="file" className='hidden' ref={this.fileInput} onChange={this.changePreview}/>
        
        {/* 用一個input和button替代它放在畫面上 */}
        <input type="text" value={this.state.previewFileName} disabled placeholder='name of file' className='p-2 rounded-l'/>
        {/* 按了這個button相當於按了fileInput */}
        <button type="button" onClick={this.fileInputClick} className="p-2 bg-blue-400 text-white rounded-r">choose file</button>
      </div>
    </div>);
  }
}
```

<br>

## 參考資料

[Controlled Component](https://zh-hant.reactjs.org/docs/forms.html)  
[Uncontrolled Component](https://zh-hant.reactjs.org/docs/uncontrolled-components.html)  
[Refs 和 DOM](https://zh-hant.reactjs.org/docs/refs-and-the-dom.html)  
[Controlled and uncontrolled form inputs in React don't have to be complicated](https://goshacmd.com/controlled-vs-uncontrolled-inputs-react/)  
[Day 9 - 為什麼要用 Controlled Component](https://ithelp.ithome.com.tw/articles/10297302)  
[【Day 19】 受控組件(Controlled Component)與非受控組件(Uncontrolled Component)](https://ithelp.ithome.com.tw/articles/10248038)  