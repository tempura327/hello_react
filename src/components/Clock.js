import {useState, useEffect} from 'react';

export default function Clock(props) {
    const [date, setDate] = useState(new Date().toLocaleString());
  
    useEffect(() => {
        const timer = setInterval(() => {
          setDate(new Date().toLocaleString());
          
        }, 1000);
  
        return () => {
          console.log(`componentWillUnmount: ${date}`);
          clearInterval(timer);
        }
    });
    
    return (
      <p>{date}</p>
    )
}