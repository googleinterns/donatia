/* global google*/

/**
 * Formats a raw phone number into a +# (###) ### - #### format.
 * @param {number} number The phone number unformatted.
 * @return {string} The formatted phone number.
 */
export function formatPhoneNumber(number) {
  const regexMatch = number.toString().match(/^(\d{3})(\d{3})(\d{4})$/);
  if (regexMatch) {
    return `(${regexMatch[1]}) ${regexMatch[2]}-${regexMatch[3]}`;
  }
  return number;
}

/**
 * Geocodes the placeID into an address
 * @param {number} placeID Google Places ID
 * @return {string} the formatted address
 */
export function getAddressFromPlaceID(placeID) {
  const geocoder = new google.maps.Geocoder();
  return new Promise(function (resolve, reject) {
    geocoder.geocode({placeId: placeID}, function (results, status) {
      if (status === 'OK') {
        if (results[0]) {
          resolve(results[0].formatted_address);
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
      resolve();
    });
  });
}

/**
 * Gets the latitude and longitude given a placeID
 * @param {number} placeID Google Places ID
 * @return {*} Object with latitude and longitude
 */
export function getCoordinatesFromPlaceID(placeID) {
  const coordinates = {};
  const geocoder = new google.maps.Geocoder();
  return new Promise(function (resolve, reject) {
    geocoder.geocode({placeId: placeID}, function (results, status) {
      if (status === 'OK') {
        if (results[0]) {
          coordinates.lat = results[0].geometry.location.lat();
          coordinates.lng = results[0].geometry.location.lng();
          resolve(coordinates);
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
      resolve();
    });
  });
}
