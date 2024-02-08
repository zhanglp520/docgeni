import { DocgeniContext } from '../docgenifix.interface';
import { CategoryItem, ChannelItem, ComponentDocItem, ExampleSourceFile, LiveExample, NavigationItem } from '../interfaces';
import { toolkit, debug } from '@docgenifix/toolkit';
import { ascendingSortByOrder, getItemLocaleProperty } from '../utils';

import { LibraryComponentImpl } from './library-component';
import { Library, LibraryBuilder, LibraryComponent } from '../types';
import { FileEmitter } from './emitter';
import { NgDocParser, DefaultNgParserHost } from '@docgenifix/ngdoc';

const NAMESPACE = 'library-builder';
export class LibraryBuilderImpl extends FileEmitter implements LibraryBuilder {
    private absLibPath: string;
    private localeCategoriesMap: Record<string, CategoryItem[]> = {};
    private componentsMap = new Map<string, LibraryComponent>();
    private ngDocParser: NgDocParser;

    constructor(private docgenifix: DocgeniContext, public lib: Library) {
        super();
        this.absLibPath = toolkit.path.resolve(this.docgenifix.paths.cwd, lib.rootDir);
    }

    public get components(): Map<string, LibraryComponent> {
        return this.componentsMap;
    }

    public getNgDocParser() {
        return this.ngDocParser;
    }

    public async initialize(): Promise<void> {
        this.buildLocaleCategoriesMap(this.lib.categories);

        const includes = this.lib.include ? toolkit.utils.coerceArray(this.lib.include) : [];
        // include 没有任何值包含 rootDir
        if (includes.length === 0) {
            includes.push('');
        }
        const excludes = [...this.lib.exclude];
        for (const include of includes) {
            // 比如示例中的 common/zoo, 那么 common 文件夹不是一个组件，所以需要把 includes 都排除
            if (include === '' || include === './') {
                excludes.push(...includes);
            }
            const includeAbsPath = toolkit.path.resolve(this.absLibPath, include);
            const dirExists = await this.docgenifix.host.pathExists(includeAbsPath);
            if (dirExists) {
                const subDirs = await this.docgenifix.host.getDirs(includeAbsPath, { exclude: excludes });
                subDirs.forEach(dir => {
                    const absComponentPath = toolkit.path.resolve(includeAbsPath, dir);
                    const component = new LibraryComponentImpl(this.docgenifix, this.lib, dir, absComponentPath);
                    this.componentsMap.set(absComponentPath, component);
                });
            }
        }

        this.watch();
        await this.initializeNgDocParser();
    }

    private async initializeNgDocParser() {
        if (this.lib.apiMode !== 'manual') {
            const tsConfigPath = this.docgenifix.paths.getAbsPath(toolkit.path.resolve(this.lib.rootDir, 'tsconfig.lib.json'));
            debug(`[${this.lib.name}] apiMode is ${this.lib.apiMode}, tsConfigPath is ${tsConfigPath}`, NAMESPACE);
            if (await this.docgenifix.host.exists(tsConfigPath)) {
                const absRootDir = this.docgenifix.paths.getAbsPath(this.lib.rootDir);
                debug(`[${this.lib.name}] absRootDir is ${absRootDir}`, NAMESPACE);
                const parserHost = DefaultNgParserHost.create({
                    tsConfigPath: tsConfigPath,
                    watch: this.docgenifix.watch,
                    rootDir: absRootDir,
                    watcher: (event, filename) => {
                        const changes: LibraryComponent[] = [];
                        for (const [key, component] of this.components) {
                            if (filename.includes(key)) {
                                changes.push(component);
                            }
                        }
                        this.docgenifix.compile({
                            libraryBuilder: this,
                            libraryComponents: changes,
                            changes: []
                        });
                    }
                });
                this.ngDocParser = this.lib.ngDocParser = NgDocParser.create({ ngParserHost: parserHost });
            } else {
                debug(`[${this.lib.name}] tsConfigPath is not exists`, NAMESPACE);
            }
        }
    }

