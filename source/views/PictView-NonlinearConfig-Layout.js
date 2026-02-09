const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier: "NonlinearConfig-Layout",

	DefaultRenderable: "NonlinearConfig-Layout-Shell",
	DefaultDestinationAddress: "#NonlinearConfig-Application-Container",

	AutoRender: false,

	CSS: /*css*/`
		#NonlinearConfig-Application-Container {
			display: flex;
			flex-direction: column;
			min-height: 100vh;
		}
		#NonlinearConfig-TopBar-Container {
			flex-shrink: 0;
		}
		#NonlinearConfig-Content-Container {
			flex: 1;
		}
		#NonlinearConfig-BottomBar-Container {
			flex-shrink: 0;
		}
	`,

	Templates:
	[
		{
			Hash: "NonlinearConfig-Layout-Shell-Template",
			Template: /*html*/`
<div id="NonlinearConfig-TopBar-Container"></div>
<div id="NonlinearConfig-Content-Container"></div>
<div id="NonlinearConfig-BottomBar-Container"></div>
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: "NonlinearConfig-Layout-Shell",
			TemplateHash: "NonlinearConfig-Layout-Shell-Template",
			DestinationAddress: "#NonlinearConfig-Application-Container",
			RenderMethod: "replace"
		}
	]
};

class NonlinearConfigLayoutView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent)
	{
		// After the layout shell is rendered, render the child views into their containers
		this.pict.views['NonlinearConfig-TopBar'].render();
		this.pict.views['NonlinearConfig-BottomBar'].render();

		// Render initial content -- the main workspace by default
		this.pict.views['NonlinearConfig-MainWorkspace'].render();

		// Inject all view CSS into the PICT-CSS style element
		this.pict.CSSMap.injectCSS();

		// Now resolve the router so it picks up the current hash URL
		if (this.pict.providers.PictRouter)
		{
			this.pict.providers.PictRouter.resolve();
		}

		return super.onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent);
	}
}

module.exports = NonlinearConfigLayoutView;

module.exports.default_configuration = _ViewConfiguration;
