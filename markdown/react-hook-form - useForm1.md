# 目錄

- [目錄](#目錄)
  - [React hook form是什麼](#react-hook-form是什麼)
  - [useForm](#useform)
    - [defaultValues](#defaultvalues)
    - [resetOptions](#resetoptions)
    - [resolver](#resolver)
  - [register](#register)
    - [驗證](#驗證)
  - [handleSubmit](#handlesubmit)
  - [getValues \& setValue](#getvalues--setvalue)
- [參考資料](#參考資料)


[codesandbox](https://codesandbox.io/s/react-hook-form-practice-1-ctgqc2)

<br/>

## React hook form是什麼

在[這篇](https://tempura-good-good.coderbridge.io/2022/10/14/react5-controlled-component/)提到過由於用`uncontrolled component`來做表單滿`髒`的，所以`官方推薦`盡量使`用controlled component`

然而`controlled component`有2個問題

1. 每次資料更新就會呼叫setState，這會導致一直re-render，而導致`效能低落`
2. 如果表單有多個欄位就會有多個useState，或者需要透過useReducer來管理表單狀態，會變得`相當繁瑣`

`React hook form`就是為了`解決這個問題`而產生的`表單套件`，大致上是`基於uncontrolled component建構`成的

但是如果要用controlled component(ex: 使用MUI的input)，只要用Controller這個組件就行了

<br/>

## useForm

React-hook-form一切的開端，register、unregister、resetField、setValue、getValues、handleSubmit、watch、formState...都是由它回傳

接收一個參數是`option`，`可選擇是否設置`，不設的話甚麼都不用傳

<br/>

### defaultValues

`預設值可以`用`同步`(如下)`或非同步`(ex: 撈資料的非同步含式)的方式設置

`不要提供undefined`給defaultValues，因為這會和controlled component的default state產生衝突

```js
// 設置default value
useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      category: '',
      checkbox: [],
      radio: ''
    }
  });
```

<br/>

### resetOptions

resetOptions是用來設定reset被呼叫後，應該有什麼行為(ex: keepDirty、keepError)

這個option是reset方法的option的reference，所以會影響到reset後的行為

```js
useForm({
  values,
  resetOptions: {
    keepDirtyValues: true, // user-interacted input will be retained
    keepErrors: true, // input errors will be retained with value update
  }
})
```

<br/>

### resolver

resolver用於`驗證`，常`配合`一些`驗證的library使用`

可以自己寫驗證邏輯，或者當驗證邏輯比較複雜時，可以配合library(ex: ajv)使用

另外還會需要安裝[@hookform/resolvers](https://www.npmjs.com/package/@hookform/resolvers)

詳細可參考[官方範例](https://codesandbox.io/s/react-hook-form-ajvresolver-vr3imc)

<br/>

## register

register是`React hook form的核心`，用於將欄位的值註冊到提交出去的結果上，這樣欄位的`值`就`能被送出、驗證`

```js
import {useForm} from 'react-hook-form';

import TextField from '@mui/material/TextField';
import Button from '@mui/material//Button';
import SearchIcon from '@mui/icons-material/Search';

interface PersonFilter {
    name: string;
    age: number;
    phone: string;
}

const Form = () => {
    const {register} = useForm<PersonFilter>();
    const { onChange, onBlur, name, ref } = register('name'); 
    
    return (
           {/* 以下相同於{...register('name')} */}
           <TextField
                label='姓名'
                variant='outlined'
                onChange={onChange} // 訂閱input change事件
                onBlur={onBlur} // 訂閱input blur事件
                name={name} // 欄位名
                ref={ref} // 用來註冊name的ref
            />
            
           <TextField
                label='年齡'
                variant='outlined'
                {...register('age')}
           />
    );
}
```

register支援巢狀結構，須注意但如果是陣列時仍然要用.來存取值

```js
<TextField
   label='1號學生姓名'
   variant='outlined'
   {...register('student.0.name')}
/>
```

<br/>

### 驗證

```js
// 上略

// 欄位為必填，驗證是否有填寫，且長度不超過20
<TextField
   label='姓名'
   variant='outlined'
   {...register('name', {
       required: true,
       maxLength: 20
   })}
/>

// 最大值為120
<TextField
   label='年齡'
   variant='outlined'
    {...register('age', {
        max: 120
    })}
/>

// 用正規表達式驗證
// 驗證號碼是否開頭09、共10位數字
<TextField
   label='電話'
   variant='outlined'
    {...register('phone', {
        pattern: /^09[0-9]{8}$/
    })}
/>

// 自訂驗證規則(傳callback或物件)
// 驗證號碼是否長度到為10字
<TextField
   label='電話'
   variant='outlined'
    {...register('phone', {
        validate: (value, formValues) => value.length === 10
    })}
/>
```

<br/>

## handleSubmit

`接收`2個參數，分別為`驗證成功`時呼叫`的callback`，另一個則為驗證`失敗`時呼叫`的callback`，callback可為非同步函式

如果`表單的內容驗證`是`合法`的，handleSubmit就能`得到資料`

另外由於`handleSubmit`並`不`會`處理callback內發生的錯誤`，所以官方推薦自己加catch來處理錯誤

```js
// 上略

// 使用apollo client的refetch來抓新的資料
const handleValidateSuccess = useCallback(
    ({ name, age }) => { // 驗證成功後可以收到表單資料
        try{
            void refetch({
                filter: {
                  name: name || undefined,
                  age: age || undefined,
                },
                size: rowsPerPage,
                after: null,
           });
        }catch{
            throw new Error("Something is wrong");
        }
      
    },
    [refetch],
  );
  
const handleValidateError = () => console.warn('some value in form goes wrong.')

// 略
 
<form onSubmit={handleSubmit(handlePersonRefetch)}>
    <TextField
        label="Name"
        variant="outlined"
        {...register('name')}
    / >
      
    <TextField
       label="Age"
       variant="outlined"
       {...register('age')}
    / >
      
   {/* form的預設行為是submit，所以按了這個鈕就會自動驗證表單內容是否合法 */}
   {/* 如果合法的話就呼叫handlePersonRefetch */}
   <Button type="submit" variant="contained">Search</Button>
</form>
```

<br/>

## getValues & setValue

兩者皆為useForm的回傳值內的屬性

getValues可用取得用register註冊過的欄位的值，setValue則是設定註冊過的欄位的值

`disabled的input`，使用getValues取值會得到undefined，因此官方建議用readonly

```js
// 上略
const { register, getValues } = useForm<FormField>();

// 略
<TextField
    label='name'
    variant='outlined'
    {...register('name')}
/>

// getValues會得到undefined
<TextField
    label='age'
    variant='outlined'
    disabled={disabled}
    {...register('age')}
/>

<TextField
   type="text"
   defaultValue={25}
   variant="outlined"
   inputProps={{ readOnly: true }}
   {...register('age')}
/>

<Button type="button" onClick={() => {
    console.log(getValues(['name', 'age']));
}}>get values</Button>


<Button type="button" onClick={() => {
    setValue('name', 'Tempura Ninja');
}}>set name</Button>
```

<br/>

# 參考資料

[Performance of React Hook Form](https://react-hook-form.com/faqs/#question1)  
[Day 10 - 為什麼要用 React Hook Form](https://ithelp.ithome.com.tw/articles/10298062)
[](https://react-hook-form.com/api/useform/register)
[Turn Anything Into A Form Field With React Hook Form Controller](https://dev.to/elyngved/turn-anything-into-a-form-field-with-react-hook-form-controller-42c)