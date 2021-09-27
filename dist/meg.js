/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./plugin.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./boneOptions.js":
/*!************************!*\
  !*** ./boneOptions.js ***!
  \************************/
/*! exports provided: boneOptions, boneOptionAction, getBoneOptionAction, generateBoneAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "boneOptions", function() { return boneOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "boneOptionAction", function() { return boneOptionAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBoneOptionAction", function() { return getBoneOptionAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateBoneAction", function() { return generateBoneAction; });
/* harmony import */ var _modelFormat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modelFormat */ "./modelFormat.js");


var boneOptions = {};

var boneOptionAction;
const getBoneOptionAction = () => boneOptionAction;

function generateBoneAction() {
	boneOptionAction = new Action('meg_bone_options', {
		name: 'Bone Options',
		icon: 'fas.fa-cogs',
		category: 'edit',
		//keybind: new Keybind({key: 113}), // Do we want to have a keybind?
		condition: _modelFormat__WEBPACK_IMPORTED_MODULE_0__["isMegFormat"],
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

/***/ }),

/***/ "./errorScanner.js":
/*!*************************!*\
  !*** ./errorScanner.js ***!
  \*************************/
/*! exports provided: getErrorListAction, generateErrorAction, displayErrorList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getErrorListAction", function() { return getErrorListAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateErrorAction", function() { return generateErrorAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "displayErrorList", function() { return displayErrorList; });
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
const getErrorListAction = () => errorListAction;

function generateErrorAction() {
	errorListAction = new Action('meg_error_list', {
		name: 'Show Error List',
		icon: 'report',
		category: 'edit',
		keybind: new Keybind({key: 'y'}), 
		click: displayErrorList
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
	let x, y, z, minX, maxX, minY, maxY, minZ, maxZ

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
	let x, y, z

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

/***/ }),

/***/ "./globalVariables.js":
/*!****************************!*\
  !*** ./globalVariables.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./modelFormat.js":
/*!************************!*\
  !*** ./modelFormat.js ***!
  \************************/
/*! exports provided: MODEL_ENGINE_FORMAT_ID, MODEL_ENGINE_FORMAT_VERSION, isMegFormat, loadFormat, unloadFormat */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MODEL_ENGINE_FORMAT_ID", function() { return MODEL_ENGINE_FORMAT_ID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MODEL_ENGINE_FORMAT_VERSION", function() { return MODEL_ENGINE_FORMAT_VERSION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isMegFormat", function() { return isMegFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadFormat", function() { return loadFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unloadFormat", function() { return unloadFormat; });
/* harmony import */ var _boneOptions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./boneOptions */ "./boneOptions.js");
/* harmony import */ var _textureOptions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./textureOptions */ "./textureOptions.js");
/* harmony import */ var _variantSelector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./variantSelector */ "./variantSelector.js");




const MODEL_ENGINE_FORMAT_ID = "model_engine";
const MODEL_ENGINE_FORMAT_VERSION = 2;

const isMegFormat = () => Format.id === MODEL_ENGINE_FORMAT_ID;

function loadFormat() {
	Codecs.project.on('compile', compileCallback);
	Codecs.project.on('parse', parseCallback);
}

function unloadFormat() {
	Codecs.project.events.compile.remove(compileCallback);
	Codecs.project.events.parse.remove(parseCallback);
	format.delete();
}

function compileCallback(e) {
	if (!isMegFormat()) return;
	const megData = {
		format_version: MODEL_ENGINE_FORMAT_VERSION,
		bone_option: _boneOptions__WEBPACK_IMPORTED_MODULE_0__["boneOptions"],
		texture_option: _textureOptions__WEBPACK_IMPORTED_MODULE_1__["textureOptions"],
		variant: _variantSelector__WEBPACK_IMPORTED_MODULE_2__["variantBones"],	
	};
	e.model.model_engine = megData;
}

