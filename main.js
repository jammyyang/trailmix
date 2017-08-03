var trailChoices;
var lat;
var lon;
var radius = 25;
var trailTemps = [];
var newCityLocation;

// //Beginning---code for inputting other city than where you are and displaying trails-----//
// $('button').click(function() {
//     cityPosition();
//     }
// );

function cityPosition (){
    var cityInput = $("#cityInput").val();
    $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json?&address="+ cityInput + '"',
        method: "get",
        dataType: "json",
        success: function(result){
            console.log("We have a result", result);
            newCityLocation = result;
        },
        error: function(){
            console.log("This thing not working");
        }
    });

    // getTrailData(lat,lon, radius);
}
//End---code for inputting other city than where you are and displaying trails-----//

//Beginning---code for clicking a div to display main activities----//
function displayMainTrailLocationActivity () {
    var activity1 = trailChoices[i].activities[0].activity_type_name;
    var activity2 = trailChoices[i].activities[1].activity_type_name;

}
//End---code for clicking a div to display main activities----//



$(document).ready(function() {
    $(".pic").click(initMap);

});

// trailChoices.[i].lat
// trailChoices.[i].lon

function initMap() {
    var myLatlng = {lat: 33.8794, lng: -117.92569};

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: myLatlng
    });

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Click to zoom'
    });

    map.addListener('center_changed', function() {
        // 3 seconds after the center of the map has changed, pan back to the
        // marker.
        window.setTimeout(function() {
            map.panTo(marker.getPosition());
        }, 4500);
    });

    marker.addListener('click', function() {
        map.setZoom(10);
        map.setCenter(marker.getPosition());
    });

}

function getLocationTrailWeather() {
    loadMessage();
    getLocation();
}

function loadMessage() {
    $("#loadIntro").modal("show");
    setTimeout(function(){
        $("#loadIntro").modal("hide");
    }, 5000);
}



function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
       alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position){
    console.log("This is the position object", position);
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    getTrailData(lat, lon, radius);
}

function getTrailData(lat, lon, radius){
    var options = {
        url:'server/trailApi.php?lat='+lat+"&lon="+lon+"&radius="+radius,
        success: handleTrailSuccess,
        error: handleError,
        dataType: 'json',
        method: 'get',
        crossdomain: true
    };

    function handleTrailSuccess(result){
        console.log('success', result);
        trailChoices = result.places;
        displayCards();

    }

    function handleError(){
        console.log('error');
    }

    $.ajax(options);
}

function displayCards () {

    for (var i=0; i<trailChoices.length; i++) {
        var random = Math.floor(Math.random() * 24 + 1);
        var trailName = trailChoices[i].name;
        var cityTemps = trailTemps[i];
        var trailLocation = trailChoices[i].city;
        console.log('city temps,', cityTemps);
        var cardColumn = $('<div>', {
            class: "col-sm-3"
        });

        var cardDiv = $('<div>', {
            class: "pic"
        });

        var imgDiv = $('<img>', {
            // src: "https://c1.staticflickr.com/7/6204/6047319257_b27c1be597_m.jpg"
            src: 'trail_image/' + random + '.jpg',
            class: "imgDiv"
        });


        var picBottomDiv = $('<div>', {
            class: "picBottom"
        });


        var trailNameDiv = $('<div>', {
            class: "trailName d-inline",
            text: trailName + ' - ' + trailLocation
        });


        var trailTempDiv = $('<div>', {
            class: "trailTemp d-inline",
            text: cityTemps
        });

        picBottomDiv.append(trailNameDiv, trailTempDiv);
        cardDiv.append(imgDiv, picBottomDiv);
        // $(imgDiv).css('background-image','url("trail_image/' + ranNum + '.jpg")');
        cardColumn.append(cardDiv);
        $('.row').append(cardColumn);
        getWeatherData(trailChoices[i],trailTempDiv);
    }


    $(".picBottom").click(function() {
        // alert("click bottom works")
        $("#myModal").modal("show");
    });

    $(".imgDiv").click(function() {
        // alert("click bottom works")
        $("#openModal").modal("show");
    });
}

function convertDegreesKToF(kTemp){
    return kTemp * 9/5 - 459.67;
}

function getWeatherData (trail,displayElement){


    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + trail.city + ",us&APPID=0b8c405de2b767fa2d70b9d5a5325856",
        method: "GET",
        dataType: 'json',
        // async: true,
        // crossDomain: true,
        success: function(result){
            console.log("This is the weather result", result.main.temp);
            trailTemps.push(result.main.temp);
            var degreesSymbol = $("<sup>",{
                html:'&#8457;',
                class: 'degreesSymbol'
            });
            displayElement.text(Math.floor(convertDegreesKToF(result.main.temp)));
            displayElement.append(degreesSymbol)
            var weatherIcon = $("<img>",{
                src: "https://openweathermap.org/img/w/" + result.weather[0].icon + ".png",
                class: 'weatherIcon'
            });
            displayElement.append(weatherIcon);
            console.log(trail);
            //displayElement.append();

        }
    });

    console.log(trailTemps);
}

