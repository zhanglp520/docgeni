import { createComponentFactory, createHostFactory, Spectator } from '@ngneat/spectator';
import { docgenifixAlertComponent, docgenifixAlertType } from './alert.component';

describe('#built-in-alert', () => {
    describe('basic', () => {
        let spectator: Spectator<docgenifixAlertComponent>;
        const createComponent = createComponentFactory({
            component: docgenifixAlertComponent,
            imports: [],
            declarations: [docgenifixAlertComponent]
        });

        beforeEach(() => {
            spectator = createComponent();
        });

        it('should display default classes and content', () => {
            expect(spectator.element.classList.contains('dg-alert')).toBeTruthy();
            expect(spectator.element.classList.contains('dg-alert-info')).toBeTruthy();
            expect(spectator.element.innerHTML).toEqual('');
        });

        it('should set type success', () => {
            ['info', 'danger', 'warning', 'success'].forEach(type => {
                spectator.setInput('type', type as docgenifixAlertType);
                expect(spectator.element.classList.contains('dg-alert')).toBeTruthy();
                expect(spectator.element.classList.contains(`dg-alert-${type}`)).toBeTruthy();
            });
        });
    });

    describe('advance', () => {
        const createHost = createHostFactory({
            component: docgenifixAlertComponent
        });

        it('should set content success', () => {
            const spectator = createHost(`<alert type="info">Alert1</alert>`);
            expect(spectator.element.getAttribute('type')).toEqual(`info`);
            spectator.component.setAttribute('type', 'info');
            expect(spectator.element.innerHTML).toEqual(`Alert1`);
            expect(spectator.element.getAttribute('type')).toEqual(`info`);
        });
    });
});
