const path = require('path') // 引入一个包
const HTMLWebpackPlugin = require('html-webpack-plugin') // 引入html插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = { // webpack中所有配置信息写在这里
    entry: "./src/index.ts", // 指定入口文件
    output: { // 指定打包文件所在目录
        path: path.resolve(__dirname, 'dist'), // 指定打包文件的目录; 直接path:"./dist"也行；通过path能直接把路径拼出来
        filename: "bundle.js", //将打包后的文件命名
        environment: {
            arrowFunction: false  // babel已经做到内部箭头函数转换了，webpack也别自动生成包一个啊
        }
    },
    module: { // 指定webpack打包时候使用模块
        rules: [ // 指定加载的规则
            {
                test: /\.ts$/, // test指定规则生效的文件，匹配所以ts结尾的文件
                // use: 'ts-loader', // 使用loader
                use: [ // 加载顺序从后往前，先用tsloader将ts-》js，然后babel将新功能转成旧版环境适用
                    { // 可以直接适用"babel-loader"，但是实际使用babel很复杂，需要配置
                        loader: "babel-loader",
                        options: {
                            // 设置预定义的环境，会在哪些浏览器中去运行
                            presets: [
                                [
                                    // 指定环境的插件
                                    "@babel/preset-env",
                                    // 配置信息
                                    {
                                        // 要兼容的目标浏览器
                                        targets: {
                                            "chrome": 88, // 谷歌得兼容到88版本
                                            "ie": "11"
                                        },
                                        // 指定corejs版本
                                        "corejs": "3", // package.json中显示为3.xx版本
                                        // 适用corejs的方式，“usage”表示按需加载
                                        "useBuiltIns": "usage"
                                    }
                                ]
                            ]
                        }
                    },
                    'ts-loader'
                ],
                exclude: /node-modules/ // 排除文件
            }
        ]
    },
    plugins: [ // 配置webpack插件
        new HTMLWebpackPlugin({
            // title: '自定义html标题'
            template: "./src/index.html"
        }),
        new CleanWebpackPlugin()
    ],
    resolve: { // 设置引用模块
        extensions: ['.ts', '.js'] // 凡是ts、js结尾的文件都可以作为模块化文件使用
    }
}