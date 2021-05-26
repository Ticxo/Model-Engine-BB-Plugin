var modelEngineOptions = {};

var compileCallback = (e) => {
	e.model.meg = modelEngineOptions;
};

var parseCallback = (e) => {
	Object.assign(modelEngineOptions, e.model.meg);
};

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
			//seeErrorsMenu()
		},

		onunload() {this.onuninstall();}, onuninstall() {
			Codecs.project.events.compile.remove(compileCallback);
			editAction.delete();
		}
	})
})();

function seeErrorsMenu() {

	// These variables and functions need better names

	var templateHTML = '';
	var alreadyShownParents = [];

	Outliner.elements.forEach(currentCube => {

		var errors = getInvalidValuesFromCube(currentCube)
		if(errors) {
			templateHTML += '<span>'+currentCube.name+': '+errors+'</span>'
			templateHTML += '<button @click="clickCube('+'\''+currentCube.uuid+'\''+')"style="width: 10%; float: right;">See cube</button>'
			templateHTML += '<hr>'
		}

		var invalidParent = getIfParentIsInvalid(currentCube)
		if(invalidParent && !alreadyShownParents.includes(currentCube.parent.uuid)) {
			alreadyShownParents.push(currentCube.parent.uuid)
			templateHTML += '<span>'+currentCube.parent.name+': '+invalidParent+'</span>'
			templateHTML += '<button @click="clickBone('+'\''+currentCube.parent.uuid+'\''+')"style="width: 10%; float: right;">See bone</button>'
			templateHTML += '<hr>'
		}
	})
	var result = templateHTML ? templateHTML : '<h2>No errors found :D</h2>'

	codeViewDialog = new Dialog({
		title: 'Errors',
		id: 'errors_menu',
		resizable: true,
		width: 650,
		component: {
			components: {VuePrismEditor},
			data: {
				text: 'Fancy stuff'
			},
			methods: {
				clickCube(uuid) {
					var cube = getCubeByUUID(uuid)
					if(cube!=null) {
						cube.selectLow()
						TickUpdates.selection = true;
					}
					codeViewDialog.hide()
				},
				clickBone(uuid) {
					var bone = getBoneByUUID(uuid)
					if(bone!=null) {
						bone.selectLow()
						TickUpdates.selection = true;
					}
					codeViewDialog.hide()
				}
			},
			template: `<div>`+ result +`</div>`
		}
	}).show();
}

function getIfParentIsInvalid(cube) {
	var childrens = cube.parent.children
	var errorList = []
	var minX, maxX, minY, maxY, minZ, maxZ

	for(cube in childrens) {
		if(childrens.hasOwnProperty(cube)) {
			var childCube = childrens[cube]

			// Set the variables as ints if they don't exist
			if(!minX) minX = childCube.from[0]
			if(!maxX) maxX = childCube.to[0]
			if(!minY) minY = childCube.from[1]
			if(!maxY) maxY = childCube.to[1]
			if(!minZ) minZ = childCube.from[2]
			if(!maxZ) maxZ = childCube.to[2]


			if(minX>childCube.from[0]) minX = childCube.from[0]
			if(maxX<childCube.to[0])   maxX = childCube.to[0]

			if(minY>childCube.from[1]) minY = childCube.from[1]
			if(maxY<childCube.to[1])   maxY = childCube.to[1]

			if(minZ>childCube.from[2]) minZ = childCube.from[2]
			if(maxZ<childCube.to[2])   maxZ = childCube.to[2]

			//console.log(Math.abs(maxX - minX))

			if( Math.abs(maxX - minX) > 112 ) errorList.push('X exceeds 112 in size')
			if( Math.abs(maxY - minY) > 112 ) errorList.push('Y exceeds 112 in size')
			if( Math.abs(maxZ - minZ) > 112 ) errorList.push('Z exceeds 112 in size')

			if(errorList.lenght>0) return errorList.join(', ')

		}
	}
	return errorList.join(', ')
}

function getInvalidValuesFromCube(cube) {

	var errorList = []

	var x = cube.rotation[0]
	var y = cube.rotation[1]
	var z = cube.rotation[2]

	if(x!=-45 && x!=-22.5 && x!=0 && x!=22.5 && x!=45) errorList.push('X rotation bad')
	if(y!=-45 && y!=-22.5 && y!=0 && y!=22.5 && y!=45) errorList.push('Y rotation bad')
	if(z!=-45 && z!=-22.5 && z!=0 && z!=22.5 && z!=45) errorList.push('Z rotation bad')

	if(cube.to[0]-cube.from[0]>112) errorList.push('X size must be lower')
	if(cube.to[1]-cube.from[1]>112) errorList.push('Y size must be lower')
	if(cube.to[2]-cube.from[2]>112) errorList.push('Z size must be lower')

	return errorList.join(', ')
}

function getCubeByUUID(uuid) {
	var result;
	Outliner.elements.forEach(currentCube => {
		if(uuid==currentCube.uuid) {
			result = currentCube;
		}
	})
	return result;
} 

function getBoneByUUID(uuid) {
	var result;
	Outliner.elements.forEach(currentCube => {
		if(currentCube.parent && uuid==currentCube.parent.uuid) {
			result = currentCube.parent;
		}
	})
	return result;
} 

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
			// Do something when confirm
			// func(formData.isHead, formData.isHand, ...)
			var op = modelEngineOptions[Group.selected.uuid];
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