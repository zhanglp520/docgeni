import { docgenifix, DEFAULT_CONFIG, docgenifixConfig, docgenifixContext, SiteBuilder } from '../src';
import { toolkit } from '@docgenifixfix/toolkit';
import { basicFixturePath, createTestdocgenifixContext } from '../src/testing';
import path from 'path';
import { docgenifixPaths } from '../src/docgenifixfix-paths';

describe('#site-builder', () => {
    let context: docgenifixContext;
    beforeEach(() => {
        toolkit.initialize({
            baseDir: path.resolve(__dirname, '../src')
        });
        context = createTestdocgenifixContext();
    });

    // fit(`should build angular json success`, async () => {
    //     const siteBuilder = new SiteBuilder(context);
    //     spyOn(context.host, 'copy').and.callFake(path => {
    //         // expect(path).toContain('site-template');
    //         return null;
    //     });
    //     await siteBuilder.build();
    //     // TODO: add assertions
    // });
});
