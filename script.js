// MAPS 

var map = L.map('map').setView([48.8566, 2.3522], 13);
let latitude;
let longitude;


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// ... 

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        
        .openOn(map);

        latitude = e.latlng.lat.toFixed(6);
        longitude = e.latlng.lng.toFixed(6);

        launchWeather(latitude, longitude);
}

map.on('click', onMapClick);

// WEATHER
const superSecret = 'SEPJ7S59LNJYRXK94KLF49QX9';




async function launchWeather(latitude, longitude) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?unitGroup=metric&include=hours&key=${superSecret}&contentType=json`;

    try {
        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        fillThePopup(latitude, longitude, data);
    } catch (err) {
        console.error('Error: ', err);
    }
}



function fillThePopup(latitude, longitude, weatherData) {
    const today = weatherData.days[0];
    console.log(weatherData)
    let content = `
    <div class="divToday">
    <p class="sunrisesunset">${today.sunrise} / ${today.sunset}</p>
    `
    let hoursToDisplay = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23];

    hoursToDisplay.forEach(index => {
        let hour = today.hours[index];
        let hourFormatted = hour.datetime.split(':').slice(0, 2).join(':');

        content += `
            <div class="divToday_hour">
             <p>${hourFormatted}</p>
             <img src="./img/icons/${hour.icon}.svg" alt="${hour.icon}" />
             <p class="divToday_hour_conditions">${hour.conditions}</p>
             <p class="divToday_hour_temp">${hour.temp}°</p>
         </div>
         </div>
        `

    })

    popup.setContent(content)
}


