import { boneOptions, getBoneOptionAction, generateBoneAction } from './boneOptions';
import { getErrorListAction, displayErrorList, generateErrorAction } from './errorScanner';
import { variantBones, getSelectVariant, generateVariantActions } from './variantSelector';
import './globalVariables';

var compileCallback = (e) => {
	e.model.bone_option = boneOptions;
	e.model.variant = variantBones;
};

var parseCallback = (e) => {
	Object.assign(boneOptions, e.model.bone_option);
	Object.assign(variantBones, e.model.variant);

	for (const key in variantBones) {
		if (variantBones.hasOwnProperty(key)) {
			selectVariant.addOption(key, variantBones[key].name);
		}
	}
};

(function() {

	let button = $(`<div><button onclick="displayErrorList()" style="width: 100%">Error</button></div>`)
	let modeSelectCallback = (e)=> {
		if(e.mode.id == 'edit')
			$('#left_bar').append(button)
		else
			button.detach();

	}

	Plugin.register('meg', {
		title: 'ModelEngine',
		author: 'Pande, Ticxo',
		icon: 'settings_applications',
		description: 'A ModelEngine addon for Blockbench',
		version: '0.1.0',
		variant: 'both',
		onload() {
			// Events
			Blockbench.on('select_mode', modeSelectCallback);
			Codecs.project.on('compile', compileCallback);
			Codecs.project.on('parse', parseCallback);

			// Menus
			generateBoneAction();
			generateErrorAction();
			generateVariantActions();
			
			window.displayErrorList = displayErrorList;

			if(Mode.selected.id == 'edit')
				$('#left_bar').append(button);

			Blockbench.showToastNotification({
				text: 'Model Engine Plugin is loaded!',
				color: 'Azure',
				expire: 2000
			});
		},

		onunload() {
			this.onuninstall()
		}, 

		onuninstall() {

			button.detach();

			Codecs.project.events.compile.remove(compileCallback);
			getErrorListAction().delete();
			getBoneOptionAction().delete();
			getSelectVariant().delete();

			delete window.displayErrorList;
		}
	})
})();