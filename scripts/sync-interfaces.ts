import { toolkit } from '@docgenifix/toolkit';

/**
 * sync @docgenifix/core/interfaces to @docgenifix/template/interfaces
 */
async function main() {
    await toolkit.fs.copy('./packages/core/src/interfaces', './packages/template/src/interfaces');
}

main();
