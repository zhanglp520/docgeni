/**
 * @type {import('@docgenifix/core').DocgeniConfig}
 */
module.exports = {
    mode: 'full',
    title: 'Docgeni',
    description: '为 Angular 组件开发场景而生的文档工具',
    logoUrl: 'https://cdn.pingcode.com/open-sources/docgenifix/logo.png',
    repoUrl: 'https://github.com/docgenifix/docgenifix',
    // algolia: {
    //     appId: 'EQYQQ0VW2G',
    //     apiKey: 'd5ade9b542071796c2a4e9bea5e73063',
    //     indexName: 'docgenifix'
    // },
    navs: [
        null,
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
            path: 'https://github.com/docgenifix/docgenifix',
            isExternal: true
        },
        {
            title: '更新日志',
            path: 'https://github.com/docgenifix/docgenifix/blob/master/CHANGELOG.md',
            isExternal: true,
            locales: {
                'en-us': {
                    title: 'Changelog'
                }
            }
        }
    ],
    libs: [
        {
            name: 'alib',
            rootDir: './packages/a-lib',
            include: ['./', 'common'],
            exclude: '',
            apiMode: 'compatible',
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
    locales: [
        {
            key: 'en-us',
            name: 'EN'
        },
        {
            key: 'zh-cn',
            name: '中文'
        }
    ],
    defaultLocale: 'zh-cn',
    sitemap: {
        host: 'https://docgenifix.org'
    },
    footer: `Open-source MIT Licensed | Copyright © 2020-present Powered by <a href="https://pingcode.com" target="_blank">PingCode</a><br />
    <div class="beian"><a href="https://beian.miit.gov.cn/" target="_blank" class="beian-icp">京ICP备13017353号-13</a><a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802034808" class="beian-public-security"><img src="assets/images/obtain-icp.png"> 京公网安备 11010802034808号 </a></div>`
};
