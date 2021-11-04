import { isMegFormat } from './modelFormat';

export var boneOptions = {};

export var boneOptionAction;
export const getBoneOptionAction = () => boneOptionAction;

export function generateBoneAction() {
	boneOptionAction = new Action('meg_bone_options', {
		name: 'Bone Options',
		icon: 'fas.fa-cogs',
		category: 'edit',
		//keybind: new Keybind({key: 113}), // Do we want to have a keybind?
		condition: isMegFormat,
		click: function () {
			setBoneTypeMenu().show();
		}
	})
	Group.prototype.menu.structure.push('_');
	Group.prototype.menu.addAction(boneOptionAction)
}

function setBoneTypeMenu(){

	let op = boneOptions[Group.selected.uuid];
	function getHead() {
		if(op)
			return op.is_head;
		return false;
	}
	function getMount() {
		if(op)
			return op.is_mount;
		return false;
	}
	function getHand() {
		if(op)
			return op.hand;
		return 'none';
	}
	function getDuplicate() {
		if(op)
			return op.duplicate;
		return '';
	}
	function getVariant() {
		if(op)
			return op.is_variant;
		return 'none';
	}
	function getExtra() {
		if(op)
			return op.extra;
		return '';
	}

	let boneTypeDialog = new Dialog({
		id: 'bone_option_dialog',
		title: 'Bone Options',
		form: {
			isHead: {
				label: 'Head',
				type: 'checkbox',
				value: getHead()
			},
			isMount: {
				label: 'Mount',
				type: 'checkbox',
				value: getMount()
			},
			isHand: {
				label: 'Hand',
				type: 'select',
				options: {
					none: 'Not Hand',
					left: 'Left',
					right: 'Right'
				},
				value: getHand()
			},
			isDuplicate: {
				label: 'Duplicate',
				type: 'input',
				placeholder: 'not duplicate',
				value: getDuplicate()
			},
			isVariant: {
				label: 'Bone Variant',
				type: 'select',
				options: {
					none: 'Default',
					texture: 'Texture',
					model: 'Model'
				},
				value: getVariant()
			},
			extraOptions: {
				label: 'Extra',
				type: 'textarea',
				placeholder: 'option1=value1\noption2=value2\n...',
				value: getExtra()
			}
		},
		onConfirm: function(formData) {
			if(op) {
				op.is_head = formData.isHead;
				op.is_mount = formData.isMount;
				op.hand = formData.isHand;
				op.duplicate = formData.isDuplicate;
				op.is_variant = formData.isVariant;
				op.extra = formData.extraOptions;
			}else {
				boneOptions[Group.selected.uuid] = {
					is_head: formData.isHead,
					is_mount: formData.isMount,
					hand: formData.isHand,
					duplicate: formData.isDuplicate,
					is_variant: formData.isVariant,
					extra: formData.extraOptions
				};
			}
			this.hide();
		},
		onCancel: function(formData) {
			this.hide();
		}
	});

	return boneTypeDialog;
}