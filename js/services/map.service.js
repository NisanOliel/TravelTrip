import { locService } from './loc.service.js'
import { utilService } from './util.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    goToSearch,
    gMap
}

window.searchCord = searchCord;
window.goToSearch = goToSearch;

const API_KEY = 'AIzaSyC4CCroXerY3okRnhMxHHcufHQAiIRSzZs'; //TODO: Enter your API Key
var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
            addMapLisner()


        })
}
function addMapLisner() {
    gMap.addListener('click', (mapMouseEvent) => {
        let lat = mapMouseEvent.latLng.lat()
        let lng = mapMouseEvent.latLng.lng()
        let position = {
            lat,
            lng
        }
        goTo(position)
    })
}

function goTo(position) {
    var placeName = prompt('Location name?')
    var currPlace = {
        id: utilService.makeId(),
        name: placeName,
        lat: position.lat,
        lng: position.lng,
        createdAt: Date.now()
    }
    locService.pushLocation(currPlace)
    addMarker(position)

}
function goToSearch(name, lat, lng) {
    var currPlace = {
        id: utilService.makeId(),
        name: name,
        lat: lat,
        lng: lng,
        createdAt: Date.now()
    }
    locService.pushLocation(currPlace)
    var position = {
        lat: lat,
        lng: lng,
    }
    addMarker(position)

}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}



function _connectGoogleApi() {
    if (window.google) return Promise.resolve()

    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);
    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function searchCord(value) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=AIzaSyC4CCroXerY3okRnhMxHHcufHQAiIRSzZs`)
        .then(res => res.data)
        .then((loc) => (loc.results[0].geometry.location))


}

