# 目錄
- [目錄](#目錄)
  - [可讀性基本定理](#可讀性基本定理)
    - [註解](#註解)
    - [全局註解](#全局註解)
  - [命名](#命名)
  - [一致性](#一致性)
  - [參考資料](#參考資料)

## 可讀性基本定理

本書中`最重要`的原則，意指`撰寫程式時將讀者理解所需的時間降到最低`，而理解指的是能夠修改、除錯

好的命名、撰寫註解都是可以改善可讀性的方式

不過關於註解各派人馬有不同意見

有人認為程式碼本身要能解釋自己，所以除非必要的情況(ex: 特殊的需求、逼不得已的workaround)，不然不該寫過多的註解

有人則認為註解的重點是要解釋商業邏輯、為甚麼要這麼做(自己的想法)，所以可以的話儘量寫註解

```js
// ok
// PM要求能夠看到半個台北，所以大約是15
const mapZoom = 15;
```

### 註解

關於註解有幾個原則

- `不要註解很快能從程式碼知道的資訊`

  ```js
  // bad
  // 取得第一個數字
  const firstNumber = numberArray.slice(0, 1);

  // bad
  // 一個fucntion component
  const Table:FC = () => {
    // some code here
  }
  ```

  常數的使用情境及為何是特定數值通常有原因
  雖然不是必要，但為常數加上註解確實有助於了解
  ```js
  // ok
  // 這是多國語言的網站，PM要求預設語言設為英文
  const defaultLanguage = Locale.En;

  // UI要求圖片的切裁比例為16:9
  const imageSizeProportion = 9/16;
  ```

- 比起註解壞命名，不如修改命名
- 標明可能發生的危險
  例如函數內有不可避免地巢狀迴圈，某些情況下執行時間可能會較久

### 全局註解

`想像程式碼在外人眼中的樣子`，新成員最難理解的是全局(ex: class間的關係、資料流向)

```txt
// 這是輔助函數，位檔案系統提供一個封裝後方便操作的介面
// 處理檔案權限以及其他基礎細節
```

## 命名

大致上有5個原則

- 避免空泛、通用的詞彙
  
    ```js
    // bad
    const foo = 1;
    const bar = (a) => {
        return a.map((i) => i.age);
    }
    const data = {
        name:'Tempura',
        job:'Engineer'
    };
    const temp = new File(["test"], "test.txt", {
        type: "text/plain",
    });
    

    ```

    這類的詞彙無法說明變數、方法的用途

    不過temp、data這個名稱有例外，如果是生命週期很短的變數，則可以用temp做為基底去命名

    ```js
    // ok
    const personalData = {
        name:'Tempura',
        job:'Engineer'
    };
    const tempFile = new File(["test"], "test.txt", {
        type: "text/plain",
    });
    ```

- 優先使用具體名稱
- 加入額外資訊
  如果有重要資訊要讓使用者知道的話可以加上額外的字

  ```JS
    // id一定是16進位
    const hexId = '#A44A3F';
    // country的代表字串一定是2碼英文
    const countryAlpha2 = 'tw';
  ```
- 包含單位的數值
  ```js
    const aDaySeconeds = 86400;
  ```
- 加入重要的屬性
  比較嚴謹的方式可以用`匈牙利命名`

  但匈牙利命名法有一些缺點
  
  1.`運行時型別的改變`，導致型別與命名不符
    尤其在`動態型別的語言容易發生`，在強型別的語言則因為有型別系統，所以不太需要在命名標示型別

    ```js
    let ageNumber = 20;
    let locationObject = {
        lat:23.5,
        lng:121.3
    };
    const nowObject = new Date();
  ```

  2.多加的詞彙無法表明`變數的`目的`

  ```c
    // c代表常數
    static char c_duedate = "02-28";
    // p代表指標
    static char* p_last = NULL;
    // c代表數量(count)
    cch = 20;
  ```

## 一致性

coding style並無優劣之分，但重點是務必保持一致，這樣能讓程式碼更好閱讀

有些可以利用linter或者formatter自動處理

ex: 縮排要幾個space、是否comma-dangle(物件屬性最後的逗號)、函式宣告要用表達式或宣告式、package的import順序...

但有些coding style的問題則依賴團隊成員遵守規範，例如使用Record<string, number>或者{[key:string]:number}、early return是否需要block包住return


## 參考資料

[要不要支持註解？](https://www.ithome.com.tw/voice/99857)