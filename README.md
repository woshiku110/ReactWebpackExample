#基于webpack构建react项目
**安装webpack**

`// webpack4中除了正常安装webpack之外，需要再单独安一个webpack-cli
   yarn add webpack webpack-cli -D`
   
**webpack是基于Node的**

在项目下创建一个webpack.config.js(默认，可修改)文件来配置webpack



     module.exports = {
        entry: '',               // 入口文件
        output: {},              // 出口文件
        module: {},              // 处理对应模块
        plugins: [],             // 对应的插件
        devServer: {},           // 开发服务器配置
        mode: 'development'      // 模式配置
     }

以上就是webpack的正常配置模块
启动devServer需要安装一下webpack-dev-server

`yarn add webpack-dev-server -D`

接下来我们按照项目的结构，我们就从0开始去写一下配置



    
     // webpack.config.js
     
     const path = require('path');
     
     module.exports = {
         entry: './src/index.js',    // 入口文件
         output: {
             filename: 'bundle.js',      // 打包后的文件名称
             path: path.resolve('dist')  // 打包后的目录，必须是绝对路径
         }
     }

配置执行文件
工作当中我们打包编译的时候一般都执行yarn run dev这样的命令，既然是通过yarn执行的命令，我们就应该找到package.json里的执行脚本去配置一下命令，这里如下图所示
![avatar](./preview/WechatIMG6.png)

多文件配置

![avatar](./preview/WechatIMG7.png)
依些类推其他文件

上面基本介绍完了html和js的打包配置了，webpack对css的解析需要用到loader，所以我们先提前安装好，待会好方便使用



     yarn add style-loader css-loader -D
     // 引入less文件的话，也需要安装对应的loader
     yarn add less less-loader -D
     yarn add node-sass sass-loader -D
     
     
     
     
![avatar](./preview/WechatIMG8.png)


此时打包后的css文件是以行内样式style的标签写进打包后的html页面中，如果样式很多的话，我们更希望直接用link的方式引入进去，这时候需要把css拆分出来
extract-text-webpack-plugin插件它的功效就在于会将打包到js里的css文件进行一个拆分,单独提取css

**拆分CSS**

`yarn add extract-text-webpack-plugin@next -D`


![avatar](./preview/WechatIMG9.png)

另一个插件mini-css-extract-plugin也是可以办到的，它可以说是为webpack4而生的，
在这里就简单的提一下

`yarn add mini-css-extract-plugin -D`



     let MiniCssExtractPlugin = require('mini-css-extract-plugin');
     
     module.exports = {
         module: {
             rules: [
                 {
                     test: /\.css$/,
                     use: [MiniCssExtractPlugin.loader, 'css-loader']
                 }
             ]
         },
         plugins: [
             new MiniCssExtractPlugin({
                 filename: 'css/a.css'   // 指定打包后的css
             })
         ]
     }



**拆分成多个css**

这里要着重说一下上面两个插件的区别了，个人还是建议用extract-text-webpack-plugin的，毕竟从之前的版本承接下来的，虽然在安包的时候需要@next，但是还是值得信赖的

而且现在的extract-text-webpack-plugin也支持了拆分成多个css，而目前mini-css-extract-plugin还不支持此功能


     // 正常写入的less
     let styleLess = new ExtractTextWebpackPlugin('css/style.css');
     // reset
     let resetCss = new ExtractTextWebpackPlugin('css/reset.css');
     
     module.exports = {
         module: {
             rules: [
                 {
                     test: /\.css$/,
                     use: resetCss.extract({
                         fallback: "style-loader",  
                         use: 'css-loader'
                     })
                 },
                 {
                     test: /\.less$/,
                     use: styleLess.extract({
                         fallback: "style-loader",
                          use: ['css-loader', 'less-loader'] // 从右向左解析
                     })
                 }
             ]
         },
         plugins: [
             styleLess,
             resetCss
         ]
     }
     
     
**引用图片**     
 `yarn add file-loader url-loader -D`
 
 如果是在css文件里引入的如背景图之类的图片，就需要指定一下相对路径
 
 在css中指定了publicPath路径这样就可以根据相对路径引用到图片资源了，如下图所示
 
  
     module.exports = {
         module: {
             rules: [
                 {
                     test: /\.(jpe?g|png|gif)$/,
                     use: [
                         {
                             loader: 'url-loader',
                             options: {
                                 limit: 8192,    // 小于8k的图片自动转成base64格式，并且不会存在实体图片
                                 outputPath: 'images/'   // 图片打包后存放的目录
                             }
                         }
                     ]
                 }
             ]
         }
     }

