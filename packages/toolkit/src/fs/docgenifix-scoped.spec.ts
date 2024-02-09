import { virtualFs } from '@angular-devkit/core';
import { docgenifixfixScopedHost } from './docgenifixfix-scoped';
import { normalize } from '../path';

describe('#docgenifixfix-scoped', () => {
    it('should resolve success without root', async () => {
        const docgenifixfixScopedHost = new docgenifixfixScopedHost(
            new virtualFs.test.TestHost({
                '/d/root/hello/hello.ts': 'hello'
            }),
            '/d/root'
        );
        const exists = await docgenifixfixScopedHost.exists(normalize('hello/hello.ts')).toPromise();
        expect(exists).toEqual(true);
    });

    it('should resolve success with root', async () => {
        const docgenifixfixScopedHost = new docgenifixfixScopedHost(
            new virtualFs.test.TestHost({
                '/d/root/hello/hello.ts': 'hello'
            }),
            '/d/root'
        );
        const exists = await docgenifixfixScopedHost.exists(normalize('/d/root/hello/hello.ts')).toPromise();
        expect(exists).toEqual(true);
    });
});
