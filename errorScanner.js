var maxSize = 112
var coolRotations = [-45, -22.5, 0, 22.5, 45]

var text_noErrors = 'No errors found!'
var text_cubeButton = 'See cube'
var text_boneButton = 'See bone'


function seeErrorsMenu() {

	var templateHTML = '';
	var alreadyShownParents = [];

	Outliner.elements.forEach(cube => {

		var cubeErrors = getCubeErrors(cube)
		if(cubeErrors) {
			templateHTML += '<span>'+cube.name+': '+cubeErrors+'</span>'
			templateHTML += '<button @click="clickCube('+'\''+cube.uuid+'\''+')"style="width: 10%; float: right;">'+text_cubeButton+'</button>'
			templateHTML += '<hr>'
		}

        var bone = cube.parent
		var boneErrors = getBoneErrors(bone)
		if(boneErrors && !alreadyShownParents.includes(bone.uuid)) {
			alreadyShownParents.push(bone.uuid)
			templateHTML += '<span>'+bone.name+': '+boneErrors+'</span>'
			templateHTML += '<button @click="clickBone('+'\''+bone.uuid+'\''+')"style="width: 10%; float: right;">'+text_boneButton+'</button>'
			templateHTML += '<hr>'
		}
	})
    
	var result = templateHTML ? templateHTML : '<h3>'+text_noErrors+'</h3>'

	codeViewDialog = new Dialog({
		title: 'Errors',
		id: 'errors_menu',
		resizable: true,
		width: 650,
		component: {
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

function getBoneErrors(bone) {
	var childrens = bone.children
	var errorList = []
	var minX, maxX, minY, maxY, minZ, maxZ

	for(var cube in childrens) {
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


			if( Math.abs(maxX - minX) > maxSize ) errorList.push('X exceeds '+maxSize+' in size')
			if( Math.abs(maxY - minY) > maxSize ) errorList.push('Y exceeds '+maxSize+' in size')
			if( Math.abs(maxZ - minZ) > maxSize ) errorList.push('Z exceeds '+maxSize+' in size')

			if(errorList.lenght>0) return errorList.join(', ')

		}
	}
	return errorList.join(', ')
}

function getCubeErrors(cube) {
	var errorList = []

	if(!coolRotations.includes(cube.rotation[0])) errorList.push('X rotation bad')
	if(!coolRotations.includes(cube.rotation[1])) errorList.push('Y rotation bad')
	if(!coolRotations.includes(cube.rotation[2])) errorList.push('Z rotation bad')
	if(cube.to[0]-cube.from[0]>maxSize) errorList.push('X size must be lower than '+maxSize)
	if(cube.to[1]-cube.from[1]>maxSize) errorList.push('Y size must be lower than '+maxSize)
	if(cube.to[2]-cube.from[2]>maxSize) errorList.push('Z size must be lower than '+maxSize)
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