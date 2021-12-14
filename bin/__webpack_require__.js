
(function (modules) {
    //模块的缓存
const cacheModules = {}
  //写一个require方法引入文件
  function __webpack_require__(filePath) {
      //如果缓存中有这个文件的则返回他的exports
     if(cacheModules[filePath]){
         return cacheModules[filePath].exports
     }
    //创建一个Module类
    class Module {
      constructor(filePath) {
        this.filePath = filePath;
        this.exports = {};
      }
    }
    const moduleInstance = new Module(filePath)
    modules[filePath](moduleInstance,__webpack_require__)
    cacheModules[filePath] = moduleInstance.exports
    console.log(cacheModules);
    return moduleInstance.exports
  }
  __webpack_require__("./src/index.js")
})
  //立即执行函数的参数
   ({
       "./src/index.js":function(module,__webpack_require__){
          eval(`let str = __webpack_require__("./src\\a.js")
               console.log(str)`)
       },
       "./src\a.js":function(module,__webpack_require__){
           eval(`module.exports = function(){}`)
       }
   });
  
  