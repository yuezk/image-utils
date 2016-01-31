/**
 * Read as data uri from a file object.
 *
 * @param file
 * @returns {string}
 */
module.exports = function readFile(file, callback) {
    if (!file) {
        throw new Error('`file` is required.');
    }

    if (typeof callback !== 'function') {
        throw new Error('`callback` is required.');
    }

    if (!window.FileReader) {
        const err = new Error('Your browser doesn\'t support `FileReader`.');
        return callback(err);
    }

    const reader = new FileReader();

    reader.onload = function onLoad() {
        const dataURL = this.result;
        callback(null, dataURL);
    };
    reader.onerror = function onError() {
        const err = this.error;
        let msg;

        switch (err.code) {
        case err.NOT_FOUND_ERR:
            msg = 'File Not Found!';
            break;
        case err.NOT_READABLE_ERR:
            msg = 'File is not readable!';
            break;
        case err.ABORT_ERR:
            msg = 'File read cancelled.';
            break;
        default:
            msg = 'An error occurred reading this file.';
        }

        callback(new Error(msg));
    };

    reader.readAsDataURL(file);
};
