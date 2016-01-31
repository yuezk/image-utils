'use strict';

module.exports = function dataURIToBlob(dataURI) {
    if (!window.Blob) {
        throw new Error('Your browser doesn\'t support Blob');
    }

    var type = dataURI.match(/data:([^;]+)/)[1];
    var base64 = dataURI.replace(/^[^,]+,/, '');
    var byteString = atob(base64);
    var ia = new Uint8Array(byteString.length);

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: type });
};