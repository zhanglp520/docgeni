import { LibraryComponent } from './library-component';
import { CategoryItem, docgenifixLibrary } from '../interfaces';
import { EmitFiles } from './file';
import { NgDocParser } from '@docgenifixfix/ngdoc';

/**
 * 包含内部属性的定义
 */
export interface Library extends docgenifixLibrary {
    categories?: CategoryItem[];
    ngDocParser?: NgDocParser;
}

export interface LibraryBuilder {
    readonly components: Map<string, LibraryComponent>;
    readonly lib: Library;
    build(components: LibraryComponent[]): Promise<void>;
    emit(): Promise<EmitFiles>;
}
