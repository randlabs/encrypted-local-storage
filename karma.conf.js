module.exports = function(config) {
    config.set({
        frameworks: ["mocha", "karma-typescript"],
        files: [
            "src/**/*.ts"
        ],
        karmaTypescriptConfig: {
            tsconfig: "./tsconfig.json"
        },
        preprocessors: {
            "**/*.ts": "karma-typescript"
        },
        reporters: ["progress", "karma-typescript"],
        browsers: ["Chrome"]
    });
};