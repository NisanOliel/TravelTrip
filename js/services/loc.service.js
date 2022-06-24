export const locService = {
    getLocs,
    pushLocation,
    removeLoc
}

import { storageService } from './storage-service.js'
window.removeLoc = removeLoc;


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
        }, 500)
    });

}

function removeLoc(idx) {
    locs.splice(idx, 1)
    storageService.saveToStorage(Location_Key, locs)


}

