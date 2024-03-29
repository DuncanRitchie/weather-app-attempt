const request = require("request");
const chalk = require("chalk");
// const JSO = require("jso");

const flickrKey = "75c23a119862573eb7204058a885d80b";
// const flickrSecret = "d902fa4a08de9ab6";

const getWeather = (address) => {
    geoUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoiZHVuY2FuciIsImEiOiJjanQ3ZGZ2OXgwb3NxM3pydXUzbmN1MThjIn0.Hw9zenxA4-uRV32LPm7Iqw`
    request({url: geoUrl, json: true},(error, geoResponse)=>{
        if (error) {
            console.log("Error getting geo-data! Maybe your internet's down, or the location doesn't exist.")
        }
        else {
            let geodata = geoResponse.body;
            let longitude = geodata.features[0].center[0];
            let latitude = geodata.features[0].center[1];
            if (latitude>=0) {
                northOrSouth = "North"
            }
            else {
                northOrSouth = "South"
            }
            if (longitude>=0) {
                eastOrWest = "East"
            }
            else {
                eastOrWest = "West"
            }
            console.log(chalk.green(`${chalk.bold(geodata.features[0].place_name)} is ${Math.abs(latitude)} degrees ${northOrSouth} and ${Math.abs(longitude)} degrees ${eastOrWest}.`));
            weatherUrl = `https://api.darksky.net/forecast/be7deb5ceb49b65e140c2bddebbe9f06/${latitude},${longitude}?units=si`;
            request({url: weatherUrl, json: true},(error, weatherResponse)=>{
                if (error || weatherResponse == undefined) {
                    console.log("Error getting weather data!")
                }
                else {
                    console.log(weatherResponse.body.currently);
                    flickrPlaceUrl = `https://api.flickr.com/services/rest/?method=flickr.places.findByLatLon&api_key=${flickrKey}&lat=${latitude}&lon=${longitude}&accuracy=4&format=json`;
                    request({url: flickrPlaceUrl},(error, flickrPlaceResponse)=>{
                        if (error || flickrPlaceResponse == undefined) {
                            console.log("Error getting place_id from Flickr!")
                        }
                        else {
                            let woe = JSON.parse(flickrPlaceResponse.body.slice(14,-1)).places.place[0].woeid;
                            console.log("Flickr says your place response is "+woe);
                        }
                    })
                }
            })
        }
    })
}

getWeather("Chester")