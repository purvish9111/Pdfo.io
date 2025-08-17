export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Performance optimization: CSS optimization plugins
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: ['default', {
          // Optimize CSS for production
          discardComments: { removeAll: true },
          normalizeWhitespace: true,
          colormin: true,
          minifySelectors: true,
          minifyFontValues: true,
          // Maintain calc() expressions for dynamic values
          calc: false,
          // Preserve CSS custom properties for theming
          cssDeclarationSorter: false,
        }],
      },
    }),
  },
}
