import { locService } from './loc.service.js'
import { utilService } from './util.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    goToSearch,
    searchCord,
    showMarkers,
    deleteMarkers,
    gMap
}

window.searchCord = searchCord;
window.goToSearch = goToSearch;

const API_KEY = 'AIzaSyAycOKOPfK6ERzlwmWSkUnoBhNqR8Z9UCE'; //TODO: Enter your API Key
var gMap;
var gMarkers = []


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
        createdAt: new Date()
    }
    locService.pushLocation(currPlace)
    addMarker(position, placeName)

}
function goToSearch(name, lat, lng) {
    var currPlace = {
        id: utilService.makeId(),
        name: name,
        lat: lat,
        lng: lng,
        createdAt: new Date()
    }
    locService.pushLocation(currPlace)
    var position = {
        lat: lat,
        lng: lng,
    }
    addMarker(position, name)

}

function addMarker(loc, name = "place") {
    const image = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: name,
        icon: image

    });
    gMarkers.push(marker)
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function showMarkers(locs) {
    locs.forEach(({ lat, lng, name }) => {
        addMarker({ lat, lng }, name)
    })
}

function deleteMarkers() {
    gMarkers.forEach(marker => marker.setMap(null))
    gMarkers = []
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
        .then(({ data }) => data.results[0].geometry.location)
}

