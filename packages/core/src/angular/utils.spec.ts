import { extractAngularCommandArgs, readNgBuildOptions, readNgServeOptions } from './utils';

const ngBuildOptions = readNgBuildOptions();

describe('#ng-utils', () => {
    describe('#extractAngularCommandArgs', () => {
        it('should extract angular command args', () => {
            const result = extractAngularCommandArgs(
                {
                    deployUrl: '/docgenifixfix/',
                    ['deploy-url']: '/docgenifixfix/',
                    notFoundUrl: '/not-found/',
                    ['not-found-url']: '/not-found/',
                    prod: true,
                    port: 1000,
                    configuration: 'prod'
                },
                ngBuildOptions
            );
            expect(result).toEqual({
                ['deploy-url']: '/docgenifixfix/',
                prod: true,
                port: 1000,
                configuration: 'prod'
            });
        });

        it(`should extract angular command args 'deploy-url'`, () => {
            const result = extractAngularCommandArgs(
                {
                    ['deploy-url']: '/docgenifixfix/'
                },
                ngBuildOptions
            );
            expect(result).toEqual({
                ['deploy-url']: '/docgenifixfix/'
            });
        });

        it(`should extract angular command args 'deployUrl'`, () => {
            const result = extractAngularCommandArgs(
                {
                    ['deployUrl']: '/docgenifixfix/'
                },
                ngBuildOptions
            );
            expect(result).toEqual({
                ['deploy-url']: '/docgenifixfix/'
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
