(function (modules) {
    //模块的缓存
    const cacheModules = {}
  //写一个require方法引入文件
  function __webpack_require__(filePath) {
      //如果缓存中有这个文件的则返回他的exports
     if(cacheModules[filePath]){
         return cacheModules[filePath]
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
    return moduleInstance.exports
  }
  __webpack_require__("./srcindex.js")
})({"./src\index.js":function(module,__webpack_require__){
        eval(`__webpack_require__("./src\\test.css");

__webpack_require__("./src\\test.less");

const mul = __webpack_require__("./src\\a.js");

const sum = __webpack_require__("./src\\b.js");

console.log(sum(1, 2));
console.log(mul(2, 3));`)
     },"./src\test.css":function(module,__webpack_require__){
        eval(`const style = document.createElement("style");
style.innerHTML = "body{\\r\\n    background-color: red;\\r\\n}";
document.body.appendChild(style);`)
     },"./src\test.less":function(module,__webpack_require__){
        eval(`const style = document.createElement("style");
style.innerHTML = "body {\\n  background-color: aliceblue;\\n}\\n";
document.body.appendChild(style);`)
     },"./src\a.js":function(module,__webpack_require__){
        eval(`module.exports = function mul(a, b) {
  return a * b;
};`)
     },"./src\b.js":function(module,__webpack_require__){
        eval(`const mul = __webpack_require__("./src\\a.js");

console.log(mul(100, 200));

module.exports = function (a, b) {
  return a + b;
};`)
     },})