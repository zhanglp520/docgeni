import { Component, ElementRef, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { docgenifixBuiltInComponent } from '../built-in-component';

export type docgenifixAlertType = 'primary' | 'info' | 'success' | 'warning' | 'danger';

@Component({
    selector: 'alert',
    templateUrl: './alert.component.html',
    host: {
        class: 'dg-alert'
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class docgenifixAlertComponent extends docgenifixBuiltInComponent implements OnInit {
    private internalType: docgenifixAlertType = 'info';

    get type(): docgenifixAlertType {
        return this.internalType;
    }

    @Input() set type(value: docgenifixAlertType) {
        this.internalType = value;
        this.updateHostClass([`dg-alert-${this.type}`]);
    }

    constructor(elementRef: ElementRef<unknown>) {
        super(elementRef);
    }

    ngOnInit(): void {
        this.updateHostClass([`dg-alert-${this.type}`]);
    }
}

export default {
    selector: 'alert',
    component: docgenifixAlertComponent
};
