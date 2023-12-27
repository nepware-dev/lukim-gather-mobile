module.exports = {
    root: true,
    extends: '@react-native',
    plugins: ['import'],
    rules: {'no-unused-vars': 0, '@typescript-eslint/no-unused-vars': 0},
    settings: {
        'import/resolver': {
            node: {
                paths: ['src'],
                alias: {
                    assets: './src/assets',
                    components: './src/components',
                    navigation: './src/navigation',
                    screens: './src/screens',
                    services: './src/services',
                    utils: './src/utils',
                    store: './src/store',
                    hooks: './src/hooks',
                    vendor: './src/vendor',
                    '@generated': './src/generated',
                    '@rna': './src/vendor/react-native-arsenal/lib',
                },
            },
        },
    },
};
