# 目錄

- [目錄](#目錄)
  - [CSS in JS是甚麼](#css-in-js是甚麼)
  - [props](#props)
  - [延伸樣式](#延伸樣式)
  - [attrs](#attrs)
  - [helpers](#helpers)
    - [createGlobalStyle](#createglobalstyle)
    - [keyframes & theme](#keyframes--theme)
  - [參考資料](#參考資料)

## CSS in JS是甚麼

CSS in JS是組件的設計模式

它讓`每個組件的樣式`都是`獨立`，而不是拆分放到通通放到index.css

這可以`避免元件之間，因為class name相同而互相影響`，且如其名可以在可JS寫CSS

但CSS in JS並`不是React原生`的功能，它需要透過第三方package(ex:`styled-component`、emotion)來實現

styled-component會生成不與其他元件重複的class name

```bash
npm i styled-components
```

## props

<!-- 在[React(7) - composition]()中，使用了props的方式來控制SimpleButton的文字、樣式 -->

那用styled-component的話會怎麼寫吧

首先import styled-component

```js
import styled, { css } from 'styled-components'; 

const colorMap = {
  primary:{
    normal:'#08A6BB',
    dark:'#068394'
  },
  error:{
    normal:'#dc3545',
    dark:'#b62d3b'
  },
  warning:{
    normal:'gold',
    dark:'#e2c000'
  },
  secondary:{
    normal:'#9999a3',
    dark:'#71717a'
  }      
};
```

```js
const SimpleButton = styled.button`
  border: 2px solid;
  border-radius: 0.25rem;
  padding: 0.5em;

  ${props => {
    if(props.outline){
      return css`
        background: transparent;
        color: ${colorMap[props.color].normal};
        border-color: ${colorMap[props.color].normal};

        &:hover{
          color: white;
          background: ${colorMap[props.color].normal};
        }
      `
    }else{
      return css`
        background: ${colorMap[props.color].normal};
        color: white;
        border-color: ${colorMap[props.color].normal};

        &:hover{
          background: ${colorMap[props.color].dark};
          border-color: ${colorMap[props.color].dark};
        }        
      `
    }
  }}
`;

SimpleButton.defaultProps = { // 設置props的default value
  color: 'primary',
}

function App(){
  return (
    <div className="container">
      {/* 使用onClick prop就將方法綁定 */}
      <SimpleButton onClick={() => alert('this is normal button')}>Normal Button</SimpleButton>
      
      {/* 使用自訂的outline、color prop設定樣式 */}
      {/* 如果想和Tailwind混用，使用className，就可以把Tailwind的class name傳進去 */}
      <SimpleButton outline color="error" className="ml-3">Outline Button</SimpleButton>
    </div>
  );
}
 
export default App;
```

## 延伸樣式

延伸樣式常用於特別化的情況，只要用styled()將base component包起來就可以

![extend style](https://static.coderbridge.com/img/tempura327/6f2fe5cc37764a969a23057ae61f51ad.png)

```js
const PillButton = styled(SimpleButton)`
  border-radius:50rem;
`;

function App(){
  return (
    <div className="container">
      <PillButton className="ml-3"color="secondary">PillButton</PillButton>
    </div>
  );
}
 
export default App;
```

## attrs

attrs和JS的setAttribute(name, value)一樣，可以幫styled component設置各種attribute

![](https://static.coderbridge.com/img/tempura327/dbde15097af247659164fdabac6e7033.gif)

```js
const Input = styled.input.attrs({ type: 'checkbox' })``;

const Label = styled.label`
  align-items: center;
  display: flex;
  margin: 0 4px;
`;

class CheckItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle(e){
    this.props.onBoxClick(this.props.data.index, e.target.checked);
  }

  render() {
    const {text, isChecked} = this.props.data;

    return (
      <div className={`flex ${isChecked && 'line-through'}`}>
        <Input checked={this.props.data.isChecked} onChange={this.toggle} disabled={this.props.data.isChecked}></Input>
        <Label>{text}</Label>
      </div>      
    );
  }
}

class ToDoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingValue:'',
      list:[
        {text:'walking dog', isChecked:false},
      ],
    };

    this.addItem = this.addItem.bind(this);
    this.changePendingValue = this.changePendingValue.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
  }

  changePendingValue(e){
    this.setState({
      pendingValue:e.target.value
    });
  }

  addItem(){
    this.setState((state) => {
      state.list.push({text:this.state.pendingValue, isChecked:false});
    });

    this.setState({
      pendingValue:''
    })
  }

  toggleCheckbox(index, isChecked){
    let list = JSON.parse(JSON.stringify(this.state.list));
    const targetItem = list[index];

    targetItem.isChecked = isChecked;
    list.splice(index, index + 1, targetItem);

    this.setState({
      list:list
    });
  }

  render() { 
    return (
      <div>
        <input type="text" value={this.state.pendingValue} className="p-2" onChange={this.changePendingValue}/>

        <SimpleButton className="ml-2" onClick={this.addItem}>add</SimpleButton>

        <ul>
          {
            this.state.list.map((item, index) => 
              <CheckItem data={{...item, index}} onBoxClick={this.toggleCheckbox} key={`${item.text}-${index}`}></CheckItem>)
          }
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() { 
    return (
      <div className='container'>
        <h1 className='text-xl bold mb-3'>React</h1>
        <ToDoList></ToDoList>
      </div>      
    );
  }
}
 
export default App;
```

## helpers

### createGlobalStyle

一般來說styled component的scope只會是該組件，以確保不同組件間的樣式不會互相干擾

如果想要讓樣式變成全域的(ex: reset.css那類整個網站都要套用的樣式)，就需要使用createGlobalStyle

```js
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    color: ${props => (props.darkMode ? 'white' : '#333')};
  }
`;

function App(){
  return (
    <div>
      {/* 如果是暗黑模式就把字全部都設為白色 */}
      <GlobalStyle darkMode />
    </div>
  )
}
```

### keyframes & theme

![](https://static.coderbridge.com/img/tempura327/129b0e1e8e6f4d2fab9a2c3c3f8f30c9.gif)

```js
import styled, { keyframes } from 'styled-components

function animationHelper(colors){
  return keyframes`
    0%{
      background-color: ${colors[0]};
    }

    25%{
      background-color: ${colors[1]};
    }

    50%{
      background-color: ${colors[2]};
    }

    75%{
      background-color: ${colors[3]};
    }

    100%{
      background-color: ${colors[4]};
    }
  `;
}

const brown = animationHelper(['#A7A284', '#8a8462', '#716834', '#5a5019', '#433E0E']);
const red = animationHelper(['#f87e8a', '#fd3e51', '#dc3545', '#b62d3b', '#91252f']);
const blue = animationHelper(['#7e9df8', '#3e64fd', '#4035dc', '#462db6', '#253991']);

const Box = styled.div`
  animation: blue 750ms infinite;
  animation: ${props => props.theme.animation} 750ms 5;
`

Box.defaultProps = {
  theme:{
    animation:blue
  }
} 

function App(){
  return (
    <div className='flex justify-around'>
      <Box className='p-3' theme={{animation:brown}}>box</Box>
      <Box className='p-3' theme={{animation:red}}>box</Box>
      <Box className='p-3'>box</Box>
    </div>
  )
}

export default App;
```

## 參考資料

[Day 23 - 為什麼要用 Styled-components](https://ithelp.ithome.com.tw/articles/10306153)  
[styled component](https://styled-components.com/)  
[A Lukewarm Approval of CSS-in-JS](https://sparkbox.com/foundry/css_in_js_overview_css_in_js_pros_and_cons)  