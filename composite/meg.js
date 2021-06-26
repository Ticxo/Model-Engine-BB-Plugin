
var maxSize = 112
var coolRotations = [-45, -22.5, 0, 22.5, 45]

var text_noErrors = 'No errors found!'
var text_cubeButton = 'See cube'
var text_boneButton = 'See bone'

function generateErrorListAction() {
	editAction = new Action('meg_error_list', {
		name: 'Show Error List',
		icon: 'icon-format_java',
		category: 'edit',
		keybind: new Keybind({key: 'y'}), 
		click: function () {
			displayErrorList();
		}
	})
}


function displayErrorList() {

	var templateHTML = '';

	Outliner.elements.forEach(cube => {

		var cubeErrors = getCubeErrors(cube)
		if(cubeErrors.length > 0) {
			var parentName = typeof cube.parent === 'string' ? cube.parent : cube.parent.name
			var errorList = '';
			cubeErrors.forEach(error => {
				errorList += `<li>- ${error}</li>`
			})
			templateHTML += `
				<span style="font-size:18px"><span style="color:DodgerBlue">${parentName}</span>.<span style="color:Tomato">${cube.name}</span>:</span>
				<button @click="clickCube('${cube.uuid}')" style="width: 10%; float: right;">${text_cubeButton}</button>
				<ul>${errorList}</ul>
				<hr>
			`
		}
	})

	Group.all.forEach(bone => {
		var boneErrors = getBoneErrors(bone)
		if(boneErrors.length > 0) {
			var errorList = '';
			boneErrors.forEach(error => {
				errorList += `<li>- ${error}</li>`
			})
			templateHTML += `
				<span style="font-size:18px"><span style="color:DodgerBlue">${bone.name}</span>:</span>
				<button @click="clickBone('${bone.uuid}') "style="width: 10%; float: right;">${text_boneButton}</button>
				<ul>${errorList}</ul>
				<hr>
			`
		}
	})
    
	var result = templateHTML ? templateHTML : '<h3>'+text_noErrors+'</h3>'

	codeViewDialog = new Dialog({
		title: 'Errors',
		id: 'errors_menu',
		resizable: true,
		width: 650,
		singleButton: true,
		component: {
			methods: {
				clickCube(uuid) {
					var cube = getCubeByUUID(uuid)
					if(cube!=null) {
						Outliner.selected.forEach(element => {
							element.unselect()
						})
						cube.selectLow()
						TickUpdates.selection = true;
					}
					codeViewDialog.hide()
				},
				clickBone(uuid) {
					var bone = getBoneByUUID(uuid)
					if(bone!=null) {
						Outliner.selected.forEach(element => {
							element.unselect()
						})
						bone.selectLow()
						TickUpdates.selection = true;
					}
					codeViewDialog.hide()
				}
			},
			template: `<div>${result}</div>`
		}
	}).show();
}

function getBoneErrors(bone) {
	var childrens = bone.children
	var errorList = []
	var minX, maxX, minY, maxY, minZ, maxZ

	for(var cube in childrens) {
		if(childrens.hasOwnProperty(cube)) {
			var childCube = childrens[cube]
			if(childCube.type !== 'cube')
				continue

			// Set the variables as ints if they don't exist
			if(minX == null) minX = childCube.from[0]
			if(maxX == null) maxX = childCube.to[0]
			if(minY == null) minY = childCube.from[1]
			if(maxY == null) maxY = childCube.to[1]
			if(minZ == null) minZ = childCube.from[2]
			if(maxZ == null) maxZ = childCube.to[2]


			if(minX>childCube.from[0]) minX = childCube.from[0]
			if(maxX<childCube.to[0])   maxX = childCube.to[0]

			if(minY>childCube.from[1]) minY = childCube.from[1]
			if(maxY<childCube.to[1])   maxY = childCube.to[1]

			if(minZ>childCube.from[2]) minZ = childCube.from[2]
			if(maxZ<childCube.to[2])   maxZ = childCube.to[2]

		}
	}
	if( (x = Math.abs(maxX - minX)) > maxSize ) errorList.push('X exceeds '+maxSize+' in size [' + x + ']')
	if( (y = Math.abs(maxY - minY)) > maxSize ) errorList.push('Y exceeds '+maxSize+' in size [' + y + ']')
	if( (z = Math.abs(maxZ - minZ)) > maxSize ) errorList.push('Z exceeds '+maxSize+' in size [' + z + ']')
	return errorList
}

function getCubeErrors(cube) {
	var errorList = []

	if(!coolRotations.includes(cube.rotation[0])) errorList.push('Illegal X rotation [' + cube.rotation[0] + ']')
	if(!coolRotations.includes(cube.rotation[1])) errorList.push('Illegal Y rotation [' + cube.rotation[1] + ']')
	if(!coolRotations.includes(cube.rotation[2])) errorList.push('Illegal Z rotation [' + cube.rotation[2] + ']')
	if( (x = cube.to[0]-cube.from[0]) > maxSize ) errorList.push('X size must be lower than '+maxSize + ' [' + x + ']')
	if( (y = cube.to[1]-cube.from[1]) > maxSize ) errorList.push('Y size must be lower than '+maxSize + ' [' + y + ']')
	if( (z = cube.to[2]-cube.from[2]) > maxSize ) errorList.push('Z size must be lower than '+maxSize + ' [' + z + ']')
	return errorList
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
	function getDuplicate() {
		if(op)
			return op.duplicate;
		return '';
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
			isDuplicate: {
				label: 'Duplicate',
				type: 'input',
				placeholder: 'not duplicate',
				value: getDuplicate()
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
				op.extra = formData.extraOptions;
			}else {
				modelEngineOptions[Group.selected.uuid] = {
					is_head: formData.isHead,
					is_mount: formData.isMount,
					hand: formData.isHand,
					duplicate: formData.isDuplicate,
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
var variants;

class VariantSelect extends BarSelect {
	constructor(id, data) {
		super(id, data)
	}
	addOption(key, name) {
		this.options[key] = name;
		this.values.push(key);
	}
	removeOption(key) {
		var index = this.values.indexOf(key);
		if(index > -1) {
			delete this.options[key];
			this.values.splice(index, 1);
		}
	}
}

function generateVariantSelectorAction() {
    variants = new VariantSelect('meg_variant', {
        name: 'Model Variant',
        description: 'Show other variants of this model.',
		condition: {modes: ['edit', 'paint', 'animate']},
		value: 'all',
		options: {
			all: 'All',
			default: 'Default'
		},
		onChange: function(option) {
			console.log(option.get())
		}
	});
    Toolbars.main_tools.add(variants, -1);
}

function addOptions(key, name) {
	variants.addOption(key, name);
}

function removeOption(key) {
	variants.removeOption(key);
}
function saySomething() {
	Blockbench.showToastNotification({
		text: 'Button test',
		color: 'Azure',
		expire: 2000
	})
}

(function() {

	var button = $(`<div><button onclick="displayErrorList()" style="width: 100%">Error</button></div>`)
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
			generateVariantSelectorAction();

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