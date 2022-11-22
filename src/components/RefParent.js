import {useRef, useEffect,forwardRef} from 'react';
import SimpleInput from './SimpleInput';

const RefParent = forwardRef((props, ref) => {
    const inputRef = useRef(null);

    // useEffect(() => {
    //     console.log(inputRef);
    // }, []);

    

    return (
        <div className='p-4'>
            <SimpleInput ref={inputRef} />

            <button onClick={() => inputRef.current.focus()}>focus</button>
        </div>
    );
})


export default RefParent;