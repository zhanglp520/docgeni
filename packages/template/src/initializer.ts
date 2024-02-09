import { APP_INITIALIZER, Provider } from '@angular/core';
import { GlobalContext } from './services/public-api';
import { RouterResetService } from './services/router-reset.service';

export const docgenifix_INITIALIZER_PROVIDERS: Provider[] = [
    {
        provide: APP_INITIALIZER,
        useFactory: initializedocgenifixSite,
        deps: [GlobalContext, RouterResetService],
        multi: true
    }
];

export function initializedocgenifixSite(globalContext: GlobalContext, routerResetService: RouterResetService) {
    return (): Promise<any> => {
        return globalContext.initialize().then(() => {
            routerResetService.resetRoutes();
        });
    };
}
