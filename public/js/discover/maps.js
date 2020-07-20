const HOUSTON_COORDS = {lat: 29.7604, lng: -95.3698};

let map;
let bounds;
let markers = [];

/* global google */

/**
 * Initializes the Google Map to be centerd in Houston and to add
 * initial organization markers.
 */
export function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: HOUSTON_COORDS,
    zoom: 13,
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
      {
        featureType: 'poi',
        stylers: [{visibility: 'off'}],
      },
    ],
  });
  bounds = new google.maps.LatLngBounds(HOUSTON_COORDS);
}

/**
 * Adds markers to the map based on the data in the data array passed in.
 * @param {JSON} data A json containing organzation data to create markers for.
 */
export function createMarkers(data) {
  data.forEach((organization) => {
    // Create the markers and attach to the map.
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(
        organization.location._latitude,
        organization.location._longitude
      ),
      map: map,
      title: organization.name,
      id: organization.id,
    });

    // Create the marker info window.
    const markerWindow = new google.maps.InfoWindow({
      content: organization.name,
    });

    // Select a marker and dispatch an event when a marker is hovered on/off.
    const mapContainer = document.getElementById('map');

    google.maps.event.addListener(marker, 'mouseover', function () {
      selectMarker(marker.id);
      mapContainer.dispatchEvent(
        new CustomEvent('markerChange', {bubbles: true, detail: marker.id})
      );
    });

    google.maps.event.addListener(marker, 'mouseout', function () {
      selectMarker(null);
      mapContainer.dispatchEvent(new CustomEvent('markerChange', {bubbles: true, detail: null}));
    });

    bounds.extend(marker.getPosition());
    map.fitBounds(bounds);
    markers.push({
      marker: marker,
      markerWindow: markerWindow,
    });
  });
}

/**
 * Selects and opens the info window for the marker with the given
 * id. Closes all other marker windows.
 * @param {String} id the id of the organization's marker to select
 */
export function selectMarker(id = null) {
  for (const marker of markers) {
    if (marker.marker.id === id) {
      marker.markerWindow.open(map, marker.marker);
    } else {
      marker.markerWindow.close();
    }
  }
}

/**
 * Removes all markers from the map and markers array.
 */
export function removeAllMarkers() {
  for (const marker of markers) marker.marker.setMap(null);
  markers = [];
}

/**
 * Sets the address and coordinates of an organization using PlaceId.
 * @param {JSON} organization The JSON list of organizations.
 */
export function setLocationInfo(organization) {
  console.log('setting info');
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({placeId: organization.placeId}, function (results, status) {
    if (status === 'OK' && results[0]) {
      organization.address = results[0].formatted_address;
      organization.coordinates = results[0].geometry.location;
      console.log('with geo info', organization);
    }
  });
}
