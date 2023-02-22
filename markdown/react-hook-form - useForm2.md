# 目錄

- [目錄](#目錄)
  - [unregister](#unregister)
  - [resetField \& reset](#resetfield--reset)
  - [watch](#watch)
  - [formState](#formstate)
  - [參考資料](#參考資料)

[codesandbox](https://codesandbox.io/s/react-hook-form-practice-2-ez7qrj?file=/src/Form.tsx)

<br/>

## unregister

將單個或多個欄位解除註冊

欄位被`解註冊`後就會`脫離react-hook-form`的管轄，所以驗證、註冊、getValue...等都不再能用於該欄位

<br/>

## resetField & reset

兩者皆能重設欄位的值，前者重設單一欄位，後者可重設多個欄位、整個表單

另外需要注意 

1. `reset`如果用於`controlled component`，那必須`使用Controller`包住，`並`在使用useForm時`給予defaultValues`

2.如果使用reset時沒有提供defaultValues，HTML的原生reset API將會恢復表單的內容，導致reset失效

```js
<Button
   className="mb-3"
   type="button"
   variant="outlined"
   onClick={() => {
      // 沒有提供defaultValues會導致reset失效
      reset();
   }}
>
   reset
</Button>
```

<br/>

## watch

watch會`監看欄位`(單個或多個)的值，並`回傳`其`current value`

```js
const foo = watch(); // 監看全部
const bar = watch('name'); // 監看name
const fooBar = watch(['name', 'age']); // 監看name、age
```

和Vue的watch很相似，`常用於判斷`該渲染出哪個東西的場景

```js
// 如果使用者在name欄位輸入Obama，就顯示歐巴馬的圖
{watch("name") === "Obama" && (
          <img src="https://images.unsplash.com/photo-1580130379624-3a069adbffc5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=726&q=80" />
)}
```

watch`會觸發`component的`re-render`，所以官方推薦在useEffect裡呼叫它，或者`使用useWatch`來`避免`效能衝擊

<br/>

## formState

表單的狀態，裡頭紀錄了errors、isDirty、dirtyField、isSubmitted、isValid之類的資訊

`dirty fields`指表單中已被`修改，但未被送出的欄位`，`isDirty`則是當`表單`中的某個`欄位值被修改，但未送出去`

另外需要`注意`

1. dirty field並不會直接代表isDirty，因為isDirty是form level，但dirty filed只是field level，而不是整個表單
2. 需要提供defaultValue給useForm，這樣才能判斷表單欄位是否被修改了

dirtyFiled可以用於表單中只有某些欄位需要驗證的場合

```js
// 假設email要驗證
<TextField
    className="mb-6"
    // errors要onSubmit後才會列出error的欄位
    error={!!errors.phone} 
    helperText={
        dirtyFields.phone && <DirtyFieldMarker fieldName="phone" />
    }
    label="phone"
    variant="outlined"
    {...register("phone", {
       // 用正規表達式驗證
        pattern: /^09[0-9]{8}$/
    })}
/>
```

<br/>

## 參考資料

[react hook form - unregister](https://react-hook-form.com/api/useform/unregister)  
[react hook form - watch](https://react-hook-form.com/api/useform/watch/)  
[react hook form - reset](https://react-hook-form.com/api/useform/reset)