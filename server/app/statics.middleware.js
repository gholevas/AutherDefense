'use strict';

var express = require('express'),
	router = express.Router(),
	path = require('path');

var rootPath = path.join(__dirname, '..', '..');

var publicPath = path.join(rootPath, 'public');
var browserPath = path.join(rootPath, 'browser');
var npmPath = path.join(rootPath, 'node_modules');
var bowerPath = path.join(rootPath, 'bower_components');

router.use(express.static(publicPath));
router.use(express.static(browserPath));
router.use(express.static(npmPath));
router.use(express.static(bowerPath));

module.exports = router;