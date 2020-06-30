var map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 29.7604, lng: -95.3698 },
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
  generateMarkers();
}

function generateMarkers() {
  console.log("making markers")

  organizations.forEach(org => {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(org.latitude, org.longitude),
      map: map,
      title: org.title
    });

    var infoWindow = new google.maps.InfoWindow({
      content: org.title
    });

    google.maps.event.addListener(marker, 'click', function () {
      infoWindow.open(map, marker);
    });
  });
}
