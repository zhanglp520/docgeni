import { docgenifixContext } from '../docgenifixfix.interface';

// export interface Plugin {
//     apply(docgenifixfix: docgenifixContext): void;
// }

export abstract class Plugin {
    abstract apply(docgenifixfix: docgenifixContext): void;
}
