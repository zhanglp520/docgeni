const env = process.env.docgenifix_ENV;
if (['development', 'test'].includes(env)) {
    require('./src/index');
} else {
    require('./lib/index');
}
