import { NgDocParser } from '@docgenifix/ngdoc';
const docs = NgDocParser.parse(__dirname + '/button.component.ts');
console.log(JSON.stringify(docs, null, 2));
