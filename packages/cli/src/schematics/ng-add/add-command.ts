import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { JSONFile } from '@schematics/angular/utility/json-file';
export class AddCommand {
    constructor() {}
    run() {
        return (host: Tree, context: SchematicContext) => {
            if (host.exists('package.json')) {
                const packageJson = new JSONFile(host, 'package.json');
                packageJson.modify(['scripts', 'start:docs'], `docgenifix serve --port 4600`);
                packageJson.modify(['scripts', 'build:docs'], `docgenifix build`);
            }
            return host;
        };
    }
}
