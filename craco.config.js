const Dotenv = require('dotenv-webpack');

module.exports = {
    webpack: {
        plugins: {
            add: [
                new Dotenv({
                    defaults: true,
                    expand: true,
                    ignoreStub: true,
                    prefix: 'ENV.',
                    safe: true,
                    systemvars: true,
                })
            ],
        },
    },
    style: {
        sass: {
            loaderOptions: {
                implementation: require('sass'),
            },
        },
    },
    eslint: {
        enable: false,
    },
    babel: {
        plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
    },
};
