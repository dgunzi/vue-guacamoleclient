import preferenceService from '../settings/PreferenceService'
/**
 * 用于生成新的guacClient属性对象的服务。
 */

let ClientProperties = function ClientProperties(template) {
    // Use empty object by default
    template = template || {};

    /**
     * Whether the display should be scaled automatically to fit within the
     * available space.
     *
     * @type Boolean
     */
    this.autoFit = template.autoFit || true;

    /**
     * The current scale. If autoFit is true, the effect of setting this
     * value is undefined.
     *
     * @type Number
     */
    this.scale = template.scale || 1;

    /**
     * The minimum scale value.
     *
     * @type Number
     */
    this.minScale = template.minScale || 1;

    /**
     * The maximum scale value.
     *
     * @type Number
     */
    this.maxScale = template.maxScale || 3;

    /**
     * Whether or not the client should listen to keyboard events.
     *
     * @type Boolean
     */
    this.keyboardEnabled = template.keyboardEnabled || true;

    /**
     * Whether translation of touch to mouse events should emulate an
     * absolute pointer device, or a relative pointer device.
     *
     * @type Boolean
     */
    this.emulateAbsoluteMouse = template.emulateAbsoluteMouse || preferenceService.preferences.emulateAbsoluteMouse;

    /**
     * The relative Y coordinate of the scroll offset of the display within
     * the client element.
     *
     * @type Number
     */
    this.scrollTop = template.scrollTop || 0;

    /**
     * The relative X coordinate of the scroll offset of the display within
     * the client element.
     *
     * @type Number
     */
    this.scrollLeft = template.scrollLeft || 0;
};

export default ClientProperties;
