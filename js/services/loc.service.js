export const locService = {
    getLocs,
    pushLocation
}

import { storageService } from './storage-service.js'

const Location_Key = 'locationDB'
const locs = storageService.loadFromStorage(Location_Key) || []


function pushLocation(location) {
    locs.push(location)
    storageService.saveToStorage(Location_Key, locs)

}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}


