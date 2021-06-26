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