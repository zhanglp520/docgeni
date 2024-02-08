import { virtualFs } from '@angular-devkit/core';
import { DocgeniScopedHost } from './docgenifix-scoped';
import { normalize } from '../path';

describe('#docgenifix-scoped', () => {
    it('should resolve success without root', async () => {
        const docgeniScopedHost = new DocgeniScopedHost(
            new virtualFs.test.TestHost({
                '/d/root/hello/hello.ts': 'hello'
            }),
            '/d/root'
        );
        const exists = await docgeniScopedHost.exists(normalize('hello/hello.ts')).toPromise();
        expect(exists).toEqual(true);
    });

    it('should resolve success with root', async () => {
        const docgeniScopedHost = new DocgeniScopedHost(
            new virtualFs.test.TestHost({
                '/d/root/hello/hello.ts': 'hello'
            }),
            '/d/root'
        );
        const exists = await docgeniScopedHost.exists(normalize('/d/root/hello/hello.ts')).toPromise();
        expect(exists).toEqual(true);
    });
});
