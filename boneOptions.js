var modelEngineOptions = {};

var compileCallback = (e) => {
	e.model.meg = modelEngineOptions;
};

var parseCallback = (e) => {
	Object.assign(modelEngineOptions, e.model.meg);
};

function generateBoneOption() {
	editAction = new Action('meg_bone_options', {
		name: 'Bone Options',
		icon: 'icon-format_java',
		category: 'edit',
		//keybind: new Keybind({key: 113}), // Do we want to have a keybind?
		click: function () {
			setBoneTypeMenu().show();
		}
	})
	Group.prototype.menu.structure.push('_');
	Group.prototype.menu.addAction(editAction)
}

function setBoneTypeMenu(){

	var op = modelEngineOptions[Group.selected.uuid];
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
	function getExtra() {
		if(op)
			return op.extra;
		return '';
	}

	var boneTypeDialog = new Dialog({
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
				op.extra = formData.extraOptions;
			}else {
				modelEngineOptions[Group.selected.uuid] = {
					is_head: formData.isHead,
					is_mount: formData.isMount,
					hand: formData.isHand,
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