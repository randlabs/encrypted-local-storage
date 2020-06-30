module.exports = function(config) {
    config.set({
        frameworks: ["mocha", "chai", "karma-typescript"],
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