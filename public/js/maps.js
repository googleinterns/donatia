const HOUSTON_CORDS = { lat: 29.7604, lng: -95.3698 }
var map;
var bounds;
var openMarkerWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: HOUSTON_CORDS,
    zoom: 13,
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }]
      }
    ]
  });
  bounds = new google.maps.LatLngBounds(HOUSTON_CORDS);
  generateMarkers();
}

function generateMarkers() {
  organizations.forEach(org => {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(org.latitude, org.longitude),
      map: map,
      title: org.title
    });

    var markerWindow = new google.maps.InfoWindow({
      content: org.title
    });

    google.maps.event.addListener(marker, 'click', function () {
      if (openMarkerWindow) openMarkerWindow.close();
      openMarkerWindow = markerWindow;
      openMarkerWindow.open(map, marker);
    });

    bounds.extend(marker.getPosition());
    map.fitBounds(bounds);
  });
}
