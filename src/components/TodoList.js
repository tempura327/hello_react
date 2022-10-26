// --------------------------------controlled component(single controlled element)-----------------------------------------------------
import React, {Component} from 'react';
import CheckItem from './CheckItem';

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
      this.toggle = this.toggle.bind(this);
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
  
    toggle(value, index){
      const copiedList = JSON.parse(JSON.stringify(this.state.list));
  
      copiedList.splice(index, index + 1, {
        text:copiedList[index].text,
        state:value
      });
  
      this.setState({
        list:copiedList
      });
    }
  
    render() { 
      return (
        <div>
          <input type="text" value={this.state.pendingValue} className="p-2" onChange={this.changePendingValue}/>
          <button className="bg-blue-400 p-2 ml-2 rounded text-white" onClick={this.addItem}>add</button>
  
          <ul className='flex flex-col'>
            {this.state.list.map((i, index) => <CheckItem text={i.text} state={i.state} onToggle={this.toggle} key={index} index={index}></CheckItem>)}
          </ul>
        </div>
      );
    }
}

export default ToDoList;