import React, {Component} from 'react';

class BarChart extends Component {
    constructor(props) {
      super(props);
      this.state = {
  
      }
  
      this.canvas = React.createRef();
    }
  

    // hooks
    componentDidMount(){
      this.ctx = this.canvas.current.getContext('2d');
      
      // 此時props還沒傳過來
    }
    componentDidUpdate({weatherData}){
      if(JSON.stringify(weatherData) !== JSON.stringify(this.props.weatherData)){
        this.setState({
          maxValue:this.getMax(this.props.weatherData.map((i) => i.main.temp_max))
        });
      }
    }
  
    
    // methods
    getMax(arr){
      return Math.max(...arr);
    }
  
    drawLine(ctx, startX, startY, endX, endY, color){
      ctx.save();
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      ctx.restore();
    }
    drawBar(ctx, x, y, width, height, color){
      ctx.save();
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
      ctx.restore();
    }
    drawGridLines() {
      const canvasActualHeight = this.props.canvasSetting.height - this.props.canvasSetting.padding * 2;
   
      let gridValue = 0;
  
      while (gridValue <= this.state.maxValue) {
        const gridY = canvasActualHeight * (1 - gridValue / this.state.maxValue) + this.props.canvasSetting.padding;
        this.drawLine(
          this.ctx,
          0,
          gridY,
          this.props.canvasSetting.width,
          gridY,
          '#cccccc'
        );
   
        this.drawLine(
          this.ctx,
          15,
          this.props.canvasSetting.padding / 2,
          15,
          gridY + this.props.canvasSetting.padding / 2,
          '#cccccc'
        );
   
        this.ctx.save();
        
        this.ctx.fillStyle = '#333333';
        this.ctx.textBaseline = 'bottom';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.fillText(`${gridValue.toString()}℃`, 0, gridY - 2);
        this.ctx.restore();
   
        gridValue += this.props.canvasSetting.gridScale;
      }
    }
    drawBars() {
      let dateArr = [...new Set(this.props.weatherData.map(i => i.dt_txt.slice(0, 10)))];
      dateArr = dateArr.slice(1, 5);
      
      const canvasActualHeight = this.props.canvasSetting.height - this.props.canvasSetting.padding * 2;
      const canvasActualWidth = this.props.canvasSetting.width - this.props.canvasSetting.padding * 2;
   
      const numberOfBars = dateArr.length;
      const barSize = canvasActualWidth / numberOfBars / 4; // divide a group into 4 parts. 2 for bars and 2 for blank.
      for(let i = 0; i < dateArr.length; i++){
        const data = this.props.weatherData.filter(d => d.dt_txt.startsWith(dateArr[i]));
        const maxTemp = Math.max(...data.map(d => d.main.temp_max));
        const minTemp = Math.min(...data.map(d => d.main.temp_min));
        
        
        const maxTempBarHeight = Math.round((canvasActualHeight * maxTemp) / this.state.maxValue);
        const minTempBarHeight = Math.round((canvasActualHeight * minTemp) / this.state.maxValue);
  
        this.drawBar(
          this.ctx,
          // (this.props.canvasSetting.padding + i * barSize) * 4,
          // if this.props.canvasSetting.padding not be added, scale will be covered by bar on left side. 
          // multiply 4 is because there are 4 parts in a group.
          this.props.canvasSetting.padding + (i * barSize) * 4 + barSize, 
          // if maxTempBarHeight not be discounted, bars will drawn from top of canvas.
          // and if this.props.canvasSetting.padding not be discounted, bars will over bottom of x axis. 
          this.props.canvasSetting.height - maxTempBarHeight - this.props.canvasSetting.padding,
          barSize,
          maxTempBarHeight,
          '#F92472',
        );
  
        this.drawBar(
          this.ctx,
          // (this.props.canvasSetting.padding + i * barSize) * 4 + barSize * 2,
          // if this.props.canvasSetting.padding not be added, scale will be covered by bar on left side. 
          // multiply 4 is because there are 4 parts in a group.          
          this.props.canvasSetting.padding + (i * barSize) * 4 + barSize * 2,
          // if maxTempBarHeight not be discounted, bars will drawn from top of canvas.
          // and if this.props.canvasSetting.padding not be discounted, bars will over bottom of x axis.           
          this.props.canvasSetting.height - minTempBarHeight - this.props.canvasSetting.padding,
          barSize,
          minTempBarHeight,
          '#08A6BB',
        ); 
  
        this.drawLabel(dateArr[i], this.props.canvasSetting.padding + (i * barSize) * 4 + barSize * 1.5);
      }
    }
    drawLabel(str, x){
      this.ctx.save();
      this.ctx.fillStyle = '#333333';
      this.ctx.textBaseline = 'bottom';
      this.ctx.font = 'bold 12px Arial';
      this.ctx.fillText(str, x, this.props.canvasSetting.height);
      this.ctx.restore();      
    }
    draw() {
      this.drawGridLines();
      this.drawBars();
    }
  
    render() { 
      const {width, height} = this.props.canvasSetting;
  
      this.draw();
  
      return (
        <div className={`w-2/4 ${this.props.class}`}>
          <canvas id="chart" ref={this.canvas} width={width} height={height}></canvas>
        </div>
      );
    }
}
   
BarChart.defaultProps = {
  canvasSetting:{
    width:700,
    height:750,
    padding:20, // keep space for scale
    gridScale:5,
  },
  weatherData:[],
};

export default BarChart;