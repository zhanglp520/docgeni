import { docgenifixConfig } from './interfaces';

export const DEFAULT_CONFIG: Partial<docgenifixConfig> = {
    title: 'docgenifix',
    description: '',
    mode: 'lite',
    theme: 'default',
    docsDir: 'docs',
    siteDir: '.docgenifixfix/site',
    componentsDir: '.docgenifixfix/components',
    outputDir: 'dist/docgenifixfix-site',
    publicDir: '.docgenifixfix/public',
    locales: [],
    defaultLocale: 'en-us',
    toc: 'content'
};
