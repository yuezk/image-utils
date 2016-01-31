'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var readFile = require('./readFile');
var dataURIToBlob = require('./dataURIToBlob');

function compressImage(image, options) {
    var quality = options.quality;
    var format = options.format;
    var blob = options.blob;

    var canvas = document.createElement('canvas');
    var ctx = undefined;
    var dataURI = undefined;
    var mimeType = undefined;

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
    var defaultOptions = {
        quality: 0.8,
        format: 'jpeg',
        blob: false
    };

    var opts = undefined;
    var image = rawImage;
    var compressed = undefined;

    if (typeof callback !== 'function') {
        throw new Error('`callback` is required.');
    }

    if (typeof options === 'number') {
        opts = _extends({}, defaultOptions, { quality: options });
    } else {
        opts = _extends({}, defaultOptions, options);
    }

    if (isImage(image)) {
        compressed = compressImage(image, opts);
        return callback(null, compressed);
    }

    if (!isImage(image)) {
        // Auto detect image format
        opts.format = options.format || getTypeFromFile(image) || opts.format;

        readFile(image, function (err, dataURI) {
            if (err) {
                return callback(err);
            }

            var img = new Image();
            img.onload = function () {
                return callback(null, compressImage(img, opts));
            };
            img.src = dataURI;
        });
    }
};