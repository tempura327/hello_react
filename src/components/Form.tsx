import {useForm} from 'react-hook-form';

import TextField from '@mui/material/TextField';
import Button from '@mui/material//Button';
import SearchIcon from '@mui/icons-material/Search';


const Form = () => {
    const {register, getValues, setValue, handleSubmit, resetField, reset, watch, unregister} = useForm();

    const handleValidateSuccess = () => console.log(111)
    const handleValidateError = () => console.warn('some value in form goes wrong.')

    return (
        <form onSubmit={handleSubmit(handleValidateSuccess, handleValidateError)}>
            <TextField
                label='姓名'
                variant='outlined'
                {...register('name')}
            />

            <TextField
                label='年齡'
                variant='outlined'
                {...register('age')}
            />

            <Button type='button' variant='contained' onClick={() => {
                setValue('name', 'Tempura')
            }}>set name</Button>

            <Button type='button' variant='contained' onClick={() => {
                getValues('name');
            }}>get name</Button>

            <Button type='submit' variant='contained' startIcon={<SearchIcon/>}>search</Button>

            <Button type='submit' variant='outlined' startIcon={<SearchIcon/>} onClick={() => {
                resetField('name');
            }}>reset name</Button>

            <Button type='submit' variant='outlined' startIcon={<SearchIcon/>} onClick={() => {
                reset({
                    name:undefined,
                    age:undefined
                });
            }}>reset</Button>

        </form>
    );
}

export default Form;