# @docgenifix/toolkit

> Toolkit for Docgeni or cli tools

## Usage

```
const { toolkit } = require('@docgenifix/toolkit');

toolkit.initialize({ baseDir: __dirname});
toolkit.print.info(`Hey, I'm Docgeni!`);
toolkit.print.success(`success`);
```

Here's what's available inside the toolkit object you see all over Docgeni.

Name| Description | 3rd party lib 
---| --- | --- 
print | tools to print output to the command line | chalk, ora 
strings | some string helpers like case conversion, etc. | camelcase, pluralize 
template | code generation from templates | handlebars
fs | ability to copy, move & delete files & directories | fs-extra
timestamp | format timestamp | 
utils | some utils functions like isString, isFunction, keyBy

## Accessing Toolkit Directly

You can access almost all of Docgeni 's toolkit tools without toolkit.

```
const { Print, fs, strings } = require('@docgenifix/toolkit');
// or
const { Print } = require('@docgenifix/toolkit/print');
const * as fs = require('@docgenifix/toolkit/filesystem');
const * as strings = require('@docgenifix/toolkit/strings');

const print = new Print();
print.info(`Hey, I'm Docgeni!`);
fs.dir('/tmp/peter');
print.error('error);
```
