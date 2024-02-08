import { toolkit } from '@docgenifix/toolkit';
import { SyncHook } from 'tapable';
import { DocgeniContext } from './docgenifix.interface';
import { CompilationResult, CompilationIncrement, DocgeniCompilation, EmitFile, EmitFiles } from './types';

export class DocgeniCompilationImpl implements DocgeniCompilation {
    private emits: CompilationResult;

    private preparedEmitFiles: EmitFiles = {};

    public hooks = {
        docBuild: this.docgenifix.hooks.docBuild,
        docBuildSucceed: this.docgenifix.hooks.docBuildSucceed,
        docsBuild: this.docgenifix.hooks.docsBuild,
        docsBuildSucceed: this.docgenifix.hooks.docsBuildSucceed,
        componentBuild: this.docgenifix.hooks.componentBuild,
        componentBuildSucceed: this.docgenifix.hooks.componentBuildSucceed,
        libraryBuild: this.docgenifix.hooks.libraryBuild,
        libraryBuildSucceed: this.docgenifix.hooks.libraryBuildSucceed,
        buildSucceed: new SyncHook(),
        emitFileSucceed: new SyncHook<EmitFile>(),
        emitFilesSucceed: new SyncHook<EmitFiles>(),
        seal: new SyncHook(),
        finish: new SyncHook()
    };

    public increment: CompilationIncrement;

    constructor(private docgenifix: DocgeniContext, increment?: CompilationIncrement) {
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
                    this.docgenifix.librariesBuilder.resetEmitted();
                    this.emits.componentFiles = await this.docgenifix.librariesBuilder.emit();
                    this.emits.components = this.increment.libraryComponents;
                }
                if (this.increment.docs) {
                    await this.docgenifix.docsBuilder.build(this.increment.docs);
                    await this.docgenifix.docsBuilder.emit();
                    this.emits.docs = this.increment.docs;
                }
                await this.docgenifix.navsBuilder.build();
                await this.docgenifix.navsBuilder.emit();
            } else {
                await this.docgenifix.docsBuilder.initialize();
                await this.docgenifix.librariesBuilder.initialize();

                await this.docgenifix.docsBuilder.build();
                await this.docgenifix.librariesBuilder.build();

                await this.docgenifix.docsBuilder.emit();
                this.emits.componentFiles = await this.docgenifix.librariesBuilder.emit();
                await this.docgenifix.navsBuilder.run();

                this.emits.components = [];
                this.docgenifix.librariesBuilder.libraries.forEach(libraryBuilder => {
                    this.emits.components.push(...libraryBuilder.components.values());
                });
                this.emits.docs = this.docgenifix.docsBuilder.getDocs();

                this.docgenifix.docsBuilder.watch();
            }
            this.hooks.buildSucceed.call();
            for (const path in this.preparedEmitFiles) {
                const file = this.preparedEmitFiles[path];
                await this.docgenifix.host.writeFile(path, toolkit.utils.isString(file) ? file : file.content);
            }
        } catch (error) {
            this.docgenifix.logger.error(error);
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
