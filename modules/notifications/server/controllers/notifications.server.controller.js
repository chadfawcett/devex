'use strict';
/*

Notes about notifications

*/

/**
 * Module dependencies.
 */
var path         = require('path'),
	mongoose     = require('mongoose'),
	Notification = mongoose.model('Notification'),
	Subscription = mongoose.model('Subscription'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	helpers      = require(path.resolve('./modules/core/server/controllers/core.server.helpers')),
	notifier     = require(path.resolve('./modules/core/server/controllers/core.server.notifier.js')).notifier,
	fs           = require('fs'),
	markdown     = require('helper-markdown'),
	Handlebars   = require('handlebars'),
	htmlToText   = require('html-to-text'),
	_            = require('lodash');

Handlebars.registerHelper('markdown', markdown({ breaks: true, xhtmlOut: false}));



// -------------------------------------------------------------------------
//
// compile subject and body in the object and put the results into
// subjectTemplate and bodyTemplate
//
// -------------------------------------------------------------------------
var compileTemplates = function (obj) {
	obj.bodyTemplate    = Handlebars.compile(obj.body);
	obj.subjectTemplate = Handlebars.compile(obj.subject);
};


// -------------------------------------------------------------------------
//
// notification
//
// -------------------------------------------------------------------------
var getNotificationByID = function (id) {
	return new Promise (function (resolve, reject) {
		if (id.substr (0, 3) === 'not' ) {
			Notification.findOne({code:id}).exec(function (err, notification) {
				if (err) {
					reject (err);
				}
				else if (!notification) {
					reject ({empty:true, message: 'No notification with that identifier has been found'});
				}
				else {
					resolve (notification)
				}
			});
		} else {
			if (!mongoose.Types.ObjectId.isValid (id)) {
				reject ({message: 'Notification is invalid'});
			}
			else {
				Notification.findById(id).exec(function (err, notification) {
					if (err) {
						reject (err);
					}
					else if (!notification) {
						reject ({empty:true, message: 'No notification with that identifier has been found'});
					}
					else {
						resolve (notification);
					}
				});
			}
		}
	});
};
var resolveNotification = function (notification) {
	if (typeof (notification) === 'object' && notification.id) {
		return Promise.resolve (notification);
	} else {
		return getNotificationByID (notification);
	}
};
// -------------------------------------------------------------------------
//
// subscription
//
// -------------------------------------------------------------------------
var getSubscriptionByID = function (id) {
	return new Promise (function (resolve, reject) {
		if (!mongoose.Types.ObjectId.isValid (id)) {
			reject ({message: 'Subscription is invalid'});
		}
		else {
			Subscription.findById(id).populate('notification').exec(function (err, subscription) {
				if (err) {
					reject (err);
				}
				else if (!subscription) {
					reject ({empty:true, message: 'No subscription with that identifier has been found'});
				}
				else {
					resolve (subscription);
				}
			});
		}
	});
};
var getSubscriptionByExternalID = function (id) {
	return new Promise (function (resolve, reject) {
		Subscription.findOne({subscriptionId:id}).populate('notification').exec(function (err, subscription) {
			if (err) {
				reject (err);
			}
			else if (!subscription) {
				reject ({empty:true, message: 'No subscription with that identifier has been found'});
			}
			else {
				resolve (subscription);
			}
		});
	});
};
var resolveSubscription = function (subscription) {
	if (typeof (subscription) === 'object' && subscription._id) {
		return Promise.resolve (subscription);
	} else {
		return getNotificationByID (subscription);
	}
};

// -------------------------------------------------------------------------
//
// all notification functions return a promise
// these can be passed an Id (our internal ids) or a mongoose document, it should
// figure it out for itself
//
// -------------------------------------------------------------------------
exports.subscribe = function (notificationidOrObject, email) {
	return resolveNotification (notificationidOrObject)
	.then (function (notification) {
		return notifier (notification.code, 'email').subscribe (email);
	});
};
exports.subscribeUpdate = function (subscriptionIdOrObject, email) {
	return resolveSubscription (subscriptionIdOrObject)
	.then (function (subscription) {
		return notifier (subscription.notificationCode, 'email').subscribeUpdate (subscription.subscriptionId, email);
	});
};
exports.unsubscribe = function (subscriptionIdOrObject) {
	return resolveSubscription (subscriptionIdOrObject)
	.then (function (subscription) {
		return notifier (subscription.notificationCode, 'email').unsubscribe (subscription.subscriptionId);
	});
};
exports.notify = function (notificationidOrObject, message) {
	return resolveNotification (notificationidOrObject)
	.then (function (notification) {
		return notifier (notification.code, 'email').notify (message);
	});
};
exports.notifyObject = function (notificationidOrObject, data) {
	return resolveNotification (notificationidOrObject)
	.then (function (notification) {
		var body = notification.bodyTemplate ({data: data});
		return exports.notify ({
			subject  : notification.subjectTemplate ({data: data}),
			textBody : htmlToText.fromString (body, { wordwrap: 130 }),
			htmlBody : body
		});
	});
};

// -------------------------------------------------------------------------
//
// get a list of all my notification subscriptions
//
// -------------------------------------------------------------------------
exports.myList = function (req, res) {
	Subscription.find ({
		user: req.user._id
	})
	.populate ('notification')
	.sort ('notification.name')
	.exec (function (err, subscriptions) {
		if (err) {
			return res.status(422).send ({
				message: errorHandler.getErrorMessage (err)
			});
		} else {
			res.json (subscriptions);
		}
	});
};
// -------------------------------------------------------------------------
//
// delete (unsubscribe) from a notification, but do not display an html page
// this is used in context of the application, not as an endpoint
//
// -------------------------------------------------------------------------
exports.myDelete = function (req, res) {
	//
	// if the subscription is actually for this user delete it, or if the user
	// is the admin
	//
	if (!!~req.user.roles.indexOf ('admin') || req.subscription.user === req.user._id) {
		exports.unsubscribe (req.subscription)
		.then (function (result) {
			req.subscription.remove (function (err) {
				if (err) {
					return res.status(422).send ({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.json (req.subscription);
				}
			});
		})
		.catch (function (err) {
			res.status(422).send (err);
		})
	} else {
		return res.status(422).send ({
			message: 'This is not your subscription, I cannot delete it'
		});
	}
};

// -------------------------------------------------------------------------
//
// unsubscribe from a notification, return an html message indicating such
//
// -------------------------------------------------------------------------
exports.unsubscribeExternal = function (req, res) {
	var message = '<h4>You have been successfully removed from the mailing list for '+req.subscription.notification.name+'</h4>';
	message += '<p>To view and manage other subscriptions from the BC Developer\'s Exchange, please go to:';
	message += '<a href=\'https://bcdevexchange.org/settings/notifications\'>My Notifications</a></p>';
	message += '<p>Thanks for using the Developer\'s Exchange!</p>';
	exports.unsubscribe (req.subscription)
	.then (function (result) {
		req.subscription.remove (function (err) {
			if (err) {
				return res.status(422).send ({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.send (message);
			}
		});
	})
	.catch (function (err) {
		res.status(422).send (err);
	});
};

/**
 * Create / Save a Notification
 */
// -------------------------------------------------------------------------
//
// create a new notification.
//
// -------------------------------------------------------------------------
var addNotificationCode = function (notification) {
	return new Promise (function (resolve, reject) {
		Notification.findUniqueCode (notification.name, null, function (newcode) {
			notification.code = newcode;
			resolve (notification);
		});
	});
};
exports.saveNotification = function (notification) {
	return new Promise (function (resolve, reject) {
		//
		// compile the markdown into handlebar templates and make a new notification
		//
		compileTemplates (notification);
		notification.save (function (err) {
			if (err) {
				reject (err);
			} else {
				resolve (notification);
			}
		});
	});
};
exports.createNotification = function (model) {
	return addNotificationCode (new Notification(model)).then (exports.saveNotification);
};
exports.create = function (req, res) {
	exports.createNotification (req.body)
	.then (function (notification) {
		res.json(notification);
	})
	.catch (function (err) {
		res.status(422).send ({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

// -------------------------------------------------------------------------
//
// this just takes the already queried object and pass it back
//
// -------------------------------------------------------------------------
exports.read = function (req, res) {
	res.json (req.notification);
};
exports.readSubscription = function (req, res) {
	res.json (req.subscription);
};

// -------------------------------------------------------------------------
//
// update the document,
//
// -------------------------------------------------------------------------
exports.update = function (req, res) {
	var notification = _.assign (req.notification, req.body);
	exports.saveNotification (notification)
	.then (function (notification) {
		res.json(notification);
	})
	.catch (function (err) {
		res.status(422).send ({
			message: errorHandler.getErrorMessage(err)
		});
	});
};

// -------------------------------------------------------------------------
//
// delete the notification
// TBD: We really should also unsubscribe all related subscriptions
//
// -------------------------------------------------------------------------
exports.delete = function (req, res) {
		var notification = req.notification;
		notification.remove(function (err) {
			if (err) {
				return res.status(422).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.json(notification);
			}
		});
};

// -------------------------------------------------------------------------
//
// return a list of all notifications
//
// -------------------------------------------------------------------------
exports.list = function (req, res) {
	// var me = helpers.myStuff ((req.user && req.user.roles)? req.user.roles : null );
	// var search = me.isAdmin ? {} : {$or: [{isPublished:true}, {code: {$in: me.notifications.admin}}]}
	Notification.find({}).sort('name')
	.exec(function (err, notifications) {
		if (err) {
			return res.status(422).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json (notifications);
		}
	});
};



// -------------------------------------------------------------------------
//
// new empty notification
//
// -------------------------------------------------------------------------
exports.new = function (req, res) {
	// console.log ('get a new notification set up and return it');
	var p = new Notification ();
	res.json(p);
};


// -------------------------------------------------------------------------
//
// magic that populates the notification on the request
//
// -------------------------------------------------------------------------
exports.notificationByID = function (req, res, next, id) {
	getNotificationByID (id)
	.then (function (notification) {
		req.notification = notification;
		next();
	})
	.catch (function (err) {
		if (err.empty) {
			return res.status(404).send (err);
		} else {
			return next (err);
		}
	});
	// if (id.substr (0, 3) === 'not' ) {
	// 	Notification.findOne({code:id})
	// 	.exec(function (err, notification) {
	// 		if (err) {
	// 			return next(err);
	// 		} else if (!notification) {
	// 			return res.status(404).send({
	// 				message: 'No notification with that identifier has been found'
	// 			});
	// 		}
	// 		req.notification = notification;
	// 		next();
	// 	});

	// } else {
	// 	if (!mongoose.Types.ObjectId.isValid(id)) {
	// 		return res.status(400).send({
	// 			message: 'Notification is invalid'
	// 		});
	// 	}
	// 	Notification.findById(id)
	// 	.exec(function (err, notification) {
	// 		if (err) {
	// 			return next(err);
	// 		} else if (!notification) {
	// 			return res.status(404).send({
	// 				message: 'No notification with that identifier has been found'
	// 			});
	// 		}
	// 		req.notification = notification;
	// 		next();
	// 	});
	// }
};
// -------------------------------------------------------------------------
//
// magic that populates the subscription on the request
//
// -------------------------------------------------------------------------
exports.subscriptionById = function (req, res, next, id) {
	getSubscriptionByID (id)
	.then (function (subscription) {
		req.subscription = subscription;
		next();
	})
	.catch (function (err) {
		if (err.empty) {
			return res.status(404).send (err);
		} else {
			return next (err);
		}
	});
	// if (!mongoose.Types.ObjectId.isValid(id)) {
	// 	return res.status(400).send({
	// 		message: 'Subscription is invalid'
	// 	});
	// }
	// Subscription.findById(id)
	// .exec(function (err, subscription) {
	// 	if (err) {
	// 		return next(err);
	// 	} else if (!subscription) {
	// 		return res.status(404).send({
	// 			message: 'No Subscription with that identifier has been found'
	// 		});
	// 	}
	// 	req.subscription = subscription;
	// 	next();
	// });
};
exports.externalSubscriptionById = function (req, res, next, id) {
	getSubscriptionByExternalID (id)
	.then (function (subscription) {
		req.subscription = subscription;
		next();
	})
	.catch (function (err) {
		if (err.empty) {
			return res.status(404).send (err);
		} else {
			return next (err);
		}
	});
};

