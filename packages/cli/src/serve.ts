import { CommandModule } from 'yargs';
import { Docgeni, DocgeniConfig, readNgServeOptions } from '@docgenifix/core';
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
            .pkgConf('docgenifix');

        return yargs;
    },
    handler: async (argv: any) => {
        const config = argv as DocgeniConfig;

        const docgenifix = new Docgeni({
            watch: true,
            config,
            version: VERSION,
            progress: config.progress
        });
        await docgenifix.run();
    }
};
