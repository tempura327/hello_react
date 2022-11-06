import {useReducer, useEffect} from 'react';

import Toast from './Toast';

import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import AddIcon from '@mui/icons-material/Add';

// function reducer(state, action){
//   const map = {
//     setPendingValue:{...state, pendingValue:action.value},
//     setList:{...state, list:action.value},
//     setIsWarningShow:{...state, isWarningShow:action.value},
//     setIsErrorShow:{...state, isErrorShow:action.value},
//   }

//   return map[action.type];
// }

// function ToDoList_MUI(props){
//   const [state, dispatch] = useReducer(reducer, {
//     pendingValue: '',
//     list:[
//       {text:'sweeping floor', state:false},
//     ],
//     isWarningShow:false,
//     isErrorShow:false,
//   });


//   const changePendingValue = (e) => {
//     dispatch({type: 'setPendingValue', value: e.target.value});
//     dispatch({type: 'setIsErrorShow', value: false});
//   }

//   const addItem = () => {
//     if(!state.pendingValue){
//       dispatch({type:'setIsErrorShow', value:true});
//       return;
//     };

//     dispatch({type:'setList', value:[...state.list, {text:state.pendingValue, state:false}]});
//     dispatch({type: 'setPendingValue', value: ''});
//   }

//   useEffect(() => {
//     if(state.list.length > 5){
//       dispatch({type:'setIsWarningShow', value:true});
//     }

//   });  // 相當於list更新時執行componentDidUpdate , [state.list.length]

//   const toggle = (e, index) => {
//     const copiedList = JSON.parse(JSON.stringify(state.list));

//     copiedList[index] = {text:state.list[index].text, state:e.target.checked}

//     dispatch({type: 'setList', value: copiedList});
//   }

//   return (
//     <>
//       <div className='flex'>
//         <Input className='mr-2' value={state.pendingValue} error={state.isErrorShow} onChange={changePendingValue}></Input>
//         <Button variant="contained" startIcon={<AddIcon />} onClick={addItem}>add</Button>    
//       </div>

//       <Toast message='todo items > 5' isShow={state.isWarningShow} autoHide={800} variant='warning' onClose={() => {dispatch({type:'setIsWarningShow', value:false})}}></Toast>

//       <Stack>
//         {state.list.map((i, index) => {
//           return <FormControlLabel 
//                     key={index}
//                     control={<Checkbox checked={i.state} disabled={i.state} onChange={(e) => {toggle(e, index)}} color='info'/>} 
//                     label={i.text}
//                     sx={{'& .MuiSvgIcon-root': { fontSize: 32 } }}/>
//         })}
//       </Stack>
//     </>
//   )
// }


function reducer(state, action){
  const res = {...state}
  res[action.type] = action.value;

  return res;
}

function ToDoList_MUI(props){
  const [state, dispatch] = useReducer(reducer, {
    pendingValue: '',
    list:[
      {text:'sweeping floor', state:false},
    ],
    isWarningShow:false,
    isErrorShow:false,
  });


  const changePendingValue = (e) => {
    dispatch({type: 'pendingValue', value: e.target.value});
    dispatch({type: 'isErrorShow', value: false});
  }

  const addItem = () => {
    if(!state.pendingValue){
      dispatch({type:'isErrorShow', value:true});
      return;
    };

    dispatch({type:'list', value:[...state.list, {text:state.pendingValue, state:false}]});
    dispatch({type: 'pendingValue', value: ''});
  }

  useEffect(() => {
    if(state.list.length > 5){
      dispatch({type:'isWarningShow', value:true});
    }

  });  // 相當於list更新時執行componentDidUpdate , [state.list.length]

  const toggle = (e, index) => {
    const copiedList = JSON.parse(JSON.stringify(state.list));

    copiedList[index] = {text:state.list[index].text, state:e.target.checked}

    dispatch({type: 'list', value: copiedList});
  }

  return (
    <>
      <div className='flex'>
        <Input className='mr-2' value={state.pendingValue} error={state.isErrorShow} onChange={changePendingValue}></Input>
        <Button variant="contained" startIcon={<AddIcon />} onClick={addItem}>add</Button>    
      </div>

      <Toast message='todo items > 5' isShow={state.isWarningShow} autoHide={800} variant='warning' onClose={() => {dispatch({type:'isWarningShow', value:false})}}></Toast>

      <Stack>
        {state.list.map((i, index) => {
          return <FormControlLabel 
                    key={index}
                    control={<Checkbox checked={i.state} disabled={i.state} onChange={(e) => {toggle(e, index)}} color='info'/>} 
                    label={i.text}
                    sx={{'& .MuiSvgIcon-root': { fontSize: 32 } }}/>
        })}
      </Stack>
    </>
  )
}

export default ToDoList_MUI;