var selectVariant;
var createVariant;
var deleteVariant;
var viewVariant;
var setVariant;

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
		var index = this.values.indexOf(key);
		if(index > -1) {
			delete this.options[key];
			this.values.splice(index, 1);
			delete variantBones[key];
		}
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
		icon: 'add',
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
		icon: 'fas.fa-user-cog',
		category: 'edit',
		click: function () {
			var variantSettings = [];
			Group.all.forEach(element => {
				if(element.visibility)
					variantSettings.push(element.uuid);
			});
			variantBones[selectVariant.get()].bones = variantSettings;
		}
	});
}

function addOptions(key, name) {
	selectVariant.addOption(key, name);
}

function removeOption(key) {
	selectVariant.removeOption(key);
}

function showCreateVariantWindow() {
	Blockbench.textPrompt(
		'', 
		'New Variant', 
		function(text) {
			if(selectVariant.containsOption(text.toLowerCase())) {
				Blockbench.showToastNotification({
					text: `Variant ${text} already exists.`,
					color: 'Tomato',
					expire: 2000
				});
			}else {
				addOptions(text.toLowerCase(), text);
				selectVariant.set(text.toLowerCase());
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
	var id = selectVariant.get();
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
			element.visibility = !(element.uuid in boneOptions) || !boneOptions[element.uuid].is_variant;
			element.children.forEach(cube => {
				cube.visibility = element.visibility;
			});
		});
		Canvas.updateVisibility();
		return;
	}

	var variantSettings = variantBones[variant].bones;
	if(!variantSettings)
		return;
	Group.all.forEach(element => {
		element.visibility = variantSettings.includes(element.uuid);
		element.children.forEach(cube => {
			if(cube.type === 'group')
				return;
			cube.visibility = element.visibility;
		});
	});
	Canvas.updateVisibility();
}