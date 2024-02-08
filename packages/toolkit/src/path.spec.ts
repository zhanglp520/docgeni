import { getTSSystemPath, normalizeSlashes } from './path';

describe('#path', () => {
    describe('#normalizeSlashes', () => {
        it('should normalize slashes', () => {
            expect(normalizeSlashes('a')).toEqual('a');
            expect(normalizeSlashes('a/b')).toEqual('a/b');
            expect(normalizeSlashes('a\\b')).toEqual('a/b');
            expect(normalizeSlashes('\\\\server\\path')).toEqual('//server/path');
            expect(normalizeSlashes(`D:\\a\\docgenifix`)).toEqual('D:/a/docgenifix');
            // expect(normalizeSlashes(`D:\\a\docgenifix`)).toEqual('D:/a/docgenifix');
        });
    });

    describe('#getTSSystemPath', () => {
        it('should getTSSystemPath', () => {
            expect(getTSSystemPath('a')).toEqual('a');
            expect(normalizeSlashes('a/b')).toEqual('a/b');
            expect(normalizeSlashes('a\\b')).toEqual('a/b');
            expect(normalizeSlashes('\\\\server\\path')).toEqual('//server/path');
            expect(normalizeSlashes(`D:\\a\\docgenifix`)).toEqual('D:/a/docgenifix');
        });
    });

});