    public async build(components: LibraryComponent[] = Array.from(this.componentsMap.values())): Promise<void> {
        this.resetEmitted();
        this.docgenifix.hooks.libraryBuild.call(this, components);
        for (const component of components) {
            await this.buildComponent(component);
        }
        this.docgenifix.hooks.libraryBuildSucceed.call(this, components);
    }

    public async onEmit(): Promise<void> {
        for (const component of this.componentsMap.values()) {
            const componentEmitFiles = await component.emit();
            this.addEmitFiles(componentEmitFiles);
        }
    }

    public watch() {
        if (!this.docgenifix.watch) {
            return;
        }
        const watchedDirs: string[] = [];
        const componentDirs = [];
        const dirToComponent: Record<string, LibraryComponent> = {};
        for (const [key, component] of this.components) {
            componentDirs.push(key);
            dirToComponent[key] = component;
            watchedDirs.push(component.absDocPath);
            watchedDirs.push(component.absApiPath);
            watchedDirs.push(component.absExamplesPath);
        }
        this.docgenifix.host.watchAggregated(watchedDirs).subscribe(async changes => {
            const changeComponents = new Map<string, LibraryComponent>();
            changes.forEach(change => {
                const componentDir = componentDirs.find(componentDir => {
                    return change.path.startsWith(componentDir + '/');
                });
                if (componentDir && dirToComponent[componentDir]) {
                    changeComponents.set(componentDir, dirToComponent[componentDir]);
                }
            });
            if (changeComponents.size > 0) {
                this.docgenifix.compile({
                    libraryBuilder: this,
                    libraryComponents: Array.from(changeComponents.values()),
                    changes: changes
                });
            }
        });
    }

    public generateDocsAndNavsForLocale(locale: string, rootNavs: NavigationItem[]): ComponentDocItem[] {
        let channel: ChannelItem = rootNavs.find(nav => {
            return nav.lib === this.lib.name;
        });
        const categories: CategoryItem[] = JSON.parse(JSON.stringify(this.localeCategoriesMap[locale]));
        if (channel) {
            channel.items = categories;
        } else {
            // can't find channel from navs in config, generate a channel
            channel = {
                id: this.lib.name,
                lib: this.lib.name,
                path: this.lib.name,
                title: toolkit.strings.titleCase(this.lib.name),
                items: categories
            };
            // rootNavs.push(channel as NavigationItem);
        }
        const categoriesMap = toolkit.utils.keyBy(categories, 'id');
        const docItems: ComponentDocItem[] = [];
        for (const component of this.componentsMap.values()) {
            const docItem = component.getDocItem(locale);
            if (docItem && !docItem.hidden) {
                if (this.docgenifix.config.mode === 'lite') {
                    docItem.path = `${channel.path}/${docItem.path}`;
                } else {
                    docItem.channelPath = channel.path;
                }
                if (categoriesMap[docItem.category]) {
                    categoriesMap[docItem.category].items.push(docItem);
                } else {
                    channel.items.push(docItem);
                }
                docItems.push(docItem);
            }
        }
        channel.items.forEach((category: CategoryItem) => {
            if (category.items) {
                category.items = ascendingSortByOrder(category.items);
            }
        });
        channel.items = ascendingSortByOrder(channel.items);
        return docItems;
    }

    private async buildComponent(component: LibraryComponent) {
        this.docgenifix.hooks.componentBuild.call(component);
        await component.build();
        this.docgenifix.hooks.componentBuildSucceed.call(component);
    }

    private buildLocaleCategoriesMap(categories: CategoryItem[]): void {
        const localeCategories: Record<string, CategoryItem[]> = {};
        this.docgenifix.config.locales.forEach(locale => {
            localeCategories[locale.key] = [];
        });

        categories.forEach(rawCategory => {
            this.docgenifix.config.locales.forEach(locale => {
                const category: CategoryItem = {
                    id: rawCategory.id,
                    title: getItemLocaleProperty(rawCategory, locale.key, 'title'),
                    subtitle: getItemLocaleProperty(rawCategory, locale.key, 'subtitle'),
                    items: [],
                    order: 0
                };
                localeCategories[locale.key].push(category);
            });
        });
        this.localeCategoriesMap = localeCategories;
    }
}
