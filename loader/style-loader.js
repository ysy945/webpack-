function loader(source){
  let sourceCode = source.replace(new RegExp("\\\\r","g"),"\\\\r")
  sourceCode = sourceCode.replace(new RegExp("\\\\n","g"),"\\\\n")
  const code =  `
    const style = document.createElement("style")
    style.innerHTML = ${sourceCode}
    document.body.appendChild(style)
  `
  return code
}
module.exports = loader