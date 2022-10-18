import React, {Component} from 'react';
import BarChart from './BarChart';

class WeatherForecast extends Component {
    constructor(props) {
      super(props);
      this.state = {
        key: 'fec0e7e281da4c7d714ff7a5f6e37a40',
      };
  
      this.getWeather = this.getWeather.bind(this);
    }
  
    
    // hooks
    async componentDidMount(){
      window.navigator.geolocation.getCurrentPosition(async (pos) => {
        const {latitude, longitude} = await pos.coords;
  
        this.setState({
          weatherData: await this.getWeather(latitude, longitude)
        });
      });
    }
    
  
    // methods
    async getWeather(latitude, longitude){
      const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${latitude}&lon=${longitude}&appid=${this.state.key}`)
                  .then((d) => d.json());
              
      return res.list;
    }
  
    render() { 
      return (
        <div>
          <h1 className='text-2xl text-center'>所在地天氣</h1>
          <BarChart class='mx-auto' weatherData={this.state.weatherData}></BarChart>
        </div>
      );
    }
}

export default WeatherForecast;