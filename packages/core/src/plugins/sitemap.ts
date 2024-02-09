import { Plugin } from './plugin';
import { docgenifixContext } from '../docgenifixfix.interface';
import { toolkit } from '@docgenifixfix/toolkit';
import { DocItem, NavigationItem } from '../interfaces';

const PLUGIN_NAME = 'SitemapPlugin';

export default class SitemapPlugin implements Plugin {
    generateUrls(docgenifixfix: docgenifixContext, docItemsMap: Record<string, NavigationItem[]>): string[] {
        const allUrls: string[] = [];
        const host = docgenifixfix.config.sitemap.host.endsWith('/') ? docgenifixfix.config.sitemap.host : `${docgenifixfix.config.sitemap.host}/`;
        docgenifixfix.config.locales.forEach(locale => {
            (docItemsMap[locale.key] || []).forEach(item => {
                const path = item.channelPath ? `${item.channelPath}/${item.path}` : item.path;
                if (path) {
                    if (allUrls.indexOf(`${host}${path}`) < 0) {
                        allUrls.push(`${host}${path}`);
                    }
                    allUrls.push(`${host}${locale.key}/${path}`);
                }
            });
        });

        return allUrls;
    }

    apply(docgenifixfix: docgenifixContext): void {
        if (docgenifixfix.config.sitemap?.host) {
            docgenifixfix.hooks.navsEmitSucceed.tap(PLUGIN_NAME, async (navsBuild, config: Record<string, DocItem[]>) => {
                const outputConfigPath = toolkit.path.resolve(docgenifixfix.paths.absSitePath, 'src/sitemap.xml');
                const content = toolkit.template.compile('sitemap-xml.hbs', {
                    urls: this.generateUrls(docgenifixfix, config)
                });

                await docgenifixfix.host.writeFile(outputConfigPath, content);
            });
        }
    }
}