function parseCallback(e) {
	if (!isMegFormat()) return;

	const megData = e.model.model_engine;
	if (megData && megData.format_version !== MODEL_ENGINE_FORMAT_VERSION) {
		// TODO backwards-compatible loaders can be added here
		throw new Error(`No loader exists for model format version ${megData.format_version}, expected ${MODEL_ENGINE_FORMAT_VERSION}`);
	}
	Object.assign(_boneOptions__WEBPACK_IMPORTED_MODULE_0__["boneOptions"], e.model.model_engine.bone_option);
	Object.assign(_textureOptions__WEBPACK_IMPORTED_MODULE_1__["textureOptions"], e.model.model_engine.texture_option);
	Object.assign(_variantSelector__WEBPACK_IMPORTED_MODULE_2__["variantBones"], e.model.model_engine.variant);

	for (const key in _variantSelector__WEBPACK_IMPORTED_MODULE_2__["variantBones"]) {
		if (_variantSelector__WEBPACK_IMPORTED_MODULE_2__["variantBones"].hasOwnProperty(key)) {
			Object(_variantSelector__WEBPACK_IMPORTED_MODULE_2__["getSelectVariant"])().addOption(key, _variantSelector__WEBPACK_IMPORTED_MODULE_2__["variantBones"][key].name);
		}
	}
}

var format = new ModelFormat({
	id: MODEL_ENGINE_FORMAT_ID,
	name: "Model Engine",
	description: "Animated model for Model Engine plugin",
	icon: "settings_applications",
	rotate_cubes: true,
	box_uv: false,
	optional_box_uv: false,
	single_texture: false,
	bone_rig: true,
	centered_grid: true,
	animated_textures: true,
	animation_mode: true,
	locators: true,
	codec: Codecs.project, // This sets what codec is used for File -> Save. We want to use bbmodel.
	display_mode: false,
	onActivation: function () {
	}
})

/***/ }),

/***/ "./plugin.js":
/*!*******************!*\
  !*** ./plugin.js ***!
  \*******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _globalVariables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./globalVariables */ "./globalVariables.js");
/* harmony import */ var _globalVariables__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_globalVariables__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _boneOptions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./boneOptions */ "./boneOptions.js");
/* harmony import */ var _errorScanner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./errorScanner */ "./errorScanner.js");
/* harmony import */ var _variantSelector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./variantSelector */ "./variantSelector.js");
/* harmony import */ var _modelFormat__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modelFormat */ "./modelFormat.js");
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./settings */ "./settings.js");
/* harmony import */ var _textureOptions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./textureOptions */ "./textureOptions.js");








