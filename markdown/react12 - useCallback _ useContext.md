# 目錄

- [目錄](#目錄)
  - [memorized hook是甚麼](#memorized-hook是甚麼)
  - [useCallback & memo](#usecallback--memo)
  - [useMemo](#usememo)
  - [參考資料](#參考資料)

## memorized hook是甚麼

memorized hook接受2個參數，第一個是函式，第二個式依賴陣列(dependency array)

它會`記住依賴陣列的狀態`，當依賴陣列內的值`更新時才會呼叫`callback

因此常用於`避免不必要的渲染、計算`

## useCallback & memo

兩者的功能類似，只差在`memo`是用`shallow compare`的方式在做比較

被`memo包住的組件`在其父組件更新，但傳給它的`props沒更新時不會重新渲染`

而`useCallback`會`記住的回傳函式`，就能避免每次產生新的function(重新分配記憶體)，又傳給子組件

前者比較props有無改變來避免重新渲染，後者避免重複分配記憶體

`兩者常一起用`避免`父組件state更新`而重新渲染時，props沒更新，但卻連`子組件也重新渲染`，`不必要的渲染會衝擊效能`

```js
function GeneralChild({callback, type, children}){
  console.log(`G + ${type[0]}`);
  
  return (
    <div className="border-solid border-2 border-blue-400 p-2">
        <h1 className={type.startsWith('general')? 'bg-blue-400' : 'bg-yellow-400'}>G + {type[0]}</h1>
        {children}
        <p>callback return value: {callback()}</p>
    </div>
  )
}

const MemoizedChild = React.memo(({ callback, type, children }) => {
  console.log(`M + ${type[0]}`);

  return (
    <div className="border-solid border-2 border-yellow-400 p-2">
      <h1 className={type.startsWith('general')? 'bg-blue-400' : 'bg-yellow-400'}>M + {type[0]}</h1>
      {children}
      <p>callback return value: {callback()}</p>
    </div>    
  )
});

function App(){
  const [num, setNum] = useState(1);

  // 將callback寫死
  const memoizedCallback = useCallback(() => {
    return 33;
  }, []);

  const generalCallback = () => {
    return 33;
  }

  console.log('-----------------');

  return(
    <div>
      <div className='flex mb-3'>
        <p className='m-2'>num: {num}</p>
        <Button variant="contained" onClick={() => setNum(Math.floor(Math.random() * 10) + 1)}>change num</Button>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        {/* num變，即便callback回傳值寫死，子組件會重新render */}
        <GeneralChild type='memoized callback' callback={memoizedCallback}></GeneralChild>

        {/* num變，即便callback回傳值寫死，子組件會重新render */}
        <GeneralChild type='general callback' callback={generalCallback}></GeneralChild>

        {/* 子組件不重新render */}
        <MemoizedChild type='memoized callback' callback={memoizedCallback}></MemoizedChild>

        {/* num變，即便callback回傳值寫死，子組件會重新render */}
        <MemoizedChild type='general callback' callback={generalCallback}></MemoizedChild>
      </div>
    </div>
  );
}
```

先來看看useCallback記住回傳函式的特點

```js
const set = new Set();
const arr = [];

function GeneralChild({callback, type, children}){
  console.log(`G + ${type[0]}`);
  store.add(callback);
  arr.push(callback);
  console.log(store, arr);

  // 後略
}
```

set會排除同樣的元素，如果是物件型別則根據記憶體位置判斷是否相同

使用useCallback回傳的函式做為prop

![pass a function return by useCallback as props](https://static.coderbridge.com/img/tempura327/e3b75bdf243e4ba893286ac474fd962a.gif)

不用的話

![pass a function as props](https://static.coderbridge.com/img/tempura327/4e72e04be05f40c881c19b53d693f5b4.gif)

再來看避免子組件不必要的渲染

![useCallback](https://static.coderbridge.com/img/tempura327/30378c03097f405790a0f3452378c783.gif)

從上圖可以看到如果沒有使用memo + useCallback，即便傳給callback prop的函式被寫死了，只要父組件的num被更新了，子組件就會被重新渲染


## useMemo

`與父組件狀態更新無關`，而是避免組件重新渲染時，組件內的`函式被重新呼叫`

重新呼叫函式造成`不必要的重新計算衝擊效能`

![no useMemo](https://static.coderbridge.com/img/tempura327/52fbc8c4432541edbcfc068527fd01eb.gif)

```js
import {useReducer, useMemo} from 'react';

function reducer(state, action){
    const res = {...state};
    const {type:key, value} = action;

    const isArray = state[key] instanceof Array;

    res[key] = isArray? [...res[key], value] : value;

    return res;
}

export default function ClassMemberList(){
    const [state, dispatch] = useReducer(reducer, {
        classList:['A', 'B', 'C'],
        studentList:[
            {id:'001', className:'A', name:'Alex'},
            {id:'002', className:'C', name:'Allen'},
            {id:'003', className:'B', name:'Amy'},
            {id:'004', className:'C', name:'Apollo'},
            {id:'005', className:'C', name:'Bill'},
            {id:'006', className:'C', name:'Belinda'},
            {id:'007', className:'A', name:'Cinderella'},
            {id:'008', className:'B', name:'Danial'},
            {id:'009', className:'A', name:'Emma'},
        ],
        className:'A',
        newStudent:{id:'', className:'', name:'',}
    })

    const filterClassMember = () => {
        console.log('filterClassMember', state.studentList.length);
        return state.studentList.filter(i => i.className === state.className);
    }
    
    const classMember = filterClassMember();

    const addStudent = () => {
        const id = (parseInt(state.studentList[state.studentList.length - 1].id) + 1).toString().padStart(3, '0');
        const isNewClassName = state.classList.indexOf(state.newStudent.className) === -1;

        dispatch({type:'studentList', value:{id, ...state.newStudent}});
        dispatch({type:'newStudent', value:{id:'', className:'', name:'',}});
        
        if(isNewClassName){
            dispatch({type:'classList', value:state.newStudent.className});
        }
    }

    return (
        <div className='flex m-3'>
            <div className='flex flex-col mr-16'>
                name:<input type="text" 
                            onChange={(e) => dispatch({type:'newStudent', value:{...state.newStudent, name:e.target.value}})} 
                            value={state.newStudent.name}/>
                class name:<input className='mb-2' 
                                type="text" 
                                onChange={(e) => dispatch({type:'newStudent', value:{...state.newStudent, className:e.target.value}})}
                                value={state.newStudent.className}/>

                <button className='p-2 bg-blue-400' onClick={addStudent}>add student</button>
            </div>

            <div>
                <select className='mb-2' onChange={(e) => {dispatch({type:'className', value:e.target.value})}}>
                    {state.classList.map(i => <option value={i} key={i}>{i} class</option>)}
                </select>



                <h1 className='text-2xl mb-2'>class {state.className} student list</h1>

                <ul>
                    {
                        classMember.map(i => <li key={i.id}>{i.name}</li>)
                    }
                </ul>
            </div>
        </div>
    )
}
```

useMemo會`記住的回傳值`，如果依賴陣列中的變數都沒有被更新，就使用原本的回傳值，`類似Vue的computed`

![useMemo](https://static.coderbridge.com/img/tempura327/75109077bc724207b39fc119e59a58da.gif)

```js
    // 前略

    // 使用useMemo()取代filterClassMember
    const classMember = useMemo(() => {
        console.log('useMemo', state.studentList.length);
        return studentList.filter(i => i.className === className);
    }, [studentList, className]);

    // 後略
```

## 參考資料

[React - useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback)
[React - useMemo](https://reactjs.org/docs/hooks-reference.html#usememo)
[React 性能優化那件大事，使用 memo、useCallback、useMemo](https://medium.com/%E6%89%8B%E5%AF%AB%E7%AD%86%E8%A8%98/react-optimize-performance-using-memo-usecallback-usememo-a76b6b272df3)