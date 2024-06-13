


let yourWeatherBtn=document.querySelector('.yourWeatherBtn');
let searchWeatherBtn=document.querySelector('.searchWeatherBtn');

let yourWeatherTab=document.querySelector('.yourWeatherTab');
let searchWeatherTab=document.querySelector('.searchWeatherTab');

let searchCityBtn=document.querySelector('.searchCityBtn');



let getPermissionTab=document.querySelector(".getPermissionTab");
let getPermissionBtn=document.querySelector('.getPermissionBtn');

let loading=document.querySelector(".loading");
let InfoTab=document.querySelector(".Info");

let error=document.querySelector('.error');
let okBtn=document.querySelector('.okBtn');



function showPosition(position){
    let userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude
    }
    console.log(userCoordinates);
    sessionStorage.setItem('userCoordinates',JSON.stringify(userCoordinates));
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

getLocation();

function checkPermission(){
    
    const localCoordinate=sessionStorage.getItem("userCoordinates");
    
    if(!localCoordinate){
        console.log("ooyeah0");
        yourWeatherBtn.disable=true;
        yourWeatherBtn.setAttribute('disabled','');
        searchWeatherBtn.setAttribute('disabled','');
        getPermissionTab.classList.add("active");
        yourWeatherTab.classList.remove("active");
        searchWeatherTab.classList.remove('active');
        getPermissionBtn.addEventListener('click',()=>{
            getLocation();
            getPermissionTab.classList.remove('active');
            yourWeatherTab.classList.add("active");

            yourWeatherBtn.removeAttribute('disabled');
            searchWeatherBtn.removeAttribute('disabled');
        })
    }else{
        console.log("ooyeah")
        getPermissionTab.classList.remove("active");
        yourWeatherTab.classList.add('active');
        const coordinates=JSON.parse(localCoordinate);
        fetchAPI(coordinates);
    }
}
checkPermission();


yourWeatherBtn.addEventListener('click',()=>{
    yourWeatherTab.classList.add('active');
    searchWeatherTab.classList.remove('active');
    loading.classList.remove('active');
});

searchWeatherBtn.addEventListener('click',()=>{
    searchWeatherTab.classList.add('active')
    yourWeatherTab.classList.remove('active');
    loading.classList.remove('active');
});

async function fetchAPI(coordinates){
    const{lat,lon}=coordinates;

    InfoTab.classList.remove('active')
    loading.classList.add('active');

    try {
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=396211a8b10fbf2101770a67dbff6226`)
        // const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=26.89&lon=87&appid=396211a8b10fbf2101770a67dbff6226`)
        var weatherApiObject= await response.json();
    } catch (error) {
        console.error(error);
    }
    InfoTab.classList.add('active')
    loading.classList.remove('active');
    setWeatherInfo(weatherApiObject);
}

async function fetchAPIToSearch(city){
    InfoTab.classList.remove('active')
    loading.classList.add('active');
    try {
        const response=await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=396211a8b10fbf2101770a67dbff6226`)
        var searchedWeatherApiObject= await response.json();
    } catch (error) {
        console.error(error);
    }

    if(searchedWeatherApiObject?.cod==404){
        loading.classList.add('active');
        yourWeatherTab.classList.remove('active');

    }else{
        InfoTab.classList.add('active')
        loading.classList.remove('active');
        setWeatherInfo(searchedWeatherApiObject);
    }
    
    // InfoTab.classList.add('active')
    // loading.classList.remove('active');
    // setWeatherInfo(searchedWeatherApiObject);
    
}

function setWeatherInfo(weatherApiObject){
    console.log(weatherApiObject);
    let countryName=document.querySelector('.countryName');
    let countryFlag=document.querySelector('.countryFlag');
    let weatherDescp=document.querySelector('.weatherDescp');
    let weatherImage=document.querySelector('.weatherImage');
    let temprature=document.querySelector('.temprature');
    let windSpeed= document.querySelector('.windSpeed');
    let humidity=document.querySelector('.humidity');
    let clouds=document.querySelector('.clouds');

    countryName.innerHTML=weatherApiObject?.name;
    countryFlag.src=`https://flagsapi.com/${weatherApiObject?.sys?.country}/flat/64.png`
    weatherDescp.innerHTML=weatherApiObject?.weather[0]?.description;
    weatherImage.src=`https://openweathermap.org/img/wn/${weatherApiObject?.weather[0]?.icon}@2x.png`;
    tempInF=weatherApiObject?.main?.temp;
    let tempInC=(tempInF-273.5).toFixed(2);
    temprature.innerHTML=tempInC;

    windSpeed.innerHTML=weatherApiObject?.wind?.speed;
    humidity.innerHTML=weatherApiObject?.main?.humidity;
    clouds.innerHTML=weatherApiObject?.clouds?.all;
}



searchCityBtn.addEventListener(('click'),()=>{
    let cityName=document.querySelector('.cityName');
    

    if(!cityName.value){
        return;
    }else{
        searchWeatherTab.classList.remove("active");
        yourWeatherTab.classList.add("active");
        fetchAPIToSearch(cityName.value);
    }

});