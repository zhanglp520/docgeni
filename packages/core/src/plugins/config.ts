import { Plugin } from './plugin';
import { docgenifixContext } from '../docgenifixfix.interface';
import { docgenifixSiteConfig } from '../interfaces';
import { toolkit } from '@docgenifixfix/toolkit';

const PLUGIN_NAME = 'SiteConfigPlugin';

export class ConfigPlugin implements Plugin {
    apply(docgenifixfix: docgenifixContext): void {
        docgenifixfix.hooks.compilation.tap(PLUGIN_NAME, compilation => {
            compilation.hooks.buildSucceed.tap(PLUGIN_NAME, () => {
                const siteConfig: docgenifixSiteConfig = {
                    title: docgenifixfix.config.title,
                    description: docgenifixfix.config.description,
                    mode: docgenifixfix.config.mode,
                    theme: docgenifixfix.config.theme,
                    baseHref: docgenifixfix.config.baseHref,
                    locales: docgenifixfix.config.locales,
                    defaultLocale: docgenifixfix.config.defaultLocale,
                    logoUrl: docgenifixfix.config.logoUrl,
                    repoUrl: docgenifixfix.config.repoUrl,
                    footer: docgenifixfix.config.footer,
                    algolia: docgenifixfix.config.algolia
                };
                const outputConfigPath = toolkit.path.resolve(docgenifixfix.paths.absSiteContentPath, 'config.ts');
                const content = toolkit.template.compile('config.hbs', {
                    siteConfig: JSON.stringify(siteConfig, null, 4)
                });
                compilation.addEmitFiles(outputConfigPath, content);
            });
        });
    }
}

module.exports = ConfigPlugin;
