const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API

  request('https://api.ipify.org?format=json', (err, response, body) => {
    if (err) {
      callback(err, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      const IP = JSON.parse(body).ip;
      callback(null, IP);
    }

        
  });
};


const fetchCoordsByIP = function(ip, callback) {

  request(`https://freegeoip.app/json/${ip}`, (err, response, body) => {
    if (err) {
      callback(err, null);
      return;
    } if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching Coordinates: ${body}`;
      callback(Error(msg), null);
      return;
    }
    //const data = JSON.parse(body).latitude
    const { latitude, longitude } = JSON.parse(body);
    //console.log({ latitude, longitute});
            
    callback(null, { latitude, longitude });
        
  });

};


const fetchISSFlyOverTimes = function(coordinates, callback) {

  request(`https://iss-pass.herokuapp.com/json/?lat=${coordinates.latitude}&lon=${coordinates.longitude}`, (err, response, body) => {
    if (err) {
      callback(err, null);
      return;
    } if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, nextPasses);
      });
    });
  });

};
  
module.exports = { nextISSTimesForMyLocation };