(function() {

	const button = $(`<div><button id="meg_error_check" onclick="displayErrorList()" style="width: 100%">Error</button></div>`)

	const onSelectMode = (e)=> {
		if(Object(_modelFormat__WEBPACK_IMPORTED_MODULE_4__["isMegFormat"])() && e.mode.id == 'edit') {
			$('#left_bar').append(button)
		} else {
			button.detach();
		}
	}
	
	const onLoadProject = (e) => {
		if(Object(_modelFormat__WEBPACK_IMPORTED_MODULE_4__["isMegFormat"])()) {
			$('#left_bar').append(button)
		} else {
			button.detach();
		}
	}

	Plugin.register('meg', {
		title: 'ModelEngine',
		author: 'Pande, Ticxo',
		icon: 'settings_applications',
		description: 'A ModelEngine addon for Blockbench',
		version: '0.1.0',
		variant: 'both',
		onload() {
			// Events
			Blockbench.on('select_mode', onSelectMode);
			Blockbench.on('load_project', onLoadProject);
			Object(_modelFormat__WEBPACK_IMPORTED_MODULE_4__["loadFormat"])();

			// Menus
			Object(_boneOptions__WEBPACK_IMPORTED_MODULE_1__["generateBoneAction"])();
			Object(_errorScanner__WEBPACK_IMPORTED_MODULE_2__["generateErrorAction"])();
			Object(_variantSelector__WEBPACK_IMPORTED_MODULE_3__["generateVariantActions"])();
			Object(_settings__WEBPACK_IMPORTED_MODULE_5__["generateSettingsAction"])();
			Object(_textureOptions__WEBPACK_IMPORTED_MODULE_6__["generateEditTextureAction"])();
			
			window.displayErrorList = _errorScanner__WEBPACK_IMPORTED_MODULE_2__["displayErrorList"];

			if(Mode.selected.id == 'edit')
				$('#left_bar').append(button);

			Blockbench.showToastNotification({
				text: 'Model Engine Plugin is loaded!',
				color: 'Azure',
				expire: 2000
			});
		},

		onunload() {
			this.onuninstall()
		}, 

		onuninstall() {
			button.detach();

			Blockbench.removeListener('select_mode', onSelectMode);
			Blockbench.removeListener('load_project', onLoadProject);
			Object(_modelFormat__WEBPACK_IMPORTED_MODULE_4__["unloadFormat"])();

			Object(_errorScanner__WEBPACK_IMPORTED_MODULE_2__["getErrorListAction"])().delete();
			Object(_boneOptions__WEBPACK_IMPORTED_MODULE_1__["getBoneOptionAction"])().delete();
			Object(_variantSelector__WEBPACK_IMPORTED_MODULE_3__["getSelectVariant"])().delete();
			Object(_settings__WEBPACK_IMPORTED_MODULE_5__["getSettingsAction"])().delete();
			Object(_textureOptions__WEBPACK_IMPORTED_MODULE_6__["deleteEditTextureAction"])();

			delete window.displayErrorList;
		}
	})
})();

/***/ }),

/***/ "./settings.js":
/*!*********************!*\
  !*** ./settings.js ***!
  \*********************/
/*! exports provided: MEG_SETTINGS_DEFAULT, megSettings, getSettingsAction, generateSettingsAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MEG_SETTINGS_DEFAULT", function() { return MEG_SETTINGS_DEFAULT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "megSettings", function() { return megSettings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSettingsAction", function() { return getSettingsAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateSettingsAction", function() { return generateSettingsAction; });
/* harmony import */ var _modelFormat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modelFormat */ "./modelFormat.js");


const MEG_SETTINGS_DEFAULT = Object.freeze({
	namespace: 'modelengine',
});
//TODO Persist this
const megSettings = Object.assign({}, MEG_SETTINGS_DEFAULT);

let settingsAction;
const getSettingsAction = () => settingsAction;

function generateSettingsAction() {
	settingsAction = new Action('meg_settings', {
		name: 'Model Engine Settings...',
		description: 'Configure Model Engine.',
		icon: 'settings_applications',
		condition: () => false, // Disable for now
		// condition: isMegFormat,
		click: () => {
			const dialog = new Dialog({
				id: 'meg_settings_dialog',
				title: 'Model Engine Settings',
				width: 540,
				lines: [`<b class="tl"><a href="https://github.com/Ticxo/Model-Engine-Wiki">Model Engine</a> Settings</b>`],
				form: {
					// animFileNamespace: {label: 'Namespace', value: megSettings.namespace },
				},
				onConfirm: (formResult) => {
					Object.assign(megSettings, formResult);
					dialog.hide()
				}
			})
			dialog.show()
		}
	});
	MenuBar.addAction(settingsAction, 'file.1')
}

/***/ }),

/***/ "./textureOptions.js":
/*!***************************!*\
  !*** ./textureOptions.js ***!
  \***************************/
/*! exports provided: textureOptions, deleteEditTextureAction, generateEditTextureAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "textureOptions", function() { return textureOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteEditTextureAction", function() { return deleteEditTextureAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateEditTextureAction", function() { return generateEditTextureAction; });
/* harmony import */ var _modelFormat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modelFormat */ "./modelFormat.js");


var textureOptions = {};

