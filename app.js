const form = document.querySelector('form');
const suggestions = document.querySelectorAll('.suggestion');
const input = document.getElementById('searchBox');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');
const loaderDiv = document.querySelector('.loading');

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
    loaderDiv.classList.remove('hidden');

    try {
        const weatherData = await getWeatherData(query);
        displayWeatherInfo(weatherData);
    } catch (error) {
        resultDiv.classList.add('hidden');
        errorDiv.classList.remove('hidden');
    }finally{
        loaderDiv.classList.add('hidden');
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
    
    const iconCode = info.weather[0].icon;

    if(iconCode.endsWith('n')){
        resultDiv.style.backgroundImage = "url('assets/Moonlit\ Clouds\ in\ a\ Deep\ Night\ Sky.png')";
    }else{
        resultDiv.style.backgroundImage = "url('assets/Cinematic\ Vignetted\ Sunlit\ Sky.png')";
    }
    
    const id = info.weather[0].id;
    
    const attribute = getWeatherIcon(id,iconCode);

    const temperature = info.main.temp - 273.15;

    resultDiv.innerHTML = `
            <div class="city-name">
                <h3>${info.name}, ${info.sys.country}</h3><i data-lucide="map-pin"></i>
            </div>
            <div class="info">
                <i data-lucide="${attribute}"></i>
                <div class="">
                    <h1>${temperature.toFixed(1)} °C</h1>
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
        loaderDiv.classList.remove('hidden');

        try{
            input.value = btn.dataset.name;
            const weatherData = await getWeatherData(input.value);
            displayWeatherInfo(weatherData);
        }catch(e){
            resultDiv.classList.add('hidden');
            errorDiv.classList.remove('hidden');
        }finally{
            input.value = "";
            loaderDiv.classList.add('hidden');
        }
    });
})

function getWeatherIcon(id,iconCode){
    switch (true) {
        case (id >= 200 && id<=232):
            return "cloud-lightning";
        case (id>= 300 && id<=321):
            return "cloud-drizzle";
        case (id>=500 && id<=504 || id>=520 && id<=531):
            return "cloud-rain";
        case (id===511 || id>=600 && id<=602 || id>=611 && id<=616 || id>=620 && id<=622):
            return "cloud-snow";
        case (id===701 || id===711 || id===721 || id===741 || id===762):
            return "cloud-fog";
        case (id===731 || id===751 || id===761 || id===771):
            return "wind";
        case (id===781):
            return "tornado";
        case (id===800):
            if(iconCode.endsWith('n')){
                return "moon";
            }else{
                return "sun";
            }
        case (id>=801 && id<=802):
            if(iconCode.endsWith('n')){
                return "cloud-moon";
            }else{
                return "cloud-sun";
            }
        case (id>=803 && id<=804):
            return "cloud";
        default:
            return "cloud-sun";
    }
}