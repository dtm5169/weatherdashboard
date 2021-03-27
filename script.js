$(document).ready(function(){

    let cities = [];

    $("#currentCity").hide();
    $("#fiveDay").hide();

    //main current city forecast API Call
    function currentCityForecast(city){
        let apiKey = "818e5b0e3e17697364971c8cea59f2dd";
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            let weatherIcon = response.weather[0].icon;
            let date = $("<h2>").text(moment().format('l'));
            let icon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"); 
            //convert temp to fahrenheit
            let tempF = (response.main.temp - 273.15) * 1.80 + 32;
                
            $("#currentCityName").text(response.name);
            $("#currentCityName").append(date);
            $("#currentCityName").append(icon);
            $("#currentCityTemp").text(tempF.toFixed(2) + " \u00B0F");
            $("#currentCityHumid").text(response.main.humidity + "%");
            $("#currentCityWind").text(response.wind.speed + "MPH");

                let lat = response.coord.lat
                let lon = response.coord.lon
                queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon; 
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function(response){
                    let uvIndex = response.value;
                    $("#currentCityUV").removeClass("favorable");
                    $("#currentCityUV").removeClass("moderate");
                    $("#currentCityUV").removeClass("severe");
                        if (uvIndex <= 2.9){
                            $("#currentCityUV").addClass("favorable");
                        } else if (uvIndex >= 3 && uvIndex <= 7.9){
                            $("#currentCityUV").addClass("moderate");
                        } else {
                            $("#currentCityUV").addClass("severe");
                        };

                        $("#currentCityUV").text(response.value);
                    
                });   

                $("#currentCity").show();   
        }); 
    };
    function createCityLists(city){
        let cityLi = $("<li>").text(city)
        cityLi.addClass("cityList");
        $("#cityList").append(cityLi); 
    };

    //Clear input element and render list for a city
    function renderCities(){
        $("#cityList").empty();
        for (let i = 0; i < cities.length; i++) { 
            createCityLists(cities[i]);
        };
    };

    function weather(city){
        currentCityForecast(city);
        fiveDayForecast(city);
    };

    function init() {
        // local storage
        let storedCities = JSON.parse(localStorage.getItem("searches"));
        if (storedCities) {
            cities = storedCities;
            renderCities();
            weather(cities[cities.length -1]);
        }; 
    };
    init();

    //forecast API
    function fiveDayForecast(city){
        let apiKey = "a21452e46a01e033140bf735eec1ff6e"
        let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;
    
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            let counter = 1
            for(let i=0; i < response.list.length; i += 8){
                let date = moment(response.list[i].dt_txt).format("l");
                let weatherIcon = response.list[i].weather[0].icon;
                //converted temp to fahrenheit
                let tempF = (response.list[i].main.temp - 273.15) * 1.80 + 32;
                    
                $("#date" + counter).text(date);
                $("#icon" + counter).attr("src", " http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
                $("#temp" + counter).text(tempF.toFixed(2) + " \u00B0F");
                $("#humid" + counter).text(response.list[i].main.humidity + "%"); 
                counter++;

            };

            $("#fiveDay").show();   
        });
    };

    //click button will save info to local storage  
    $("#searchBtn").click(function(){
        let cityInputs = $(this).siblings("#userInput").val().trim();
        $("#userInput").val("");
        if (cityInputs !== ""){
            if (cities.indexOf(cityInputs)== -1){
                cities.push(cityInputs);
                localStorage.setItem("searches",JSON.stringify(cities));
                createCityLists(cityInputs);
            };
            
            weather(cityInputs);
        };
    });

    $("#cityList").on("click", ".cityList", function(){
        var cityOnButton = $(this).text();
        weather(cityOnButton);
    });

});