(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ImageUtils"] = factory();
	else
		root["ImageUtils"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// re-exports the API
	exports.readFile = __webpack_require__(1);
	exports.dataURIToBlob = __webpack_require__(2);
	exports.compress = __webpack_require__(3);

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

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
	        var err = new Error('Your browser doesn\'t support `FileReader`.');
	        return callback(err);
	    }

	    var reader = new FileReader();

	    reader.onload = function onLoad() {
	        var dataURL = this.result;
	        callback(null, dataURL);
	    };
	    reader.onerror = function onError() {
	        var err = this.error;
	        var msg = undefined;

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

/***/ },
/* 2 */
/***/ function(module, exports) {

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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var readFile = __webpack_require__(1);
	var dataURIToBlob = __webpack_require__(2);

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

/***/ }
/******/ ])
});
;