import React, {Component} from 'react';

// --------------------------------------function component & JSX + loop-----------------------------------------------

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

// ---------------------------------------class component & event handler----------------------------------------------
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

// -------------------------------------class component & state------------------------------------------------
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

// ----------------------------------class component & loop---------------------------------------------------
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

// --------------------------------controlled component(single controlled element)-----------------------------------------------------
// class CheckItem extends Component{
//   constructor(props){
//     super(props);

//     this.state = {
//       isDone:props.state,
//     }

//     this.toggle = this.toggle.bind(this);
//   }

//   toggle(){
//     this.setState({
//       isDone: !this.state.isDone,
//     })
//   }

//   render(){
//     return (
//       <div className="inline">
//         <input type="checkbox" checked={this.state.isDone} value={this.state.isDone} onChange={this.toggle} disabled={this.state.isDone} className="mr-2" />
//         <label className={this.state.isDone? 'line-through' : ''}>{this.props.text}</label>
//       </div>
//     )
//   }
// }

// class ToDoList extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       pendingValue:'',
//       list:[
//         {text:'sweeping floor', state:false},
//       ],
//     };

//     this.addItem = this.addItem.bind(this);
//     this.changePendingValue = this.changePendingValue.bind(this);
//   }

//   changePendingValue(e){
//     this.setState({
//       pendingValue:e.target.value
//     });
//   }

//   addItem(){
//     this.setState((state) => {
//       state.list.push({text:this.state.pendingValue, state:false});
//     });

//     this.setState({
//       pendingValue:''
//     })
//   }

//   render() { 
//     return (
//       <div>
//         <input type="text" value={this.state.pendingValue} className="p-2" onChange={this.changePendingValue}/>
//         <button className="bg-blue-400 p-2 mb-4 ml-2 rounded text-white" onClick={this.addItem}>add</button>

//         <ul>
//           {this.state.list.map((i, index) => <CheckItem text={i.text} state={i.state} key={index}></CheckItem>)}
//         </ul>
//       </div>
//     );
//   }
// }


// class App extends Component {
//   state = {
    
//   };

//   render(){
//     return (
//       <div className="container">
//         <ToDoList></ToDoList>
//       </div>
//     )
//   };
// }

// ------------------------------------controlled component(multiple controlled element)-------------------------------------------------
// class Profile extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       name:'',
//       age:0
//     };

//     this.changeProfile = this.changeProfile.bind(this);
//   }

//   changeProfile(e){
//     const target = e.target;
//     const key = target.name;

//     this.setState({
//       [key]:target.value
//     });
//   }

//   render() { 
//     return (
//       <div className='flex flex-col'>
//         <input className='mb-2' type="text" name="name" value={this.state.name} onChange={this.changeProfile}/>
//         <input className='mb-2' type="text" name="age" value={this.state.age} onChange={this.changeProfile}/>

//         <hr/>

//         <p>My name is {this.state.name}. I'm {this.state.age} years old</p>
//       </div>
//     );
//   }
// }
 

// class App extends Component {
//   state = {
    
//   };

//   render(){
//     return (
//       <div className="container">
//         <Profile></Profile>
//       </div>
//     )
//   };
// }
 
// ------------------------------------uncontrolled component-------------------------------------------------
// class Form extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       text:'',
//       previewUrl:'',
//       previewFileName:''
//     };

//     this.submitProfile = this.submitProfile.bind(this);
//     this.changePreview = this.changePreview.bind(this);

//     this.input = React.createRef();
//     this.fileInput = React.createRef();
//   }

//   submitProfile(){
//     this.setState({
//       text:this.input.current.value
//     });
//   }

//   changePreview(e){
//     const files = e.target.files;

//     const reader = new FileReader();

//     reader.onload = (e) => {
//       this.setState({
//         previewUrl:e.target.result,
//         previewFileName:e.target.name
//       });
//     }

//     reader.readAsDataURL(files[0]);
//   }

//   render() { 
//     return (
//       <div className='flex flex-col'>
//         <img className='mb-2 w-32' src={this.state.previewUrl} alt="" />
//         <input className='mb-2' type="file" ref="fileInput" onChange={this.changePreview}/>

//         <div>
//           <label>圖片標題: </label>
//           <input className='mb-2' type="text" ref={this.input} defaultValue="tempura"/>
//         </div>

//         <button className='p-2 bg-blue-400 text-white rounded' onClick={this.submitProfile}>submit</button>

//         <p>{this.state.text}</p>
//       </div>
//     );
//   }
// }

// class Form extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       previewUrl:'',
//       previewFileName:''
//     };

//     this.fileInput = React.createRef();
//     this.fileInputClick = this.fileInputClick.bind(this);
//     this.changePreview = this.changePreview.bind(this);
//   }

//   fileInputClick() {
//     this.fileInput.current.click();
//   }

