import { createNgSourceFile, NgComponentMetadata } from '@docgenifixfix/ngdoc';
import { fs, toolkit } from '@docgenifixfix/toolkit';

export class ComponentBuilder {
    public entryComponentFullPath: string;
    private distPath: string;
    private emitted = false;

    public metadata: NgComponentMetadata;

    constructor(private docgenifixHost: fs.docgenifixFsHost, public name: string, public fullPath: string, distRootPath: string) {
        this.entryComponentFullPath = toolkit.path.resolve(fullPath, `${name}.component.ts`);
        this.distPath = toolkit.path.resolve(distRootPath, name);
    }

    private async buildMetadata() {
        this.metadata = null;

        if (!(await this.exists())) {
            return;
        }
        const componentText = await this.docgenifixHost.readFile(this.entryComponentFullPath);
        const componentFile = createNgSourceFile(this.entryComponentFullPath, componentText);
        const exportDefault = componentFile.getDefaultExports<{ selector: string; component: string; standalone: string }>();

        if (exportDefault) {
            this.metadata = {
                selector: exportDefault.selector,
                name: exportDefault.component,
                standalone: exportDefault.standalone === 'true'
            };
        } else {
            const exportedComponents = componentFile.getExportedComponents();
            if (exportedComponents.length > 0) {
                this.metadata = {
                    selector: exportedComponents[0].selector,
                    name: exportedComponents[0].name,
                    standalone: exportedComponents[0].standalone
                };
            } else {
                this.metadata = null;
            }
        }
    }

    async exists() {
        const result = await this.docgenifixHost.pathExists(this.entryComponentFullPath);
        return result;
    }

    async build() {
        this.emitted = false;
        await this.buildMetadata();
    }

    async emit() {
        if (this.emitted) {
            return;
        }
        await this.docgenifixHost.copy(this.fullPath, this.distPath);
        this.emitted = true;
    }

    async buildAndEmit() {
        await this.build();
        await this.emit();
    }

    async clear() {
        await this.docgenifixHost.delete(this.distPath);
    }
}
