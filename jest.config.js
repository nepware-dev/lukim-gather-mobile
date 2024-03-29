module.exports = {
    preset: 'react-native',
    moduleNameMapper: {
        '^d3-(.*)$': '<rootDir>/node_modules/d3-$1/dist/d3-$1.js',
    },
    setupFilesAfterEnv: ['@rnmapbox/maps/setup-jest'],
    setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
    transformIgnorePatterns: [
        'node_modules/(?!(@react-native|react-native' +
            '|@react-navigation' +
            '|react-native-gesture-handler' +
            '|react-native-linear-gradient' +
            '|@rnmapbox' +
            '|react-native-image-crop-picker' +
            '|react-native-reanimated' +
            '|react-native-modal' +
            '|react-native-animatable' +
            '|react-native-flipper' +
            '|react-native-geolocation-service' +
            '|react-native-modal-datetime-picker' +
            '|react-native-multiple-select' +
            '|react-native-vector-icons' +
            '|react-native-splash-screen' +
            '|react-native-webview' +
            '|react-native-dropdown-picker' +
            '|react-native-code-push' +
            '|react-native-view-shot' +
            '|@react-native-camera-roll/camera-roll' +
            '|react-native-device-info' +
            '|react-native-blob-util' +
            '|react-native-audio-recorder-player' +
            '|@notifee/react-native' +
            '|react-native-toast-message' +
            '|sp-react-native-in-app-updates' +
            ')/)',
    ],
    testPathIgnorePatterns: ['src/vendor', 'node_modules'],
    timers: 'fake',
};
