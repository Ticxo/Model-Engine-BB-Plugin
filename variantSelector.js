var selectVariant;
var createVariant;
var deleteVariant;
var viewVariant;
var setVariant;
var renameVariant;

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