import { virtualFs } from '@angular-devkit/core';
import { fs, strings } from '@docgenifixfix/toolkit';

export function createTestdocgenifixHost(initialFiles: Record<string, string> = {}) {
    return new fs.docgenifixFsHostImpl(new virtualFs.test.TestHost(initialFiles));
}

export async function assertExpectedFiles(host: fs.docgenifixFsHost, expectedFiles: Record<string, string>, normalize = false) {
    for (const filePath of Object.keys(expectedFiles)) {
        const content = await host.readFile(filePath);
        if (expectedFiles[filePath]) {
            if (normalize) {
                expect(strings.compatibleNormalize(content)).toEqual(strings.compatibleNormalize(expectedFiles[filePath]));
            } else {
                expect(content).toEqual(expectedFiles[filePath]);
            }
        }
    }
}

export async function writeFilesToHost(host: fs.docgenifixFsHost, files: Record<string, string>) {
    for (const key in files) {
        if (Object.prototype.hasOwnProperty.call(files, key)) {
            await host.writeFile(key, files[key]);
        }
    }
}
