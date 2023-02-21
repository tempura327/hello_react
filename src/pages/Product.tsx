import {useState} from 'react';

import Button from "@mui/material//Button";

import FormPratice1 from '../components/FormPratice1';
import FormPratice2 from '../components/FormPratice2';

const Product = () => {
    const [formIndex, setFormIndex] = useState(0);

    const formList = [<FormPratice1/>, <FormPratice2/>];
    
    return (
        <div className='p-4'>
            <div className='mb-8'>
                <Button type="button" variant={formIndex === 0? 'contained' : 'outlined'} className='mr-4' onClick={() => {setFormIndex(0)}}>FormPratice1</Button>
                <Button type="button" variant={formIndex === 1? 'contained' : 'outlined'}  onClick={() => {setFormIndex(1)}}>FormPratice2</Button>
            </div>

            <div className='w-2/3 mx-auto'>
            {
                formList[formIndex]
            }
            </div>

        </div>
    );
}  




export default Product;