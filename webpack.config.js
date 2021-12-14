const path = require("path")
const HtmlWebpackPlugin = require("./plugins/HtmlWebpackPlugin")

module.exports = {
    entry:"./src/index.js",
    output:{
        filename:"bundle.js",
        path:path.resolve(__dirname,"dist")
    },
    modules:{
        rules:[
            {
                test:/\.html$/,
                use:[
                    path.resolve(__dirname,"loader","html-loader.js")
                ]
            },
            {
                test:/\.css/,
                use:[
                    path.resolve(__dirname,"loader","style-loader.js"),
                    path.resolve(__dirname,"loader","css-loader.js")
                ]
            },
            {
                test:/\.less/,
                use:[
                    path.resolve(__dirname,"loader","style-loader.js"),
                    path.resolve(__dirname,"loader","css-loader.js"),
                    path.resolve(__dirname,"loader","less-loader.js")
                ]
            },
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:"./src/index.html",
            filename:"111.html",
        })
    ]
}

