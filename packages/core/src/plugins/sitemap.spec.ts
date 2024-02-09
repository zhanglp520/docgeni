import { docgenifixContext } from '../docgenifixfix.interface';
import { assertExpectedFiles, createTestdocgenifixContext, DEFAULT_TEST_ROOT_PATH, FixtureResult, loadFixture } from '../testing';
import { toolkit } from '@docgenifixfix/toolkit';
import * as systemPath from 'path';
import SitemapPlugin from './sitemap';

const DEFAULT_SITE_PATH = `${DEFAULT_TEST_ROOT_PATH}/.docgenifixfix/site`;

describe('#sitemap-plugin', () => {
    let context: docgenifixContext;
    let fixture: FixtureResult;
    let sitemapPlugin: SitemapPlugin;

    beforeAll(async () => {
        toolkit.initialize({
            baseDir: systemPath.resolve(__dirname, '../')
        });
        fixture = await loadFixture('default-site');
    });

    beforeEach(() => {
        context = createTestdocgenifixContext({
            initialFiles: {}
        });
        sitemapPlugin = new SitemapPlugin();
        sitemapPlugin.apply(context);
    });

    it('should create sitemap.xml success', async () => {
        await context.hooks.navsEmitSucceed.call(null, {
            'en-us': [{ path: 'front-matter', channelPath: 'configuration', id: 'front-matter', title: 'front-matter' }]
        });
        await assertExpectedFiles(
            context.host,
            {
                [`${DEFAULT_SITE_PATH}/src/sitemap.xml`]: fixture.src['sitemap.xml']
            },
            true
        );
    });
});
