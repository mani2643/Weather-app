const form = document.querySelector('form');
const suggestions = document.querySelectorAll('.suggestion');
const input = document.getElementById('searchBox');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');

// api key
const apiKey = "26489e5928aee0630df07e5a74231568";

form.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const query = input.value.trim();
    
    if(!query){
        alert("There is nothing to search");
        return;
    }

    resultDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');

    try {
        const weatherData = await getWeatherData(query);
        displayWeatherInfo(weatherData);
    } catch (error) {
        console.log(error);
        resultDiv.classList.add('hidden');
        errorDiv.classList.remove('hidden');
    }finally{
        input.value = "";
    }
})

async function getWeatherData(city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appId=${apiKey}`;
    const response = await fetch(apiUrl);

    if(!response.ok){
        throw new Error("Could not fetch weather data");
    }
    const data = await response.json();

    return data;
}

function displayWeatherInfo(info){
    resultDiv.classList.remove('hidden');
    // console.log(info);
    
    const temperature = info.main.temp - 273.15;

    resultDiv.innerHTML = `
            <div class="city-name">
                <h3>${info.name}, ${info.sys.country}</h3><i data-lucide="map-pin"></i>
            </div>
            <div class="info">
                <i data-lucide="cloud-sun"></i>
                <div class="">
                    <h2>${temperature.toFixed(1)} °C</h2>
                    <div class="description">${info.weather[0].description}</div>
                </div>
            </div>
            <div class="cards">
                <div class="card">
                    <i data-lucide="droplets"></i>
                    <p class="humidity">Humidity</p>
                    <p class="percentage">${info.main.humidity}%</p>
                </div>
                <div class="card">
                    <i data-lucide="wind"></i>
                    <p class="humidity">Wind speed</p>
                    <p class="percentage">${info.wind.speed} m/s</p>
                </div>
            </div>
    `;

    lucide.createIcons();
}

suggestions.forEach((btn)=>{
    btn.addEventListener('click',async ()=>{

        resultDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');

        try{
            input.value = btn.dataset.name;
            const weatherData = await getWeatherData(input.value);
            displayWeatherInfo(weatherData);
        }catch(e){
            resultDiv.classList.add('hidden');
            errorDiv.classList.remove('hidden');
        }finally{
            input.value = "";
        }
    
    });
})