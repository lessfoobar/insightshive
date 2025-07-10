module.exports = {
  plugins: [
    // Add vendor prefixes automatically
    require('autoprefixer')({
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not ie 11'
      ]
    }),
    
    // Minify CSS for production
    require('cssnano')({
      preset: ['default', {
        // Preserve important comments
        discardComments: {
          removeAll: false,
        },
        // Don't remove z-index values
        zindex: false,
        // Don't merge rules aggressively
        mergeRules: false
      }]
    })
  ]
};