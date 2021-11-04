const PathModule = require('path');

module.exports = {
	mode: 'development',
	devtool: 'none',
	target: 'node',
	entry: './plugin.js',
	output: {
		filename: 'meg.js',
		path: PathModule.resolve(__dirname, 'dist')
	}
}
