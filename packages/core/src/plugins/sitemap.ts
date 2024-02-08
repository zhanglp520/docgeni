import { Plugin } from './plugin';
import { DocgeniContext } from '../docgenifix.interface';
import { toolkit } from '@docgenifix/toolkit';
import { DocItem, NavigationItem } from '../interfaces';

const PLUGIN_NAME = 'SitemapPlugin';

export default class SitemapPlugin implements Plugin {
    generateUrls(docgenifix: DocgeniContext, docItemsMap: Record<string, NavigationItem[]>): string[] {
        const allUrls: string[] = [];
        const host = docgenifix.config.sitemap.host.endsWith('/') ? docgenifix.config.sitemap.host : `${docgenifix.config.sitemap.host}/`;
        docgenifix.config.locales.forEach(locale => {
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

    apply(docgenifix: DocgeniContext): void {
        if (docgenifix.config.sitemap?.host) {
            docgenifix.hooks.navsEmitSucceed.tap(PLUGIN_NAME, async (navsBuild, config: Record<string, DocItem[]>) => {
                const outputConfigPath = toolkit.path.resolve(docgenifix.paths.absSitePath, 'src/sitemap.xml');
                const content = toolkit.template.compile('sitemap-xml.hbs', {
                    urls: this.generateUrls(docgenifix, config)
                });

                await docgenifix.host.writeFile(outputConfigPath, content);
            });
        }
    }
}
