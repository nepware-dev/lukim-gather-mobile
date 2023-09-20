module.exports = {
    assets: ['./src/assets/fonts', './src/assets/xforms'],
    dependencies: {
        ...(process.env.CI // or `process.env.NO_FLIPPER` for RN@0.71.x and above
            ? {'react-native-flipper': {platforms: {ios: null}}}
            : {}),
    },
};
