/**
 * 提供用于在guacClipboard指令、clipboardService服务等之间交换的ClipboardData类。
 * @param template
 * @constructor
 */
let ClipboardData = function ClipboardData(template) {
    // Use empty object by default
    template = template || {};

    /**
     * The mimetype of the data currently stored within the clipboard.
     *
     * @type String
     */
    this.type = template.type || 'text/plain';

    /**
     * The data currently stored within the clipboard. Depending on the
     * nature of the stored data, this may be either a String, a Blob, or a
     * File.
     *
     * @type String|Blob|File
     */
    this.data = template.data || '';
};

export default ClipboardData;