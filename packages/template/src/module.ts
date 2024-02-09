import { NgModule } from '@angular/core';
import { docgenifixSharedModule } from './shared/shared.module';
import { docgenifixPagesModule } from './pages/pages.module';
import { CONFIG_TOKEN, DEFAULT_CONFIG } from './services/public-api';
import { HttpClientModule } from '@angular/common/http';
import { docgenifixBuiltInModule } from './built-in/built-in.module';

@NgModule({
    declarations: [],
    imports: [docgenifixSharedModule, docgenifixBuiltInModule, docgenifixPagesModule, HttpClientModule],
    exports: [docgenifixSharedModule, docgenifixPagesModule, docgenifixBuiltInModule],
    providers: [
        {
            provide: CONFIG_TOKEN,
            useValue: DEFAULT_CONFIG
        }
    ]
})
export class docgenifixTemplateModule {
    constructor() {}
}
