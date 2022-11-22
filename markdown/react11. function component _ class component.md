# 目錄

- [目錄](#目錄)
  - [差異](#差異)
  - [useRef](#useref)
  - [參考資料](#參考資料)

## 差異

class component有生命週期，那還要function component做甚麼?🤔

先說結論，class component和function component`絕對不只差在`預設`有無生命週期`

它們的關鍵`差在於function` component會`抓住render時`(一個render就是一幀)`props`傳進來`的值`，而`class` component`則否`

> Function components capture the rendered values.

每次組件的`資料更新`，`function`(component)會`被呼叫`，之後會render，`每次render`都會`產生一幀`

`function`每次`被呼叫`都會`產生function scope`，也就是說`前一幀和後一幀的`scope是`互相獨立`的，且`組件內的變數都是常數`(constant)

以下面這段code來說就是，組件資料更新時，都會產生新的scope，裡面都有一個常數num(舊的num和新的num互相獨立)

```js
const [num, setNum] = useState(0);
```

以這個[例子](https://codesandbox.io/s/falling-framework-gvejp5?file=/src/ProfilePageFunction.js)(取自[How Are Function Components Different from Classes?](https://overreacted.io/how-are-function-components-different-from-classes/))來說

function component在按了鈕後迅速切換選項的情況下，最後setTimeout會得到舊的值

因為setTimeout被排入event loop的當下，它抓住了那一幀的props的值(舊值)，然後在3秒後才印出來

```js
  // 上略

  const handleClick = () => {
    setTimeout(() => alert('Followed ' + props.user), 3000);
  };

  // 下略
```

同樣的操作發生在class component，最後setTimeout會得到新的值

這是因為React的`props是immutable，但this是mutable`

`只要實例不被消滅`，隨著`資料`的`更新`，`this`也會被`更新`，所以才會得到新的值

```js
  // 上略

  handleClick = () => {
    setTimeout(alert('Followed ' + this.props.user), 3000);
  };
  
  // 下略
```

所以說按了鈕後故意馬上unmount組件(消滅實例)，就會得到和function component一樣的結果

![](https://static.coderbridge.com/img/tempura327/34381daf3e724f57afabd49627f99cee.gif)

```js
class Bar extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidUpdate(){
    setTimeout(() => {
      console.log(`Bar: ${this.props.name}`);
      
    }, 3000);
  }

  render() { 
    return (
      <div>
        name of Bar is {this.props.name}
      </div>
    );
  }
}
```

```js
function App(){
  const [nickName, setNickName] = useState('Emma');
  const [arr, setArr] = useState([1]);

  return (
    <div>
      {
        // Bar依賴父組件的資料arr，arr內有幾個元素，就有幾個Bar被mount
        arr.map((i, index) => <Bar key={index} name={nickName}></Bar>)
      }

      <select className='block my-3' onChange={(e) => {setNickName(e.target.value)}}>
        <option value="Alex" key="Alex">Alex</option>
        <option value="Joyce" key="Joyce">Joyce</option>
      </select>

      {/* 藉由在父組件清空陣列來unmount子組件Bar */}
      <SimpleButton click={() => {setArr([])}}>clear arr</SimpleButton>
    </div>
  )
}
```

但如果不想unmount組件呢🤔

使用解構將name抽出，切斷props和this的連結

這樣componentDidUpdate每次執行都會創造出不同的function scope

```js
// Bar

  // 上略

  render() { 
    const props = this.props;

    setTimeout(() => {
      console.log(`Bar: ${props.name}`);
      
    }, 3000);

    return (
      <div>
        name of Bar is {this.props.name}
      </div>
    );
  }

  // 下略
```

## useRef

`useRef`()是一個hook

它的`current`屬性就像就像實例的屬性，可以存任何值，而且是`mutable`

> The useRef() Hook isn’t just for DOM refs. The “ref” object is a generic container whose current property is mutable and can hold any value, similar to an instance property on a class.

透過它可以得到像上面的例子中class component一樣的結果(按了鈕後迅速切換選項，最後setTimeout會得到新的值)

```js
function Foo(props){
  const name = useRef('Emma');

  useEffect(() => {
    name.current = props.name;

    setTimeout(() => {
      console.log(name.current);
      console.log(props.name);
  
    }, 3000);

  });

  return (
    <p>name of Foo is {props.name}</p>
  )
}

function App(){
  const [nickName, setNickName] = useState('Emma');

  return (
    <div>
      <Foo name={nickName}></Foo>

      <select className='block my-3' onChange={(e) => {setNickName(e.target.value)}}>
        <option value="Alex" key="Alex">Alex</option>
        <option value="Joyce" key="Joyce">Joyce</option>
      </select>
    </div>
  )
}
```

## 參考資料

[從實際案例看 class 與 function component 的差異](https://blog.techbridge.cc/2020/06/13/class-function-component-and-useeffect/)  
[How Are Function Components Different from Classes?](https://overreacted.io/how-are-function-components-different-from-classes/)  
[How to fetch data with React Hooks](https://www.robinwieruch.de/react-hooks-fetch-data/)  
[A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/)  