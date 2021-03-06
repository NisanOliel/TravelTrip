import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { apiService } from './services/api.service.js'

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
window.copyUrlToClipboard = copyUrlToClipboard;


function onInit() {
    mapService.initMap()
        .then(() => {
            renderFilterByQueryStringParams()
        })
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            // document.querySelector('.locs').innerText = JSON.stringify(locs)
            var strHtml = locs.map((loc, idx) => {

                return `  <tr>
                <td>${loc.id}</td>
                <td>${loc.name}</td>
                <td>${loc.lat}</td>
                <td>${loc.lng}</td>
                <td>${loc.createdAt}</td>
                <td><button class="btn btn-success" onclick="goToPlace(${loc.lat},${loc.lng})">go</button></td>
                <td><button class="btn btn-danger" onclick="onRemoveLoc(${idx})">X</button></td>
            </tr>`
            })
            mapService.deleteMarkers()
            mapService.showMarkers(locs)
            document.querySelector('.tbody-location').innerHTML = strHtml.join('')
        })
}
function renderWeather(coord) {
    apiService.getWeather(coord).then(data => {
        const strHtmls = data.map((item) => `<li>${item}</li>`)

        const elWeatherList = document.querySelector('.weather-list')
        elWeatherList.innerHTML = strHtmls.join('')
    })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.userPos').classList.remove('hide')
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
    mapService.panTo(35.6895, 139.6917);

}
function goToPlace(lat, lng) {
    mapService.panTo(lat, lng)
    renderWeather({ lat, lng })

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
    mapService.searchCord(value)
        .then(({ lat, lng }) => {
            goToPlace(lat, lng)
            mapService.goToSearch(value, lat, lng)
            //TODO: Add render weather here
            renderWeather({ lat, lng })
        })
        .then(onGetLocs).then(getParams(value))

}

function getParams(value) {
    const queryStringParams = `?location=${value}`
    const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function copyUrlToClipboard() {
    const url = window.location.href
    navigator.clipboard.writeText(url)
}

function renderFilterByQueryStringParams() {
    // Retrieve data from the current query-params
    const queryStringParams = new URLSearchParams(window.location.search)

    const filterBy = {
        location: queryStringParams.get('location') || '',
    }

    if (!filterBy.location) return

    document.querySelector('[name=search]').value = filterBy.location
    mapService.searchCord(filterBy.location)
        .then(({ lat, lng }) => {
            goToPlace(lat, lng)
        })
        .then(onGetLocs).then(getParams(filterBy.location))
}