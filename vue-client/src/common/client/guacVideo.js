import Guacamole from 'guacamole-common-js'
export default new function() {
    /**
     * Array of all supported video mimetypes.
     */
    this.supported = Guacamole.VideoPlayer.getSupportedTypes();
}();