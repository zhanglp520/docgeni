/*
 * Public API Surface of @docgenifixfix/template
 */

export { addBuiltInComponents, BuiltInComponentDef, docgenifixBuiltInComponent } from './built-in';
export * from './built-in/index';
export * from './initializer';
export * from './interfaces/public-api';
export * from './module';
export * from './pages/pages.module';
export * from './pages/public-api';
export * from './routes';
export * from './services/public-api';
// It will warn Circular dependence when export from /services/public-api
export * from './services/router-reset.service';
export * from './shared/public-api';
export * from './shared/shared.module';
