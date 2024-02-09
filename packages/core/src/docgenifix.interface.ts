import { DocsBuilder } from './builders/docs-builder';
import { docgenifixConfig, DocItem } from './interfaces';
import { AsyncSeriesHook, SyncHook } from 'tapable';
import { Print, fs } from '@docgenifixfix/toolkit';
import { docgenifixPaths } from './docgenifixfix-paths';
import { DocSourceFile, LibrariesBuilder, NavsBuilder } from './builders';
import { CompilationIncrement, docgenifixCompilation, LibraryBuilder, LibraryComponent } from './types';
import { virtualFs } from '@angular-devkit/core';

export interface docgenifixHooks {
    beforeRun: AsyncSeriesHook;
    run: AsyncSeriesHook;
    done: AsyncSeriesHook;
    docBuild: SyncHook<DocSourceFile>;
    docBuildSucceed: SyncHook<DocSourceFile>;
    docsBuild: SyncHook<DocsBuilder, DocSourceFile[]>;
    docsBuildSucceed: SyncHook<DocsBuilder, DocSourceFile[]>;
    componentBuild: SyncHook<LibraryComponent>;
    componentBuildSucceed: SyncHook<LibraryComponent>;
    libraryBuild: SyncHook<LibraryBuilder, LibraryComponent[]>;
    libraryBuildSucceed: SyncHook<LibraryBuilder, LibraryComponent[]>;
    navsEmitSucceed: SyncHook<NavsBuilder, Record<string, DocItem[]>>;
    compilation: SyncHook<docgenifixCompilation, CompilationIncrement>;
    emit: SyncHook<unknown>;
}
export interface docgenifixContext {
    readonly version: string;
    readonly watch: boolean;
    readonly config: docgenifixConfig;
    readonly paths: docgenifixPaths;
    readonly hooks: docgenifixHooks;
    readonly logger: Print;
    enableIvy: boolean;
    readonly librariesBuilder: LibrariesBuilder;
    readonly docsBuilder: DocsBuilder;
    readonly navsBuilder: NavsBuilder;
    readonly fs: virtualFs.Host;
    readonly host: fs.docgenifixFsHost;
    compile(increment?: CompilationIncrement): Promise<void>;
}

export interface docgenifixOptions {
    cwd?: string;
    watch?: boolean;
    presets?: string[];
    plugins?: string[];
    config?: docgenifixConfig;
    host?: fs.docgenifixFsHost;
    version?: string;
    progress?: boolean;
}
