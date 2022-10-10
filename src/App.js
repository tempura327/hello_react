import React, {Component} from 'react';

// function Card({imgSrc, text}){
//   return (
//     <div className='flex justify-center flex-col'>
//       <img src={imgSrc} alt={text}/>
//       <p className="text-center">{text}</p>
//     </div>
//   );
// }

// function FlipCard({imgSrc, text}){
//   return (
//     <div className="flip-card">
//       <div className="flip-card-inner">
//         <div className="flip-card-front">
//           <img src={imgSrc} alt="" className="w-full rounded-full"/>
//         </div>
//         <div className="flip-card-back">
//           <h1>{text}</h1>
//         </div>
//       </div>
//     </div>
//   );
// }

// function List({data, ele, className}){
//   const elementArr = [];

//   for(let i = 0; i < data.length; i++){
//     elementArr.push(ele(...Object.values(data[i]), i));
//   }

//   return <div className={className}>{elementArr}</div>
// }


// function App() {
//   const data = [
//     {url:'https://images.unsplash.com/photo-1552521923-b46b3137bab3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80', name:'Sakura'},
//     {url:'https://images.unsplash.com/photo-1602294525148-c3d202338aa3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80', name:'lilac'},     
//     {url:'https://images.unsplash.com/photo-1593139247120-fd48520799a3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80', name:'Hydrangea'},
//   ];

//   return (
//     <div className="container">
//       <List data={data}  ele={(url, name, index) => {return <Card imgSrc={url} text={name} key={index}></Card>}} className="grid grid-cols-3 gap-2"></List>

//       <hr className="my-8"/>

//       <List data={data}  ele={(url, name, index) => {return <FlipCard imgSrc={url} text={name} key={index}></FlipCard>}} className="flex justify-around"></List>
//     </div>
//   );
// }

// -------------------------------------------------------------------------------------
// class Counter extends Component {
//   constructor(props){
//     super(props);
//     this.state = {num:0};

//     // 一定要使用bind改變this的指向，不然addNum的this會是undefined
//     this.addNum = this.addNum.bind(this);    
//   }

//   // methods
//   addNum() {
//     this.setState((state, prop) => ({
//       num: state.num + prop.unit
//     }));
//   }

//   discountNum = () => {
//     this.setState((state, prop) => ({
//       num: state.num - prop.unit
//     }));
//   }

//   reset = () => {
//     this.setState({
//       num: 0
//     })
//   }  

//   render() {
//     return (
//       <div>
//         <h2>{this.state.num}</h2>
//         {/* 千萬不要直接寫onClick={this.addNum()}，這樣會不斷呼叫 */}
//         <button className='p-3 bg-blue-300 text-white rounded' onClick={this.addNum}>add</button>
//         <button className='p-3 ml-3 bg-blue-300 text-white rounded' onClick={this.discountNum}>discount</button>
//         <button className='p-3 ml-3 bg-blue-300 text-white rounded' onClick={this.reset}>reset</button>
//       </div>
//     );
//   }
// }

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {n:0};
//   }

//   render() { 
//     return (
//       <div className="container">
//         <Counter unit={2}></Counter>
//         <Counter unit={5}></Counter>
//       </div>      
//     );
//   }
// }

// -------------------------------------------------------------------------------------
// class Hello extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }
//   render() { 
//     return (
//       <div className={this.props.className} onClick={this.props.onClick}>
//         <h1>hello, {this.props.name}</h1>
//       </div>
//     );
//   }
// }
 
// class Goodbye extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }
//   render() { 
//     return (
//       <div className={this.props.className}>
//         <h1>Goodbye, {this.props.name}</h1>
//       </div>
//     );
//   }
// }

// class Sun extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {  };
//   }
  
//   render() { 
//     return this.props.isSunShow ? (
//       <div className='my-3'>
//         <span className='bg-yellow-200 rounded p-2 shadow-yellow-400/50 shadow-lg'>
//           The sun is rising.
//         </span>
//       </div>
//     ) : null;
//   }
// }
 
