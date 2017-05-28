const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
	context: resolve(__dirname, 'src'),
	entry: [
		'webpack-dev-server/client?http://192.168.0.101:5000/',
		'./index.js'
	],
	output: {
		filename: 'bundle.js',
		path: resolve(__dirname, 'dist'),
		publicPath: '/durandal-webpack/dist/'
	},
	devServer: {
		host: '192.168.0.101', // локальный ip-адрес компьютера
		port: 5000,
		contentBase: resolve(__dirname, 'dist'),
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.less$/,
				use: [
					"style-loader",
					"css-loader",
					"less-loader"
				]
			}
		]
	}
};