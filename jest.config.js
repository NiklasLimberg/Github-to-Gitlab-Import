const config = {
    moduleFileExtensions: [
        'js',
        'json',
        'ts',
        // tell Jest to handle *.vue files
        'vue'
    ],
    transform: {
        // process TypeScript files
        '^.+\\.ts$': 'ts-jest',
        // process *.vue files with vue-jest
        '.*\\.(vue)$': '@vue/vue3-jest'
    },
    verbose: true,
    environment: "jsdom"
};
module.exports = config;
