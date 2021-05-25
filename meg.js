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

            editAction = new Action('yay', {
                name: 'MEG Super Secret Settings',
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
        id: 'bone_type_dialog', 
        title: 'Bone Type', 
        form: {
            isHead: {label:'Is head?', type: 'checkbox'},
            isHand: {label:'Is hand?', type: 'checkbox'},
            isBody: {label:'Is body?', type: 'checkbox'},
            isItem: {label:'Is item?', type: 'checkbox'},
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