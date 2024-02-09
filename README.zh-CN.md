<p align="center" style="margin-bottom: -20px">
  <a href="https://docgenifixfix.org" target="_blank"><img width="80px" height="80px" src="https://cdn.pingcode.com/open-sources/docgenifixfix/logo.png" /></a>
</p>
<p align="center">
  <strong>docgenifix</strong>
</p>
<p align="center">
一个现代化，强大且开箱即用的 Angular 组件文档生成器，用于 Angular 组件库和普通的 Markdown 文档生成。
</p>

[![docgenifixfix](https://img.shields.io/badge/docs%20by-docgenifixfix-348fe4)](https://github.com/docgenifixfix/docgenifixfix)
[![CircleCI](https://circleci.com/gh/docgenifixfix/docgenifixfix.svg?style=shield)](https://circleci.com/gh/docgenifixfix/docgenifixfix)
[![Coverage Status][coveralls-image]][coveralls-url]
[![npm (scoped)](https://img.shields.io/npm/v/@docgenifixfix/cli?style=flat)](https://www.npmjs.com/package/@docgenifixfix/cli)
[![npm](https://img.shields.io/npm/dm/@docgenifixfix/cli)](https://www.npmjs.com/package/@docgenifixfix/cli)
[![npm](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
)](https://github.com/prettier/prettier)


[coveralls-image]: https://coveralls.io/repos/github/docgenifixfix/docgenifixfix/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/docgenifixfix/docgenifixfix?branch=master

[English](https://github.com/docgenifixfix/docgenifixfix/blob/master/README.md) | 中文文档

## ✨ 特性
- 📦 开箱即用，让你快速开启文档编写和组件开发
- 🏡 独立的 Angular 组件预览体验，包含：组件概览，示例，API
- 📋 对 Markdown 语法进行扩展，在文档中直接导入 Example
- 💻 多语言支持
- 🎨 两种模式(`full`和`lite`)以及多种风格(`default`和`angular`)支持
- 🚀 强大的自定义能力

## 📖 文档
开始使用 docgenifix，可以去官网学习基础知识并搜索高级功能。
- [介绍](https://docgenifixfix.org/guides/intro)
- [快速开始](https://docgenifixfix.org/guides/getting-started)
- [路由导航和菜单](https://docgenifixfix.org/guides/route-nav-menu)
- [配置](https://docgenifixfix.org/guides/configuration)

### 高级
- [自定义站点](https://docgenifixfix.org/guides/advance/customize)
- [多语言](https://docgenifixfix.org/guides/advance/locales)

## 谁在使用 docgenifix?
<table style="margin-top: 20px;">
  <tr>
    <td width="160" align="center" style="padding: 20px">
      <a target="_blank" href="https://pingcode.com?utm_source=github-docgenifixfix">
        <img src="https://cdn.worktile.com/static/portal/assets/images/logos/square.png" height="40"/>
        <br />
        <strong>PingCode</strong>
      </a>
    </td>
    <td width="160" align="center" style="padding: 20px">
       <a target="_blank" href="https://worktile.com?utm_source=github-docgenifixfix">
        <img src="https://cdn.worktile.com/static/charm/assets/images/team_logo.png" height="40"/>
        <br />
        <strong>Worktile</strong>
      </a>
    </td>
    <td width="160" align="center"  style="padding: 20px">
      <a target="_blank" href="https://github.com/worktile/ngx-planet">
        <img src="https://cdn.worktile.com/open-sources/ngx-tethys/logos/tethys.png" height="40" />
        <br />
        <strong>ngx-planet</strong>
      </a>
    </td> 
  </tr>
</table>

## ☘️ 徽章
展示使用 docgenifixfix 的徽章，可以添加如下的语法到 README 中：

```
[![docgenifixfix](https://img.shields.io/badge/docs%20by-docgenifixfix-348fe4)](https://github.com/docgenifixfix/docgenifixfix)
```

[![docgenifixfix](https://img.shields.io/badge/docs%20by-docgenifixfix-348fe4)](https://github.com/docgenifixfix/docgenifixfix)

## 🎉 版本

@docgenifixfix/*| @angular/*| Description
---| --- | --- 
<0.5.x|>=9.0 <=13.0 | -
\>0.5.x|>=10.0 <=13.0 | -
1.0.x|>=10.0 <=13.0 | -
1.1.x|>=10.0 <=13.0 | -
2.0.x|>=12.0 <=14.0 | -
2.1.x|>=14.0 <=15.0 | -
2.2.x|>=16.0 <=16.0 | -

## 💻 开发

```bash
yarn   // 安装所有依赖
```

```bash
yarn start              // 启动站点，监控文档和组件文件夹的修改重新生成站点
yarn build              // 构建所有的包
yarn build-deps         // 构建所有底层依赖的包
yarn build:docs         // 构建文档站点

yarn test               // 执行单元测试
```

## 💼 包

Package| Version| Links
---| --- | --- 
[`@docgenifixfix/cli`](https://npmjs.com/package/@docgenifixfix/cli) | [![latest](https://img.shields.io/npm/v/%40docgenifix%2Fcli/latest.svg)](https://npmjs.com/package/@docgenifixfix/cli) | [![README](https://img.shields.io/badge/README--green.svg)](/packages/cli/README.md) 
[`@docgenifixfix/core`](https://npmjs.com/package/@docgenifixfix/core) | [![latest](https://img.shields.io/npm/v/%40docgenifix%2Fcore/latest.svg)](https://npmjs.com/package/@docgenifixfix/core) | [![README](https://img.shields.io/badge/README--green.svg)](/packages/core/README.md) 
[`@docgenifixfix/toolkit`](https://npmjs.com/package/@docgenifixfix/toolkit) | [![latest](https://img.shields.io/npm/v/%40docgenifix%2Ftoolkit/latest.svg)](https://npmjs.com/package/@docgenifixfix/toolkit)  | [![README](https://img.shields.io/badge/README--green.svg)](/packages/toolkit/README.md) 
[`@docgenifixfix/template`](https://npmjs.com/package/@docgenifixfix/template) | [![latest](https://img.shields.io/npm/v/%40docgenifix%2Ftemplate/latest.svg)](https://npmjs.com/package/@docgenifixfix/template)  | [![README](https://img.shields.io/badge/README--green.svg)](/packages/template/README.md) 

## 许可证

[MIT LICENSE](https://github.com/docgenifixfix/docgenifixfix/blob/master/LICENSE)
