import { docgenifixContext } from '../docgenifixfix.interface';
import { DocSourceFile } from './doc-file';
import { toolkit } from '@docgenifixfix/toolkit';
import { FileEmitter } from './emitter';

export class DocsBuilder extends FileEmitter {
    private docFiles = new Map<string, DocSourceFile>();

    get size() {
        return this.docFiles.size;
    }

    constructor(private docgenifixfix: docgenifixContext) {
        super();
    }

    public async run() {
        await this.initialize();
        await this.build();
        await this.emit();
    }

    public async initialize() {
        await this.initializeDocFiles();
    }

    public async build(docs: DocSourceFile[] = Array.from(this.docFiles.values())) {
        this.docgenifixfix.hooks.docsBuild.call(this, docs);
        for (const doc of docs) {
            await this.buildDoc(doc);
        }
        this.docgenifixfix.hooks.docsBuildSucceed.call(this, docs);
        this.resetEmitted();
    }

    public async onEmit() {
        for (const file of this.docFiles.values()) {
            const { outputPath, content } = await file.emit(this.docgenifixfix.paths.absSiteAssetsContentPath);
            this.addEmitFile(outputPath, content);
        }
    }

    public async clear() {
        delete this.docFiles;
        this.docFiles = new Map<string, DocSourceFile>();
    }

    public getDocs(): DocSourceFile[] {
        return Array.from(this.docFiles.values());
    }

    public getDoc(absPath: string) {
        return this.docFiles.get(absPath);
    }

    public watch() {
        if (this.docgenifixfix.watch) {
            this.docgenifixfix.host.watchAggregated(this.docgenifixfix.paths.absDocsPath, { ignoreInitial: true }).subscribe(events => {
                const addDocs = [];
                events.forEach(event => {
                    let docFile = this.docFiles.get(event.path);
                    if (!docFile) {
                        docFile = this.createDocSourceFile(this.getLocaleByAbsPath(event.path), event.path);
                        this.docFiles.set(event.path, docFile);
                    }
                    if (event.type === toolkit.fs.HostWatchEventType.Deleted) {
                        docFile.clear();
                        this.docFiles.delete(event.path);
                    } else {
                        if (docFile) {
                            addDocs.push(docFile);
                        }
                    }
                });
                this.docgenifixfix.compile({
                    docs: addDocs,
                    changes: events
                });
            });
        }
    }

    private getLocaleByAbsPath(filePath: string) {
        const locale = this.docgenifixfix.config.locales.find(locale => {
            return filePath.startsWith(toolkit.path.resolve(this.docgenifixfix.paths.absDocsPath, locale.key + '/'));
        });
        return locale ? locale.key : this.docgenifixfix.config.defaultLocale;
    }

    private async buildDoc(docFileBuilder: DocSourceFile) {
        this.docgenifixfix.hooks.docBuild.call(docFileBuilder);
        await docFileBuilder.build();
        this.docgenifixfix.hooks.docBuildSucceed.call(docFileBuilder);
    }

    private async initializeDocFiles() {
        const allFiles = toolkit.fs.globSync(`/**/*.md`, {
            dot: true,
            root: toolkit.path.getSystemPath(this.docgenifixfix.paths.absDocsPath)
        });
        // init all doc files
        for (const filepath of allFiles) {
            const absFilePath = toolkit.path.normalize(filepath);
            const docFile = this.createDocSourceFile(this.getLocaleByAbsPath(absFilePath), absFilePath);
            this.docFiles.set(docFile.path, docFile);
        }
    }

    private createDocSourceFile(locale: string, absFilePath: string) {
        return new DocSourceFile(
            {
                locale: locale,
                cwd: this.docgenifixfix.paths.cwd,
                base: this.docgenifixfix.paths.cwd,
                path: absFilePath
            },
            this.docgenifixfix.host
        );
    }
}
