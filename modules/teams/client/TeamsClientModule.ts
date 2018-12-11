'use strict';

(app => {
	app.registerModule('teams', ['core']);
	app.registerModule('teams.services');
	app.registerModule('teams.routes', ['ui.router', 'core.routes', 'projects.services']);
})(ApplicationConfiguration);
