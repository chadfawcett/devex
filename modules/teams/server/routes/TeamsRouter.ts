'use strict'

import TeamsServerController from '../controllers/TeamsServerController';
import TeamsPolicy from '../policies/TeamsPolicy';

class TeamsRouter {
	public static getInstance() {
		return this.instance || (this.instance = new this());
	}

	private static instance: TeamsRouter;

	private constructor() {
		TeamsPolicy.invokeRolesPolicies();
	}

	public setupRoutes = app => {
		app.route('/api/teams')
			.all(TeamsPolicy.isAllowed)
			.get(TeamsServerController.list)
			.post(TeamsServerController.create);

		app.route('/api/teams/:teamId')
			.all(TeamsPolicy.isAllowed)
			.get(TeamsServerController.read)
			.put(TeamsServerController.update);
	}
}

export default TeamsRouter.getInstance();
