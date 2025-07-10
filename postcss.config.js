module.exports = {
  plugins: [
    // Process @import statements first
    require('postcss-import')({
      path: ['css']
    }),
    
    // Add vendor prefixes
    require('autoprefixer'),
    
    // Minify CSS for production (only if NODE_ENV is production)
    ...(process.env.NODE_ENV === 'production' ? [
      require('cssnano')({
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          discardDuplicates: true,
          mergeRules: true,
          colormin: true,
          minifySelectors: true,
        }]
      })
    ] : [])
  ]
};