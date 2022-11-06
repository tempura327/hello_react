import {useState} from 'react';

export default function Calculator(props){
    const [count, setCount] = useState(0);
    const [operator, setOperator] = useState(undefined);

    const chooseNumber = (number) => {
        if(operator){
            calculate(number);
            return;
        }

        if(count === 0){
            setCount(number);
        }else{
            setCount((prev) => {
                const num = parseInt(prev.toString() + number.toString());

                setCount(num);
            })
        }
    }

    const calculate = (number) => {
        switch(operator){
            case '+':
                setCount((prev) => prev + number);
                break;

            case '-':
                setCount((prev) => prev - number);
                break;
                
            case '*':
                setCount((prev) => prev * number);
                break;
                
            case '/':
                setCount((prev) => prev / number);
                break;                

            default:
        }

        setOperator(undefined);
    }

    return (
        <div>
            <div className='bg-zinc-300 text-right mb-1 p-2 px-4'>{count}</div>

            <div className='grid grid-cols-3 gap-1'>
                <button className='bg-indigo-600 text-white p-2 px-4 col-span-3' onClick={() => setCount(0)}>clear</button>

                <button className='bg-blue-800 text-white p-2 px-4' onClick={() => setOperator('+')}>+</button>
                <button className='bg-blue-800 text-white p-2 px-4' onClick={() => setOperator('-')}>-</button>
                <button className='bg-blue-800 text-white p-2 px-4' onClick={() => setOperator('*')}>*</button>
                <button className='bg-blue-800 text-white p-2 px-4' onClick={() => setOperator('/')}>/</button>
                <button className='bg-blue-800 text-white p-2 px-4' onClick={() => {setCount((prev) => Math.pow(prev, 2))}}>x²</button>
                
                {
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(i => 
                        <button className='bg-blue-200 p-2 px-4' key={`button-${i}`} onClick={() => chooseNumber(i)}>{i}</button>
                    )
                }
            </div>
        </div>
    )
}