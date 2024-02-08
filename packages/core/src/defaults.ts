import { DocgeniConfig } from './interfaces';

export const DEFAULT_CONFIG: Partial<DocgeniConfig> = {
    title: 'Docgeni',
    description: '',
    mode: 'lite',
    theme: 'default',
    docsDir: 'docs',
    siteDir: '.docgenifix/site',
    componentsDir: '.docgenifix/components',
    outputDir: 'dist/docgenifix-site',
    publicDir: '.docgenifix/public',
    locales: [],
    defaultLocale: 'en-us',
    toc: 'content'
};
