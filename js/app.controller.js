import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.goToPlace = goToPlace;
window.onRemoveLoc = onRemoveLoc;
window.setUserLocation = setUserLocation;
window.onSearch = onSearch;
window.getParams = getParams;
window.renderFilterByQueryStringParams = renderFilterByQueryStringParams;


function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
            renderFilterByQueryStringParams()
        })
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            // document.querySelector('.locs').innerText = JSON.stringify(locs)
            var strHtml = locs.map((loc, idx) => {
                console.log('loc:', loc)

                return `  <tr>
                <td>${loc.id}</td>
                <td>${loc.name}</td>
                <td>${loc.lat}</td>
                <td>${loc.lng}</td>
                <td>${loc.createdAt}</td>
                <td><button onclick="goToPlace(${loc.lat},${loc.lng})">go</button></td>
                <td><button onclick="onRemoveLoc(${idx})">X</button></td>
            </tr>`
            })
            document.querySelector('.tbody-location').innerHTML = strHtml.join('')
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            goToPlace(pos.coords.latitude, pos.coords.longitude)
            mapService.addMarker({ lat: pos.coords.latitude, lng: pos.coords.longitude })

        })
        .catch(err => {
            console.log('err!!!', err);
        })
}
function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}
function goToPlace(lat, lng) {
    mapService.panTo(lat, lng)
}

function onRemoveLoc(idx) {
    locService.removeLoc(idx)
    onGetLocs()

}

function setUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(centerMapOnUser)
    } else {
        console.log('Geolocation is not supported by this browser.')
    }
}

function centerMapOnUser(position) {
    const center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
    }

    console.log('Centering on', center)
    mapService.panTo(center.lat, center.lng)
    mapService.addMarker({ lat: center.lat, lng: center.lng })
}

function onSearch(ev) {
    ev.preventDefault()
    var elSearch = document.querySelector('[name=search]')
    var value = elSearch.value
    searchCord(value)
        .then((res) => (goToPlace(res.lat, res.lng),
            mapService.goToSearch(value, res.lat, res.lng)))
        .then(onGetLocs).then(getParams(value))

}

function getParams(value) {
    const queryStringParams = `?location=${value}`
    const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}


function renderFilterByQueryStringParams() {
    // Retrieve data from the current query-params
    const queryStringParams = new URLSearchParams(window.location.search)

    const filterBy = {
        location: queryStringParams.get('location') || '',
    }

    if (!filterBy.location) return

    document.querySelector('[name=search]').value = filterBy.location
    searchCord(filterBy.location)
        .then((res) => (goToPlace(res.lat, res.lng),
            mapService.goToSearch(filterBy.location, res.lat, res.lng)))
        .then(onGetLocs).then(getParams(filterBy.location))
}