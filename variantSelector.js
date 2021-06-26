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