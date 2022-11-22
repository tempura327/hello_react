import {Component} from 'react';

class SimpleButton extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  
  render() { 
    const color = this.props.color || 'blue';
    const skin = this.props.type === 'outline' ? `border-2 border-solid border-${color}-400 hover:bg-${color}-400 hover:text-white` : `text-white bg-${color}-600 hover:bg-${color}-800`;

    return (
      <button className={`rounded p-2 ${skin} ${this.props.class}`} onClick={this.props.onClick}>{this.props.children || 'save'}</button>
    );
  }
}

export default SimpleButton;