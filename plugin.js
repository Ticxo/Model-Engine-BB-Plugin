function saySomething() {
	Blockbench.showToastNotification({
		text: 'Button test',
		color: 'Azure',
		expire: 2000
	})
}

(function() {

	var button = $(`<div><button onclick="displayErrorList()" style="width: 100%">Click me!</button></div>`)
	var modeSelectCallback = (e)=> {
		if(e.mode.id == 'edit')
			$('#left_bar').append(button)
		else
			button.detach();

	}

	Plugin.register('meg', {
		title: 'ModelEngine',
		author: 'Pande, Ticxo',
		icon: 'icon',
		description: 'A ModelEngine addon for Blockbench',
		version: '0.1.0',
		variant: 'both',
		onload() {
			// Events
			Blockbench.on('select_mode', modeSelectCallback);
			Codecs.project.on('compile', compileCallback);
			Codecs.project.on('parse', parseCallback);

			// Menus
			generateBoneOption()
			generateErrorListAction();

			if(Mode.selected.id == 'edit')
				$('#left_bar').append(button)

			Blockbench.showToastNotification({
				text: 'Model Engine Plugin is loaded!',
				color: 'Azure',
				expire: 2000
			})
		},

		onunload() {
			this.onuninstall()
		}, 

		onuninstall() {

			button.detach();

			Codecs.project.events.compile.remove(compileCallback);
			editAction.delete();
		}
	})
})();