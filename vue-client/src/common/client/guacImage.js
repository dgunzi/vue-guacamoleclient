let service = {};

/**
 * Map of possibly-supported image mimetypes to corresponding test images
 * encoded with base64. If the image is correctly decoded, it will be a
 * single pixel (1x1) image.
 *
 * @type Object.<String, String>
 */
let testImages = {

    /**
     * Test JPEG image, encoded as base64.
     */
    'image/jpeg':
        '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoH' +
        'BwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQME' +
        'BAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU' +
        'FBQUFBQUFBQUFBQUFBT/wAARCAABAAEDAREAAhEBAxEB/8QAFAABAAAAAAAAAAA' +
        'AAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAA' +
        'AAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AVMH/2Q==',

    /**
     * Test PNG image, encoded as base64.
     */
    'image/png':
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX///+nxBvI' +
        'AAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==',

    /**
     * Test WebP image, encoded as base64.
     */
    'image/webp': 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=='

};

/**
 * Array of all promises associated with pending image tests. Each image
 * test promise MUST be guaranteed to resolve and MUST NOT be rejected.
 *
 * @type Promise[]
 */
let pendingTests = [];

/**
 * The array of supported image formats. This will be gradually populated
 * by the various image tests that occur in the background, and will not be
 * fully populated until all promises within pendingTests are resolved.
 *
 * @type String[]
 */
let supported = [];

/**
 * Return a promise which resolves with to an array of image mimetypes
 * supported by the browser, once those mimetypes are known. The returned
 * promise is guaranteed to resolve successfully.
 *
 * @returns {Promise.<String[]>}
 *     A promise which resolves with an array of image mimetypes supported
 *     by the browser.
 */
service.getSupportedMimetypes = function getSupportedMimetypes() {
    return new Promise((resolve, reject) => {
        // When all image tests are complete, resolve promise with list of
        // supported formats
        Promise.all(pendingTests).then(function imageTestsCompleted() {
            resolve(supported);
        });
    });
};

// Test each possibly-supported image
for (let mimetype in testImages) {
    // Add promise for current image test
    pendingTests.push(new Promise((resolve, reject) => {
        // Attempt to load image
        let image = new Image();
        image.src = 'data:' + mimetype + ';base64,' + testImages[mimetype];

        // Store as supported depending on whether load was successful
        image.onload = image.onerror = function imageTestComplete() {
            // Image format is supported if successfully decoded
            if (image.width === 1 && image.height === 1) {
                supported.push(mimetype);
            }

            // Test is complete
            resolve();
        };
    }));
}

export default service;