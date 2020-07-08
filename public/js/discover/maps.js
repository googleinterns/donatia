const HOUSTON_COORDS = {lat: 29.7604, lng: -95.3698};

let map;
let bounds;
let selectedMarker;
let markers = [];

/**
 * Initializes the Google Map to be centerd in Houston and to add 
 * initial organization markers.
 */
export function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: HOUSTON_COORDS,
    zoom: 13,
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }],
      },
    ],
  });
  bounds = new google.maps.LatLngBounds(HOUSTON_COORDS);
}

/**
 * Adds markers to the map based on the data in the data array passed in.
 * @param {JSON object} data A json containing organzation data to create markers for.
 */
export function createMarkers(data) {
  data.forEach(organization => {
    // Create the markers and attach to the map.
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(organization.latitude, organization.longitude),
      map: map,
      title: organization.title,
      id: organization.id
    });

    // Create the marker info window.
    let markerWindow = new google.maps.InfoWindow({
      content: organization.title,
    });

    // Add event listeners to the map for marker hovering.
    const mapContainer = document.getElementById("map");

    google.maps.event.addListener(marker, 'mouseover', function () {
      selectMarker(marker.id)
      mapContainer.dispatchEvent(new CustomEvent('markerHover', {bubbles: true, detail: marker.id}))
    });

    google.maps.event.addListener(marker, 'mouseout', function () {
      selectMarker("")
      mapContainer.dispatchEvent(new CustomEvent('markerHover', {bubbles: true, detail: null}))
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
 * Select and open the info window for the marker with the 
 * given id. Close all other marker windows.
 */
export function selectMarker(id = null) {
  if (selectedMarker) selectedMarker.markerWindow.close();
  selectedMarker = markers.find(marker => marker.marker.id == id);
  if (selectedMarker) selectedMarker.markerWindow.open(map, selectedMarker.marker);
}

/**
 * Removes all markers from the map and markers array.
 */
export function removeAllMarkers() {
  for (let marker of markers) marker.marker.setMap(null);
  markers = [];
}
