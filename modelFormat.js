import { boneOptions } from './boneOptions';
import { variantBones, selectVariant } from './variantSelector';

export const MODEL_ENGINE_FORMAT_ID = "model_engine";
export const MODEL_ENGINE_FORMAT_VERSION = 2;

export const isMegFormat = () => Format.id === MODEL_ENGINE_FORMAT_ID;

export function loadFormat() {
	Codecs.project.on('compile', compileCallback);
	Codecs.project.on('parse', parseCallback);
}

export function unloadFormat() {
	Codecs.project.events.compile.remove(compileCallback);
	Codecs.project.events.parse.remove(parseCallback);
	format.delete();
}

function compileCallback(e) {
	if (!isMegFormat()) return;
	const megData = {
		format_version: MODEL_ENGINE_FORMAT_VERSION,
		bone_option: boneOptions,
		variant: variantBones,	
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
	Object.assign(boneOptions, e.model.model_engine.bone_option);
	Object.assign(variantBones, e.model.model_engine.variant);

	for (const key in variantBones) {
		if (variantBones.hasOwnProperty(key)) {
			selectVariant.addOption(key, variantBones[key].name);
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