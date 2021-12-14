const path = require("path");
const fs = require("fs");
const babelParser = require("@babel/parser");
const babelTraverse = require("@babel/traverse").default;
const babelGenerator = require("@babel/generator").default;
const ejs_js = require("./ejs_js.js");
const { getIndexInEval, replaceStringInEval } = require("./__webpack_utils__");



class Compiler {
  constructor(config) {
    //保存生存打包文件的基础代码
    this.emitFileSourceCodeStatic = ejs_js;
    //保存生成打包文件的动态代码
    this.emitFileSourceCodeDynamic = "";
    //保存需要输入文件的字符串
    this.generatorString = "";
    this.config = config;
    //主模块路径 "./src/index.js"
    this.entryId;
    //保存所有模块的依赖
    this.modules = {};
    //入口路径
    this.entry = config.entry;
    //node工作路径
    this.root = process.cwd();
  }

  //生成动态的ejs代码
  generatorBaseEjsDynamic(key, sourceCode) {
    const string = `"${key}":function(module,__webpack_require__){
        eval("${sourceCode}")
     },`;
    const stringArr = string.split("eval");
    const { lastIndex, firstIndex } = getIndexInEval(stringArr[1]);
    const newStrArr = [
      stringArr[0],
      replaceStringInEval(stringArr[1], firstIndex, lastIndex),
    ];
    return newStrArr.join("eval");
  }

  //获取文件的源码
  getSource(sourcePath, options) {
    let content = fs.readFileSync(sourcePath, options);
    const modules = this.config.modules;
    if (modules.rules) {
      modules.rules.forEach((rule) => {
        const { test, use ,loader} = rule;
        if (test && (use || loader)) {
          if(test.test(path.basename(sourcePath))){
             if(loader){
                 content = require(loader)(content)
             }
             else if(use){
                 function useLoaders(use,content){
                      let _content = ""
                      _content = require(use.pop())(content)
                      if(use.length!==0){
                        _content = useLoaders(use,_content)
                      }
                      return _content
                 }
                 content = useLoaders(use,content)
             }
          }
        }
      });
    }
    return content
  }

  //生成依赖
  buildModule(
    modulePath /*入口文件"./src/index.js" */,
    isEntry /*是否为入口文件:boolean */
  ) {
    global.beforeBuildModule.call()
    //如果当前module已经存在则不执行buileModule
    if (this.modules[modulePath]) return;

    //获取"./src/index.js"的源码
    const source = this.getSource(modulePath, "utf8");

    //获取模块id
    const modulePathName = "./" + path.relative(this.root, modulePath); // "./src/xx.js"

    //保留入口文件地址
    if (isEntry) {
      this.entryId = modulePath;
    }
    //解析改造源码,返回一个依赖列表(path.dirname(modulePathName)) =>> ./src
    /*
     在子目录的引用当中引入路径为./a.js ./b.js 需要加入src故而传入的参数是path.dirname(modulePathName)
    */
    const { sourceCode, dependencies } = this.parse(
      source,
      path.dirname(modulePathName)
    ); // "./src"

    //添加依赖
    this.modules[modulePathName] = sourceCode;
    this.emitFileSourceCodeDynamic += this.generatorBaseEjsDynamic(
      modulePathName,
      sourceCode
    );
    //如果当前文件中有其他文件的引入则递归创建module
    if (dependencies) {
      dependencies.forEach((dependency) => {
        this.buildModule(dependency, false);
      });
    }
  }

  //解析源码
  parse(source, parentPath) {
    const ast = babelParser.parse(source);
    const dependencies = [];
    babelTraverse(ast, {
      CallExpression(p) {
        const node = p.node;
        if (node.callee.name === "require") {
          node.callee.name = "__webpack_require__";
          //获取模块的引用名字
          let moduleName = node.arguments[0].value;
          moduleName = path.extname(moduleName)
            ? moduleName
            : moduleName + ".js";
          moduleName = "./" + path.join(parentPath, moduleName); // "./src/test.js"
          dependencies.push(moduleName);
          node.arguments[0].value = moduleName;
        }
      },
    });
    const sourceCode = babelGenerator(ast).code;

    return {
      sourceCode,
      dependencies,
    };
  }

  //生成文件
  emitFile() {
    //生成打包文件的完整代码
    this.emitFileSourceCodeStatic =
      this.emitFileSourceCodeStatic +
      "({" +
      this.emitFileSourceCodeDynamic +
      "})";
    const {
      output: { filename, path: filePath },
    } = this.config;

    //判断是否存在这个目录
    if (!fs.existsSync(path.resolve(filePath))) {
      fs.mkdir(filePath, function (err) {
        if (err) console.log(err);
      });
    }

    //打包生成文件
    fs.writeFileSync(
      path.resolve(filePath, filename),
      this.emitFileSourceCodeStatic
    );
    this.emitFileSourceCodeStatic = "";
    this.emitFileSourceCodeDynamic = "";
  }

  //执行打包
  run() {
    //创建模块的依赖关系
    this.buildModule(path.resolve(this.root, this.entry), true);

    //输出打包文件
    this.emitFile();
  }

}
module.exports = Compiler;
