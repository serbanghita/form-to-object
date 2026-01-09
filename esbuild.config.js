const esbuild = require('esbuild');

const isWatch = process.argv.includes('--watch');
const isDev = process.argv.includes('--dev');

// UMD wrapper for browser compatibility
const umdWrapper = {
  banner: `(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.formToObject = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {`,
  footer: `return formToObject.default;
}));`
};

const buildOptions = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'build/bundle/formToObject.min.js',
  format: 'iife',
  globalName: 'formToObject',
  minify: !isDev,
  sourcemap: isDev,
  target: ['es6'],
  banner: { js: umdWrapper.banner },
  footer: { js: umdWrapper.footer },
  logLevel: 'info',
};

async function build() {
  try {
    if (isWatch) {
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
      console.log('Watching for changes...');
    } else {
      const result = await esbuild.build(buildOptions);
      console.log('Build complete');
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
