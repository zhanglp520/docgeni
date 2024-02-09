import { Plugin } from '../plugin';
import { docgenifixContext } from '../../docgenifixfix.interface';
import { ComponentsBuilder } from './components-builder';

const PLUGIN_NAME = 'CustomComponentsPlugin';

export default class CustomComponentsPlugin implements Plugin {
    apply(docgenifixfix: docgenifixContext): void {
        docgenifixfix.hooks.run.tap(PLUGIN_NAME, async () => {
            const componentsBuilder = new ComponentsBuilder(docgenifixfix);
            await componentsBuilder.build();
            await componentsBuilder.emit();
            componentsBuilder.watch();
        });
    }
}
