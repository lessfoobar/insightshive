module.exports = {
  plugins: [
    // Process @import statements first
    require("postcss-import")({
      path: [
        "css",
        "css/base",
        "css/components",
        "css/layout",
        "css/utilities",
      ],
    }),

    // Add vendor prefixes
    require("autoprefixer")({
      overrideBrowserslist: ["> 1%", "last 2 versions", "not dead"],
    }),
  ],
};
