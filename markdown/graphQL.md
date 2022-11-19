# 目錄

- [目錄](#目錄)
  - [GraphQL是甚麼](#graphql是甚麼)
  - [語法](#語法)
    - [field & argument](#field--argument)
    - [variable](#variable)
    - [aliases](#aliases)
    - [fragment](#fragment)
    - [指令 include](#指令-include)
  - [參考資料](#參考資料)

## GraphQL是甚麼

GraphQL是種資料庫查詢語言

其架構是由一個一個的type組成，type內定義了欄位

```js
// type是型別宣告的關鍵字，Capsule則是型別名
type Capsule {
  // 內部是欄位、欄位的型別
  id: ID
  landings: Int
  missions: [CapsuleMission]
  original_launch: Date
  reuse_count: Int
  status: String
  type: String
  dragon: Dragon
}
```

優點

1. 只拿需要的資料
2. 極具`彈性`，資料間可以連來連去，且不像SQL的Join複雜
3. 支援`型別定義、偵錯`，目前有5種預設型別，Int、Float、String、Boolean、ID(String | Int)

缺點

1. 無論query是否成功都會得到HTTP code 200，使得難以處理error的情況
2. `快取有困難`
   官方提到可以用2種方法發request給GraphQL，GET與POST

   `GET`因為網址會帶query string，所以可快取

   只是網址可能會長成這樣，而且`帶有變數`的request並`無法使用`此方法

   ```bash
    // 一定要留空格，空格代表換行
    https://api.spacex.land/graphql/?query={ capsules { id missions { name flight } } }
   ```

   `POST`的話因為把query轉為JSON，並帶入body，所以`response`並`不會被cache`

   ```js
    async function bar(){
        const res = await fetch('https://api.spacex.land/graphql/', {
            method:'POST',
            body:JSON.stringify({query:"{\n  capsules {\n    id\n  }\n}\n", variables:null}),
            headers:{
                "Content-Type":"application/json; charset=utf-8"
            }
        })

        return await res.json();
    }

    const {data} = await bar();
    console.log(data);
   ```

   關於GET與POST可以回顧[這篇](https://tempura-good-good.coderbridge.io/2022/08/01/GET-POST/)


## 語法

本文使用中的例子是[GraphQL playground - space X](https://api.spacex.land/graphql/)來進行操作

它的schema滿完整的，只可惜使用的GraphQL版本低於5

### field & argument

field就是欄位，有甚麼欄位可以用Docs看

`query`是operation type，capsuleData是`operation name`，只有一組query時可以不寫，`多組一定要寫，不然會發生衝突`

先來看一下型別

```js
// ()內的是argument，:後是型別
capsules(
    find: CapsulesFind
    limit: Int
    offset: Int
    order: String
    sort: String
): [Capsule]
```

```js
// Capsule的欄位
id: ID
landings: Int
missions: [CapsuleMission]
original_launch: Date
reuse_count: Int
status: String
type: String
dragon: Dragon
```

語法

```js
query capsuleData {
  capsules(limit:2) { // limit:2是argument，這代表只抓前2筆資料
    id
    missions {
      flight
      name
    }
  }
}
```

### variable

```js
// $id:ID是variable，ID是型別，!代表必填
query capsuleData($id:ID! = "C102"){ // = "C102"是給變數預設值
  capsule(id:$id){
    id
    missions {
      flight
      name
    }
  }
}
```

下方的Query Variable區域用JSON格式填寫變數

```js
{
  "id":"C101"
}
```

### aliases

和SQL的別名一樣都是為了`避免同樣的field導致衝突`

```js
query capsuleData {
  C105Data: capsule(id: "C105") { // C105Data是別名
    id
    missions {
      flight
      name
    }
  }
  C101Data: capsule(id: "C101") {
    id
    missions {
      flight
      name
    }
  }
}
```

### fragment

透過`fragment`建立`field set`，這可以`用在同樣的欄位重複多次出現時`(就像前個例子)

argument用於在一坨同型別的資料中根據條件撈資料

```js
{
  // id: "C105"是argument
  leftComparison: capsule(id: "C105") { 
    ...comparisonFields
  }
  rightComparison: capsule(id: "C101") {
    ...comparisonFields
  }
}

// comparisonFields是fragment的名稱，Capsule是型別名
fragment comparisonFields on Capsule { 
  id
  missions {
    flight
    name
  }
}
```

### 指令 include

graphql-tools 5+才能用

```js
query capsuleData($limit:Int, $isFligheShow:Boolean!){
  capsules(limit:$limit){
    id
    missions @include(if: $isFligheShow) {
      flight
      name
    }
  }
}
```

## 參考資料

[GraphQL - queries](https://graphql.org/learn/queries/)  
[Serving over HTTP](https://graphql.org/learn/serving-over-http/#post-request)  
[GraphQL 入門：初次實作 Schema 與 Resolver](https://ithelp.ithome.com.tw/articles/10203333)  
[GraphQL 入門： 簡介 X 範例 X 優缺點](https://ithelp.ithome.com.tw/articles/10200678)  
[GraphQL 入門： Arguments, Aliases, Fragment 讓 Query 更好用 (進階 Query)](https://ithelp.ithome.com.tw/articles/10203965)  
[HTTP caching in GraphQL](https://blog.logrocket.com/http-caching-graphql/)  
[Making GraphQL Requests using HTTP Methods](https://www.apollographql.com/blog/graphql/basics/making-graphql-requests-using-http-methods/)

playgrounds

[GraphQL playground - space X](https://api.spacex.land/graphql/)  
[GraphQL Playground Example](https://www.graphqlbin.com/v2/mqZgc5)  
[PoP API Demo](https://newapi.getpop.org/graphiql/)