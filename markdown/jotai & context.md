# 目錄

- [目錄](#目錄)
  - [Jotai是甚麼](#jotai是甚麼)
  - [Jotai用法](#jotai用法)
  - [情境](#情境)
  - [使用context實作](#使用context實作)
  - [使用Jotai實作](#使用jotai實作)
  - [參考資料](#參考資料)

<br/>

## Jotai是甚麼

可以用全域性的一次只出現一個的snackbar、dialog上

<br/>

## Jotai用法

<br/>

## 情境

假設有3個組件分別如下

└── CreatePhotoWork(上傳作品（照片url、敘述）的頁面)
   ├── FileUpload(上傳圖片的組件)
   └── ImageCrop(切裁圖片的組件)
  
操作流程則如下

1. 在FileUpload選擇圖片，觸發input的onChange
2. 從input取得File
3. 把File丟給ImageCrop，然後轉成切裁的圖
4. 
    a. 切裁完按下ImageCrop的OK後，(呼叫setPreview方法)繪製canvas
    b. 將canvas轉成Blob，再轉成File
5. (這一步在下方例子會省略)
    a. 按下FileUpload的upload，跳出loading
    b. 把從ImageCrop得到的File傳給後端)

<br/>

## 使用context實作

![](https://beta.reactjs.org/_next/image?url=%2Fimages%2Fdocs%2Fdiagrams%2Fpassing_data_context_far.png&w=640&q=75)

context可以讓多個組件共享資料，而不必一層一層地把props傳到最底下

呼叫useContext的組件能夠`取得最靠近的Context.Provider的value`

然而缺點是，若`子組件`需要能`更新context的值`，就`必須把set function從父組件傳下去`給子組件

如果用以上的情境來說，使用context可以這麼做

1. 在父組件(頁面組件)建立context，一開始可為空

```js
import { createContext } from "react";

export const PhotoStateContext = createContext<PhotoState | null>(null);
```

2. 在父組件使用useState建立存context值的變數、更新context值的set function

```js
export type PhotoState = {
  previewSrc: string;
  photoToUpload?: File;
};

const Context = () => {
  const [photoState, setPhotoState] = useState<PhotoState>({
    previewSrc: "",
    photoToUpload: undefined
  });
```

3. 在父組件用context建立Context.Provider並把步驟2的變數傳給value

```js
  return (
    <PhotoStateContext.Provider value={photoState}>
       // 省略
   </PhotoStateContext.Provider>
);
```

4. 
    a. 在需要能更新context值的子組件開個props，傳入步驟2的set function
    
    ```js
    <PhotoStateContext.Provider value={photoState}>
        <FileUpload inputRef={inputRef} setPhotoState={setPhotoState} />
        <ImageCrop
          src={photoState.previewSrc}
          input={inputRef.current}
          setPhotoState={setPhotoState}
        />
    </PhotoStateContext.Provider>
    ```
    
    b. 在需要取得context值的子組件使用useContext，並傳入步驟1建立的context
    
    ```js
    import { createContext } from "react";
    
    interface ImageCropProps {
       src: string;
       input: HTMLInputElement | null;
       setPhotoState: (data: PhotoState) => void;
    }

    const ImageCrop: FunctionComponent<ImageCropProps> = ({
      src,
      input,
      setPhotoState
    }) => {
        const photoState = useContext(PhotoStateContext);
    ```

[codesandbox](https://codesandbox.io/s/jotai-context-fyplmv?file=/src/pages/PhotoUpload/Context.tsx)

<br/>

## 使用Jotai實作

如果用以上的情境來說，使用Jotai可以這麼做

1. 開一個存放atom的檔案(ex: store.ts)，並使用atom建立一個存放state的atom

    ```js
    import { atom } from "jotai";

    interface PhotoState {
      photoToUpload?: File;
      previewSrc: string;
    }

    export const photoStateAtom = atom<PhotoState>({
      previewSrc: ""
});
```

2. 在store.ts視需求撰寫write或read atom

```js
// 這是write-only atom
// getter為null，setter為function，所以只能更新
export const changePhotoStateAtom = atom(
  null,
  (get, set, update: Partial<PhotoState>) => {
    const photoState = get(photoStateAtom);

    set(photoStateAtom, { ...photoState, ...update });
  }
);
```

3. 在需要取得、更新atom值的地方引入atom

之後的用法就類似useState

```js
import { useAtom } from "jotai";
import { photoStateAtom } from "../../store";

const Jotai = () => {
  // 第一個元素是atom值，第二個是set function
  const [{ previewSrc, photoToUpload }] = useAtom(photoStateAtom);
```

```js
import { useAtom } from "jotai";
import { changePhotoStateAtom } from "../../store";

interface ImageCropProps {
  src: string;
  input: HTMLInputElement | null;
}

const ImageCrop: FunctionComponent<ImageCropProps> = ({ src, input }) => {
  // write-only atom
  // 第一個元素為null，第二個為set function
  const [, setPhotoState] = useAtom(changePhotoStateAtom);
```

[codesandbox](https://codesandbox.io/s/jotai-context-fyplmv?file=/src/pages/PhotoUpload/Jotai.tsx)

<br/>

## 參考資料

[Jotai](https://jotai.org/)