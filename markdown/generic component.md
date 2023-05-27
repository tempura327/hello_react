# 目錄

- [目錄](#目錄)
  - [Generic component是什麼](#generic-component是什麼)
  - [怎麼寫Generic component](#怎麼寫generic-component)
  - [參考資料](#參考資料)

[codesandbox](https://codesandbox.io/s/generic-component-2-7shwrf?file=/src/App.tsx)

## Generic component是什麼

純Typescript有泛型的功能，用`Typescript`寫的React` component`也可以`和泛型結合`

這個技巧相當地實用，在一些UI library內也會看到

![](https://static.coderbridge.com/img/tempura327/3f5b4b5b731b4066bc0c1b1734b50868.png)
![](https://static.coderbridge.com/img/tempura327/8b9c9db7ca0f4e989c05f057df3aa56a.png)

泛型的React component幾個優點

1. 利於`複用`
2. 維持`型別彈性`，`同時`也避免過於彈性，故能`避開`潛在的`型別錯誤`

## 怎麼寫Generic component

假設有個組件叫GenericSelect，它是一個包裝select而成的組件

其選項會有多個，選項的文字一定是string，`值則可能是string或者number`

當onChange被處發時，它的`上層組件可以透過onSelect拿到選擇的值`

開始前可以先想一下組件可能怎麼被使用

```js
      <GeniricSelect
        options={genderOptions}
        onSelect={(selectedGender) => {
          // 直接接收值
          setGender(selectedGender);
        }}
      />
```

或

```js
      <GeniricSelect
        options={genderOptions}
        onSelect={({ target }) => { 
          // 接收event，再取出target.value
          setGender(target.value);
        }}
      />
```


那麼先來定義props

```js
  interface GeniricSelectProps<T> {
    options: { 
      text: string; 
      // 值可能是string或number，所以用泛型
      // 至於為什麼不寫string | number，因為這樣型別過於廣泛，所以用泛型來限縮範圍
      value: T 
    }[]; 
    onSelect: (value: T) => void;
  }
```

然後寫組件本體
![](https://static.coderbridge.com/img/tempura327/027a05f997c045bfa7c16fff946dbed7.png)

![](https://static.coderbridge.com/img/tempura327/eeffbc5727f341f18d9b49f7a9ea54aa.png)

這時會發現有type error，這是因為[e.target.value會被預設認為是string](https://stackoverflow.com/questions/66957660/event-target-value-as-a-number)，即便`input type="number"也一樣`


這時有兩個方式

1.一種是直接把value的型別改為`unknown`，然後在使用GenericSelect的地方，傳function給onSelect時，內部`加上type guard`

```js
interface GeniricSelectProps<T> {
  options: { text: string; value: T }[];
  onSelect: (value: unknown) => void;
}

const GeniricSelect = <P extends string | number>({
  options,
  onSelect
}: GeniricSelectProps<P>) => {
  return (
    <select
      name=""
      id=""
      style={{ padding: 8 }}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => onSelect(e.target.value)}
    >
      {options?.map(({ text, value }) => (
        <option value={value} key={value}>
          {text}
        </option>
      ))}
    </select>
  );
};
```

2.使用`intersection`(&)來讓target.value的型別不再只限於string

```js
interface GeniricSelectProps<T> {
  options: { text: string; value: T }[];
  onSelect: (
    e: ChangeEvent<HTMLSelectElement> & { target: { value: T } }
  ) => void;
}

const GeniricSelect = <P extends string | number>({
  options,
  onSelect
}: GeniricSelectProps<P>) => {
  return (
    <select name="" id="" style={{ padding: 8 }} onChange={onSelect}>
      {options?.map(({ text, value }) => (
        <option value={value} key={value}>
          {text}
        </option>
      ))}
    </select>
  );
};
```

[codesandbox](https://codesandbox.io/s/generic-component-2-7shwrf?file=/src/App.tsx)

## 參考資料

[Create a React / TypeScript Generic Component](https://dev.to/fabiobiondi/create-a-react-typescript-generic-component-2dal)
[How to set type for event.target.value?](https://stackoverflow.com/questions/62214443/how-to-set-type-for-event-target-value)