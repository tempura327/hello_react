import {forwardRef} from 'react';

const SimpleInput = forwardRef((props, ref) => {
    return <input type="text" ref={ref} className='focus:outline-none focus:ring focus:ring-violet-300'/>;
});

export default SimpleInput;