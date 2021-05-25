(function() {
    Plugin.register('meg', {
        title: 'ModelEngine',
        author: 'Pande, Ticxo',
        icon: 'icon',
        description: 'A ModelEngine addon for Blockbench',
        version: '0.1.0',
        variant: 'both',
        onload() {
            Blockbench.showQuickMessage("MEG Loaded!", 2000);

            editAction = new Action('meg_bone_options', {
                name: 'Bone Options',
				icon: 'icon-format_java',
				category: 'edit',
				//keybind: new Keybind({key: 113}), // Do we want to have a keybind?
				click: function () {
					setBoneTypeMenu().show();
				}
			})
            Group.prototype.menu.addAction(editAction)
		},

		onunload() {
			this.onuninstall();
		},
		onuninstall() {
            // Prevent action flood when reloading the plugin, remove once pushed to the public
			editAction.delete();
		}
	})
})();


function setBoneTypeMenu(){
    
    var boneTypeDialog = new Dialog({
        id: 'bone_option_dialog',
        title: 'Bone Options',
        form: {
            isHead: {
                label: 'Head',
                type: 'checkbox'
            },
            isMount: {
                label: 'Mount',
                type: 'checkbox'
            },
            isHand: {
                label: 'Hand',
                type: 'select',
                options: {
                    none: 'Not Hand',
                    left: 'Left',
                    right: 'Right'
                }
            },
            extraOptions: {
                label: 'Extra',
                type: 'textarea',
                placeholder: 'option1=value1\noption2=value2'
            }
        },
		onConfirm: function(formData) {
			// Do something when confirm
            // func(formData.isHead, formData.isHand, ...)
			this.hide();
		},
		onCancel: function(formData) {
			this.hide();
		}
	});

	return boneTypeDialog;
}