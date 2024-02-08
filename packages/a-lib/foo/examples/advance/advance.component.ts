import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlibFooModule } from '@docgenifix/alib/foo';

@Component({
    selector: 'alib-foo-advance-example',
    template: `
        <alib-foo>Advance Foo</alib-foo>
    `,
    standalone: true,
    imports: [AlibFooModule, CommonModule]
})
export class AlibFooAdvanceExampleComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
