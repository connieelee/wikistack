'use strict';

var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack');

// disable sequelize logger
var db = new Sequelize('postgres://localhost:5432/wikistack', {
    logging: false
});

var Page = db.define('page', {
	title: {
		type: Sequelize.STRING,
		allowNull: false
	},
	urlTitle: {
		type: Sequelize.STRING,
		allowNull: false
	},
	content: {
		type: Sequelize.TEXT,
		allowNull: false
	},
	status: {
		type: Sequelize.ENUM('open', 'closed')
	}, 
	tags: {
		type: Sequelize.ARRAY(Sequelize.TEXT),
		set: function(str) {
			this.setDataValue('tags', str.split(', '));
		}
	}/*,
	date: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	}*/
}, {
	getterMethods: {
		route: function() {
			var urlTitle = this.getDataValue('urlTitle');
			return '/wiki/' + urlTitle;
		}
	},
	hooks: {
		beforeValidate: function(page, options) {
			if (page.title) {
				page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W+/g, '');
			} else {
				page.urlTitle = Math.random().toString(36).substring(2, 7);
			}
		}
	}
});

var User = db.define('user', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		isEmail: true,
		allowNull: false
	}
});

Page.belongsTo(User, {as: 'author'});

module.exports = {
	Page: Page,
	User: User
};
