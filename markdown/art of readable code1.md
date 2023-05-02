# 目錄
- [目錄](#目錄)
  - [可讀性基本定理](#可讀性基本定理)
  - [富含資訊的命名](#富含資訊的命名)
  - [參考資料](#參考資料)

## 可讀性基本定理

本書中`最重要`的原則，意指`撰寫程式時將讀者理解所需的時間降到最低`，而理解指的是能夠修改、除錯

好的命名、撰寫註解都是可以改善可讀性的方式

不過關於註解有另一派的人認為程式碼本身要能解釋自己，所以除非必要的情況(ex: 特殊的商業邏輯、逼不得已的workaround)，不然不該寫過多的註解

## 富含資訊的命名

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
    尤其在動態型別的語言容易發生，在強型別的語言則因為有型別系統，所以不太需要在命名標示型別

    ```js
    let ageNumber = 20;
    let locationObject = {
        lat:23.5,
        lng:121.3
    };
  ```

  2.多加的詞彙無法表明`變數的`目的`

  ```php
    // c代表常數
    public const c_duedate = "02-28";
  ```

## 參考資料

[要不要支持註解？](https://www.ithome.com.tw/voice/99857)