import Guacamole from 'guacamole-common-js'
export default new function() {
    /**
     * Array of all supported audio mimetypes.
     *
     * @type String[]
     */
    this.supported = Guacamole.AudioPlayer.getSupportedTypes();
}();