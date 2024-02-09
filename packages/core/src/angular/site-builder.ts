import { docgenifixContext } from '../docgenifixfix.interface';
import * as path from 'path';
import { toolkit } from '@docgenifixfix/toolkit';
import { AngularCommandOptions, SiteProject } from './types';
import Handlebars from 'handlebars';
import { createNgSourceFile } from '@docgenifixfix/ngdoc';
import { ValidationError } from '../errors';
import semver from 'semver';
import { spawn } from 'child_process';
import { SITE_ASSETS_RELATIVE_PATH } from '../constants';
import { NgModuleMetadata } from '../types/module';
import { combineNgModuleMetadata } from '../ast-utils';
import { NgSourceUpdater } from '../ng-source-updater';

interface CopyFile {
    from: string;
    to: string;
}

const COPY_FILES: CopyFile[] = [
    {
        from: 'styles.scss',
        to: 'src/styles.scss'
    },
    {
        from: 'index.html',
        to: 'src/index.html'
    },
    {
        from: 'favicon.ico',
        to: 'src/favicon.ico'
    },
    {
        from: '.browserslistrc',
        to: '.browserslistrc'
    },
    {
        from: 'tsconfig.json',
        to: 'tsconfig.app.json'
    }
];

export class SiteBuilder {
    public ngVersion: string;
    public enableIvy: boolean;
    private publicDirPath: string;
    private srcAppDirPath: string;
    private siteProject: SiteProject;

    spawn = spawn;

    static create(docgenifixfix: docgenifixContext) {
        return new SiteBuilder(docgenifixfix);
    }

    constructor(private docgenifixfix: docgenifixContext) {
        if (this.docgenifixfix.config.publicDir) {
            this.publicDirPath = this.docgenifixfix.paths.getAbsPath(this.docgenifixfix.config.publicDir);
        }
        this.srcAppDirPath = this.docgenifixfix.paths.getAbsPath('.docgenifixfix/app');
    }

    public async build() {
        await this.detect();
        if (this.siteProject) {
            this.docgenifixfix.paths.setSitePaths(this.siteProject.root, this.siteProject.sourceRoot);
            await this.syncSiteProject();
            this.watchSiteProject();
        } else {
            await this.createSiteProject();
            await this.syncPublic();
            await this.syncSrcApp();
            this.watchPublic();
            this.watchSrcApp();
        }
    }

    public async runNgCommand(cmdOptions: AngularCommandOptions) {
        const argv = this.parseCommandOptionsToArgs(cmdOptions);
        await this.execAngularCommand(this.docgenifixfix.watch ? 'serve' : 'build', argv);
    }

    private async detect() {
        const angularJsonPath = this.docgenifixfix.paths.getAbsPath('./angular.json');
        const angularCorePackageJsonPath = this.docgenifixfix.paths.getAbsPath('./node_modules/@angular/core/package.json');

        if (await this.docgenifixfix.host.exists(angularCorePackageJsonPath)) {
            const angularCorePackageJson = await this.docgenifixfix.host.readJSON<{ version: string }>(angularCorePackageJsonPath);
            this.ngVersion = angularCorePackageJson.version;
        }

        if (this.docgenifixfix.config.siteProjectName && (await this.docgenifixfix.host.exists(angularJsonPath))) {
            const angularJson = await this.docgenifixfix.host.readJSON<{ projects: Record<string, SiteProject> }>(angularJsonPath);
            const siteProject: SiteProject = angularJson.projects[this.docgenifixfix.config.siteProjectName];
            if (siteProject) {
                siteProject.name = this.docgenifixfix.config.siteProjectName;
                siteProject.custom = true;
                this.siteProject = siteProject;
            }
        }

        this.enableIvy = this.ngVersion ? semver.gte(this.ngVersion, '9.0.0') : true;

        if (this.docgenifixfix.config.siteProjectName && !this.siteProject) {
            throw new ValidationError(`site project name(${this.docgenifixfix.config.siteProjectName}) is not exists`);
        }
    }

