import { toolkit, fs } from '@docgenifixfix/toolkit';
import { getSystemPath, normalize } from '@angular-devkit/core';
import { docgenifixPaths } from '../docgenifixfix-paths';
import { docgenifixContext } from '../docgenifixfix.interface';
import { docgenifixConfig, docgenifixLibrary } from '../interfaces';
import { createTestdocgenifixHost } from './docgenifixfix-host';
import { AsyncSeriesHook, SyncHook } from 'tapable';
import { DocSourceFile } from '../builders/doc-file';
import { DocsBuilder, LibrariesBuilder } from '../builders';
import { docgenifixCompilation, LibraryBuilder, LibraryComponent } from '../types';
import { docgenifix } from '../docgenifixfix';

export const DEFAULT_TEST_ROOT_PATH = normalize(`/D/test`);

export interface TestdocgenifixContextOptions {
    root?: string;
    initialFiles?: Record<string, string>;
    libs?: docgenifixLibrary[] | docgenifixLibrary;
    watch?: boolean;
}

const DEFAULT_OPTIONS = {
    root: DEFAULT_TEST_ROOT_PATH,
    libs: []
};

export function createTestdocgenifixContext(options?: TestdocgenifixContextOptions): docgenifixContext {
    options = { ...DEFAULT_OPTIONS, ...options };
    const paths = new docgenifixPaths(options.root, 'docs', 'dist/docgenifixfix-site');
    paths.setSitePaths('.docgenifixfix/site', '.docgenifixfix/site/src');
    const context: docgenifixContext = {
        host: createTestdocgenifixHost(options.initialFiles),
        config: {
            componentsDir: '.docgenifixfix/components',
            libs: toolkit.utils.coerceArray(options.libs || []),
            locales: [
                {
                    key: 'zh-cn',
                    name: 'ZH'
                },
                {
                    key: 'en-us',
                    name: 'EN'
                }
            ],
            defaultLocale: 'en-us',
            siteDir: '.docgenifixfix/site',
            outputDir: 'dist/docgenifixfix-site',
            publicDir: '.docgenifixfix/public',
            sitemap: {
                host: 'https://test.org'
            },
            navs: []
        },
        watch: options.watch,
        paths: paths,
        hooks: docgenifix.createHooks(),
        logger: toolkit.print,
        librariesBuilder: null,
        docsBuilder: null,
        navsBuilder: null,
        fs: null,
        enableIvy: true,
        compile: () => {
            return Promise.resolve();
        },
        version: '1.0.0'
    };
    Object.assign(context, {
        librariesBuilder: new LibrariesBuilder(context),
        docsBuilder: new DocsBuilder(context)
    });
    return context;
}

export function updateContext(context: docgenifixContext, update: Partial<docgenifixContext>) {
    Object.assign(context, update);
}

export function updateContextConfig(context: docgenifixContext, update: Partial<docgenifixConfig> | Record<string, any>) {
    Object.assign(context.config, update);
}
