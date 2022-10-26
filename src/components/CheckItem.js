import React, {Component} from 'react';

class CheckItem extends Component{
    constructor(props){
      super(props);
  
      this.state = {}
  
      this.toggle = this.toggle.bind(this);
    }
  
    toggle(e){
      this.props.onToggle(Boolean(e.target.value), this.props.index);
    }
  
    render(){
      return (
        <div className="inline">
          <input type="checkbox" checked={this.props.state} value={this.props.state} onChange={this.toggle} disabled={this.props.state} className="mr-2" />
          <label className={this.props.state? 'line-through' : ''}>{this.props.text}</label>
        </div>
      )
    }
  }
  
  export default CheckItem;