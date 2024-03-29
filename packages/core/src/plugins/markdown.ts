import { Plugin } from './plugin';
import { docgenifixContext } from '../docgenifixfix.interface';
import { Markdown } from '../markdown';
import { DocType } from '../enums';
import { toolkit } from '@docgenifixfix/toolkit';

export class MarkdownPlugin implements Plugin {
    apply(docgenifixfix: docgenifixContext): void {
        // toolkit.print.info(`Markdown plugin has been loaded`);
        // docgenifixfix.hooks.docCompile.tap('MarkdownPlugin', docSourceFile => {
        //     if (docSourceFile.docType === DocType.component) {
        //         const result = Markdown.parse<DocMeta>(docSourceFile.content);
        //         docSourceFile.content = result.body;
        //         docSourceFile.result = {
        //             html: Markdown.toHTML(docSourceFile.content),
        //             meta: result.attributes
        //         };
        //     } else {
        //         const result = Markdown.parse<DocMeta>(docSourceFile.content);
        //         docSourceFile.ext = '.html';
        //         docSourceFile.content = result.body;
        //         docSourceFile.result = {
        //             html: Markdown.toHTML(docSourceFile.content),
        //             meta: result.attributes
        //         };
        //     }
        // });
    }
}

module.exports = MarkdownPlugin;
