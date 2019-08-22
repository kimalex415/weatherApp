const request = require('request');

function forecast(latitude, longitude, callback) {
    const url = `https://api.darksky.net/forecast/08c4695f51dea7ed72978ff6c12d22d2/${latitude},${longitude}`;

    request({
        url,
        json: true
    }, (error, {
        body
    }) => {
        if (error) {
            callback('Unable to connect to weather service', undefined);
        } else if (body.error) {
            callback('Unable to find location', undefined)
        } else {
            callback(undefined, `${body.daily.data[0].summary} It is currently ${body.currently.temperature} degrees out. There is a ${body.currently.precipProbability}% chance of rain.`)
        }
    })
}

module.exports = forecast;