//   changePreview(e){
//     const files = e.target.files;
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       this.setState({
//         previewUrl:e.target.result,
//         previewFileName:files[0].name
//       });
//     }

//     reader.readAsDataURL(files[0]);    
//   }

//   render() { 
//     return (<div>
//       <img src={this.state.previewUrl} alt="" className='w-32'/>

//       <div className='flex'>
//         {/* 把醜醜的fileInput藏起來 */}
//         <input type="file" className='hidden' ref={this.fileInput} onChange={this.changePreview}/>
        
//         {/* 用一個input和button替代它放在畫面上 */}
//         <input type="text" value={this.state.previewFileName} disabled placeholder='name of file' className='p-2 rounded-l'/>
//         {/* 按了這個button相當於按了fileInput */}
//         <button type="button" onClick={this.fileInputClick} className="p-2 bg-blue-400 text-white rounded-r">choose file</button>
//       </div>
//     </div>);
//   }
// }
 
// class App extends Component {
//   state = {
//     // 
//   };
// // 
//   render(){
//     return (
//       <div className="container">
//         <Form></Form>
//       </div>
//     )
//   };
// }

// ------------------------------------lifting state up-------------------------------------------------
// function convertToDateObj(dateStr){
//   return new Date(dateStr);
// }

// function convertToDateStr(dateObj){
//   const year = dateObj.getFullYear();
//   const month = dateObj.getMonth() + 1;
//   const date = dateObj.getDate();

//   const hour = dateObj.getHours();
//   const min = dateObj.getMinutes();
//   const sec = dateObj.getSeconds();
  
//   return `${year}/${fillLengthUp(month)}/${fillLengthUp(date)} ${fillLengthUp(hour)}:${fillLengthUp(min)}:${fillLengthUp(sec)}`;
// }

// function convertTime(targetTimeZone, timeZone, dateObj){
//   const anHourSecond =  60 * 60 * 1000;
  
//   return new Date(dateObj - (targetTimeZone - timeZone) * anHourSecond);
// }

// function fillLengthUp(num){
//   return num.toString().padStart(2, 0);
// }

// class TimeInput extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
      
//     };

//     this.onTimeChange = this.onTimeChange.bind(this);
//     this.validateTime = this.validateTime.bind(this);
//   }

//   onTimeChange(e){
//     const {isValid, dateStr} = this.validateTime(e.target.value);

//     if(!isValid) return;

//     this.props.onTimeChange(this.props.timeZone, dateStr);
//   }

//   validateTime(dateStr){
//     return /^[0-9]{4}(\/|-)[0-9]{2}(\/|-)[0-9]{2}( [0-9]{2}:[0-9]{2}:[0-9]{2}){0,1}$/.test(dateStr)? {isValid:true, dateStr} : {isValid:false, dateStr:''};
//   }

//   render() { 
//     return (
//       <div>
//         <p>UTC{this.props.timeZone >= 0? '+' : ''}{this.props.timeZone}</p>
//         <input type="text" className='mb-3 p-2' value={this.props.dateStr} onChange={this.onTimeChange}/>
//       </div>
//     );
//   }
// }
 
// class TimeConvertor extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       timeZone:8,
//       dateStr:convertToDateStr(new Date())
//     };

//     this.changeTime = this.changeTime.bind(this);
//   }

//   changeTime(timeZone, dateStr){
//     this.setState({
//       timeZone,
//       dateStr,
//     });
//   }

//   render() {
//     const timeZones = [8, 4, 0, -4, -8];
//     let time = '';
    
//     return (
//       <div className='flex flex-col'>
//         {
//           timeZones.map((zone, index) => {
//             time = this.state.timeZone === zone? this.state.dateStr : convertToDateStr(convertTime(this.state.timeZone, zone, convertToDateObj(this.state.dateStr)));

//             return <TimeInput timeZone={zone} dateStr={time} onTimeChange={this.changeTime} key={index}></TimeInput>
//           })
//         }
//       </div>
//     );
//   }
// }
 
// function App(){
//   return (
//       <div className="container">
//         <TimeConvertor></TimeConvertor>
//       </div>
//     )
// }

// --------------------------------children prop-----------------------------------------------------

// function SideBar(props){
//   return (
//     <div className='flex flex-col bg-indigo-700 text-white w-1/4 h-screen p-2'>
//       {props.children}
//     </div>
//   );
// }

// function App(){
//   const routes = [
//     {name:'Google', url:'https://www.google.com.tw'}, 
//     {name:'React official site', url:'https://reactjs.org/'},
//     {name:'Vue official site', url:'https://vuejs.org/'},
//     {name:'Tailwind official site', url:'https://tailwindcss.com/'},
//   ];

//   return (
//       <div className="container">
//         <SideBar>
//           {
//             routes.map((route, index) => <a href={route.url} className='w-fit py-2 inline border-transparent border-b-2 border-solid hover:border-white'>{route.name}</a>)
//           }
//         </SideBar>
//       </div>
//     )
// }

// ------------------------------specialization-------------------------------------------------------
function Modal(props){
  return (
    <div className='bg-gray-800/50 h-screen w-screen absolute top-0 left-0'>
      <div className='bg-white rounded w-1/2 p-4 mx-auto flex flex-col'>
        <h1 className='text-xl'>{props.title}</h1>
        <hr className='my-2'/>

        {props.children}

        <hr className='my-2'/>
        {props.modalFooter}
      </div>
    </div>
  );
}


function App(){
  const footer =  <button className='bg-blue-600 rounded p-2 text-white ml-auto'>save</button>;

  return (
    <div>
      <div className='container'>
        <h1 className='text-2xl'>this is APP</h1>

      </div>
      <Modal title="tempura ninja modal" modalFooter={footer}>
        <img src="" alt="" />
      </Modal>
    </div>
  );
}

export default App;