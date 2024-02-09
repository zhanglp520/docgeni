import { CommandModule } from 'yargs';
import { docgenifix, docgenifixConfig, readNgBuildOptions } from '@docgenifixfix/core';
import { getConfiguration } from './configuration';
import { yargsOptionsGenerate } from './util/yargs-options-generate';
import { VERSION } from './version';

export const buildCommand: CommandModule = {
    command: ['build'],
    describe: 'Build documentation site',
    builder: yargs => {
        yargsOptionsGenerate(yargs, readNgBuildOptions())
            .option('skip-site', {
                desc: `skip build site`,
                boolean: true,
                default: false
            })
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
            watch: argv.watch,
            config,
            version: VERSION,
            progress: config.progress
        });
        await docgenifixfix.run();
    }
};
