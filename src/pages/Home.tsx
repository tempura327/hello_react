import {Link} from 'react-router-dom'

const Home = () => {
    return (
        <div>
            <h1>this is Home</h1>

            <Link to='about'>About</Link>
            <Link to='product'>Product</Link>
        </div>

        
    );
}  

export default Home;