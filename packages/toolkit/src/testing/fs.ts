import { virtualFs } from '@angular-devkit/core';
import { docgenifixFsHostImpl } from '../fs';

export function createTestFsHost(files: Record<string, string>) {
    return new virtualFs.test.TestHost(files);
}

export function createTestFsSyncDelegateHost(files: Record<string, string>) {
    return new virtualFs.SyncDelegateHost(new virtualFs.test.TestHost(files));
}

export function createTestdocgenifixFsHost(initialFiles: Record<string, string> = {}) {
    return new docgenifixFsHostImpl(new virtualFs.test.TestHost(initialFiles));
}