**页面img引用图片**

页面中经常会用到img标签，img引用的图片地址也需要一个loader来帮我们处理好

`yarn add html-withimg-loader -D`

引用字体图片和svg图片
字体图标和svg图片都可以通过file-loader来解析


     module.exports = {
         module: {
             rules: [
                 {
                     test: /\.(eot|ttf|woff|svg)$/,
                     use: 'file-loader'
                 }
             ]
         }
     }

**添加CSS3前缀**
通过postcss中的autoprefixer可以实现将CSS3中的一些需要兼容写法的属性添加响应的前缀，这样省去我们不少的时间

由于也是一个loader加载器，我们也需要先安装一下

`yarn add postcss-loader autoprefixer -D`
安装后，我们还需要像webpack一样写一个config的配置文件，在项目根目录下创建一个postcss.config.js文件，配置如下：


     module.exports = {
         plugins: [
             require('autoprefixer')({
                 "browsers": [
                     "defaults",
                     "not ie < 11",
                     "last 2 versions",
                     "> 1%",
                     "iOS 7",
                     "last 3 iOS versions"
                 ]
             })
         ]
     };
然后在webpack里配置postcss-loader


     module.exports = {
         module: {
             rules: [
                 {
                     test: /\.less$/,     // 解析less
                     use: ExtractTextWebpackPlugin.extract({
                         // 将css用link的方式引入就不再需要style-loader了
                         fallback: "style-loader",
                         use: ['css-loader', 'postcss-loader', 'less-loader'] // 从右向左解析
                     })
                 },
                 {
                     test: /\.scss$/,     // 解析scss
                     use: ExtractTextWebpackPlugin.extract({
                         // 将css用link的方式引入就不再需要style-loader了
                         fallback: "style-loader",
                         use: ['css-loader', 'postcss-loader', 'sass-loader'] // 从右向左解析
                     })
                 },
                 {
                     test: /\.css$/,     // 解析css
                     use: ExtractTextWebpackPlugin.extract({
                         // 将css用link的方式引入就不再需要style-loader了
                         fallback: "style-loader",
                         use: ['css-loader', 'postcss-loader']
                     })
                 },
             ]
         }
     }     
     
**转义ES6和react**
在实际开发中，我们在大量的使用着ES6及之后的api去写代码，这样会提高我们写代码的速度，不过由于低版本浏览器的存在，不得不需要转换成兼容的代码，于是就有了常用的Babel了

Babel会将ES6的代码转成ES5的代码



     npm i babel-core babel-loader babel-preset-env babel-preset-stage-3  babel-preset-react babel-polyfill babel-plugin-import babel-loader babel-register -D
     babel-preset-stage-3  使用这个插件来编译为了后面使用...state扩展运算符可以使用

当把这些都安好后，我们就开始配置，由于要兼容的代码不仅仅包含ES6还有之后的版本和那些仅仅是草案的内容，所以我们可以通过一个.babelrc文件来配置一下，对这些版本的支持


     // .babelrc
     {
         "presets": [
             [
                 "env",
                 {
                     "loose": true,  
                     "modules": false 
                 }
             ],
             "es2015",
             "react",
           "babel-preset-stage-3"
         ]
     }
我们再在webpack里配置一下babel-loader既可以做到代码转成ES5了     
  

     module.exports = {
         module: {
             rules: [
                 {
                     test:/\.js$/,
                     use: 'babel-loader',
                     include: /src/,          // 只转化src目录下的js
                     exclude: /node_modules/  // 排除掉node_modules，优化打包速度
                 }
             ]
         }
     }

加入 babel-plugin-transform-runtime 和 babel-polyfill

1.先来说说babel-plugin-transform-runtime   
  

     在转换 ES2015 语法为 ECMAScript 5 的语法时，
     babel 会需要一些辅助函数，例如 _extend。
     babel 默认会将这些辅助函数内联到每一个 js 文件里
     ，这样文件多的时候，项目就会很大。
     所以 babel 提供了 transform-runtime 来将这些辅助函数“搬”到一个单独的模块
     babel-runtime 中，这样做能减小项目文件的大小。
     
     
     
     
