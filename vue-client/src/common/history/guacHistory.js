// Required types
import HistoryEntry from './HistoryEntry'

let service = {};

// The parameter name for getting the history from local storage
let GUAC_HISTORY_STORAGE_KEY = 'GUAC_HISTORY';

/**
 * The number of entries to allow before removing old entries based on the
 * cutoff.
 */
let IDEAL_LENGTH = 6;

/**
 * The top few recent connections, sorted in order of most recent access.
 *
 * @type HistoryEntry[]
 */
service.recentConnections = [];

/**
 * Updates the thumbnail and access time of the history entry for the
 * connection with the given ID.
 *
 * @param {String} id
 *     The ID of the connection whose history entry should be updated.
 *
 * @param {String} thumbnail
 *     The URL of the thumbnail image to associate with the history entry.
 */
service.updateThumbnail = function(id, thumbnail) {
    // Remove any existing entry for this connection
    for (let i = 0; i < service.recentConnections.length; i++) {
        if (service.recentConnections[i].id === id) {
            service.recentConnections.splice(i, 1);
            break;
        }
    }

    // Store new entry in history
    service.recentConnections.unshift(new HistoryEntry(
        id,
        thumbnail,
        new Date().getTime()
    ));

    // Truncate history to ideal length
    if (service.recentConnections.length > IDEAL_LENGTH) {
        service.recentConnections.length = IDEAL_LENGTH;
    }

    // Save updated history
    localStorage.setItem(GUAC_HISTORY_STORAGE_KEY, JSON.stringify(service.recentConnections));
};

// Init stored connection history from localStorage
let storedHistory = localStorage.getItem(GUAC_HISTORY_STORAGE_KEY) ? JSON.parse(localStorage.getItem(GUAC_HISTORY_STORAGE_KEY)) : [];
if (storedHistory instanceof Array) {
    service.recentConnections = storedHistory;
}

export default service;