let map;
let marker;

let markers = [];

async function loadMarkers() {
  let events = await fetch('http://localhost:3000/mapsdb-api/v1/readAll');
  events = await events.json();
  events.forEach(event => {
    let newMarker = new google.maps.Marker({
      position: { lat: parseFloat(event.positionLat),
                  lng: parseFloat(event.positionLng)
      },
      map,
      title: event.title,
      clickable: false,
      draggable: false,
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });
    markers.push(newMarker);
  });
}

async function initMap() {
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: -6.88778, lng: -38.55700 },
    zoom: 13,
    zoomControl: false,
    fullscreenControl: false,
    minZoom: 7,
    maxZoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  map.addListener('click', (evt) => {
    console.log(`lat: ${evt.latLng.lat()}, lng:${evt.latLng.lng()}`);

    marker.setPosition(evt.latLng);
    map.setCenter(evt.latLng);
  });

  marker = new google.maps.Marker({
    position: { lat: -6.88778, lng: -38.55700 },
    map,
    title: "Hello World!",
    clickable: false,
    draggable: true,
    animation: google.maps.Animation.BOUNCE
  });

  marker.addListener('dblclick', evt => {
    showPos(evt.latLng);
  });
}

initMap()
.then(loadMarkers());

/* EVENTS */

const modal = document.querySelector('.marker-modal');
const lat = document.querySelector('#lat');
const lng = document.querySelector('#lng');

const findButtons = document.getElementsByClassName('find');

for (let i = 0; i < findButtons.length; i++) {
  findButtons[i].addEventListener('click', () => {
    map.setCenter(markers[i].getPosition());
  });
}

const showPos = pos => {
  lat.setAttribute('value', pos.lat());
  lng.setAttribute('value', pos.lng());
  modal.classList.remove('hidden');
};