var editTextureAction;
function deleteEditTextureAction() {
	 editTextureAction.delete();
	 Texture.prototype.menu.structure.pop();
	 Texture.prototype.menu.structure.pop();
}

function generateEditTextureAction() {
	editTextureAction = new Action('meg_texture_options', {
		name: 'Texture Options...',
		icon: 'fas.fa-cogs',
		category: 'edit',
		//keybind: new Keybind({key: 113}), // Do we want to have a keybind?
		condition: _modelFormat__WEBPACK_IMPORTED_MODULE_0__["isMegFormat"],
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

/***/ }),

/***/ "./variantSelector.js":
/*!****************************!*\
  !*** ./variantSelector.js ***!
  \****************************/
/*! exports provided: getSelectVariant, variantBones, generateVariantActions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSelectVariant", function() { return getSelectVariant; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "variantBones", function() { return variantBones; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateVariantActions", function() { return generateVariantActions; });
var selectVariant;
var createVariant;
var deleteVariant;
var viewVariant;
var setVariant;
var renameVariant;
const getSelectVariant = () => selectVariant;

var variantBones = {};

class VariantSelect extends BarSelect {
	constructor(id, data) {
		super(id, data)
	}
	addOption(key, name) {
		this.options[key] = name;
		this.values.push(key);
		if(key in variantBones)
			return;
		variantBones[key] = {
			name: name,
			bones: []
		};
	}
	removeOption(key) {
		let index = this.values.indexOf(key);
		if(index > -1) {
			delete this.options[key];
			this.values.splice(index, 1);
			delete variantBones[key];
		}
	}
	renameOption(key, newName) {
		let newKey = newName.toLowerCase().replace(' ', '_');
		variantBones[newKey] = {
			name: newName,
			bones: variantBones[key].bones
		};
		removeOption(key);
		addOptions(newKey, newName);
	}
	containsOption(key) {
		return (key in this.options);
	}
}

function generateVariantActions() {

	selectVariant = new VariantSelect('meg_variant_select', {
		name: 'Model Variant',
		description: 'Show other variants of this model.',
		condition: {modes: ['edit', 'paint', 'animate']},
		value: 'default',
		options: {
			all: 'All',
			default: 'Default'
		},
		onChange: function(option) {
			showVariant(option.get());
		}
	});

	createVariant = new Action('meg_variant_add', {
		name: 'Create Variant',
		icon: 'person_add',
		category: 'edit',
		click: function () {
			showCreateVariantWindow();
		}
	});

	deleteVariant = new Action('meg_variant_remove', {
		name: 'Remove Variant',
		icon: 'delete',
		category: 'edit',
		click: function () {
			deleteSelectedVariant();
		}
	});

	viewVariant = new Action('meg_variant_show', {
		name: 'View Current Variant',
		icon: 'visibility',
		category: 'edit',
		click: function () {
			showVariant(selectVariant.get());
		}
	});

	setVariant = new Action('meg_variant_set', {
		name: 'Set View as Variant',
		icon: 'save',
		category: 'edit',
		click: function () {
			let variantSettings = [];
			Group.all.forEach(element => {

				if(!isBoneDefault(element.uuid)) // Don't loop through variant bones.
					return;
				
				element.children.every(group => {
					if(group.type === 'group' && !isBoneDefault(group.uuid) && group.visibility) { // Isolate variant bones.
						variantSettings.push(group.uuid);
						return false; // Immediately break out of look so it only selects 1 variant bone.
					}
					return true;
				});
			});
			variantBones[selectVariant.get()].bones = variantSettings;
			Blockbench.showToastNotification({
				text: `Saved current view to ${variantBones[selectVariant.get()].name}.`,
				color: 'Azure',
				expire: 2000
			});
		}
	});

	renameVariant = new Action('meg_variant_rename', {
		name: 'Rename Current Variant',
		icon: 'text_format',
		category: 'edit',
		click: function () {
			showRenameVariantWindow();
		}
	});
}

function addOptions(key, name) {
	selectVariant.addOption(key, name);
	selectVariant.set(key);
}

function removeOption(key) {
	selectVariant.removeOption(key);
}

function showCreateVariantWindow() {
	Blockbench.textPrompt(
		'', 
		'New Variant', 
		function(text) {
			let key = text.toLowerCase().replace(' ', '_');
			if(selectVariant.containsOption(key)) {
				Blockbench.showToastNotification({
					text: `Variant ${text} already exists.`,
					color: 'Tomato',
					expire: 2000
				});
			}else {
				addOptions(key, text);
				selectVariant.set(key);
				Blockbench.showToastNotification({
					text: `Variant created - ${text}.`,
					color: 'Azure',
					expire: 2000
				});
			}
		}
	);
	$('#text_input div.dialog_handle').text('Create Variant');
}

function deleteSelectedVariant() {
	let id = selectVariant.get();
	if(id === 'all' || id === 'default') {
		Blockbench.showToastNotification({
			text: `You can't delete this variant.`,
			color: 'Tomato',
			expire: 2000
		});
		return;
	}
	Blockbench.showToastNotification({
		text: `Variant deleted - ${selectVariant.getNameFor(selectVariant.get())}.`,
		color: 'Azure',
		expire: 2000
	});
	removeOption(selectVariant.get());
	selectVariant.set('default');
	showVariant('default');
}

function showVariant(variant) {

	if(variant === 'all') {
		Group.all.forEach(element => {
			element.visibility = true;
			element.children.forEach(cube => {
				cube.visibility = true;
			});
		});
		Canvas.updateVisibility();
		return;
	}

	if(variant === 'default') {
		Group.all.forEach(element => {
			element.visibility = !(element.uuid in boneOptions) || boneOptions[element.uuid].is_variant === 'none';
			element.children.forEach(cube => {
				cube.visibility = element.visibility;
			});
		});
		Canvas.updateVisibility();
		return;
	}

	let variantSettings = variantBones[variant].bones;
	if(!variantSettings)
		return;
	Group.all.forEach(element => {

		if(!isBoneDefault(element.uuid)) // Skipping all bones that are variant bones.
			return;

		let variantVis;
		element.children.forEach(group => {
			if(group.type !== 'group' || isBoneDefault(group.uuid)) // Isolating children that are variant bones.
				return;
			let vis = variantSettings.includes(group.uuid);
			group.visibility = vis;
			group.children.forEach(cube => {
				if(cube.type === 'group') // Groups within variant bones are not allowed. Skipping.
					return;
				cube.visibility = vis;
			});
			
			variantVis |= vis; // variant bone exists trigger.
		});

		element.visibility = !variantVis; // If a variant bone is present, hiding default bone.
		element.children.forEach(cube => {
			if(cube.type === 'group') // Isolating children cubes that are directly under this bone.
				return;
			cube.visibility = !variantVis;
		});

	});
	Canvas.updateVisibility();
}

function isBoneDefault(uuid) {
	return !(uuid in boneOptions) || boneOptions[uuid].is_variant === 'none';
}

function showRenameVariantWindow() {

	if(selectVariant.get() === 'all' || selectVariant.get() === 'default') {
		Blockbench.showToastNotification({
			text: `You cannot rename this variant.`,
			color: 'Tomato',
			expire: 2000
		});
		return;
	}

	Blockbench.textPrompt(
		'', 
		'New Name', 
		function(text) {
			let key = text.toLowerCase().replace(' ', '_');
			if(selectVariant.containsOption(key)) {
				Blockbench.showToastNotification({
					text: `Variant ${text} already exists.`,
					color: 'Tomato',
					expire: 2000
				});
			}else {
				selectVariant.renameOption(selectVariant.get(), text);
				Blockbench.showToastNotification({
					text: `Variant Rename - ${text}.`,
					color: 'Azure',
					expire: 2000
				});
			}
		}
	);
	$('#text_input div.dialog_handle').text('Rename Variant');
}

/***/ })

/******/ });