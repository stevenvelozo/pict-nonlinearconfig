const libPictApplication = require('pict-application');
const libPictRouter = require('pict-router');

// Views
const libViewLayout = require('./views/PictView-NonlinearConfig-Layout.js');
const libViewTopBar = require('./views/PictView-NonlinearConfig-TopBar.js');
const libViewBottomBar = require('./views/PictView-NonlinearConfig-BottomBar.js');
const libViewMainWorkspace = require('./views/PictView-NonlinearConfig-MainWorkspace.js');
const libViewLogin = require('./views/PictView-NonlinearConfig-Login.js');
const libViewAbout = require('./views/PictView-NonlinearConfig-About.js');
const libViewDocumentation = require('./views/PictView-NonlinearConfig-Documentation.js');

class NonlinearConfigApplication extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		// Add the router provider with routes
		this.pict.addProvider('PictRouter', require('./providers/PictRouter-NonlinearConfig-Configuration.json'), libPictRouter);

		// Add the layout view (the shell that contains top bar, workspace, bottom bar)
		this.pict.addView('NonlinearConfig-Layout', libViewLayout.default_configuration, libViewLayout);

		// Add the top bar and bottom bar views
		this.pict.addView('NonlinearConfig-TopBar', libViewTopBar.default_configuration, libViewTopBar);
		this.pict.addView('NonlinearConfig-BottomBar', libViewBottomBar.default_configuration, libViewBottomBar);

		// Add the main content workspace view
		this.pict.addView('NonlinearConfig-MainWorkspace', libViewMainWorkspace.default_configuration, libViewMainWorkspace);

		// Add the login view
		this.pict.addView('NonlinearConfig-Login', libViewLogin.default_configuration, libViewLogin);

		// Add the about page view
		this.pict.addView('NonlinearConfig-About', libViewAbout.default_configuration, libViewAbout);

		// Add the documentation page view
		this.pict.addView('NonlinearConfig-Documentation', libViewDocumentation.default_configuration, libViewDocumentation);
	}

	onAfterInitializeAsync(fCallback)
	{
		// Initialize application state
		this.pict.AppData.NonlinearConfig =
		{
			User:
			{
				LoggedIn: false,
				UserName: '',
				DisplayName: ''
			},
			CurrentRoute: 'home'
		};

		// Render the layout shell first, then the initial content
		this.pict.views['NonlinearConfig-Layout'].render();

		return super.onAfterInitializeAsync(fCallback);
	}

	/**
	 * Navigate to a route using the pict-router.
	 *
	 * @param {string} pRoute - The route path to navigate to (e.g. '/About')
	 */
	navigateTo(pRoute)
	{
		this.pict.providers.PictRouter.navigate(pRoute);
	}

	/**
	 * Render a specific content view into the main workspace area.
	 * This is called by the router when a route is matched.
	 *
	 * @param {string} pViewIdentifier - The view identifier to render
	 */
	showView(pViewIdentifier)
	{
		if (pViewIdentifier in this.pict.views)
		{
			this.pict.AppData.NonlinearConfig.CurrentRoute = pViewIdentifier;
			this.pict.views[pViewIdentifier].render();
		}
		else
		{
			this.pict.log.warn(`View [${pViewIdentifier}] not found; falling back to main workspace.`);
			this.pict.views['NonlinearConfig-MainWorkspace'].render();
		}
	}

	/**
	 * Handle user login attempt.
	 *
	 * @param {string} pUserName - The username
	 * @param {string} pPassword - The password
	 */
	attemptLogin(pUserName, pPassword)
	{
		this.pict.log.info(`Login attempt for user [${pUserName}]`);

		// TODO: Implement real authentication; for now accept any non-empty credentials
		if (pUserName && pPassword)
		{
			this.pict.AppData.NonlinearConfig.User.LoggedIn = true;
			this.pict.AppData.NonlinearConfig.User.UserName = pUserName;
			this.pict.AppData.NonlinearConfig.User.DisplayName = pUserName;

			// Re-render the top bar to show logged-in state, then navigate to home
			this.pict.views['NonlinearConfig-TopBar'].render();
			this.navigateTo('/Home');
		}
		else
		{
			this.pict.log.warn('Login failed: username and password are required.');
		}
	}

	/**
	 * Handle user logout.
	 */
	logout()
	{
		this.pict.AppData.NonlinearConfig.User.LoggedIn = false;
		this.pict.AppData.NonlinearConfig.User.UserName = '';
		this.pict.AppData.NonlinearConfig.User.DisplayName = '';

		// Re-render the top bar and navigate to login
		this.pict.views['NonlinearConfig-TopBar'].render();
		this.navigateTo('/Login');
	}
}

module.exports = NonlinearConfigApplication;

module.exports.default_configuration = require('./Pict-Application-NonlinearConfig-Configuration.json');
