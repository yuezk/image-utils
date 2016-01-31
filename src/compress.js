const readFile = require('./readFile');
const dataURIToBlob = require('./dataURIToBlob');

function compressImage(image, options) {
    const { quality, format, blob } = options;
    const canvas = document.createElement('canvas');
    let ctx;
    let dataURI;
    let mimeType;

    if ('png' === format) {
        mimeType = 'image/png';
    } else {
        mimeType = 'image/jpeg';
    }


    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    dataURI = canvas.toDataURL(mimeType, quality);

    if (!blob) {
        return dataURI;
    }

    return dataURIToBlob(dataURI);
}

function isImage(obj) {
    return obj && obj.nodeName && obj.nodeName.toLowerCase() === 'img';
}

function getTypeFromFile(file) {
    if (file.type) {
        // image/png
        return file.type.split('/')[1];
    }

    return null;
}

module.exports = function compress(rawImage, options, callback) {
    const defaultOptions = {
        quality: 0.8,
        format: 'jpeg',
        blob: false
    };

    let opts;
    let image = rawImage;
    let compressed;

    if (typeof callback !== 'function') {
        throw new Error('`callback` is required.');
    }

    if (typeof options === 'number') {
        opts = { ...defaultOptions, quality: options };
    } else {
        opts = { ...defaultOptions, ...options };
    }

    if (isImage(image)) {
        compressed = compressImage(image, opts);
        return callback(null, compressed);
    }

    if (!isImage(image)) {
        // Auto detect image format
        opts.format = options.format || getTypeFromFile(image) || opts.format;

        readFile(image, (err, dataURI) => {
            if (err) {
                return callback(err);
            }

            const img = new Image();
            img.onload = () => callback(null, compressImage(img, opts));
            img.src = dataURI;
        });
    }
};
