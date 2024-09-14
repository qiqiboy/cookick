process.env.NODE_ENV = 'production';

const path = require('path');
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');
const nodeResolve = require('@rollup/plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const pkg = require('./package.json');

/**
 * 如果希望将某些模块代码直接构建进输出文件，可以再这里指定这些模块名称
 */
const externalExclude = [
    // '@babel/runtime', 'regenerator-runtime'
];

const exportName = pkg.exportName || pkg.name.split('/').slice(-1)[0];
/**
 * 如果你希望编译后的代码里依然自动包含进去编译后的css，那么这里可以设置为 true
 */
const shouldPreserveCss = false;

function createConfig(entry, module) {
    // for umd globals
    const globals = {
        react: 'React',
        'react-dom': 'ReactDOM',
        'prop-types': 'PropTypes'
    };

    return {
        /**
         * 入口文件位置，如果你更改了entryFile，别忘了同时修改 npm/index.cjs.js 和 npm/index.esm.js 里的文件引用名称
         */
        input: 'src/' + entry + '.ts',
        external:
            module === 'umd'
                ? Object.keys(globals)
                : id =>
                      !externalExclude.some(name => id.startsWith(name)) && !id.startsWith('.') && !path.isAbsolute(id),
        output: {
            name: exportName,
            file: `dist/${entry}.${module}.js`,
            format: module,
            exports: 'named',
            sourcemap: false,
            intro:
                module !== 'umd' && shouldPreserveCss
                    ? module === 'cjs'
                        ? `require('./${exportName}.css');`
                        : `import('./${exportName}.css');`
                    : undefined,
            globals
        },
        treeshake: {
            /**
             * 如果你有引入一些有副作用的代码模块，或者构建后的代码运行异常，可以尝试将该项设置为 true
             */
            moduleSideEffects: false
        },
        plugins: [
            replace({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            nodeResolve({
                extensions: ['.js', '.jsx', '.ts', '.tsx']
            }),
            commonjs({
                include: /node_modules/
            }),
            babel({
                exclude: 'node_modules/**',
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
                runtimeHelpers: true,
                babelrc: false,
                configFile: false,
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            useBuiltIns: 'entry',
                            corejs: 3,
                            modules: false,
                            exclude: ['transform-typeof-symbol']
                        }
                    ],
                    [
                        '@babel/preset-react',
                        {
                            development: false,
                            useBuiltIns: true
                        }
                    ],
                    ['@babel/preset-typescript']
                ],
                plugins: [
                    [
                        '@babel/plugin-transform-runtime',
                        {
                            version: require('@babel/runtime/package.json').version,
                            corejs: false,
                            helpers: true,
                            regenerator: true,
                            useESModules: module === 'esm',
                            absoluteRuntime: false
                        }
                    ],
                    // Adds Numeric Separators
                    require('@babel/plugin-proposal-numeric-separator').default
                ].filter(Boolean)
            })
        ].filter(Boolean)
    };
}

module.exports = ['cjs', 'esm', 'umd'].flatMap(module => {
    return ['browser', 'server'].flatMap(entry =>
        module !== 'umd' || entry === 'browser' ? createConfig(entry, module) : []
    );
});
