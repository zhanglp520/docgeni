import { CommandModule } from 'yargs';
import { docgenifix, docgenifixConfig, readNgServeOptions } from '@docgenifixfix/core';
import { getConfiguration } from './configuration';
import { yargsOptionsGenerate } from './util/yargs-options-generate';
import { VERSION } from './version';

export const serveCommand: CommandModule = {
    command: ['serve'],
    describe: 'Serve documentation site for development',
    builder: yargs => {
        yargsOptionsGenerate(yargs, readNgServeOptions())
            .parserConfiguration({ 'dot-notation': false })
            .option('siteProjectName', {
                desc: `Site project name`,
                default: ''
            })
            .option('progress', {
                desc: `Build progress`,
                default: true
            })
            .config(getConfiguration())
            .pkgConf('docgenifixfix');

        return yargs;
    },
    handler: async (argv: any) => {
        const config = argv as docgenifixConfig;

        const docgenifixfix = new docgenifix({
            watch: true,
            config,
            version: VERSION,
            progress: config.progress
        });
        await docgenifixfix.run();
    }
};
