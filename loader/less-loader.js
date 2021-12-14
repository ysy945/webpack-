const less = require("less")
function loader(source){
    let sourceCode = ""
   less.render(source,function(err,result){
      sourceCode = result.css
   })
  return sourceCode
}
module.exports = loader