'use strict';

var router = require('express').Router(),
	_ = require('lodash');

var HttpError = require('../../utils/HttpError');
var User = require('./user.model');

var isAdmin = function (req, res, next) {
	console.log('the req passport user!!!!!!!!!!!!',req.requestedUser._id)
	console.log('the req id!!!!!!!!!!!!',req.user._id)
	// console.log('the req user!!!!!!!!!!!!',req.user._id)
    if ((req.isAuthenticated() && req.user.isAdmin)||req.body._id == req.user._id) {
        next();
    } else {
        res.status(401).end();
    }
};

var deleteSelf = function (req, res, next) {
    if ((req.isAuthenticated() && req.user.isAdmin)||req.requestedUser._id == req.user._id) {
        next();
    } else {
        res.status(401).end();
    }
};


router.param('id', function (req, res, next, id) {
	User.findById(id).exec()
	.then(function (user) {
		if (!user) throw HttpError(404);
		req.requestedUser = user;
		next();
	})
	.then(null, next);
});

router.get('/', function (req, res, next) {
	User.find({}).exec()
	.then(function (users) {
		res.json(users);
	})
	.then(null, next);
});

router.post('/',isAdmin, function (req, res, next) {
	User.create(req.body)
	.then(function (user) {
		res.status(201).json(user);
	})
	.then(null, next);
});

router.get('/:id', function (req, res, next) {
	req.requestedUser.getStories()
	.then(function (stories) {
		var obj = req.requestedUser.toObject();
		obj.stories = stories;
		res.json(obj);
	})
	.then(null, next);
});

router.put('/:id',isAdmin, function (req, res, next) {
	_.extend(req.requestedUser, req.body);
	req.requestedUser.save()
	.then(function (user) {
		res.json(user);
	})
	.then(null, next);
});

router.delete('/:id',deleteSelf, function (req, res, next) {
	req.requestedUser.remove()
	.then(function () {
		res.status(204).end();
	})
	.then(null, next);
});

module.exports = router;