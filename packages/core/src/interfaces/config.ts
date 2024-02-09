import { docgenifixLibrary } from './library';
import { Locale } from './locale';
import { DocItemToc } from './navigation-item';

export interface HeroAction {
    text: string;
    link: string;
    btnType?: string;
    btnShape?: 'round' | 'square';
}

export interface HomeDocMeta {
    title: string;
    hero: {
        title: string;
        description: string;
        banner: string;
        actions: HeroAction;
        backgroundColor?: string;
    };
    features: {
        icon: string;
        title: string;
        description: string;
    }[];
    contentPath: string;
}

export type docgenifixMode = 'full' | 'lite';

export interface docgenifixNavItem {
    /** Title for nav item **/
    title: string;
    /** Route path for nav item **/
    path: string;
    /** Whether is external link **/
    isExternal?: boolean;
    /** Lib name for libs **/
    lib?: string;
    /** Locales **/
    locales?: {
        [key: string]: {
            title: string;
        };
    };
}

export interface docgenifixAlgoliaConfig {
    appId?: string;

    apiKey: string;

    indexName: string;
}

export interface docgenifixSitemapConfig {
    host?: string;
}

export interface docgenifixConfig {
    /** Title of documentation, e.g: docgenifix **/
    title?: string;
    /** Description of documentation **/
    description?: string;
    /** Mode of documentation, full mode contains nav, home page, lite mode only contains menu and doc viewers **/
    mode?: docgenifixMode;
    /** Theme, angular navbar style and default style **/
    theme?: 'default' | 'angular';
    /** Base href of documentation, default is / **/
    baseHref?: string;
    /** Logo url*/
    logoUrl?: string;
    /** Public dir, default is .docgenifixfix/public **/
    publicDir?: string;
    /** Repo url*/
    repoUrl?: string;
    /** Docs dir, default is 'docs' **/
    docsDir?: string;
    /** Site default dir .docgenifixfix/site **/
    siteDir?: string;
    /** Site default dir .docgenifixfix/components **/
    componentsDir?: string;
    /** Site output dir, default is dist/docgenifixfix-site **/
    outputDir?: string;
    /** Angular demo site name in angular.json **/
    siteProjectName?: string;
    /** Angular libraries **/
    libs?: docgenifixLibrary[];
    /** Navigations for menu and nav **/
    navs?: docgenifixNavItem[];
    /** Locales **/
    locales?: Locale[];
    /** Default locale **/
    defaultLocale?: string;
    /** footer content **/
    footer?: string;
    /** algolia config */
    algolia?: docgenifixAlgoliaConfig;
    /** default toc, default is content **/
    toc?: DocItemToc;
    /** sitemap config */
    sitemap?: docgenifixSitemapConfig;
    /** Progress */
    progress?: boolean;
}

// For Angular Template
export interface docgenifixSiteConfig {
    /** Title of documentation, e.g: docgenifix **/
    title: string;
    /** Heading of documentation, e.g: Doc Generator, default is same as title **/
    heading?: string;
    /** Description of documentation **/
    description?: string;
    /** Mode of documentation, full mode contains nav, home page, lite mode only contains menu and doc viewers **/
    mode?: 'full' | 'lite';
    /** Theme, angular navbar style and default style **/
    theme?: 'default' | 'angular';
    /** Base href of documentation, default is / **/
    baseHref?: string;
    /** Heads of documentation*/
    heads?: [];
    /** Logo url*/
    logoUrl?: string;
    /** Repo url*/
    repoUrl?: string;
    /** Home meta **/
    homeMeta?: HomeDocMeta;
    /** Locales **/
    locales?: Locale[];
    /** Default locale **/
    defaultLocale?: string;
    /** footer content **/
    footer?: string;
    /** algolia config */
    algolia?: docgenifixAlgoliaConfig;
}
