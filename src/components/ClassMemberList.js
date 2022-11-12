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

    const classMember = useMemo(() => {
        console.log('useMemo', state.studentList.length);
        return state.studentList.filter(i => i.className === state.className);
    }, [state.studentList, state.className]);

    // const filterClassMember = () => {
    //     console.log('filterClassMember', state.studentList.length);
    //     return state.studentList.filter(i => i.className === state.className);
    // }
    
    // const classMember = filterClassMember();

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