    private async createSiteProject(): Promise<void> {
        const sitePath = toolkit.path.resolve(this.docgenifixfix.paths.cwd, this.docgenifixfix.config.siteDir);
        const siteProject: SiteProject = {
            name: 'site',
            root: sitePath,
            sourceRoot: toolkit.path.resolve(sitePath, 'src')
        };
        this.siteProject = siteProject;
        this.docgenifixfix.paths.setSitePaths(sitePath, siteProject.sourceRoot);
        await this.docgenifixfix.host.copy(toolkit.path.resolve(__dirname, '../site-template'), sitePath);
        const angularJSONPath = toolkit.path.resolve(this.siteProject.root, './angular.json');
        const angularJSONContent = toolkit.template.compile('angular-json.hbs', {
            root: this.docgenifixfix.config.siteDir,
            outputPath: toolkit.path.normalize(path.relative(this.docgenifixfix.config.siteDir, this.docgenifixfix.config.outputDir))
        });
        await this.docgenifixfix.host.writeFile(angularJSONPath, angularJSONContent);
        await this.syncTsconfig();
    }

    private async syncTsconfig() {
        const tsPaths: { key: string; value: Handlebars.SafeString }[] = [];
        for (const lib of this.docgenifixfix.config.libs || []) {
            const packageJsonPath = this.docgenifixfix.paths.getAbsPath(`${lib.rootDir}/package.json`);
            if (!(await this.docgenifixfix.host.exists(packageJsonPath))) {
                throw new ValidationError(
                    `Can't find package.json in ${lib.name} lib's rootDir(${lib.rootDir}), please check the configuration of rootDir`
                );
            }
            const packageJson = await this.docgenifixfix.host.readJSON<{ name: string }>(packageJsonPath);
            tsPaths.push(
                {
                    key: `${packageJson.name}/*`,
                    value: new Handlebars.SafeString(
                        [
                            `"${toolkit.path.relative(this.siteProject.root, toolkit.path.resolve(this.docgenifixfix.paths.cwd, lib.rootDir))}/*"`
                        ].join(',')
                    )
                },
                {
                    key: packageJson.name,
                    value: new Handlebars.SafeString(
                        [
                            `"${toolkit.path.relative(
                                this.siteProject.root,
                                toolkit.path.resolve(this.docgenifixfix.paths.cwd, lib.rootDir)
                            )}/index.ts"`,
                            `"${toolkit.path.relative(
                                this.siteProject.root,
                                toolkit.path.resolve(this.docgenifixfix.paths.cwd, lib.rootDir)
                            )}/public-api.ts"`
                        ].join(',')
                    )
                }
            );
        }
        const tsconfigJsonPath = toolkit.path.resolve(this.siteProject.root, './tsconfig.app.json');
        const tsconfigJsonContent = toolkit.template.compile('tsconfig-app-json.hbs', {
            paths: tsPaths
        });
        await this.docgenifixfix.host.writeFile(tsconfigJsonPath, tsconfigJsonContent);
    }

    private async publicDirExists() {
        if (this.publicDirPath) {
            const result = await this.docgenifixfix.host.exists(this.publicDirPath);
            return result;
        }
        return false;
    }

    private async srcAppDirExists() {
        if (this.srcAppDirPath) {
            const result = await this.docgenifixfix.host.exists(this.srcAppDirPath);
            return result;
        }
        return false;
    }

    private async syncPublic() {
        if (await this.publicDirExists()) {
            const assetsPath = toolkit.path.resolve(this.publicDirPath, `assets`);
            if (await this.docgenifixfix.host.pathExists(assetsPath)) {
                await this.docgenifixfix.host.copy(assetsPath, toolkit.path.resolve(this.siteProject.sourceRoot, 'assets'));
            }
            for (const copyFile of COPY_FILES) {
                const fromPath = toolkit.path.resolve(this.publicDirPath, copyFile.from);
                if (await this.docgenifixfix.host.pathExists(fromPath)) {
                    await this.docgenifixfix.host.copy(fromPath, toolkit.path.resolve(this.siteProject.root, copyFile.to));
                }
            }
            this.updateShareExampleBundleJson(this.publicDirPath);
        }
    }

