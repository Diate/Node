var locations = [
  ['Location 1', 37.7749, -122.4194],
  ['Location 2', 37.7749, -122.4316],
  ['Location 3', 37.7815, -122.4089],
];

var map = L.map('map').setView([37.7749, -122.4194], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map);

for (var i = 0; i < locations.length; i++) {
  var location = locations[i];
  L.marker([location[1], location[2]]).addTo(map).bindPopup(location[0]);
}
