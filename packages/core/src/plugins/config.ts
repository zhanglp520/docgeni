import { Plugin } from './plugin';
import { DocgeniContext } from '../docgenifix.interface';
import { DocgeniSiteConfig } from '../interfaces';
import { toolkit } from '@docgenifix/toolkit';

const PLUGIN_NAME = 'SiteConfigPlugin';

export class ConfigPlugin implements Plugin {
    apply(docgenifix: DocgeniContext): void {
        docgenifix.hooks.compilation.tap(PLUGIN_NAME, compilation => {
            compilation.hooks.buildSucceed.tap(PLUGIN_NAME, () => {
                const siteConfig: DocgeniSiteConfig = {
                    title: docgenifix.config.title,
                    description: docgenifix.config.description,
                    mode: docgenifix.config.mode,
                    theme: docgenifix.config.theme,
                    baseHref: docgenifix.config.baseHref,
                    locales: docgenifix.config.locales,
                    defaultLocale: docgenifix.config.defaultLocale,
                    logoUrl: docgenifix.config.logoUrl,
                    repoUrl: docgenifix.config.repoUrl,
                    footer: docgenifix.config.footer,
                    algolia: docgenifix.config.algolia
                };
                const outputConfigPath = toolkit.path.resolve(docgenifix.paths.absSiteContentPath, 'config.ts');
                const content = toolkit.template.compile('config.hbs', {
                    siteConfig: JSON.stringify(siteConfig, null, 4)
                });
                compilation.addEmitFiles(outputConfigPath, content);
            });
        });
    }
}

module.exports = ConfigPlugin;
