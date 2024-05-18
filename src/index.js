import './styles.css';
import Spinner from './spinner.js';
import { dayImages, nightImages } from './loadImages.js';
import { format, getHours } from 'date-fns';

const renderInfo = (data, scale = true, speedMeasure = true) => {
  const dataName = document.getElementById('dataName');
  const dataRegion = document.getElementById('dataRegion');
  const dataCountry = document.getElementById('dataCountry');
  const dataTemp = document.getElementById('dataTemp');
  const dataCondition = document.getElementById('dataCondition');
  const dataFeelsLike = document.getElementById('dataFeelsLike');
  const dataHumidity = document.getElementById('dataHumidity');
  const dataWind = document.getElementById('dataWind');
  const img = document.getElementById('weatherConditionImg');
  const icon = data.current.condition.icon.split('/').pop();
  const path = data.current.is_day === 1 ? dayImages : nightImages;
  img.setAttribute('src', `${path[icon]}`);
  const forecastDaily = document.getElementById('forecastDaily');
  const forecastHourly = document.getElementById('forecastHourly');
  const forecastHourlyBtn = document.getElementById('forecastHourlyBtn');
  const forecastDailyBtn = document.getElementById('forecastDailyBtn');
  forecastDailyBtn.addEventListener('click', () => {
    forecastDaily.classList.remove('hidden');
    forecastDaily.classList.add('grid');
    forecastHourly.classList.add('hidden');
  });
  forecastHourlyBtn.addEventListener('click', () => {
    forecastDaily.classList.add('hidden');
    forecastDaily.classList.remove('grid');
    forecastHourly.classList.remove('hidden');
    forecastHourly.classList.add('grid');
  });

  const renderObj = {
    renderGeneralInfo() {
      dataName.textContent = `${data.location.name}`;
      dataRegion.textContent = `${data.location.region}`;
      dataCountry.textContent = `${data.location.country}`;
    },
    renderTemperature() {
      dataTemp.textContent = `${
        scale
          ? data.current.temp_c + '\u00B0C'
          : data.current.temp_f + '\u00B0F'
      }`;
      dataCondition.textContent = `${data.current.condition.text}`;
      dataFeelsLike.textContent = `${
        scale
          ? data.current.feelslike_c + '\u00B0C'
          : data.current.feelslike_f + '\u00B0F'
      }`;
      dataHumidity.textContent = `${data.current.humidity}%`;
      dataWind.textContent = `${
        speedMeasure
          ? data.current.wind_kph + ' kph'
          : data.current.wind_mph + ' mph'
      }`;
    },
    renderDailyForecast() {
      // Clear any previous searches
      forecastDaily.textContent = '';
      // Get all the available days
      const forecastDays = data.forecast.forecastday;
      // and for each day create and display the info needed
      forecastDays.forEach((forecast) => {
        const forecastDay = document.createElement('div');
        forecastDay.className =
          'w-full col-span-1 row-auto flex flex-col items-center';
        // set the image depending on the icon returned
        const forecastIcon = forecast.day.condition.icon.split('/').pop();
        const img = document.createElement('img');
        img.setAttribute('src', `${path[forecastIcon]}`);
        // get the average temp
        const avgTemp = document.createElement('span');
        avgTemp.textContent = `${
          scale
            ? forecast.day.avgtemp_c + '\u00B0C'
            : forecast.day.avgtemp_f + '\u00B0F'
        }`;
        const forecastDayInfo = document.createElement('div');
        forecastDayInfo.textContent = `${format(forecast.date, 'dd-MM-yyyy')}`;
        forecastDay.append(forecastDayInfo, avgTemp, img);
        forecastDaily.append(forecastDay);
        // when we have data click the daily button to show the forecast for the next 3 days
        forecastDailyBtn.click();
      });
    },
    renderHourlyForecast() {
      // Clear any previous searches
      forecastHourly.textContent = '';
      // Get all the available hours
      const forecastHours = data.forecast.forecastday[0].hour;
      // and for each hour create and display the info needed
      forecastHours.forEach((hour) => {
        const forecastHour = document.createElement('div');
        forecastHour.className = 'flex items-center gap-2';
        // set the image depending on the icon returned
        const forecastIcon = hour.condition.icon.split('/').pop();
        const img = document.createElement('img');
        img.setAttribute('src', `${path[forecastIcon]}`);
        img.setAttribute('width', '60px');
        // get the average temp
        const hourlyTemp = document.createElement('span');
        hourlyTemp.textContent = `${
          scale ? hour.temp_c + '\u00B0C' : hour.temp_f + '\u00B0F'
        }`;
        const forecastHourlyInfo = document.createElement('div');
        forecastHourlyInfo.textContent = `${getHours(hour.time)}:00`;

        forecastHour.append(forecastHourlyInfo, img, hourlyTemp);
        forecastHourly.append(forecastHour);
      });
    },

    init() {
      renderObj.renderGeneralInfo();
      renderObj.renderTemperature();
      renderObj.renderDailyForecast();
      renderObj.renderHourlyForecast();
    },
  };
  return renderObj.init;
};

const getWeatherData = async (loc) => {
  const spinner = Spinner();
  const weatherLocation = document.getElementById('weatherLocation');

  spinner.show();
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=bbfcef0df5014fa79dd95135240505&q=${
      typeof loc !== 'string' ? weatherLocation.value : loc
    }&days=3`,
    {
      mode: 'cors',
    }
  );
  if (!response.ok) {
    alert('There was an error with your search please try again');
    weatherLocation.value = '';
    spinner.hide();
    throw new Error('Something went wrong ');
  }
  try {
    const data = await response.json();
    weatherLocation.value = '';
    const celsiusRadio = document.querySelector('#celsius');
    const fahrenheitRadio = document.querySelector('#fahrenheit');

    celsiusRadio.addEventListener('change', () => {
      let scale = celsiusRadio.checked ? true : false;
      let speedMeasure = celsiusRadio.checked ? true : false;
      renderInfo(data, scale, speedMeasure)();
    });

    fahrenheitRadio.addEventListener('change', () => {
      let scale = fahrenheitRadio.checked ? false : true;
      let speedMeasure = fahrenheitRadio.checked ? false : true;
      renderInfo(data, scale, speedMeasure)();
    });

    let scale = celsiusRadio.checked ? true : false;
    let speedMeasure = celsiusRadio.checked ? true : false;
    renderInfo(data, scale, speedMeasure)();
    spinner.hide();
  } catch (error) {
    console.error(`HOUSTON ${error}`);
  }
};
const getDataBtn = document.getElementById('getDataBtn');
getDataBtn.addEventListener('click', () => {
  const weatherLocation = document.getElementById('weatherLocation');

  if (weatherLocation.value.trim() === '') {
    alert('Please search for a location');
  } else {
    getWeatherData();
  }
});

window.addEventListener('load', () => {
  getWeatherData('London');
});
