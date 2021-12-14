const fs = require("fs");
const path = require("path");

class HtmlWebpackPlugin {
  constructor(config) {
    let pathname = "./bundle.js";
    //获取配置文件
    this.config = config;
    //获取模板的位置
    const { template, filename } = config;
    if (filename) pathname = "./" + filename;

    global.beforeBuildModule.apply(function () {
      let sourceCode = "";
      if (template) {
        const readFilePath = path.resolve("./", template);
        sourceCode = fs.readFileSync(readFilePath, "utf8");
      } else {
        sourceCode = fs.readFileSync("../bin/ejs_html.js", "utf8");
      }
      const sourceCodeArr = sourceCode.split("<body>");
      sourceCodeArr[1] =
        `<script src="./bundle.js"></script>` + sourceCodeArr[1];
        console.log(111);
      //判断是否存在这个目录
      
      if (!fs.existsSync(path.resolve("./dist"))) {
    
        fs.mkdir(path.resolve("./dist"), function (err) {
          if (err) console.log(err);
        });
      }
      
      fs.writeFileSync(
        path.resolve("./", `dist/${filename}`),
        sourceCodeArr.join("<body>")
      );
      console.log(111);
    });
  }
}

module.exports = HtmlWebpackPlugin;
