import { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css";
import Highcharts from 'highcharts';
import wmo from "./wmo.js"

function App() {
  const [weather, setWeather] = useState({});
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [loading, setLoading] = useState(true);

  function getWeather() {
    axios.get('https://api.open-meteo.com/v1/forecast?latitude=65.01&longitude=25.47&current=temperature_2m,weather_code&hourly=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto')
      .then(response => {
        setWeather(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }
  
  useEffect(() => {
    getWeather();
  }, []);

  const currentTemperature = !isFahrenheit 
  ? weather.current?.temperature_2m 
  : (weather.current?.temperature_2m * 9/5) + 32;

  const currentWeatherCode = weather.current?.weather_code
  const currentWeatherCodeLabel = wmo[weather.current?.weather_code];
  let currentWeatherImgSrc;
  let forecastImgSrc = [];

  if (currentWeatherCodeLabel) {
    switch (currentWeatherCode) {
      case 0:
      case 1:
        currentWeatherImgSrc = '/src/assets/clear-sky.png';
        break;
      case 2:
        currentWeatherImgSrc = '/src/assets/partly-cloudy.png';
        break;
      case 3:
        currentWeatherImgSrc = '/src/assets/cloudy.png';
        break;
      case 45:
      case 48:
        currentWeatherImgSrc = '/src/assets/fog.png';
        break;
      case 51:
      case 53:
      case 55:
        currentWeatherImgSrc = '/src/assets/drizzle.png';
        break;
      case 56:
      case 57:
        currentWeatherImgSrc = '/src/assets/freezing-rain.png';
        break;
      case 61:
      case 63:
        currentWeatherImgSrc = '/src/assets/light-rain.png';
        break;
      case 65:
      case 66:
      case 67:
        currentWeatherImgSrc = '/src/assets/heavy-rain.png';
        break;
      case 71:
      case 73:
      case 75:
      case 77:
        currentWeatherImgSrc = '/src/assets/snow.png';
        break;
      case 80:
      case 81:
        currentWeatherImgSrc = '/src/assets/light-rain.png';
        break;
      case 82:
        currentWeatherImgSrc = '/src/assets/heavy-rain.png';
        break;
      case 85:
      case 86:
        currentWeatherImgSrc = '/src/assets/snow.png';
        break;
      case 95:
      case 951:
        currentWeatherImgSrc = '/src/assets/storm.png';
        break;
      case 96:
      case 99:
        currentWeatherImgSrc = '/src/assets/hail.png';
        break;
      default:
        break;
    }
  }
  
  const weatherCodesWeek = weather.daily?.weather_code;
  const temperaturesMinWeek = weather.daily?.temperature_2m_min;
  const temperaturesMaxWeek = weather.daily?.temperature_2m_max;
  const datesWeek = weather.daily?.time;
  const date = new Date();
  const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];

  const todayDate = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

  const formattedDate = todayDate + ' ' + getMonthName(month) + ' ' + year + ', ' + hours + ':' + minutes;

function getMonthName(month) {
    let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[month - 1];
}

if (weatherCodesWeek) {
 forecastImgSrc = weatherCodesWeek.map(code => {
  switch (code) {
    case 0:
    case 1:
      return '/src/assets/clear-sky.png';
    case 2:
      return '/src/assets/partly-cloudy.png';
    case 3:
      return '/src/assets/cloudy.png';
    case 45:
    case 48:
      return '/src/assets/fog.png';
    case 51:
    case 53:
    case 55:
      return '/src/assets/drizzle.png';
    case 56:
    case 57:
      return '/src/assets/freezing-rain.png';
    case 61:
    case 63:
      return '/src/assets/light-rain.png';
    case 65:
    case 66:
    case 67:
      return '/src/assets/heavy-rain.png';
    case 71:
    case 73:
    case 75:
    case 77:
      return '/src/assets/snow.png';
    case 80:
    case 81:
      return '/src/assets/light-rain.png';
    case 82:
      return '/src/assets/heavy-rain.png';
    case 85:
    case 86:
      return '/src/assets/snow.png';
    case 95:
    case 951:
      return '/src/assets/storm.png';
    case 96:
    case 99:
      return '/src/assets/hail.png';
    default:
      return '';
    }
  });
}

const hourlyTemperaturesOneWeek = weather.hourly?.temperature_2m;

  const temperatures = isFahrenheit 
  ? hourlyTemperaturesOneWeek.map(temp => (temp * 9/5) + 32)
  : hourlyTemperaturesOneWeek;

  const forecastCardMinTemperatures = isFahrenheit 
  ? temperaturesMinWeek.map(temp => (temp * 9/5) + 32)
  : temperaturesMinWeek;

  const forecastCardMaxTemperatures = isFahrenheit 
  ? temperaturesMaxWeek.map(temp => (temp * 9/5) + 32)
  : temperaturesMaxWeek;

  const tempUnit = isFahrenheit ? '°F' : '°C';

  useEffect(() => {
    const chart = document.getElementById('weather-chart');
    if (chart) {
    Highcharts.chart('weather-chart', {
      title: {
          text: 'Temperatures (' + tempUnit + ')'
      },
      xAxis: {
        type: 'datetime',
        tickInterval: 24 * 3600 * 1000
      },
      yAxis: {
          title: {
              text: 'Temperature (' + tempUnit + ')'
          }
      },
      plotOptions: {
          series: {
              label: {
                  connectorAllowed: false
              },
              pointStart: date.setHours(2,0,0,0)
          }
      },
      credits: {
        enabled: false
      },
      series: [{
          name: 'Temperature (' + tempUnit + ')',
          data: temperatures,
          pointInterval:  3600 * 1000
      }],
      responsive: {
          rules: [{
              condition: {
                  maxWidth: 500
              },
              chartOptions: {
                  legend: {
                      layout: 'horizontal',
                      align: 'center',
                      verticalAlign: 'bottom'
                  }
              }
          }]
      }
  })}
  }), [document.getElementById('weather-chart')];

  return (
    <div>
      {loading === true && !weather ? <p>Retrieving weather data. Please wait.</p> : null}
      <div className='flex-container'>
      <h1 className='weather-label'>Weather
      <img className='weather-logo' src="/src/assets/weather.png"></img>
      </h1>
      <div className='content-box' style={{backgroundImage: `linear-gradient(
                                    rgba(255, 255, 255, 0.5),
                                    rgba(255, 255, 255, 0.5)
                                    ), url(${currentWeatherImgSrc})`}}>
          <h2 className='current-weather-title'>Current weather</h2>
          <div className='current-temperature-label'>
              {Math.round(currentTemperature * 10) / 10 + ' ' + tempUnit} 
          </div>
          <div className='current-datetime-label'>
            {currentWeatherCodeLabel}
            <br></br>
            <br></br>
              {day + ', ' + formattedDate}
          </div>
      </div>
      </div>
      {weather?.daily?.time.length > 0 ? (
        <>
              <button className='toggle-button' onClick={() => setIsFahrenheit(prev => !prev)}>Toggle Temperature Unit</button>  
        <div className='weather-line-chart' id='weather-chart'>
        </div>
        <div className='weather-components'>
        <div className='forecast-container'> 
        <div className='weather-forecast'>
        {datesWeek.map((timeValue, index) => (
          <div className="card" style={{backgroundImage: `linear-gradient(
                                rgba(255, 255, 255, 0.3),
                                rgba(255, 255, 255, 0.3)
                                ), url(${forecastImgSrc[index]})`}} key={timeValue}>
            <h3>{timeValue}</h3>
            {Math.round(forecastCardMinTemperatures[index] * 10) / 10 + tempUnit 
            + ' ' + Math.round(forecastCardMaxTemperatures[index] * 10) / 10 + tempUnit}
            <br></br>
            {wmo[weatherCodesWeek[index]]}
          </div>
        ))}
        </div>
        </div>
        </div>
        </>
      ) : null}
    </div>
  );
}

export default App;