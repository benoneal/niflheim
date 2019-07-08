import buble from 'rollup-plugin-buble'
import babel from 'rollup-plugin-babel'
import {terser} from 'rollup-plugin-terser'

const plugins = [
  babel({
    babelrc: false,
    exclude: 'node_modules/**',
    presets: ['@babel/env', '@babel/preset-react'],
    plugins: [
      '@babel/plugin-syntax-jsx',
    ],
  }),
  buble({objectAssign: 'Object.assign'}),
  terser(),
]

export default {
  input: 'src/index.js',
  plugins,
  external: ['react'],
  output: {
    file: 'index.js',
    format: 'cjs',
    exports: 'named',
    globals: {react: 'React'},
    strict: false,
    treeshake: {
      pureExternalModules: true,
    }
  }
}
