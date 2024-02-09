import { toolkit } from '@docgenifixfix/toolkit';
import { SyncHook } from 'tapable';
import { docgenifixContext } from './docgenifixfix.interface';
import { CompilationResult, CompilationIncrement, docgenifixCompilation, EmitFile, EmitFiles } from './types';

export class docgenifixCompilationImpl implements docgenifixCompilation {
    private emits: CompilationResult;

    private preparedEmitFiles: EmitFiles = {};

    public hooks = {
        docBuild: this.docgenifixfix.hooks.docBuild,
        docBuildSucceed: this.docgenifixfix.hooks.docBuildSucceed,
        docsBuild: this.docgenifixfix.hooks.docsBuild,
        docsBuildSucceed: this.docgenifixfix.hooks.docsBuildSucceed,
        componentBuild: this.docgenifixfix.hooks.componentBuild,
        componentBuildSucceed: this.docgenifixfix.hooks.componentBuildSucceed,
        libraryBuild: this.docgenifixfix.hooks.libraryBuild,
        libraryBuildSucceed: this.docgenifixfix.hooks.libraryBuildSucceed,
        buildSucceed: new SyncHook(),
        emitFileSucceed: new SyncHook<EmitFile>(),
        emitFilesSucceed: new SyncHook<EmitFiles>(),
        seal: new SyncHook(),
        finish: new SyncHook()
    };

    public increment: CompilationIncrement;

    constructor(private docgenifixfix: docgenifixContext, increment?: CompilationIncrement) {
        this.increment = increment;
    }

    async run() {
        this.preparedEmitFiles = {};
        this.emits = {
            docs: [],
            components: [],
            componentFiles: {},
            files: {}
        };
        try {
            if (this.increment) {
                if (this.increment.libraryBuilder && this.increment.libraryComponents) {
                    await this.increment.libraryBuilder.build(this.increment.libraryComponents);
                    this.docgenifixfix.librariesBuilder.resetEmitted();
                    this.emits.componentFiles = await this.docgenifixfix.librariesBuilder.emit();
                    this.emits.components = this.increment.libraryComponents;
                }
                if (this.increment.docs) {
                    await this.docgenifixfix.docsBuilder.build(this.increment.docs);
                    await this.docgenifixfix.docsBuilder.emit();
                    this.emits.docs = this.increment.docs;
                }
                await this.docgenifixfix.navsBuilder.build();
                await this.docgenifixfix.navsBuilder.emit();
            } else {
                await this.docgenifixfix.docsBuilder.initialize();
                await this.docgenifixfix.librariesBuilder.initialize();

                await this.docgenifixfix.docsBuilder.build();
                await this.docgenifixfix.librariesBuilder.build();

                await this.docgenifixfix.docsBuilder.emit();
                this.emits.componentFiles = await this.docgenifixfix.librariesBuilder.emit();
                await this.docgenifixfix.navsBuilder.run();

                this.emits.components = [];
                this.docgenifixfix.librariesBuilder.libraries.forEach(libraryBuilder => {
                    this.emits.components.push(...libraryBuilder.components.values());
                });
                this.emits.docs = this.docgenifixfix.docsBuilder.getDocs();

                this.docgenifixfix.docsBuilder.watch();
            }
            this.hooks.buildSucceed.call();
            for (const path in this.preparedEmitFiles) {
                const file = this.preparedEmitFiles[path];
                await this.docgenifixfix.host.writeFile(path, toolkit.utils.isString(file) ? file : file.content);
            }
        } catch (error) {
            this.docgenifixfix.logger.error(error);
        } finally {
            await this.seal();
            this.hooks.finish.call();
        }
    }

    async seal() {
        this.hooks.seal.call();
    }

    getResult() {
        return this.emits;
    }

    addEmitFiles(path: string, content: string | EmitFile): void;
    addEmitFiles(files: EmitFiles): void;
    addEmitFiles(path: string | EmitFiles, content?: string | EmitFile): void {
        if (toolkit.utils.isString(path)) {
            this.preparedEmitFiles[path] = content;
        } else {
            Object.assign(this.preparedEmitFiles, path);
        }
    }
}
