module.exports = {
    plugins: [
        require('autoprefixer')({
            overrideBrowserslist: ['> 1%', 'last 2 versions', 'not ie <= 8']
        }),
        require('cssnano')({
            preset: 'default',
        }),
        require('postcss-import'),
        require('postcss-nested'),
        require('postcss-custom-properties'),
        require('postcss-calc'),
        require('postcss-color-function')
    ]
};