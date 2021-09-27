import './globalVariables';
import { getBoneOptionAction, generateBoneAction } from './boneOptions';
import { getErrorListAction, displayErrorList, generateErrorAction } from './errorScanner';
import { getSelectVariant, generateVariantActions } from './variantSelector';
import { isMegFormat, loadFormat, unloadFormat } from './modelFormat';
import { getSettingsAction, generateSettingsAction } from './settings';
import { deleteEditTextureAction, generateEditTextureAction } from './textureOptions';

(function() {

	const button = $(`<div><button id="meg_error_check" onclick="displayErrorList()" style="width: 100%">Error</button></div>`)

	const onSelectMode = (e)=> {
		if(isMegFormat() && e.mode.id == 'edit') {
			$('#left_bar').append(button)
		} else {
			button.detach();
		}
	}
	
	const onLoadProject = (e) => {
		if(isMegFormat()) {
			$('#left_bar').append(button)
		} else {
			button.detach();
		}
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
			Blockbench.on('select_mode', onSelectMode);
			Blockbench.on('load_project', onLoadProject);
			loadFormat();

			// Menus
			generateBoneAction();
			generateErrorAction();
			generateVariantActions();
			generateSettingsAction();
			generateEditTextureAction();
			
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

			Blockbench.removeListener('select_mode', onSelectMode);
			Blockbench.removeListener('load_project', onLoadProject);
			unloadFormat();

			getErrorListAction().delete();
			getBoneOptionAction().delete();
			getSelectVariant().delete();
			getSettingsAction().delete();
			deleteEditTextureAction();

			delete window.displayErrorList;
		}
	})
})();