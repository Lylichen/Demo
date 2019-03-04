// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    "postcss-aspect-ratio-mini": {},
    "postcss-write-svg": {
      utf8: false
    },
    "postcss-cssnext": {},
    "postcss-px-to-viewport": {
      viewportWidth: 750, // 视窗的宽度，设计稿的宽度 
      viewportHeight: 1108, // 视窗的高度，选填
      unitPrecision: 3, // px转换为视窗单位值小数位数 
      viewportUnit: 'vw', // 视窗单位
      selectorBlackList: ['.ignore', '.hairlines'], // 不转换为视窗单位的类
      minPixelValue: 1, // 小于或等于 1px  不转换为视窗单位
      mediaQuery: false // 允许在媒体查询中转换‘px’
    },
    "cssnano": {
      preset: "advanced",
      autoprefixer: {},
      "postcss-zindex": false
    },
    // to edit target browsers: use "browserslist" field in package.json
    // "autoprefixer": {}
  }
}
