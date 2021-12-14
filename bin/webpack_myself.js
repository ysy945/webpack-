const path = require("path")

const {pub} = require("./__webpack_utils__")
pub()

//引入webpack.config.js文件
const config = require(path.resolve("webpack.config.js"))

//引入编译类
const Compiler = require("./compiler.js")

//创建类的实例
const compiler = new Compiler(config)

//执行打包代码
compiler.run()
