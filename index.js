
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentwetheritemsEL = document.getElementById('current-wether-items');
const timezoneEl = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const wetherForecastEl = document.getElementById('wether-forecast');
const currentTempEl = document.getElementById('current-temp');
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const API_KEY ='49cc8c821cd2aff9af04c9f98c36eb74';

setInterval(()=>{
 const time = new Date();
 const month = time.getMonth();
 const date = time.getDate();
 const day = time.getDay();
 const hours = time.getHours();
 const hourin12HrFoemat = hours >= 13 ? hours % 12 : hours;
 const minutes = time.getMinutes();
 const min = minutes < 10 ? '0'+ minutes : minutes;
 const ampm = hours >=12 ? 'PM' : 'AM'; 

 timeEl.innerHTML = hourin12HrFoemat+':'+min+' '+  `<span id="am-pm">${ampm}</span>`;
 dateEl.innerHTML = days[day]+', '+date+' '+months[month];

},1000);
getWeatherData();
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        
        let {latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

        console.log(data)
        showWeatherData(data);
        })

    })
}

function showWeatherData(data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;
    currentwetheritemsEL.innerHTML = ` 
    <div class="wether-item">
    <div>Humidtiy</div>
    <div>${humidity}%</div>
</div>
<div class="wether-item">
    <div>Pressure</div>
    <div>${pressure}</div>
</div>
<div class="wether-item">
    <div>wind speed</div>
    <div>${wind_speed}</div>
</div>
<div class="wether-item">
    <div>Sunrise</div>
    <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
</div>

<div class="wether-item">
    <div>Sunset</div>
    <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
</div>

`;
let otherDayForcast = ''
data.daily.forEach((day, idx) => {
    if(idx == 0){
        currentTempEl.innerHTML = `
        <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
        <div class="other">
            <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
            <div class="temp">Night - ${day.temp.night}&#176;C</div>
            <div class="temp">Day - ${day.temp.day}&#176;C</div>
        </div>
        
        `
    }else{
        otherDayForcast += `
        <div class="weather-forecast-item">
            <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="temp">Night - ${day.temp.night}&#176;C</div>
            <div class="temp">Day - ${day.temp.day}&#176;C</div>
        </div>
        
        `
    }
})


wetherForecastEl.innerHTML = otherDayForcast;
}