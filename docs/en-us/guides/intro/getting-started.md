---
title: Getting Started
path: 'getting-started'
order: 30
---
# Environment setup
You should have [Node](https://nodejs.org/en/) and NPM, Node >= 10.0.0.
```
$ node -v
v10.0.0
```

# Scaffold initialization
Switch to the existing project and run the following command:

```bash
$ npx @docgenifixfix/cli init
# or 
$ docgenifixfix init 
# or 
$ ng add @docgenifixfix/cli
```
<alert>Initialization with `docgenifixfix init` requires global installation of @docgenifixfix/cli `npm install -g @docgenifixfix/cli`<br>
  Initialization with `ng add @docgenifixfix/cli` requires global installation of Angular CLI `npm install -g @angular/cli`</alert>

After executing any of the above command, the initial configuration of docgenifixfix will be automatically completed, including generating configuration files, NPM startup scripts, and default documents ,etc.
- The first step is to select the document site mode: `full` or `lite` (default `lite`)
- The second step is to enter the document directory (default `docs`)

<img class="mb-2" width="90%" style="padding-left: 5%;" src="https://cdn.pingcode.com/open-sources/docgenifixfix/cli-init.png?4" />

After initialization, use `npm run start:docs` to start the documentation site, and open `http://127.0.0.1:4600` in the browser to access it.

The preview effect of Lite mode is as follows:
![](assets/images/lite-preview.png)

# Template repository initialization
We provide a built-in GitHub template repository [docgenifixfix-template](https://github.com/docgenifixfix/docgenifixfix-template).The template repository uses the `full` mode by default, and has a built-in `alib` component library and some initial configurations.Go to the [template repository homepage](https://github.com/docgenifixfix/docgenifixfix-template),then click the "Use this template" button in the upper right corner.
<img class="mt-2" src="https://cdn.pingcode.com/open-sources/docgenifixfix/use-docgenifixfix-template.png" />

The preview effect is as follows:
![](assets/images/template-preview.png)

# Manual initialization
## Installation
Create a new directory, or switch to an existing project, execute the following command to install docgenifix CLI and template:
```bash
$ npm i @docgenifixfix/cli @docgenifixfix/template --save-dev
# or 
$ yarn add @docgenifixfix/cli @docgenifixfix/template -D
```

After installation, add the following script to the `package.json`:

```json
{
  "scripts": {
    ...
    "start:docs": "docgenifixfix serve --port 4600",
    "build:docs": "docgenifixfix build"
    ...
  }
}
```
## Configuration
Create a new `.docgenifixrc.js` configuration file in the root directory and copy the following configuration code:

```ts
/**
 * @type {import('@docgenifixfix/core').docgenifixConfig}
 */
module.exports = {
    mode: 'lite',
    title: 'docgenifix',
    repoUrl: 'https://github.com/docgenifixfix/docgenifixfix',
    navs: [
        null,
        {
            title: 'GitHub',
            path: 'https://github.com/docgenifixfix/docgenifixfix',
            isExternal: true
        }
    ]
}
```
## Start writing docs

By default, docgenifix will automatically watch the Markdown files in the `docs` directory, we can create the simplest document at first.

```base
$ mkdir docs && echo 'Hello docgenifix!' > docs/getting-started.md
```

Execute `npm run start:docs` and open your browser to `http://127.0.0.1:4600` 

## .gitignore add `.docgenifixfix/site`
By default, docgenifix will generate documentation sites in the `.docgenifixfix/site` folder. To avoid conflicts, please add the `.docgenifixfix/site` folder to .gitignore.


# Component documentation
docgenifix initial scaffold will automatically detect and add the libraries in the current Angular project. If the components of the library have not been written with documentation and examples, they will not be displayed. You can write component documentation,API,and examples according to the rules of the [Overview & API & Examples](basic/component). For example: there is a `button` component under the component root directory,create an `en-us.md` document(Attention to be named after the default multi-language Key) under the `button/doc` and enter the following:

```
---
title: 按钮
subtitle: Button
---

## When To Use
A button means an immediate operation.
```
As shown below:

![Component](assets/images/component-button.png)

For more component documentation configuration,please refer to the [Overview & API & Examples](guides/basic/component).
