'use strict';

import acl from 'acl';

class TeamsPolicy {
	public static getInstance() {
		return this.instance || (this.instance = new this());
	}

	private static instance: TeamsPolicy;

	private aclMem = new acl(new acl.memoryBackend());

	private constructor() {}

	public invokeRolesPolicies = () => {
		this.aclMem.allow([
			{
				roles: ['guest'],
				allows: [
					{
						resources: '/api/teams',
						permissions: 'get'
					}
				]
			},
			{
				roles: ['user'],
				allows: [
					{
						resources: '/api/teams',
						permissions: 'get'
					},
					{
						resources: '/api/teams/:teamId',
						permissions: 'get'
					}
				]
			},
			{
				roles: ['gov'],
				allows: [
					{
						resources: '/api/teams',
						permissions: 'post'
					},
					{
						resources: '/api/teams/:teamId',
						permissions: 'put, delete'
					}
				]
			}
		])
	}

	public isAllowed = (req, res, next) => {
		const roles = req.user ? req.user.roles : ['guest'];

		// If an Project is being processed and the current user created it then allow any manipulation
		if (req.project && req.user && req.project.user && req.project.user.id === req.user.id) {
			return next();
		}

		// Check for user roles
		this.aclMem.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), (err, isAllowed) => {
			if (err) {
				// An authorization error occurred
				return res.status(500).send('Unexpected authorization error');
			} else {
				if (isAllowed) {
					// Access granted! Invoke next middleware
					return next();
				} else {
					return res.status(403).json({
						message: 'User is not authorized'
					});
				}
			}
		});
	};
}

export default TeamsPolicy.getInstance();
