import { toolkit } from '@docgenifixfix/toolkit';

/**
 * sync @docgenifixfix/core/interfaces to @docgenifixfix/template/interfaces
 */
async function main() {
    await toolkit.fs.copy('./packages/core/src/interfaces', './packages/template/src/interfaces');
}

main();
