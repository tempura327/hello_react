# 目錄

- [目錄](#目錄)
  - [state提升是甚麼](#state提升是甚麼)
  - [例子](#例子)
  - [參考資料](#參考資料)

## state提升是甚麼

有時`多個組件`要`對同個資料做出不同的反映`，這時官方建議將共享的`state提升到`最靠近它們的`共同父組件`

所謂對同個資料做出不同的反應，舉例來說就像「輸入inputA，inputB的值會隨之變化。反之亦然」，這在Vue透過v-model(雙向綁定)就能達成

但React不像Vue有雙向綁定，於是就需要`提升state`

這能讓`子組件們共用state`，也會`使debug更容易`

## 例子

這個例子中將做個將台灣、英國時間互相轉換的工具

首先需要寫轉換時間、轉換物件和字串的函式

```js
function convertToDateObj(dateStr){ // 將字串轉為Date
  return new Date(dateStr);
}

function convertToDateStr(dateObj){ // 將Date轉為字串
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const date = dateObj.getDate();

  const hour = dateObj.getHours();
  const min = dateObj.getMinutes();
  const sec = dateObj.getSeconds();
  
  return `${year}/${fillLengthUp(month)}/${fillLengthUp(date)} ${fillLengthUp(hour)}:${fillLengthUp(min)}:${fillLengthUp(sec)}`;
}

function fillLengthUp(num){ // 月、日、時、分、秒不足兩位數時補0
  return num.toString().padStart(2, 0);
}

function convertTime(targetTimeZone, timeZone, dateObj){ // 轉換時間
  const anHourSecond =  60 * 60 * 1000;// 一小時的毫秒數
  
  return new Date(dateObj - (targetTimeZone - timeZone) * anHourSecond);
}
```

再來做個輸入框組件(TimeInput)、和轉換時間組件(TimeConvertor)的切版

```js
class TimeInput extends Component {
  constructor(props) {
    super(props);
    this.state = {   };
  }

  render() { 
    return (
      <div>
        <p>UTC{this.props.timeZone >= 0? '+' : ''}{this.props.timeZone}</p>
        <input type="text" className='mb-3 p-2'/>
      </div>
    );
  }
}

class TimeConvertor extends Component {
  constructor(props) {
    super(props);

    this.state = {   };
  }

  render() {
    const timeZones = [8, 4, 0, -4, -8];
    let time = '';
    
    return (
      <div className='flex flex-col'>
        {
          timeZones.map((zone, index) => {
            return <TimeInput timeZone={zone} key={index}></TimeInput>
          })
        }
      </div>
    );
  }
}
```

這樣子就會看到畫面上有5個TimeInput了

![](https://static.coderbridge.com/img/tempura327/e6d2970b3991431e9616e23aac387c43.png)

當在TimeInput進行輸入時，需要把TimeInput的時區、輸入的時間字串拋到父組件，另外需要擋掉不合法的輸入

```js
class TimeInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };

    this.onTimeChange = this.onTimeChange.bind(this);
    this.validateTime = this.validateTime.bind(this);
  }

  onTimeChange(e){
    // (5)先驗證字串是否符合日期格式
    const {isValid, dateStr} = this.validateTime(e.target.value);

    // (6)若否則直接return
    if(!isValid) return;
    
    // 將父組件的方法當作prop傳進來
    // (7)使用這個prop把這個TimeInput的時區、值丟出去給父組件
    this.props.onTimeChange(this.props.timeZone, dateStr);
  }

  validateTime(dateStr){
    return /^[0-9]{4}(\/|-)[0-9]{2}(\/|-)[0-9]{2}( [0-9]{2}:[0-9]{2}:[0-9]{2}){0,1}$/.test(dateStr)? {isValid:true, dateStr} : {isValid:false, dateStr:''};
  }

  render() { 
    return (
      <div>
        <p>UTC{this.props.timeZone >= 0? '+' : ''}{this.props.timeZone}</p>

        {/* (3)子組件收父組件傳來的時間字串後將其顯示 */}
        {/* (4)子組的值被改變時呼叫this.onTimeChange */}
        <input type="text" className='mb-3 p-2' value={this.props.dateStr} onChange={this.onTimeChange}/>
      </div>
    );
  }
}


class TimeConvertor extends Component {
  constructor(props) {
    super(props);

    // (0)預設是+8時區、當前時間
    this.state = {
      timeZone:8,
      dateStr:convertToDateStr(new Date())
    };

    this.changeTime = this.changeTime.bind(this);
  }

  changeTime(timeZone, dateStr){
    // (8)
    // 當子組件輸入值改變且符合格式時，將子組件送過來的資料丟到state，設為標準時間、時區
    // 其他的TimeInput將以這個標準時間、時區做時間的轉換
    this.setState({
      timeZone,
      dateStr,
    });
  }

  render() {
    const timeZones = [8, 4, 0, -4, -8];
    let time = '';
    
    return (
      <div className='flex flex-col'>
        {
          timeZones.map((zone, index) => {
            //(1)(9) 計算每個TimeInput的值
            time = this.state.timeZone === zone? this.state.dateStr : convertToDateStr(convertTime(this.state.timeZone, zone, convertToDateObj(this.state.dateStr)));

            // (2)(10)將計算出來的時間再傳給子組件
            return <TimeInput timeZone={zone} dateStr={time} onTimeChange={this.changeTime} key={index}></TimeInput>
          })
        }
      </div>
    );
  }
}
```

最後的樣子

```js
function App(){
  return (
      <div className="container">
        <TimeConvertor></TimeConvertor>
      </div>
    )
}

export default App;
```

![](https://static.coderbridge.com/img/tempura327/9f08fa78ecde47acb6fd7711c9342ccc.gif)

## 參考資料

[提升 State](https://zh-hant.reactjs.org/docs/lifting-state-up.html)
[Lifting State up in ReactJS](https://www.geeksforgeeks.org/lifting-state-up-in-reactjs/)