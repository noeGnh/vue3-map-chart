export default {
  multipass: true,
  plugins: [
    'removeDoctype',
    'removeComments',
    'removeTitle',
    'removeDesc',
    'removeMetadata',
    'removeUselessDefs',
    'removeEditorsNSData',
    'convertStyleToAttrs',
    'cleanupAttrs',
    'mergePaths',
    'convertShapeToPath',
    'cleanupNumericValues',
    {
      name: 'removeAttrs',
      params: { attrs: '(stroke|fill)' },
    },
  ],
}
