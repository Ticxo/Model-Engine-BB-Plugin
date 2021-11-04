import { isMegFormat } from './modelFormat';

export var textureOptions = {};

var editTextureAction;
export function deleteEditTextureAction() {
	 editTextureAction.delete();
	 Texture.prototype.menu.structure.pop();
	 Texture.prototype.menu.structure.pop();
}

export function generateEditTextureAction() {
	editTextureAction = new Action('meg_texture_options', {
		name: 'Texture Options...',
		icon: 'fas.fa-cogs',
		category: 'edit',
		//keybind: new Keybind({key: 113}), // Do we want to have a keybind?
		condition: isMegFormat,
		click: () => {
			const dialog = new Dialog({
				id: 'meg_texture_options_dialog',
				title: 'Model Engine Texture Options',
				width: 540,
				lines: ['Texture options used by Model Engine.'],
				form: {
					namespace: {label: 'Namespace', value: getNamespace() },
				},
				onConfirm: (formResult) => {
					textureOptions[Texture.selected.uuid] = Object.assign(
						{},
						textureOptions[Texture.selected.uuid],
						formResult);
					dialog.hide()
				}
			})
			dialog.show()
		}
	});
	Texture.prototype.menu.structure.push('_');
	Texture.prototype.menu.addAction(editTextureAction);
}

function getNamespace() {
	const op = textureOptions[Texture.selected.uuid];
	if (op && op.namespace) {
		return op.namespace;
	} else {
		return Texture.selected.namespace;
	}
}