// class App extends Component {
//   state = {
//     isHelloOn:true
//   };

//   // methods
//   toggle = () => {
//     this.setState({
//       isHelloOn:!this.state.isHelloOn,
//     })
//   }

//   render(){
//     return (
//       <div className="container">
//         <h1>{`isHelloOn: ${this.state.isHelloOn}`}</h1>
//         <button className='mb-3 p-2 bg-blue-500 text-white rounded' onClick={this.toggle}>toggle</button>
//         {this.state.isHelloOn? <Hello onClick={() => {console.log(`hello1: ${this.state.isHelloOn}`);}} name="Tempura" className="text-yellow-400"></Hello> : <Goodbye name="Tempura" className="text-blue-400"></Goodbye>}

//         {
//           this.state.isHelloOn && <Hello onClick={() => {console.log(`hello2: ${this.state.isHelloOn}`);}} name="Tempura"></Hello>
//         }

//         <Sun isSunShow={true}></Sun>
//         <Sun isSunShow={false}></Sun>
       
//       </div>
//     )
//   };
// }
 
// export default App;

// -------------------------------------------------------------------------------------
// class NumberList extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {  };
//     this.list = this.props.numbers.map(i => <li key={i} className={i % 2 === 0 && 'bg-green-200'}>{i}</li>);
//   }

//   render() { 
//     return (
//       <ul className='border-2 border-solid border-green-400 p-3 my-2'>
//         {this.list}
//       </ul>
//     );
//   }
// }
 
// class List extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       list:[]
//     };
    
//     for(let i in this.props.data){
//       this.state.list.push(<li className='my-1'>{parseInt(i) + 1}: {this.props.data[i]}</li>);
//     }
//   }

//   render() { 
//     return (
//       <ul>
//         {this.state.list}
//       </ul>
//     );
//   }
// }
 

// class App extends Component {
//   state = {
//     listData:['aaa', 'bb', 'cccc']
//   };

//   render(){
//     return (
//       <div className="container">
//         <NumberList numbers={[1,2,3]}></NumberList>
//         <NumberList numbers={[4,5,6]}></NumberList>
//         <hr/>

//         <List data={this.state.listData}></List>

//       </div>
//     )
//   };
// }

// -------------------------------------------------------------------------------------
class CheckItem extends Component{
  constructor(props){
    super(props);

    this.state = {
      isDone:props.state,
    }

    this.toggle = this.toggle.bind(this);
  }

  toggle(){
    this.setState({
      isDone: !this.state.isDone,
    })
  }

  render(){
    return (
      <div className="inline">
        <input type="checkbox" checked={this.state.isDone} value={this.state.isDone} onChange={this.toggle} disabled={this.state.isDone} className="mr-2" />
        <label className={this.state.isDone? 'line-through' : ''}>{this.props.text}</label>
      </div>
    )
  }
}

class ToDoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingValue:'',
      list:[
        {text:'sweeping floor', state:false},
      ],
    };

    this.addItem = this.addItem.bind(this);
    this.changePendingValue = this.changePendingValue.bind(this);
  }

  changePendingValue(e){
    this.setState({
      pendingValue:e.target.value
    });
  }

  addItem(){
    this.setState((state) => {
      state.list.push({text:this.state.pendingValue, state:false});
    });

    this.setState({
      pendingValue:''
    })
  }

  render() { 
    return (
      <div>
        <input type="text" value={this.state.pendingValue} className="p-2" onChange={this.changePendingValue}/>
        <button className="bg-blue-400 p-2 mb-4 ml-2 rounded text-white" onClick={this.addItem}>add</button>

        <ul>
          {this.state.list.map((i, index) => <CheckItem text={i.text} state={i.state} key={index}></CheckItem>)}
        </ul>
      </div>
    );
  }
}


class App extends Component {
  state = {
    
  };

  render(){
    return (
      <div className="container">
        <ToDoList></ToDoList>
      </div>
    )
  };
}
 
export default App;