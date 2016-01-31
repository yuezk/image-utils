module.exports = function dataURIToBlob(dataURI) {
    if (!window.Blob) {
        throw new Error('Your browser doesn\'t support Blob');
    }

    const type = dataURI.match(/data:([^;]+)/)[1];
    const base64 = dataURI.replace(/^[^,]+,/, '');
    const byteString = atob(base64);
    const ia = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: type });
};
