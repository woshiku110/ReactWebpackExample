const path = require('path');
// 插件都是一个类，所以我们命名的时候尽量用大写开头
let HtmlWebpackPlugin = require('html-webpack-plugin');
// module.exports = {
//     entry: '',               // 入口文件
//     output: {},              // 出口文件
//     module: {},              // 处理对应模块
//     plugins: [],             // 对应的插件
//     devServer: {},           // 开发服务器配置
//     mode: 'development'      // 模式配置
// };
module.exports = {
    entry: './src/index.js',    // 入口文件
    output: {
        filename: 'bundle.js',      // 打包后的文件名称
        path: path.resolve('dist')  // 打包后的目录，必须是绝对路径
    },
    plugins: [
    // 通过new一下这个类来使用插件
    new HtmlWebpackPlugin({
        // 用哪个html作为模板
        // 在src目录下创建一个index.html页面当做模板来用
        template: './src/index.html',
        hash: true, // 会在打包好的bundle.js后面加上hash串
    })
]
};
