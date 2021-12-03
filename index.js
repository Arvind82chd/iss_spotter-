// index.js
const { nextISSTimesForMyLocation } = require('./iss');

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   } else {
//     console.log('It worked! Returned IP:' , ip);
//   }


// });

// fetchCoordsByIP('49.36.229.230', (error, coordinates) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   } else {
//     console.log('It worked! Returned Coordinates:' , coordinates);
//   }
  
  
// });


// const exampleCoords = { latitude: '49.27670', longitude: '-123.13000' };
// fetchISSFlyOverTimes(exampleCoords, (error, timestamp) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   } else {
//     console.log('It worked! Returned Timestamp: ', timestamp);
//   }
// });

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};


nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the daets!
  printPassTimes(passTimes);
});