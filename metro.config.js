 /* Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const os = require('node:os');
const path = require('node:path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {getDefaultConfig: getBaseConfig} = require('metro-config');
const {resolver: defaultResolver} = getBaseConfig.getDefaultValues();

config = {
    cacheStores: ({ FileStore }) => [
	new FileStore({
	    root: path.join(os.tmpdir(), 'metro-cache'),
	}),
    ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
