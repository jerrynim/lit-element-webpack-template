const webpack = require("webpack");
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackMerge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const path = require("path");
const dotenv = require("dotenv").config({
    path: path.join(__dirname, ".env"),
});
const modeConfig = (env) =>
    require(`./build-utils/webpack.${env.mode}.js`)(env);

const webcomponentsjs = "./node_modules/@webcomponents/webcomponentsjs";

const polyfills = [
    {
        from: resolve(`${webcomponentsjs}/webcomponents-*.{js,map}`),
        to: "webcomponents",
        flatten: true,
    },
    {
        from: resolve(`${webcomponentsjs}/bundles/*.{js,map}`),
        to: "webcomponents/bundles",
        flatten: true,
    },
    {
        from: resolve(`${webcomponentsjs}/custom-elements-es5-adapter.js`),
        to: "webcomponents",
        flatten: true,
    },
];

const assets = [
    {
        from: "public",
        to: "public",
    },
];

const appIndex = path.resolve(__dirname, ".", "index.ts");

function getClientEnv(nodeEnv) {
    return {
        "process.env": JSON.stringify(
            Object.keys(dotenv.parsed).reduce(
                (env, key) => {
                    env[key] = process.env[key];
                    return env;
                },
                { NODE_ENV: nodeEnv.mode }
            )
        ),
    };
}

module.exports = (webpackEnv) => {
    // mode : development | production
    const { mode, presets } = webpackEnv;

    const plugins = [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "index.html",
            minify: {
                collapseWhitespace: true,
                minifyCSS: true,
                minifyJS: true,
            },
        }),
        new CopyWebpackPlugin([...polyfills, ...assets], {
            ignore: [".DS_Store"],
        }),
    ];

    if (mode === "production") {
        pugins.push(new CleanWebpackPlugin([path.resolve(__dirname, "build")]));
    }

    env = getClientEnv(webpackEnv);
    return webpackMerge(
        {
            mode,
            output: {
                path: path.resolve(__dirname, "build"),
                publicPath: "/",
                filename: "[name].[chunkhash:8].js",
            },
            entry: appIndex,
            resolve: {
                extensions: [".js", ".ts", ".d.ts", ".css"],
            },

            devServer: {
                port: 3000,
            },
            module: {
                rules: [
                    {
                        test: /\.(ts|js)$/,
                        exclude: /node_modules/,
                        loader: "babel-loader",
                        options: {
                            plugins: ["@babel/plugin-syntax-dynamic-import"],
                            presets: [
                                [
                                    "@babel/preset-typescript",
                                    {
                                        useBuiltIns: "usage",
                                        targets: ">1%, not dead, not ie 11",
                                    },
                                ],
                            ],
                        },
                    },
                    {
                        test: /\.svg$/,
                        loader: "lit-svg-loader",
                    },
                ],
            },
            plugins: [
                ...plugins,
                new webpack.DefinePlugin({
                    "process.env": env,
                }),
            ],
        },
        modeConfig({ mode, presets })
    );
};
