'use strict';

var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

router.get('/', function(req, res, next) {
	Page.findAll({
		attributes: ['title', 'urlTitle']
	})
	.then(function(pages) {
		res.render('index', {pages: pages});
	})
	.catch(next);
});

router.post('/', function(req, res, next) {
	User.findOrCreate({where: {name: req.body.author, email: req.body.email}})
		.then(function(user) {
			var page = Page.build({
				title: req.body.title,
				content: req.body.content,
				tags: req.body.tags,
				authorId: user[0].id
			});

			return page.save();

			/* Workshop solution suggestion:
				var user = values[0] //(where value is passed in the then function)
				var page = .... (same as above, without authorId)

				return page.save().then(function(page) {
					return page.setAuthor(user);
				});
			*/
		})
		.then(function(page) {
			res.redirect(page.route);
		})
		.catch(next);
});

router.get('/add', function(req, res, next) {
	res.render('addpage');
});

router.get('/:urlTitle', function(req, res, next) {
	Page.findOne({
		where: {urlTitle: req.params.urlTitle}
	})
	.then(function(page) {
		page.getAuthor()
		.then(function(author) {
			res.render('wikipage', {page: page, author: author});
		});
	})
	.catch(next);
});

module.exports = router;