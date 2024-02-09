import { docgenifix, DEFAULT_CONFIG, docgenifixConfig } from '../src';
import { toolkit } from '@docgenifixfix/toolkit';
import { createTestdocgenifixHost, expectThrowAsync } from '../src/testing';
import { docgenifixHost } from '../src/docgenifixfix-host';
import { virtualFs, normalize, getSystemPath } from '@angular-devkit/core';

describe('#config', () => {
    let docgenifixHost: docgenifixHost;
    beforeEach(() => {
        docgenifixHost = createTestdocgenifixHost({
            'docs/getting-started.md': 'Getting Started'
        });
    });

    describe('normalize', () => {
        it('should normalize default config success', async () => {
            const docgenifixfix = new docgenifix({});
            expect(docgenifixfix.config.defaultLocale).toEqual(DEFAULT_CONFIG.defaultLocale);
            expect(docgenifixfix.config.title).toEqual(DEFAULT_CONFIG.title);
            expect(docgenifixfix.config.description).toEqual(DEFAULT_CONFIG.description);
            expect(docgenifixfix.config.mode).toEqual(DEFAULT_CONFIG.mode);
            expect(docgenifixfix.config.theme).toEqual(DEFAULT_CONFIG.theme);
            expect(docgenifixfix.config.docsDir).toEqual(DEFAULT_CONFIG.docsDir);
            expect(docgenifixfix.config.siteDir).toEqual(DEFAULT_CONFIG.siteDir);
            expect(docgenifixfix.config.publicDir).toEqual(DEFAULT_CONFIG.publicDir);
            expect(docgenifixfix.config.outputDir).toEqual(DEFAULT_CONFIG.outputDir);
            expect(docgenifixfix.config.libs).toEqual([]);
            expect(docgenifixfix.config.locales).toEqual([
                {
                    name: DEFAULT_CONFIG.defaultLocale,
                    key: DEFAULT_CONFIG.defaultLocale
                }
            ]);

            expect(docgenifixfix.config).toEqual({
                title: 'docgenifix',
                description: '',
                mode: 'lite',
                theme: 'default',
                docsDir: 'docs',
                siteDir: '.docgenifixfix/site',
                componentsDir: '.docgenifixfix/components',
                outputDir: 'dist/docgenifixfix-site',
                publicDir: '.docgenifixfix/public',
                locales: [{ name: 'en-us', key: 'en-us' }],
                defaultLocale: 'en-us',
                libs: [],
                navs: [],
                toc: 'content'
            });
        });

        it('should get correct config when input custom config', () => {
            const customConfig: docgenifixConfig = {
                title: toolkit.strings.generateRandomId(),
                description: toolkit.strings.generateRandomId(),
                mode: 'full',
                theme: 'angular',
                baseHref: '/',
                docsDir: toolkit.strings.generateRandomId(),
                siteDir: toolkit.strings.generateRandomId(),
                componentsDir: toolkit.strings.generateRandomId(),
                outputDir: `dist/${toolkit.strings.generateRandomId()}`,
                publicDir: `.docgenifixfix/${toolkit.strings.generateRandomId()}`,
                locales: [
                    { key: 'en-us', name: 'EN' },
                    { key: 'zh-cn', name: '中文' },
                    { key: 'zh-tw', name: '繁体' }
                ],
                defaultLocale: 'zh-tw',
                libs: [
                    {
                        name: 'alib',
                        rootDir: './packages/a-lib',
                        include: ['common'],
                        exclude: '',
                        categories: [
                            {
                                id: 'general',
                                title: '通用',
                                locales: {
                                    'en-us': {
                                        title: 'General'
                                    }
                                }
                            },
                            {
                                id: 'layout',
                                title: '布局',
                                locales: {
                                    'en-us': {
                                        title: 'Layout'
                                    }
                                }
                            }
                        ]
                    }
                ],
                navs: [
                    {
                        title: '组件',
                        path: 'components',
                        lib: 'alib',
                        locales: {
                            'en-us': {
                                title: 'Components'
                            }
                        }
                    },
                    {
                        title: 'GitHub',
                        path: 'https://github.com/docgenifixfix/docgenifixfix',
                        isExternal: true
                    }
                ],
                footer: 'Open-source MIT Licensed | Copyright © 2020-present Powered by PingCode',
                toc: 'menu'
            };
            const docgenifixfix = new docgenifix({
                config: customConfig
            });

            expect(docgenifixfix.config).toEqual({
                ...customConfig
            });
        });

        it('should use custom locales', () => {
            const docgenifixfix = new docgenifix({
                config: {
                    locales: [
                        {
                            key: 'en-us',
                            name: 'EN'
                        }
                    ]
                }
            });
            expect(docgenifixfix.config.locales).toEqual([
                {
                    key: 'en-us',
                    name: 'EN'
                }
            ]);
        });
    });

    describe('verify', () => {
        it('should throw error when default locale is not in locales', async () => {
            await expectThrowAsync(async () => {
                await new docgenifix({
                    config: {
                        locales: [
                            {
                                key: 'en-us',
                                name: 'EN'
                            }
                        ],
                        defaultLocale: 'zh-cn'
                    }
                }).verifyConfig();
            }, `default locale(zh-cn) is not in locales`);
        });

        it('should throw error when default locale has not in locales', async () => {
            await expectThrowAsync(async () => {
                docgenifixHost.writeFile(`${process.cwd()}/docs/index.md`, 'content');
                const docgenifixfix = new docgenifix({
                    config: {
                        locales: [
                            {
                                key: 'en-us',
                                name: 'EN'
                            }
                        ],
                        defaultLocale: 'zh-cn'
                    },
                    host: docgenifixHost
                });
                await docgenifixfix.verifyConfig();
            }, `default locale(zh-cn) is not in locales`);
        });

        it('should throw error when doc dir has not exists', async () => {
            const notFoundPath = 'not-found/path';
            const expectFullPath = normalize(`${process.cwd()}/${notFoundPath}`);
            await expectThrowAsync(async () => {
                const docgenifixfix = new docgenifix({
                    config: {
                        docsDir: notFoundPath
                    },
                    host: docgenifixHost
                });
                await docgenifixfix.verifyConfig();
            }, `docs dir(${notFoundPath}) has not exists, full path: ${getSystemPath(expectFullPath)}`);
            docgenifixHost.writeFile(`${process.cwd()}/${notFoundPath}/index.md`, 'content');
            await new docgenifix({
                config: {
                    docsDir: notFoundPath
                },
                host: docgenifixHost
            }).verifyConfig();
        });

        // it('should throw error when siteProject is not found', async () => {
        //     const notFoundProject = 'not-found-project-name';

        //     await expectThrowAsync(async () => {
        //         const docgenifixfix = new docgenifix({
        //             config: {
        //                 siteProjectName: notFoundProject
        //             },
        //             host: docgenifixHost
        //         });
        //         await docgenifixfix.run();
        //     }, `site project name(${notFoundProject}) is not exists`);
        // });

        it('should throw error when mode is not match', async () => {
            await expectThrowAsync(async () => {
                const docgenifixfix = new docgenifix({
                    config: {
                        mode: 'full1' as any
                    },
                    host: docgenifixHost
                });
                await docgenifixfix.verifyConfig();
            }, `mode must be full or lite, current is full1`);
        });
    });
});
