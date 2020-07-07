const HOUSTON_COORDS = {lat: 29.7604, lng: -95.3698};

let map;
let bounds;
let markers = [];
let markerWindows = [];
let selectedMarker;

/* 
 * Initializes the Google Map to be centerd in Houston and to add 
 * initial organization markers.
 */
function initMap() {
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
function createMarkers(data) {
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
      id: organization.id
    });

    // Open the marker windows when clicked.
    google.maps.event.addListener(marker, 'click', function () {
      if (selectedMarker) { 
        selectedMarker.close(); 
      }
      selectedMarker = markerWindow;
      selectedMarker.open(map, marker);
    });

    bounds.extend(marker.getPosition());
    map.fitBounds(bounds);
    markers.push(marker);
    markerWindows.push(markerWindow);
  });
}

/*
 * Opens the marker with the given id.
 */
function openMarker(id) {
  for (let i = 0; i < markerWindows.length; i++) {
    console.log(markerWindows[i].id, id, markerWindows[i].id === id)
    if (markerWindows[i].id === id) {
      markerWindows[i].open(map, markers[i]);
    } else {
      markerWindows[i].close();
    }
  }
}

/*
 * Removes all markers from the map and markers array.
 */
function removeMarkers() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}
