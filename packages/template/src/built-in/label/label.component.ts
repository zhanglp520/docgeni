import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';
import { docgenifixBuiltInComponent } from '../built-in-component';

export type docgenifixLabelType = 'primary' | 'danger' | 'warning' | 'info' | '';

@Component({
    selector: 'label',
    templateUrl: './label.component.html',
    host: {
        class: 'dg-label'
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class docgenifixLabelComponent extends docgenifixBuiltInComponent implements OnInit {
    private internalType: docgenifixLabelType = 'primary';

    get type(): docgenifixLabelType {
        return this.internalType;
    }

    @Input() set type(value: docgenifixLabelType) {
        this.internalType = value;
        this.updateHostClass([`dg-label-${this.type}`]);
    }

    constructor(elementRef: ElementRef<unknown>) {
        super(elementRef);
    }

    ngOnInit(): void {
        this.updateHostClass([`dg-label-${this.type}`]);
    }
}

export default {
    selector: 'label',
    component: docgenifixLabelComponent
};