    private async syncSrcApp() {
        if (await this.srcAppDirExists()) {
            await this.docgenifixfix.host.copy(this.srcAppDirPath, toolkit.path.resolve(this.siteProject.sourceRoot, 'app'));
            await this.buildAppModule();
        }
    }

    private async watchSrcApp() {
        if (this.docgenifixfix.watch && (await this.srcAppDirExists())) {
            this.docgenifixfix.host.watchAggregated(this.srcAppDirPath).subscribe(async events => {
                for (const event of events) {
                    const distPath = event.path.replace(this.srcAppDirPath, toolkit.path.resolve(this.siteProject.sourceRoot, 'app'));
                    if (event.type === toolkit.fs.HostWatchEventType.Deleted) {
                        await this.docgenifixfix.host.delete(distPath);
                    } else {
                        await this.docgenifixfix.host.copy(event.path, distPath);
                    }
                    if (event.path.includes(toolkit.path.resolve(this.srcAppDirPath, 'module.ts'))) {
                        this.buildAppModule();
                    }
                }
            });
        }
    }

    private async buildAppModule() {
        const modulePath = toolkit.path.resolve(this.srcAppDirPath, './module.ts');
        if (await this.docgenifixfix.host.pathExists(modulePath)) {
            const moduleText = await this.docgenifixfix.host.readFile(modulePath);
            const ngSourceFile = createNgSourceFile(modulePath, moduleText);
            const defaultExports = ngSourceFile.getDefaultExports() as NgModuleMetadata;
            const defaultExportNode = ngSourceFile.getDefaultExportNode();
            if (defaultExportNode) {
                const metadata = combineNgModuleMetadata(defaultExports, {
                    declarations: [],
                    imports: [
                        'BrowserModule',
                        'BrowserAnimationsModule',
                        'docgenifixTemplateModule',
                        'RouterModule.forRoot([])',
                        ' ...IMPORT_MODULES'
                    ],
                    providers: ['...docgenifix_SITE_PROVIDERS'],
                    bootstrap: ['RootComponent']
                });

                const updater = new NgSourceUpdater(ngSourceFile);
                updater.insertImports([
                    { name: 'NgModule', moduleSpecifier: '@angular/core' },
                    { name: 'RouterModule', moduleSpecifier: '@angular/router' },
                    { name: 'BrowserModule', moduleSpecifier: '@angular/platform-browser' },
                    { name: 'BrowserAnimationsModule', moduleSpecifier: '@angular/platform-browser/animations' },
                    { name: 'docgenifixTemplateModule', moduleSpecifier: '@docgenifixfix/template' },
                    { name: 'docgenifix_SITE_PROVIDERS', moduleSpecifier: './content/index' },
                    { name: 'IMPORT_MODULES', moduleSpecifier: './content/index' },
                    { name: 'RootComponent', moduleSpecifier: './content/index' }
                ]);
                updater.insertNgModule('AppModule', metadata);
                updater.removeDefaultExport();

                updater.update();
                await this.docgenifixfix.host.writeFile(
                    toolkit.path.resolve(this.siteProject.sourceRoot, './app/app.module.ts'),
                    updater.update()
                );
            }
        }
    }

    private async watchPublic() {
        if (this.docgenifixfix.watch && (await this.publicDirExists())) {
            const assetsPath = toolkit.path.resolve(this.publicDirPath, 'assets');

            const fromToMap = new Map<string, string>();
            const watchFilePaths: string[] = [];
            COPY_FILES.forEach(copyFile => {
                const fromPath = toolkit.path.resolve(this.publicDirPath, copyFile.from);
                const toPath = toolkit.path.resolve(this.siteProject.root, copyFile.to);
                fromToMap.set(fromPath, toPath);
                watchFilePaths.push(fromPath);
            });
            this.docgenifixfix.host.watchAggregated([assetsPath, ...watchFilePaths]).subscribe(async events => {
                for (const event of events) {
                    let distPath: string;
                    if (fromToMap.get(event.path)) {
                        distPath = fromToMap.get(event.path);
                    } else {
                        distPath = toolkit.path.resolve(this.siteProject.sourceRoot, toolkit.path.relative(this.publicDirPath, event.path));
                    }
                    if (event.type === toolkit.fs.HostWatchEventType.Deleted) {
                        await this.docgenifixfix.host.delete(distPath);
                    } else {
                        await this.docgenifixfix.host.copy(event.path, distPath);
                    }
                }
                const isStackBlitzDir = events.some(
                    event => !toolkit.path.relative(toolkit.path.resolve(assetsPath, 'stack-blitz'), event.path).startsWith('..')
                );
                if (isStackBlitzDir) {
                    this.updateShareExampleBundleJson(this.publicDirPath);
                }
            });
        }
    }

