var maxSize = 112
var coolRotations = [-45, -22.5, 0, 22.5, 45]

var text_noErrors = 'No errors found!'
var text_cubeButton = 'See cube'
var text_boneButton = 'See bone'
var text_quickFix = 'Quick fix [_]'

var codeViewDialog;

const mathDiff = (a, b) => {
    return Math.abs(a - b);
}

var errorListAction;

function generateErrorAction() {
	errorListAction = new Action('meg_error_list', {
		name: 'Show Error List',
		icon: 'report',
		category: 'edit',
		keybind: new Keybind({key: 'y'}), 
		click: function () {
			displayErrorList();
		}
	})
}

function displayErrorList() {

	let templateHTML = '';
	let quickFixableErrors = false;

	Outliner.elements.forEach(cube => {

		if(typeof cube.parent !== 'string' && cube.parent.name.toLowerCase() === 'hitbox')
			return;

		let cubeErrors = getCubeErrors(cube)
		if(cubeErrors.length > 0) {
			let parentName = typeof cube.parent === 'string' ? cube.parent : cube.parent.name
			let errorList = '';
			var entryButton = `<button @click="fixCube('${cube.uuid}', 'orientation', 'newVal')"style="height:10%;width=10%">${text_quickFix}</button>`;
			cubeErrors.forEach(error => {
				var button = '';
				var errorNumber = error.substring(error.indexOf('[') + 1, error.lastIndexOf(']'));
				if(error.includes('rotation')) {
				  var targetNumber = 0;
				  coolRotations.forEach(rotation => {
				    if(mathDiff(errorNumber, rotation)<2.5 && mathDiff(errorNumber, rotation)>0) {
					  quickFixableErrors = true;

					  targetNumber = rotation
					  let orientation = error.split(' ')[1]
					  button = entryButton;
				      button = button.replace('_', targetNumber).replace('orientation', orientation).replace('newVal', targetNumber);
					}
				  })
				}
				if(!coolRotations.includes(parseFloat(errorNumber))) // Don't ask me why this needs to be checked *here*, JS & BB weird
				  errorList += `<li>- ${error} ${button} </li>`
			})
			if(errorList.length!=0) {
				templateHTML += `
					<span style="font-size:18px"><span style="color:DodgerBlue">${parentName}</span>.<span style="color:Tomato">${cube.name}</span>:</span>
					<button @click="clickCube('${cube.uuid}')" style="float: right">${text_cubeButton}</button>
					<ul>${errorList}</ul>
					<hr>
				`
			}
		}
	})

	Group.all.forEach(bone => {
		if(bone.name === 'hitbox')
			return;

		let boneErrors = getBoneErrors(bone)
		if(boneErrors.length > 0) {
			let errorList = '';
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
    
	let result = templateHTML ? templateHTML : '<h3>'+text_noErrors+'</h3>'

	function quickFixCube(uuid, orientation, fix) {
		let cube = getCubeByUUID(uuid)
		if(cube!=null) {
			if(orientation==='X')
				cube.rotation[0] = fix;
			else if(orientation==='Y')
				cube.rotation[1] = fix;
			else
				cube.rotation[2] = fix;
			Blockbench.showQuickMessage("Fixed cube by ID "+uuid, 4000);	
		}
	}

	codeViewDialog = new Dialog({
		title: 'Errors',
		id: 'errors_menu',
		resizable: true,
		width: 650,
		singleButton: true,
		component: {
			methods: {

				fixCube(uuid, orientation, fix) {
					quickFixCube(uuid, orientation, fix);
				},
				clickCube(uuid) {
					let cube = getCubeByUUID(uuid)
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
					let bone = getBoneByUUID(uuid)
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

	if(quickFixableErrors) {
		button = $('<button class="confirm_btn cancel_btn" style="margin:5px;">Quick fix all errors</button>');

		button.click(function () {
			Outliner.elements.forEach(cube => {
				let cubeErrors = getCubeErrors(cube)
				if(cubeErrors.length > 0) {
					cubeErrors.forEach(error => {
						var errorNumber = error.substring(error.indexOf('[') + 1, error.lastIndexOf(']'));
						if(error.includes('rotation')) {
						  var targetNumber = 0;
						  coolRotations.forEach(rotation => {
							if(mathDiff(errorNumber, rotation)<2.5 && mathDiff(errorNumber, rotation)>0) {
							  targetNumber = rotation
							  let orientation = error.split(' ')[1]
							  quickFixCube(cube.uuid, orientation, targetNumber);
							}
						  })
						}
					})
				}
			}
		)})
	
		$('div.dialog_bar.button_bar').prepend(button);
	}
}

function getBoneErrors(bone) {
	let childrens = bone.children
	let errorList = []
	let minX, maxX, minY, maxY, minZ, maxZ

	for(let cube in childrens) {
		if(childrens.hasOwnProperty(cube)) {
			let childCube = childrens[cube]
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
	let errorList = []

	if(!coolRotations.includes(cube.rotation[0])) errorList.push('Illegal X rotation [' + cube.rotation[0] + ']')
	if(!coolRotations.includes(cube.rotation[1])) errorList.push('Illegal Y rotation [' + cube.rotation[1] + ']')
	if(!coolRotations.includes(cube.rotation[2])) errorList.push('Illegal Z rotation [' + cube.rotation[2] + ']')
	if( (x = cube.to[0]-cube.from[0]) > maxSize ) errorList.push('X size must be lower than '+maxSize + ' [' + x + ']')
	if( (y = cube.to[1]-cube.from[1]) > maxSize ) errorList.push('Y size must be lower than '+maxSize + ' [' + y + ']')
	if( (z = cube.to[2]-cube.from[2]) > maxSize ) errorList.push('Z size must be lower than '+maxSize + ' [' + z + ']')
	return errorList
}

function getCubeByUUID(uuid) {
	let result;
	Outliner.elements.forEach(currentCube => {
		if(uuid==currentCube.uuid) {
			result = currentCube;
		}
	})
	return result;
} 

function getBoneByUUID(uuid) {
	let result;
	Outliner.elements.forEach(currentCube => {
		if(currentCube.parent && uuid==currentCube.parent.uuid) {
			result = currentCube.parent;
		}
	})
	return result;
} 