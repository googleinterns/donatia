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
  data
    .filter((organization) => !!organization.coordinates)
    .forEach((organization) => {
      // Create the markers and attach to the map.
      const marker = new google.maps.Marker({
        position: organization.coordinates,
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
