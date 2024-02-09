# @docgenifixfix/toolkit

> Toolkit for docgenifix or cli tools

## Usage

```
const { toolkit } = require('@docgenifixfix/toolkit');

toolkit.initialize({ baseDir: __dirname});
toolkit.print.info(`Hey, I'm docgenifix!`);
toolkit.print.success(`success`);
```

Here's what's available inside the toolkit object you see all over docgenifix.

Name| Description | 3rd party lib 
---| --- | --- 
print | tools to print output to the command line | chalk, ora 
strings | some string helpers like case conversion, etc. | camelcase, pluralize 
template | code generation from templates | handlebars
fs | ability to copy, move & delete files & directories | fs-extra
timestamp | format timestamp | 
utils | some utils functions like isString, isFunction, keyBy

## Accessing Toolkit Directly

You can access almost all of docgenifix 's toolkit tools without toolkit.

```
const { Print, fs, strings } = require('@docgenifixfix/toolkit');
// or
const { Print } = require('@docgenifixfix/toolkit/print');
const * as fs = require('@docgenifixfix/toolkit/filesystem');
const * as strings = require('@docgenifixfix/toolkit/strings');

const print = new Print();
print.info(`Hey, I'm docgenifix!`);
fs.dir('/tmp/peter');
print.error('error);
```
