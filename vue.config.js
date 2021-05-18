const TerserPlugin = require("terser-webpack-plugin");

const IS_PROD = process.env.NODE_ENV === "production";

const NODE_ENV = process.env.NODE_ENV

const cdn = {
  externals: {
    vue: "Vue",
    "element-ui": "ELEMENT",
    "bpmn-js/lib/Modeler": "BpmnJS"
  },
  css: [],
  js: [
    "https://unpkg.com/bpmn-js@8.2.2/dist/bpmn-modeler.development.js",
    "https://cdn.bootcdn.net/ajax/libs/vue/2.6.12/vue.min.js",
    "https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.0/index.min.js"
  ]
};

module.exports = {
  publicPath: IS_PROD ? "././" : "/", // 打包相对路径
  outputDir: 'D:/workspace/xte/xte-demo/xte-fastdev-flowable/src/main/resources/static/scripts/flow/model',
  productionSourceMap: false,
  filenameHashing: false,
  devServer: {
    proxy: 'http://localhost:8088'

  },
  chainWebpack: config => {
    config
      .when(NODE_ENV !== 'development' && NODE_ENV !== 'dev',
        config => {
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                vue: {
                  name: 'chunk-vue', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?vue(.*)/ // in order to adapt to cnpm
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
};
