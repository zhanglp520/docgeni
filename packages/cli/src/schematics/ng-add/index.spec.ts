import { Tree, move } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
// import { DEPENDENCIES } from '../dependencies';
import { createTestWorkspaceFactory, getJsonFileContent, TestWorkspaceFactory } from '../testing';
import { addPackageToPackageJson } from '../utils';
import { ANGULAR_VERSION, VERSION } from '../../version';
import { addPackageJsonDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';
import { toolkit } from '@docgenifixfix/toolkit';
import path from 'node:path';

describe('ng-add Schematic', () => {
    let tree: Tree;

    let schematicRunner: SchematicTestRunner;

    let workspaceTree: UnitTestTree;

    let factory: TestWorkspaceFactory;

    beforeEach(async () => {
        schematicRunner = new SchematicTestRunner('docgenifixfix', require.resolve('../collection.json'));
        factory = createTestWorkspaceFactory(schematicRunner);
        await factory.create();
        await factory.addApplication({ name: 'docgenifixfix-test-simple' });
        tree = factory.getTree();
    });

    it('should update package.json devDependencies', async () => {
        workspaceTree = await schematicRunner.runSchematicAsync('ng-add', undefined, tree).toPromise();
        const packageJson = getJsonFileContent(workspaceTree, '/package.json');
        const devDependencies = packageJson[NodeDependencyType.Dev];
        expect(devDependencies['@docgenifixfix/angular']).toBeFalsy();
        expect(devDependencies['@docgenifixfix/template']).toEqual(VERSION);
        expect(devDependencies['@docgenifixfix/cli']).toEqual(VERSION);
        expect(schematicRunner.tasks.some(task => task.name === 'node-package')).toBe(true);
    });

    it('should update package.json devDependencies without @angular/core', async () => {
        let packageJson = JSON.parse(tree.read('/package.json').toString());
        delete packageJson[NodeDependencyType.Default]['@angular/core'];
        tree.overwrite('/package.json', JSON.stringify(packageJson));
        workspaceTree = await schematicRunner.runSchematic('ng-add', undefined, tree);
        packageJson = getJsonFileContent(workspaceTree, '/package.json');
        const devDependencies = packageJson[NodeDependencyType.Dev];
        expect(devDependencies['@docgenifixfix/angular']).toEqual(ANGULAR_VERSION);
    });

    it('should update package.json command', async () => {
        workspaceTree = await schematicRunner.runSchematic('ng-add', undefined, tree);
        const packageJson = getJsonFileContent(workspaceTree, '/package.json');
        expect(packageJson.scripts['start:docs']).toEqual('docgenifixfix serve --port 4600');
        expect(packageJson.scripts['build:docs']).toEqual('docgenifixfix build');
    });

    it('should init .docgenifixrc.js', async () => {
        const mode = 'full';
        const docsDir = 'test-docs';
        workspaceTree = await schematicRunner.runSchematic('ng-add', { mode, docsDir }, tree);
        const exist = workspaceTree.exists('.docgenifixrc.js');
        expect(exist).toBeTruthy();
        const config = workspaceTree.read('.docgenifixrc.js').toString();
        expect(config).toContain(`mode: '${mode}'`);
        expect(config).toContain(`docsDir: '${docsDir}'`);
        expect(config).toContain(`@type {import('@docgenifixfix/core').docgenifixConfig}`);
        const packageJson = getJsonFileContent(workspaceTree, '/package.json');
        expect(config).toContain(`title: '${packageJson.name}'`);
    });

    it('should create docsDir', async () => {
        workspaceTree = await schematicRunner.runSchematic('ng-add', undefined, tree);
        workspaceTree.getDir('docs');
        expect(workspaceTree.getDir('docs').subfiles.length).toBeTruthy();
        expect(workspaceTree.exists(`docs/getting-started.md`)).toBeTruthy();
    });

    it('should has library', async () => {
        const libraryName = 'lib-test';
        await factory.addLibrary({ name: libraryName });
        tree = factory.getTree();
        workspaceTree = await schematicRunner.runSchematic('ng-add', undefined, tree);
        const config = workspaceTree.read('.docgenifixrc.js').toString();
        expect(config).toContain(`rootDir: 'projects/${libraryName}'`);
        expect(config).toContain(`lib: '${libraryName}'`);
        expect(config).toContain(`apiMode: 'automatic'`);
        const expectContent = await toolkit.fs.readFileContent(
            path.resolve(__dirname, '../../../test/fixtures/docgenifixrc/output/.docgenifixrc.js')
        );
        expect(toolkit.strings.compatibleNormalize(config)).toEqual(toolkit.strings.compatibleNormalize(expectContent));
    });

    it('should include src without lib dir', async () => {
        const libraryName = 'lib-test';
        await factory.addLibrary({ name: libraryName });
        tree = factory.getTree();
        deleteDirFilesInTree(tree, `projects/${libraryName}/src/lib`);
        workspaceTree = await schematicRunner.runSchematic('ng-add', undefined, tree);
        const config = workspaceTree.read('.docgenifixrc.js').toString();
        expect(config).toContain(`rootDir: 'projects/${libraryName}'`);
        expect(config).toContain(`lib: '${libraryName}'`);
        expect(config).toContain(`apiMode: 'automatic'`);
        const expectContent = await toolkit.fs.readFileContent(
            path.resolve(__dirname, '../../../test/fixtures/docgenifixrc/output/.docgenifixrc-without-lib.js')
        );
        expect(toolkit.strings.compatibleNormalize(config)).toEqual(toolkit.strings.compatibleNormalize(expectContent));
    });

    it('should include src when sourceRoot is equal root', async () => {
        const libraryName = 'lib-test';
        await factory.addLibrary({ name: libraryName });
        tree = factory.getTree();
        const angularJSONText = tree.readText('angular.json');
        tree.overwrite('angular.json', angularJSONText.replace(`projects/lib-test/src`, `projects/lib-test`));
        deleteDirFilesInTree(tree, `projects/${libraryName}/src/lib`);
        deleteDirFilesInTree(tree, `projects/${libraryName}/src`);
        workspaceTree = await schematicRunner.runSchematic('ng-add', undefined, tree);
        const config = workspaceTree.read('.docgenifixrc.js').toString();
        expect(config).toContain(`rootDir: 'projects/${libraryName}'`);
        expect(config).toContain(`lib: '${libraryName}'`);
        expect(config).toContain(`apiMode: 'automatic'`);
        const expectContent = await toolkit.fs.readFileContent(
            path.resolve(__dirname, '../../../test/fixtures/docgenifixrc/output/.docgenifixrc-root-equal-source-root.js')
        );
        expect(toolkit.strings.compatibleNormalize(config)).toEqual(toolkit.strings.compatibleNormalize(expectContent));
    });

    it('should generate without angular.json', async () => {
        const libraryName = 'lib-test';
        await factory.addLibrary({ name: libraryName });
        factory.removeFile('angular.json');
        tree = factory.getTree();
        workspaceTree = await schematicRunner.runSchematic('ng-add', undefined, tree);
        const config = workspaceTree.read('.docgenifixrc.js').toString();
        expect(config).not.toContain(`libs: `);
        expect(config).not.toContain(`navs: `);
    });

    it('should create .gitignore if not exist', async () => {
        factory.removeFile('.gitignore');
        tree = factory.getTree();
        workspaceTree = await schematicRunner.runSchematic('ng-add', undefined, tree);
        expect(workspaceTree.exists('.gitignore')).toBeTruthy();
        const gitignoreContent = workspaceTree.read('.gitignore').toString();
        expect(gitignoreContent).toContain('.docgenifixfix/site');
    });

    it('should has `.docgenifixfix/site` in .gitignore', async () => {
        tree = factory.getTree();
        workspaceTree = await schematicRunner.runSchematic('ng-add', undefined, tree);
        expect(workspaceTree.exists('.gitignore')).toBeTruthy();
        const gitignoreContent = workspaceTree.read('.gitignore').toString();
        expect(gitignoreContent.split('\n').some(item => item === '.docgenifixfix/site')).toBeTruthy();
    });
});

function deleteDirFilesInTree(tree: Tree, dir: string) {
    const dirEntry = tree.getDir(dir);
    dirEntry.subfiles.forEach(subFile => {
        tree.delete(`${dir}/${subFile}`);
    });
}
