import { useEffect, useState } from 'react';

import SimpleButton from './SimpleButton';

export default function PassFunction(props){
    const [cb, setCb] = useState(() => {return () => {console.log('init');}});

    useEffect(() => {
        setCb(() => props.onClick);
    }, []);

    useEffect(() => {
    }, [props.onClick])
   
    return (
        <div>
            <SimpleButton click={cb}>click</SimpleButton>
        </div>
    )
}