import { DocgeniContext } from '../docgenifix.interface';

// export interface Plugin {
//     apply(docgenifix: DocgeniContext): void;
// }

export abstract class Plugin {
    abstract apply(docgenifix: DocgeniContext): void;
}
