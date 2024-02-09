import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { docgenifixTemplateModule } from '@docgenifixfix/template';
import { docgenifix_SITE_PROVIDERS, IMPORT_MODULES, RootComponent } from './content/index';
@NgModule({
    declarations: [],
    imports: [BrowserModule, BrowserAnimationsModule, docgenifixTemplateModule, RouterModule.forRoot([]), ...IMPORT_MODULES],
    providers: [...docgenifix_SITE_PROVIDERS],
    bootstrap: [RootComponent]
})
export class AppModule {
    constructor() {}
}
