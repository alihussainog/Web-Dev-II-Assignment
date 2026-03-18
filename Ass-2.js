const API_KEY = "45ecd5ed9b60acb78bb119577c748d7f";

const form = document.querySelector("#weatherForm");
const cityInput = document.querySelector("#cityInput");
const info = document.querySelector(".info");
const historyDiv = document.querySelector(".history");
const consoleDiv = document.querySelector(".console");


function logConsole(message){
    const p = document.createElement("p");
    p.textContent = message;
    consoleDiv.appendChild(p);
}


form.addEventListener("submit", async (e)=>{

    e.preventDefault();

    const city = cityInput.value;

    if(city === ""){
        alert("Enter city name");
        return;
    }

    // 🔹 Reset console every search
    consoleDiv.innerHTML="";

    logConsole("Sync Start");

    setTimeout(()=>{
        logConsole("setTimeout (Macrotask)");
    },0);

    logConsole("Sync End");

    logConsole("[ASYNC] Start fetching");

    try{

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.json();

        logConsole("[ASYNC] Data received");

        if(data.cod === "404"){
            info.innerHTML="City not found";
            return;
        }

        displayWeather(data);

        saveHistory(city);

    }
    catch(error){

        info.innerHTML="Network error";

        logConsole("Error fetching data");

    }

});


function displayWeather(data){

info.innerHTML=`
<p><span>City</span><span>${data.name}, ${data.sys.country}</span></p>
<p><span>Temp</span><span>${data.main.temp} °C</span></p>
<p><span>Weather</span><span>${data.weather[0].main}</span></p>
<p><span>Humidity</span><span>${data.main.humidity}%</span></p>
<p><span>Wind</span><span>${data.wind.speed} m/s</span></p>
`;

}


function saveHistory(city){

let history = JSON.parse(localStorage.getItem("cities")) || [];

if(!history.includes(city)){
history.push(city);
localStorage.setItem("cities", JSON.stringify(history));
}

showHistory();

}


function showHistory(){

let history = JSON.parse(localStorage.getItem("cities")) || [];

historyDiv.innerHTML="";

history.forEach(city => {

const span = document.createElement("span");

span.textContent = city;

span.addEventListener("click", ()=>{

cityInput.value = city;

form.dispatchEvent(new Event("submit"));

});

historyDiv.appendChild(span);

});

}

showHistory();