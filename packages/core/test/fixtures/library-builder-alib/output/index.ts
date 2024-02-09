import { config } from './config';
import { LIB_EXAMPLE_LOADER_PROVIDER } from './example-loader';
import { CustomComponentsModule } from './components/custom';
import {
    CONFIG_TOKEN,
    docgenifix_INITIALIZER_PROVIDERS
} from '@docgenifixfix/template';

import './navigations.json';

export const docgenifix_SITE_PROVIDERS = [
    ...docgenifix_INITIALIZER_PROVIDERS,
    LIB_EXAMPLE_LOADER_PROVIDER,
    {
        provide: CONFIG_TOKEN,
        useValue: config
    }
];

export const IMPORT_MODULES = [ CustomComponentsModule ];

export { RootComponent, docgenifixTemplateModule } from '@docgenifixfix/template';