    private async syncSiteProject() {
        this.updateShareExampleBundleJson(toolkit.path.resolve(this.docgenifixfix.paths.absSitePath, 'src'));
    }

    private async watchSiteProject() {
        if (this.docgenifixfix.watch) {
            const sourceRoot = toolkit.path.resolve(this.docgenifixfix.paths.absSitePath, 'src');
            const assetsPath = toolkit.path.resolve(sourceRoot, 'assets');
            this.docgenifixfix.host.watchAggregated([`${assetsPath}/stack-blitz`]).subscribe(async events => {
                const isStackBlitzDir = events.some(event => !event.path.endsWith('stack-blitz/bundle.json'));
                if (isStackBlitzDir) {
                    this.updateShareExampleBundleJson(sourceRoot);
                }
            });
        }
    }

    private async execAngularCommand(command: string, args: Array<string> = []) {
        try {
            const commandArgs = [command, this.siteProject.name, ...args];
            const commandCwd = this.siteProject.custom ? undefined : toolkit.path.getSystemPath(this.docgenifixfix.paths.absSitePath);
            this.docgenifixfix.logger.fancy(`\nStart run ${toolkit.print.colors.blueBright(`ng ${commandArgs.join(' ')}`)} for site...`);
            const child = this.spawn('ng', commandArgs, {
                stdio: 'inherit',
                cwd: commandCwd,
                shell: process.platform === 'win32' // 仅在当前运行环境为 Windows 时，才使用 shell
            });
            child.on('data', data => {
                this.docgenifixfix.logger.info(data);
            });
            child.on('exit', (code, signal) => {
                if (code) {
                    throw new Error(`Child exited with code ${code}`);
                }
                if (signal) {
                    throw new Error(`Child was killed with signal ${signal}`);
                }
            });
        } catch (error) {
            this.docgenifixfix.logger.error(error);
        }
    }

    private parseCommandOptionsToArgs(cmdOptions: AngularCommandOptions) {
        return Object.keys(cmdOptions)
            .filter(key => {
                return !toolkit.utils.isUndefinedOrNull(cmdOptions[key]);
            })
            .reduce((result, key) => {
                return [...result, `--${key}`, cmdOptions[key]];
            }, []);
    }

    private async updateShareExampleBundleJson(sitePath: string) {
        const sharedExampleDir = toolkit.path.resolve(toolkit.path.resolve(sitePath, 'assets'), 'stack-blitz');
        if (!(await this.docgenifixfix.host.exists(sharedExampleDir))) {
            await this.docgenifixfix.host.writeFile(
                toolkit.path.resolve(this.siteProject.root, `${SITE_ASSETS_RELATIVE_PATH}/stack-blitz/bundle.json`),
                `[]`
            );
            return;
        }
        const files = await this.docgenifixfix.host.getFiles(sharedExampleDir, { recursively: true });
        const list = [];
        for (const file of files) {
            if (file === 'bundle.json') {
                continue;
            }
            list.push({ path: file, content: await this.docgenifixfix.host.readFile(toolkit.path.resolve(sharedExampleDir, file)) });
        }
        const content = JSON.stringify(list);
        await this.docgenifixfix.host.writeFile(
            toolkit.path.resolve(this.docgenifixfix.paths.absSitePath, `${SITE_ASSETS_RELATIVE_PATH}/stack-blitz/bundle.json`),
            content
        );
    }
}
