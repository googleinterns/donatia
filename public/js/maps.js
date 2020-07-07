const HOUSTON_COORDS = {lat: 29.7604, lng: -95.3698};

let map;
let bounds;
let openMarkerWindow;

/** 
 * Initialize the Google Map to be centerd in Houston and to add 
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
  data.forEach(org => {
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(org.latitude, org.longitude),
      map: map,
      title: org.title,
    });

    let markerWindow = new google.maps.InfoWindow({
      content: org.title,
    });

    google.maps.event.addListener(marker, 'click', function () {
      // Close current marker window if there is one open.
      if (openMarkerWindow) openMarkerWindow.close();
      openMarkerWindow = markerWindow;
      openMarkerWindow.open(map, marker);
    });

    bounds.extend(marker.getPosition());
    map.fitBounds(bounds);
  });
}
