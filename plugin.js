(function() {
	Plugin.register('meg', {
		title: 'ModelEngine',
		author: 'Pande, Ticxo',
		icon: 'icon',
		description: 'A ModelEngine addon for Blockbench',
		version: '0.1.0',
		variant: 'both',
		onload() {
			Codecs.project.on('compile', compileCallback);
			Codecs.project.on('parse', parseCallback);
			Blockbench.showQuickMessage("MEG Loaded!", 2000);
			generateBoneOption()
			generateErrorListAction();
			// seeErrorsMenu()
		},

		onunload() {this.onuninstall();}, onuninstall() {
			Codecs.project.events.compile.remove(compileCallback);
			editAction.delete();
		}
	})
})();