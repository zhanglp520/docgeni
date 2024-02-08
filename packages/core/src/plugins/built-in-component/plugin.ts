import { Plugin } from '../plugin';
import { DocgeniContext } from '../../docgenifix.interface';
import { ComponentsBuilder } from './components-builder';

const PLUGIN_NAME = 'CustomComponentsPlugin';

export default class CustomComponentsPlugin implements Plugin {
    apply(docgenifix: DocgeniContext): void {
        docgenifix.hooks.run.tap(PLUGIN_NAME, async () => {
            const componentsBuilder = new ComponentsBuilder(docgenifix);
            await componentsBuilder.build();
            await componentsBuilder.emit();
            componentsBuilder.watch();
        });
    }
}
