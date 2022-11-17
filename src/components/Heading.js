import { useContext } from 'react';
import { LevelContext } from '../contexts/LevelContext';

// export default function Heading({level, children}){
//     switch(level){
//         case 1:
//             return <h1 className='text-3xl'>{children}</h1>;

//         case 2:
//             return <h2 className='text-2xl'>{children}</h2>;

//         case 3:
//             return <h3 className='text-xl'>{children}</h3>;

//         case 4:
//             return <h4 className='text-lg'>{children}</h4>;
            
//         case 5:
//             return <h5 className='text-base'>{children}</h5>;
        
//         case 6:
//             return <h6 className='text-sm'>{children}</h6>;
        
//         default:
//             throw Error('level is invalid.');
//     }
// }

// export default function Heading({children}){
//     const level = useContext(LevelContext);
//     // console.log(LevelContext);
    
//     switch(level){
//         case 1:
//             return <h1 className='text-3xl'>{children}</h1>;

//         case 2:
//             return <h2 className='text-2xl'>{children}</h2>;

//         case 3:
//             return <h3 className='text-xl'>{children}</h3>;

//         case 4:
//             return <h4 className='text-lg'>{children}</h4>;
            
//         case 5:
//             return <h5 className='text-base'>{children}</h5>;
        
//         case 6:
//             return <h6 className='text-sm'>{children}</h6>;
        
//         default:
//             throw Error('level is invalid.');
//     }
// }

export default function Heading({children}){
    const level = useContext(LevelContext);
    
    switch(level){
        case 1:
            return <h1 className='text-3xl'>{children}</h1>;

        case 2:
            return <h2 className='text-2xl'>{children}</h2>;

        case 3:
            return <h3 className='text-xl'>{children}</h3>;

        case 4:
            return <h4 className='text-lg'>{children}</h4>;
            
        case 5:
            return <h5 className='text-base'>{children}</h5>;
        
        case 6:
            return <h6 className='text-sm'>{children}</h6>;
        
        default:
            throw Error('level is invalid.');
    }
}