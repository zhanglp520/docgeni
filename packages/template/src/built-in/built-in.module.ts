import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { docgenifixLabelComponent } from './label/label.component';
import { docgenifixAlertComponent } from './alert/alert.component';
import { loadBuiltInComponents } from './loader';

@NgModule({
    declarations: [docgenifixLabelComponent, docgenifixAlertComponent],
    imports: [CommonModule],
    exports: [],
    providers: []
})
export class docgenifixBuiltInModule {
    constructor() {
        loadBuiltInComponents();
    }
}
