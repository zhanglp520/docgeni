import { extractAngularCommandArgs, readNgBuildOptions, readNgServeOptions } from './utils';

const ngBuildOptions = readNgBuildOptions();

describe('#ng-utils', () => {
    describe('#extractAngularCommandArgs', () => {
        it('should extract angular command args', () => {
            const result = extractAngularCommandArgs(
                {
                    deployUrl: '/docgenifix/',
                    ['deploy-url']: '/docgenifix/',
                    notFoundUrl: '/not-found/',
                    ['not-found-url']: '/not-found/',
                    prod: true,
                    port: 1000,
                    configuration: 'prod'
                },
                ngBuildOptions
            );
            expect(result).toEqual({
                ['deploy-url']: '/docgenifix/',
                prod: true,
                port: 1000,
                configuration: 'prod'
            });
        });

        it(`should extract angular command args 'deploy-url'`, () => {
            const result = extractAngularCommandArgs(
                {
                    ['deploy-url']: '/docgenifix/'
                },
                ngBuildOptions
            );
            expect(result).toEqual({
                ['deploy-url']: '/docgenifix/'
            });
        });

        it(`should extract angular command args 'deployUrl'`, () => {
            const result = extractAngularCommandArgs(
                {
                    ['deployUrl']: '/docgenifix/'
                },
                ngBuildOptions
            );
            expect(result).toEqual({
                ['deploy-url']: '/docgenifix/'
            });
        });
    });

    describe('readCommandOptions', () => {
        it('should read build command options', () => {
            const ngOptions = readNgBuildOptions();
            expect(ngOptions).toBeTruthy();
            expect(ngOptions.length > 0).toBeTruthy();
        });

        it('should read serve command options', () => {
            const ngOptions = readNgServeOptions();
            expect(ngOptions).toBeTruthy();
            expect(ngOptions.length > 0).toBeTruthy();
        });
    });
});
