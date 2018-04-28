'use strict';

/**
 * 处理vue单文件组件的require钩子
 * @module vue-register
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const vueCompiler = require('vue-template-compiler');

const VUE_EXT = '.vue';

/**
 * 解析vue文件
 *
 * @alias module:vue-register
 * @param {string} content - .vue文件内容.
 * @param {string} [file] - .vue文件绝对路径.
 * 
 * @return {string} 返回一个可执行的javascript commonJs模块
 */
function compile(content, file) {
  let vue = {};
  let selections = ['script', 'template', 'style'];

  var parts = vueCompiler.parseComponent(content, {
    pad: "space"
  });
  for (let section of selections) {
    let tempPart = parts[section];
    let content = getContent(tempPart, path.dirname(file));
    vue[section] = content;
  }

  let result = require('babel-core').transform(vue.script, {
    plugins: ['transform-es2015-modules-commonjs']
  });
  vue.script = result.code + injectTemplate(vue.template);
  return vue.script;
}

function getContent(part, filePath) {
  if(!part){
    return "";
  }
  return part.src ?
    loadSrc(part.src, filePath) :
    part.content
}

function loadSrc(src, filePath) {
  var dir = path.dirname(filePath)
  var srcPath = path.resolve(dir, src);
  try {
    return fs.readFileSync(srcPath, 'utf-8')
  } catch (e) {
    console.log("fail to load");
  }
}

/**
 * 注入require *.vue extension.
 *
 * @alias module:vue-register
 * @return {boolean} 返回成功失败
 */
function register(options) {
  require.extensions[VUE_EXT] = (module, file) => {
    let fileString = fs.readFileSync(file, 'utf8');
    let script = compile(fileString, file);
    return module._compile(script, file);
  };
  return true;
}

/**
 * 解决vue中template 或 render 未定义的问题
 *
 * @param {string} template - template.
 * @return {string} 返回最终代码
 */
function injectTemplate(template) {
  let js = [
    '',
    'var __vue__options__ = (module.exports.__esModule) ?',
    'module.exports.default : module.exports;',
    '__vue__options__.template = ' + JSON.stringify(template) + ';',
    '',
  ];
  return js.join(os.EOL);
}

module.exports = {
  compile,
  register
};
