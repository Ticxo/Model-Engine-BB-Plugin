import { isMegFormat } from './modelFormat';

export const MEG_SETTINGS_DEFAULT = Object.freeze({
	namespace: 'modelengine',
});
//TODO Persist this
export const megSettings = Object.assign({}, MEG_SETTINGS_DEFAULT);

let settingsAction;
export const getSettingsAction = () => settingsAction;

export function generateSettingsAction() {
	settingsAction = new Action('meg_settings', {
		name: 'Model Engine Settings...',
		description: 'Configure Model Engine.',
		icon: 'settings_applications',
		condition: () => false, // Disable for now
		// condition: isMegFormat,
		click: () => {
			const dialog = new Dialog({
				id: 'meg_settings_dialog',
				title: 'Model Engine Settings',
				width: 540,
				lines: [`<b class="tl"><a href="https://github.com/Ticxo/Model-Engine-Wiki">Model Engine</a> Settings</b>`],
				form: {
					// animFileNamespace: {label: 'Namespace', value: megSettings.namespace },
				},
				onConfirm: (formResult) => {
					Object.assign(megSettings, formResult);
					dialog.hide()
				}
			})
			dialog.show()
		}
	});
	MenuBar.addAction(settingsAction, 'file.1')
}